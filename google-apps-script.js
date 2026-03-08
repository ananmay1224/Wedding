/**
 * Ananmay & Jennifer Wedding — RSVP Backend
 * ─────────────────────────────────────────
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it "Wedding RSVP".
 *
 * 2. Create two sheets (tabs) inside it:
 *    Sheet 1 name: "Primary Guests"
 *    Sheet 2 name: "Additional Guests"
 *
 * 3. Add these headers to row 1 of each sheet:
 *
 *    Primary Guests (A→I):
 *    Name | Email | Phone | AgeGroup | Attending | Dietary | IDFileURL | Message | SubmittedAt
 *
 *    Additional Guests (A→F):
 *    PrimaryName | GuestName | AgeGroup | Email | Phone | Dietary
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
 */

// ── Config ──────────────────────────────────────────────────────────────────
const PASSWORD           = 'Kasauli2026';   // Change this to your chosen password
const PRIMARY_SHEET      = 'Primary Guests';
const ADDITIONAL_SHEET   = 'Additional Guests';
const ID_FOLDER_NAME     = 'Wedding RSVP IDs';
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

    // Save uploaded ID to Drive (if provided)
    let idUrl = '';
    if (d.idFile && d.idFileName) {
      idUrl = saveFileToDrive(d.idFile, d.idFileName, d.name);
    }

    // Write primary guest row
    const sheet1 = ss.getSheetByName(PRIMARY_SHEET);
    sheet1.appendRow([
      d.name,
      d.email,
      d.phone,
      d.age,
      d.attending,
      d.dietary || '',
      idUrl,
      d.message || '',
      new Date().toISOString(),
    ]);

    // Write additional guest rows
    if (Array.isArray(d.guests) && d.guests.length > 0) {
      const sheet2 = ss.getSheetByName(ADDITIONAL_SHEET);
      d.guests.forEach(g => {
        sheet2.appendRow([
          d.name,          // link back to primary guest
          g.name,
          g.age,
          g.email   || '',
          g.phone   || '',
          g.dietary || '',
        ]);
      });
    }

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

    const mimeType  = base64Data.split(';')[0].split(':')[1];
    const base64    = base64Data.split(',')[1];
    const blob      = Utilities.newBlob(
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

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
