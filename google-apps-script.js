/**
 * Ananmay & Jennifer Wedding — RSVP Backend
 * ─────────────────────────────────────────
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it "Wedding RSVP".
 *
 * 2. You only need ONE sheet (tab). Rename "Sheet1" to:
 *    RSVP Responses
 *
 * 3. Add these headers to row 1 (columns A → L):
 *    SubmittedBy | GroupSize | GuestType | Name | AgeGroup | Email | Phone | Dietary | Attending | IDFileURL | Message | SubmittedAt
 *
 *    TIP: Freeze row 1 (View → Freeze → 1 row) so headers stay visible when scrolling.
 *    TIP: Add a 13th column "Checked In" for use on the wedding day.
 *
 * 4. In the spreadsheet, go to Extensions → Apps Script.
 *    Delete the default code and paste this entire file.
 *
 * 5. Change the PASSWORD constant below to whatever you want.
 *
 * 6. Click Deploy → New Deployment.
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, copy the Web App URL.
 *
 * 7. In js/rsvp.js, replace 'YOUR_APPS_SCRIPT_URL_HERE' with that URL.
 *
 * 8. Done! Commit and push to GitHub.
 *
 * ─────────────────────────────────────────
 * HOW THE SHEET WILL LOOK:
 *
 * SubmittedBy   | GroupSize | GuestType | Name          | AgeGroup | Email      | Phone | Dietary | Attending | IDFileURL | Message      | SubmittedAt
 * Rahul Sharma  | 3         | Primary   | Rahul Sharma  | 12+      | rahul@...  | 91... | veg     | yes       | [link]    | Can't wait!  | 2026-01-15
 * Rahul Sharma  | 3         | Guest 1   | Priya Sharma  | 12+      |            |       |         |           |           |              |
 * Rahul Sharma  | 3         | Guest 2   | Aryan Sharma  | 6-11     |            |       |         |           |           |              |
 * Meera Kapoor  | 1         | Primary   | Meera Kapoor  | 12+      | meera@...  | 91... |         | yes       |           |              | 2026-01-16
 *
 * Filter by SubmittedBy to see a whole family.
 * Sort by Name for alphabetical check-in.
 * Filter Attending = yes to remove declines.
 */

// ── Config ──────────────────────────────────────────────────────────────────
const PASSWORD       = 'Kasauli2026';   // Change this to your chosen password
const SHEET_NAME     = 'RSVP Responses';
const ID_FOLDER_NAME = 'Wedding RSVP IDs';
// ────────────────────────────────────────────────────────────────────────────

const ss = SpreadsheetApp.getActiveSpreadsheet();

// GET — password validation
function doGet(e) {
  const action = e.parameter.action || '';

  if (action === 'validatePassword') {
    const valid = (e.parameter.password || '') === PASSWORD;
    return jsonOut({ valid });
  }

  return jsonOut({ error: 'Unknown action' });
}

// POST — RSVP submission
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    const sheet     = ss.getSheetByName(SHEET_NAME);
    const groupSize = 1 + (Array.isArray(d.guests) ? d.guests.length : 0);

    // Duplicate check — reject if same name OR email already submitted
    const existing = sheet.getDataRange().getValues();
    for (let i = 1; i < existing.length; i++) {
      const rowType  = existing[i][2]; // GuestType column
      const rowName  = (existing[i][3] || '').toString().trim().toLowerCase();
      const rowEmail = (existing[i][5] || '').toString().trim().toLowerCase();
      if (rowType === 'Primary') {
        const inName  = (d.name  || '').trim().toLowerCase();
        const inEmail = (d.email || '').trim().toLowerCase();
        if (rowName === inName || (inEmail && rowEmail === inEmail)) {
          return jsonOut({ ok: false, duplicate: true });
        }
      }
    }

    // Save uploaded ID to Drive (if provided)
    let idUrl = '';
    if (d.idFile && d.idFileName) {
      idUrl = saveFileToDrive(d.idFile, d.idFileName, d.name);
    }

    // Primary guest row
    appendRow(sheet, [
      d.name,                       // A: SubmittedBy
      groupSize,                    // B: GroupSize
      'Primary',                    // C: GuestType
      d.name,                       // D: Name
      d.age,                        // E: AgeGroup
      d.email,                      // F: Email
      d.phone,                      // G: Phone
      d.dietary    || '',           // H: Dietary
      d.attending,                  // I: Attending
      idUrl,                        // J: IDFileURL
      d.message    || '',           // K: Message
      new Date().toISOString(),     // L: SubmittedAt
    ]);

    // Additional guest rows
    if (Array.isArray(d.guests) && d.guests.length > 0) {
      d.guests.forEach((g, i) => {
        let gIdUrl = '';
        if (g.idFile && g.idFileName) {
          gIdUrl = saveFileToDrive(g.idFile, g.idFileName, g.name);
        }
        appendRow(sheet, [
          d.name,               // A: SubmittedBy (links row back to primary)
          groupSize,            // B: GroupSize
          'Guest ' + (i + 1),  // C: GuestType
          g.name,               // D: Name
          g.age,                // E: AgeGroup
          g.email   || '',      // F: Email
          g.phone   || '',      // G: Phone
          g.dietary || '',      // H: Dietary
          'yes',                // I: Attending (additional guests are always attending)
          gIdUrl,               // J: IDFileURL
          '',                   // K: Message
          '',                   // L: SubmittedAt
        ]);
      });
    }

    // Send confirmation email (non-fatal)
    try { sendConfirmationEmail(d, groupSize); } catch (err) {}

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// Save base64-encoded file to a Google Drive folder; return the shareable URL
function saveFileToDrive(base64Data, fileName, guestName) {
  try {
    const folders = DriveApp.getFoldersByName(ID_FOLDER_NAME);
    const folder  = folders.hasNext() ? folders.next() : DriveApp.createFolder(ID_FOLDER_NAME);

    const mimeType = base64Data.split(';')[0].split(':')[1];
    const base64   = base64Data.split(',')[1];
    const blob     = Utilities.newBlob(
      Utilities.base64Decode(base64),
      mimeType,
      guestName.replace(/\s+/g, '_') + '_' + fileName
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return ''; // non-fatal — submission still goes through
  }
}

// Write a row using RAW mode so phone numbers starting with + are not
// misinterpreted as formulas by Google Sheets
function appendRow(sheet, values) {
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
}

// ── Confirmation email ───────────────────────────────────────────────────────
function sendConfirmationEmail(d, groupSize) {
  if (!d.email) return;

  const attending = d.attending === 'yes';
  const firstName = d.name.split(' ')[0];

  const subject = attending
    ? 'See you in Kasauli — RSVP Confirmed'
    : 'We\'ll miss you — Ananmay & Jennifer\'s Wedding';

  // ── Build guest list rows (HTML + plain) ──
  let guestRowsHtml = '';
  let guestRowsText = '';
  if (attending) {
    const allGuests = [{ name: d.name, age: d.age }];
    if (Array.isArray(d.guests)) d.guests.forEach(g => allGuests.push({ name: g.name, age: g.age }));
    allGuests.forEach(g => {
      guestRowsHtml += `<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#3a3028;padding:5px 0">${g.name}</td><td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#8b7355;padding:5px 0 5px 16px">Age ${g.age}</td></tr>`;
      guestRowsText += `  ${g.name} (Age ${g.age})\n`;
    });
  }

  const dietaryHtml = d.dietary
    ? `<tr><td colspan="2" style="padding-top:16px;border-top:1px solid #e0d5c5"></td></tr><tr><td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7355;padding:4px 0;vertical-align:top">Dietary</td><td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#3a3028;padding:4px 0 4px 16px">${d.dietary}</td></tr>`
    : '';
  const messageHtml = d.message
    ? `<tr><td colspan="2" style="padding-top:16px;border-top:1px solid #e0d5c5"></td></tr><tr><td colspan="2" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#6b5a4a;font-style:italic;line-height:1.7;padding:4px 0">"${d.message}"</td></tr>`
    : '';

  // ── HTML email ──
  const htmlBody = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#ede8df;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:580px;margin:32px auto;background:#faf7f2">

    <!-- Header -->
    <div style="background:#4b0e1a;padding:44px 48px 40px;text-align:center">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;margin:0 0 14px;font-weight:400">The Wedding of</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:34px;color:#f5ead6;font-weight:normal;margin:0;letter-spacing:1px">Ananmay &amp; Jennifer</p>
      <div style="width:48px;height:1px;background:#c9a84c;margin:18px auto"></div>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.65);text-transform:uppercase;margin:0;font-weight:300">4 – 6 June 2026 &nbsp;·&nbsp; Kasauli, India</p>
    </div>

    <!-- Body -->
    <div style="padding:44px 48px 36px">

      <p style="font-size:17px;color:#3a3028;line-height:1.8;margin:0 0 12px">Dear ${firstName},</p>

      ${attending
        ? `<p style="font-size:16px;color:#3a3028;line-height:1.85;margin:0 0 32px">We're so glad you'll be there. Kasauli is going to be special, and having you with us makes it even more so — we genuinely cannot wait.</p>`
        : `<p style="font-size:16px;color:#3a3028;line-height:1.85;margin:0 0 32px">We're sorry you won't be able to make it, but we're grateful you took the time to let us know. You'll be missed, and we hope we get to celebrate with you soon.</p>`
      }

      ${attending ? `
      <!-- Summary box -->
      <div style="border:1px solid #ddd5c3;background:#f2ece0;padding:28px 32px;margin-bottom:32px">
        <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:9px;letter-spacing:3px;color:#a08060;text-transform:uppercase;margin:0 0 18px;font-weight:400">Your RSVP at a Glance</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7355;padding:4px 0;vertical-align:top">Attending</td>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#3a3028;padding:4px 0 4px 16px">Yes &nbsp;·&nbsp; Party of ${groupSize}</td>
          </tr>
          <tr><td colspan="2" style="padding-top:16px;border-top:1px solid #e0d5c5"></td></tr>
          <tr>
            <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7355;padding:4px 0;vertical-align:top">Guests</td>
            <td style="padding:4px 0 4px 16px"><table style="border-collapse:collapse">${guestRowsHtml}</table></td>
          </tr>
          ${dietaryHtml}
          ${messageHtml}
        </table>
      </div>
      ` : ''}

      <p style="font-size:15px;color:#6b5a4a;line-height:1.9;margin:0 0 28px;font-style:italic">Details about the schedule, accommodation, and travel are all available on our website at <a href="https://www.ananmayandjennifer.com" style="color:#4b0e1a;text-decoration:none;border-bottom:1px solid rgba(75,14,26,0.3)">www.ananmayandjennifer.com</a>. Feel free to reach out to us any time.</p>

      <p style="font-size:16px;color:#3a3028;line-height:1.5;margin:0 0 2px">With love,</p>
      <p style="font-size:26px;color:#4b0e1a;margin:0 0 32px;font-weight:normal">Ananmay &amp; Jennifer</p>

    </div>

    <!-- Footer -->
    <div style="background:#4b0e1a;padding:22px 48px;text-align:center">
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.75);margin:0 0 6px">#AnanmayWedsJennifer</p>
      <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:rgba(245,234,214,0.45);margin:0">
        <a href="mailto:ananmayandjennifer@gmail.com" style="color:rgba(201,168,76,0.6);text-decoration:none">ananmayandjennifer@gmail.com</a>
        &nbsp;·&nbsp; +91 93134 64284
      </p>
    </div>

  </div>
</body></html>`;

  // ── Plain-text fallback ──
  const plainBody = attending
    ? `Dear ${firstName},\n\nWe're so glad you'll be there. Kasauli is going to be special, and having you with us makes it even more so — we genuinely cannot wait.\n\nYOUR RSVP\nAttending: Yes · Party of ${groupSize}\n\nGuests:\n${guestRowsText}${d.dietary ? `Dietary: ${d.dietary}\n` : ''}${d.message ? `\nYour message: "${d.message}"\n` : ''}\nDetails about the schedule, accommodation, and travel are available on our website: www.ananmayandjennifer.com. Feel free to reach out to us any time.\n\nWith love,\nAnanmay & Jennifer\nananmayandjennifer@gmail.com · +91 93134 64284\n#AnanmayWedsJennifer`
    : `Dear ${firstName},\n\nWe're sorry you won't be able to make it, but we're grateful you took the time to let us know. You'll be missed, and we hope we get to celebrate with you soon.\n\nWith love,\nAnanmay & Jennifer\nananmayandjennifer@gmail.com · +91 93134 64284\n#AnanmayWedsJennifer`;

  MailApp.sendEmail({
    to: d.email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
  });
}
// ─────────────────────────────────────────────────────────────────────────────

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
