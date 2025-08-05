export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Here you would integrate with Google Sheets API
    // For now, we'll simulate the save
    console.log("Saving guest response to spreadsheet:", data)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving response:", error)
    return Response.json({ error: "Failed to save response" }, { status: 500 })
  }
}
