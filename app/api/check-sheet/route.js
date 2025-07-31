import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { exists: false, error: "No wallet provided" },
        { status: 400 }
      );
    }

    // Validate Google Auth credentials
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error("Google Sheets authentication credentials not configured");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheet ID not configured");
    }

    // Get all sheets in the spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Check if any sheet name matches the wallet address
    const exists = response.data.sheets?.some(
      sheet => sheet.properties?.title?.toLowerCase() === wallet.toLowerCase()
    );

    return NextResponse.json({ exists });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        exists: false, 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}