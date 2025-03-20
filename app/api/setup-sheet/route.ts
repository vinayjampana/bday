import { google } from "googleapis"
import { NextResponse } from "next/server"

// This is a one-time setup endpoint to create the Google Sheet with headers
export async function GET() {
  try {
    // Create a JWT client using service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      return NextResponse.json({ error: "Google Sheets spreadsheet ID is not configured" }, { status: 500 })
    }

    // Set up headers in the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1:C1",
      valueInputOption: "RAW",
      requestBody: {
        values: [["Name", "Drink Preference", "Timestamp"]],
      },
    })

    return NextResponse.json({ success: true, message: "Sheet headers set up successfully" })
  } catch (error) {
    console.error("Error setting up Google Sheet:", error)
    return NextResponse.json({ error: "Failed to set up Google Sheet" }, { status: 500 })
  }
}

