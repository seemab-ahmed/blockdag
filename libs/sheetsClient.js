import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";

export async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "credentials/google-service-account.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });
  return sheets;
}  