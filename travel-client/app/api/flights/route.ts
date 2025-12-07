import { NextResponse } from "next/server";

// Helper to make TS happy + fail fast if env is missing
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

// Amadeus API Configuration
const AMADEUS_API_KEY = requireEnv("AMADEUS_API_KEY");
const AMADEUS_API_SECRET = requireEnv("AMADEUS_API_SECRET");

// Airline names dictionary (common carriers)
const AIRLINE_NAMES: Record<string, string> = {
  AA: "American Airlines",
  DL: "Delta Air Lines",
  UA: "United Airlines",
  BA: "British Airways",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  IB: "Iberia",
  AY: "Finnair",
  LY: "El Al",
  TK: "Turkish Airlines",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad Airways",
  SU: "Aeroflot",
  AC: "Air Canada",
  NH: "ANA",
  JL: "Japan Airlines",
  SQ: "Singapore Airlines",
  CX: "Cathay Pacific",
  QF: "Qantas",
  NZ: "Air New Zealand",
  SK: "SAS",
  AZ: "ITA Airways",
  LX: "SWISS",
  OS: "Austrian Airlines",
  SN: "Brussels Airlines",
  TP: "TAP Air Portugal",
  EI: "Aer Lingus",
  FR: "Ryanair",
  U2: "easyJet",
  WN: "Southwest Airlines",
  B6: "JetBlue",
  AS: "Alaska Airlines",
  F9: "Frontier Airlines",
  NK: "Spirit Airlines",
  G4: "Allegiant Air",
  IZ: "Arkia",
  H4: "HiSky",
  "6H": "Israir",
};

// Cache for Amadeus access token
let amadeusToken: { token: string; expiresAt: number } | null = null;

// Get Amadeus Access Token
async function getAmadeusToken() {
  if (amadeusToken && amadeusToken.expiresAt > Date.now()) {
    return amadeusToken.token;
  }

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,     // now definitely string
      client_secret: AMADEUS_API_SECRET, // now definitely string
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Token error: ${data.error_description || "Unknown error"}`);
  }

  amadeusToken = {
    token: data.access_token,
    expiresAt: Date.now() + 1700 * 1000,
  };

  return data.access_token;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { from, to, date, passengers = 1 } = body;

  if (!from || !to || !date) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: from, to, or date" },
      { status: 400 }
    );
  }

  const originCode = String(from).toUpperCase().trim().substring(0, 3);
  const destinationCode = String(to).toUpperCase().trim().substring(0, 3);
  const iataRegex = /^[A-Z]{3}$/;

  if (!iataRegex.test(originCode) || !iataRegex.test(destinationCode)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid IATA codes. From: "${originCode}", To: "${destinationCode}". IATA codes must be 3 letters.`,
      },
      { status: 400 }
    );
  }

  try {
    const token = await getAmadeusToken();

    const params = new URLSearchParams({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: date,
      adults: String(passengers),
      max: "10",
      currencyCode: "USD",
    });

    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Amadeus API Error: ${data.errors?.[0]?.detail || "Unknown error"}`,
          apiError: data.errors,
        },
        { status: 502 }
      );
    }

    const flights = (data.data || []).map((offer: any) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

      const segments = offer.itineraries[0].segments.map((seg: any) => ({
        flight_number: seg.carrierCode + seg.number,
        airline_iata: seg.carrierCode,
        airline_name: AIRLINE_NAMES[seg.carrierCode] || seg.carrierCode,
        dep_iata: seg.departure.iataCode,
        arr_iata: seg.arrival.iataCode,
        dep_time: new Date(seg.departure.at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        arr_time: new Date(seg.arrival.at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        duration: seg.duration.replace("PT", "").replace("H", "h ").replace("M", "m"),
        aircraft_icao: seg.aircraft?.code || "N/A",
        dep_terminal: seg.departure.terminal,
        arr_terminal: seg.arrival.terminal,
      }));

      return {
        id: offer.id,
        flight_iata: firstSegment.carrierCode + firstSegment.number,
        airline_iata: firstSegment.carrierCode,
        airline_name: AIRLINE_NAMES[firstSegment.carrierCode] || firstSegment.carrierCode,
        dep_iata: firstSegment.departure.iataCode,
        arr_iata: lastSegment.arrival.iataCode,
        dep_time: new Date(firstSegment.departure.at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        arr_time: new Date(lastSegment.arrival.at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        duration: offer.itineraries[0].duration
          .replace("PT", "")
          .replace("H", "h ")
          .replace("M", "m"),
        aircraft_icao: firstSegment.aircraft?.code || "N/A",
        status: "Available",
        price: offer.price.total,
        currency: offer.price.currency,
        numberOfStops: offer.itineraries[0].segments.length - 1,
        dep_terminal: firstSegment.departure.terminal,
        arr_terminal: lastSegment.arrival.terminal,
        segments,
      };
    });

    return NextResponse.json({
      success: true,
      flights,
      count: flights.length,
      source: "amadeus",
    });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch flights: ${error.message}` },
      { status: 500 }
    );
  }
}