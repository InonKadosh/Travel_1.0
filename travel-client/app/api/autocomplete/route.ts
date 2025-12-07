import { NextResponse } from "next/server";

const AIRLABS_API_KEY = process.env.AIRLABS_API_KEY;

if (!AIRLABS_API_KEY) {
  throw new Error("AirLabs API key not configured. Check .env.local file.");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json({ airports: [], cities: [] });
  }

  try {
    const res = await fetch(
      `https://airlabs.co/api/v9/autocomplete?query=${encodeURIComponent(query)}&api_key=${AIRLABS_API_KEY}`
    );

    if (!res.ok) {
      console.error("AirLabs API HTTP error:", res.status, res.statusText);
      const errorText = await res.text();
      console.error("AirLabs error response:", errorText);
      return NextResponse.json(
        { error: `AirLabs API error: ${res.status}`, airports: [], cities: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("AirLabs response:", JSON.stringify(data, null, 2));

    return NextResponse.json({
      response: {
        airports: data.response?.airports || [],
        cities: data.response?.cities || [],
      }
    });
  } catch (error) {
    console.error("AirLabs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete data", airports: [], cities: [] },
      { status: 500 }
    );
  }
}
