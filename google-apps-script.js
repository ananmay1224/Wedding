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

  // Build guest list lines
  let guestLines = '';
  if (attending) {
    guestLines += `  • ${d.name} (Age ${d.age})\n`;
    if (Array.isArray(d.guests) && d.guests.length > 0) {
      d.guests.forEach(g => { guestLines += `  • ${g.name} (Age ${g.age})\n`; });
    }
  }

  const subject = attending
    ? '✉ RSVP Confirmed — Ananmay & Jennifer\'s Wedding'
    : '✉ We\'ll Miss You — Ananmay & Jennifer\'s Wedding';

  let body;

  if (attending) {
    body =
`Dear ${firstName},

What wonderful news — we're so happy you'll be joining us!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ANANMAY & JENNIFER
  4 – 6 June 2026  ·  Kasauli, India
  Ramada by Wyndham, Kasauli
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR RSVP SUMMARY
─────────────────
Attending:    Yes
Party size:   ${groupSize} ${groupSize === 1 ? 'guest' : 'guests'}

Guests confirmed:
${guestLines}${d.dietary ? `Dietary notes: ${d.dietary}\n` : ''}${d.message ? `\nYour message to us:\n"${d.message}"\n` : ''}
─────────────────

More details about the schedule, accommodation, and travel will be shared closer to the date. In the meantime, feel free to reach out to us at any time.

With love & excitement,
Ananmay & Jennifer

ananmayandjennifer@gmail.com  ·  +91 93134 64284
#AnanmayWedsJennifer`;

  } else {
    body =
`Dear ${firstName},

Thank you for letting us know — you will truly be missed.

We're sad you won't be able to join us in Kasauli, but we'll be thinking of you and hope to celebrate together another time.

If your plans change or you have any questions, please don't hesitate to reach out.

With love,
Ananmay & Jennifer

ananmayandjennifer@gmail.com  ·  +91 93134 64284
#AnanmayWedsJennifer`;
  }

  MailApp.sendEmail({ to: d.email, subject: subject, body: body });
}
// ─────────────────────────────────────────────────────────────────────────────

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
