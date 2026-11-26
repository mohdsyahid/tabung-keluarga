/*
 * Google Apps Script untuk Tabung Keluarga.
 * Ikut README.md sebelum deploy sebagai Web App.
 */
const SHEETS = ['Contributions', 'Expenses', 'Loans'];

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const output = {
    contributions: readSheet_(ss, 'Contributions'),
    expenses: readSheet_(ss, 'Expenses'),
    loans: readSheet_(ss, 'Loans'),
    ...readSettings_(ss)
  };
  return json_(output);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (body.action === 'replaceAll' && body.data) {
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      const current = readSettings_(ss);
      if (current.revision && body.revision !== current.revision) {
        return json_({ ok: false, conflict: true, error: 'Data telah berubah pada peranti lain.' });
      }
      const revision = writeAll_(ss, body.data);
      return json_({ ok: true, revision: revision });
    } catch (error) {
      return json_({ ok: false, error: 'Sila cuba semula. Penyelarasan sedang digunakan.' });
    } finally {
      if (lock.hasLock()) lock.releaseLock();
    }
  }
  return json_({ ok: false, error: 'Permintaan tidak sah.' });
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SHEETS.forEach(name => setupSheet_(ss, name));
  setupSettings_(ss);
}

function setupSheet_(ss, name) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers_(name));
  sheet.setFrozenRows(1);
  return sheet;
}

function readSheet_(ss, name) {
  const sheet = setupSheet_(ss, name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const [headers, ...rows] = values;
  return rows.filter(row => row.some(value => value !== '')).map(row => Object.fromEntries(headers.map((header, i) => [header, formatValue_(row[i])])));
}

function writeAll_(ss, data) {
  SHEETS.forEach(name => {
    const key = name.toLowerCase();
    const sheet = setupSheet_(ss, name);
    sheet.clearContents();
    const headers = headers_(name);
    sheet.appendRow(headers);
    const rows = (data[key] || []).map(record => headers.map(header => record[header] ?? ''));
    if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    sheet.setFrozenRows(1);
  });
  const revision = String(new Date().getTime()) + '-' + Math.floor(Math.random() * 100000);
  const settings = setupSettings_(ss);
  settings.clearContents();
  settings.appendRow(['key', 'value']);
  settings.appendRow(['data', JSON.stringify({ startingBalances: data.startingBalances || {}, members: data.members || [], revision: revision })]);
  settings.setFrozenRows(1);
  return revision;
}

function setupSettings_(ss) {
  const sheet = ss.getSheetByName('Settings') || ss.insertSheet('Settings');
  if (sheet.getLastRow() === 0) sheet.appendRow(['key', 'value']);
  return sheet;
}

function readSettings_(ss) {
  const sheet = setupSettings_(ss);
  if (sheet.getLastRow() < 2) return { startingBalances: {}, members: [] };
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  const stored = values.find(row => row[0] === 'data');
  try { return stored && stored[1] ? JSON.parse(stored[1]) : { startingBalances: {}, members: [] }; }
  catch (error) { return { startingBalances: {}, members: [] }; }
}

function headers_(name) {
  if (name === 'Contributions') return ['id', 'date', 'member', 'amount', 'note', 'status'];
  if (name === 'Expenses') return ['id', 'date', 'item', 'amount', 'category', 'status'];
  return ['id', 'date', 'person', 'purpose', 'principal', 'paid', 'status', 'note'];
}

function formatValue_(value) {
  return value instanceof Date ? Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd') : value;
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
