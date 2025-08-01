import { getSheetsClient } from "../../../libs/sheetsClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab"); // default tab

  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = `'${tab}'!A1:Z100`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return Response.json(response.data.values); 
}