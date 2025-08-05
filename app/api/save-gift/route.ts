export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Here you would integrate with Google Sheets API
    // For now, we'll simulate the save
    console.log("Saving gift message to spreadsheet:", data)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving gift message:", error)
    return Response.json({ error: "Failed to save gift message" }, { status: 500 })
  }
}
