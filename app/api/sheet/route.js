import { getSheetsClient } from "@/libs/sheetsClient";

export async function GET() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID; // Get from .env
  const range = "'0x5649'!A1:Z100";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return Response.json(response.data.values);
}