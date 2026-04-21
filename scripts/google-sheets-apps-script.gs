/**
 * Zyph Labs — Assessment submissions receiver.
 *
 * PASTE THIS INTO: Extensions → Apps Script on a new Google Sheet.
 *
 * 1. Create a new Google Sheet called "Zyph Assessment Submissions"
 * 2. Open Extensions → Apps Script
 * 3. Replace the default code with this whole file
 * 4. Click Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy, authorize when prompted
 * 5. Copy the web app URL (ends in /exec)
 * 6. Paste it into Vercel → Project → Settings → Environment Variables
 *    as SHEETS_WEBHOOK_URL (all environments)
 * 7. Redeploy the Vercel app — or just wait for next push
 *
 * The sheet will auto-create its header row on the first submission.
 */

// Expected columns (header row auto-created if missing):
var HEADERS = [
  'timestamp',
  'source',
  'name',
  'email',
  'company',
  'industry',
  'trade',
  'topPain',
  'teamSize',
  'yearsInBusiness',
  'location',
  'reportUrl',
  'answersJson',
  'status',
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Ensure header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var row = HEADERS.map(function (h) {
      var v = body[h];
      if (v === undefined || v === null) return '';
      if (typeof v === 'object') return JSON.stringify(v);
      return v;
    });

    sheet.appendRow(row);

    // Format the new row's timestamp
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm');

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, row: lastRow })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, endpoint: 'zyph-assessment-sheet-receiver' })
  ).setMimeType(ContentService.MimeType.JSON);
}
