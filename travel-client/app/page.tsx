"use client";
import Image from "next/image";
import { useState } from "react";
import AutocompleteInput from "./components/AutocompleteInput";

export default function Home() {
  const [tripType, setTripType] = useState("flight");

  // Search values
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  // Search results
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState<"api" | "mock" | null>(null);

  async function searchFlights() {
    console.log("Searching flights with:", { from, to, departure });

    if (!from || !to || !departure) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setFlights([]);

    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          date: departure,
          passengers,
        }),
      });

      const data = await res.json();
      console.log("Flights result:", data);
      console.log("Number of flights:", data.flights?.length || 0);

      if (data.success) {
        if (data.flights && data.flights.length > 0) {
          setFlights(data.flights);
          setDataSource(data.source || "api");
          console.log("Setting flights:", data.flights);
        } else {
          setError(`No flights found for this route. Try a different date or route. (API returned ${data.flights?.length || 0} results)`);
          console.log("No flights in response");
        }
      } else {
        setError(data.error || "Failed to fetch flights.");
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong...");
    }

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
          alt="Travel Background"
          fill
          className="object-cover brightness-50"
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center justify-center text-center min-h-screen px-6">

        <h1 className="text-6xl font-extrabold text-white drop-shadow-xl">
          Plan Your Perfect Trip ✈️
        </h1>

        <p className="mt-4 text-2xl text-white drop-shadow-md">
          Flights, hotels and vacation packages — customized for you.
        </p>

        {/* Search Box */}
        <div className="mt-10 bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl w-full max-w-4xl">

          {/* Trip Type Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {["flight", "hotel", "package"].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                  tripType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {type === "flight" && "Flights"}
                {type === "hotel" && "Hotels"}
                {type === "package" && "Packages"}
              </button>
            ))}
          </div>

          {/* Dynamic Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">

            {/* FLIGHTS + PACKAGES */}
            {(tripType === "flight" || tripType === "package") && (
              <>
                <AutocompleteInput
                  label="From"
                  placeholder="City or Airport"
                  onSelect={(iata) => setFrom(iata)}
                />

                <AutocompleteInput
                  label="To"
                  placeholder="Destination airport/city"
                  onSelect={(iata) => setTo(iata)}
                />

                <div>
                  <label className="text-white">Departure</label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>

                <div>
                  <label className="text-white">Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-white">Passengers</label>
                  <input
                    type="number"
                    min="1"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>
              </>
            )}

            {/* HOTELS */}
            {tripType === "hotel" && (
              <>
                <AutocompleteInput
                  label="Destination"
                  placeholder="City or Hotel"
                  onSelect={(v) => setTo(v)}
                />

                <div>
                  <label className="text-white">Check-in</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>

                <div>
                  <label className="text-white">Check-out</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-white">Guests</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  />
                </div>
              </>
            )}

          </form>

          {/* Error / Info Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
              <p className="text-white/60 text-xs mt-2">
                💡 Tip: The API may have limited data. Try popular routes like LAX to JFK, or LHR to CDG.
              </p>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={searchFlights}
              disabled={loading}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xl font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

        </div>

        {/* Flight Results */}
        {flights.length > 0 && (
          <div className="mt-8 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">
                Found {flights.length} Flight{flights.length !== 1 ? "s" : ""}
              </h2>
              {dataSource === "mock" && (
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm">
                  Demo Data
                </span>
              )}
            </div>

            <div className="space-y-4">
              {flights.map((flight, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl"
                >
                  {/* Full Route Display */}
                  {flight.segments && flight.segments.length > 0 ? (
                    <div className="space-y-4">
                      {flight.segments.map((segment: any, segIndex: number) => (
                        <div key={segIndex}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                            {/* Flight Number & Airline */}
                            <div>
                              <p className="text-sm text-white/60">
                                {segIndex === 0 ? "Flight" : `Connection ${segIndex}`}
                              </p>
                              <p className="text-xl font-bold">
                                {segment.flight_number}
                              </p>
                              <p className="text-sm text-white/80">
                                {segment.airline_name}
                              </p>
                            </div>

                            {/* Departure */}
                            <div>
                              <p className="text-sm text-white/60">Departure</p>
                              <p className="text-lg font-semibold">
                                {segment.dep_iata}
                              </p>
                              <p className="text-sm text-white/80">
                                {segment.dep_time}
                              </p>
                              {segment.dep_terminal && (
                                <p className="text-xs text-white/60">
                                  Terminal {segment.dep_terminal}
                                </p>
                              )}
                            </div>

                            {/* Arrival */}
                            <div>
                              <p className="text-sm text-white/60">Arrival</p>
                              <p className="text-lg font-semibold">
                                {segment.arr_iata}
                              </p>
                              <p className="text-sm text-white/80">
                                {segment.arr_time}
                              </p>
                              {segment.arr_terminal && (
                                <p className="text-xs text-white/60">
                                  Terminal {segment.arr_terminal}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Segment Duration */}
                          <div className="mt-2 text-sm text-white/70">
                            <span>⏱️ Segment Duration: {segment.duration}</span>
                            <span className="ml-4">✈️ Aircraft: {segment.aircraft_icao}</span>
                          </div>

                          {/* Separator between segments */}
                          {segIndex < flight.segments.length - 1 && (
                            <div className="my-4 border-t border-dashed border-white/30 pt-2">
                              <p className="text-center text-sm text-yellow-300">
                                🔄 Layover at {segment.arr_iata}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                      {/* Fallback to old format if no segments */}
                      <div>
                        <p className="text-sm text-white/60">Flight</p>
                        <p className="text-xl font-bold">
                          {flight.flight_iata || flight.flight_icao || "N/A"}
                        </p>
                        <p className="text-sm text-white/80">
                          {flight.airline_name || flight.airline_iata || flight.airline_icao || "Unknown Airline"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-white/60">Departure</p>
                        <p className="text-lg font-semibold">
                          {flight.dep_iata || flight.dep_icao || "N/A"}
                        </p>
                        <p className="text-sm text-white/80">
                          {flight.dep_time || "Time N/A"}
                        </p>
                        {flight.dep_terminal && (
                          <p className="text-xs text-white/60">
                            Terminal {flight.dep_terminal}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-white/60">Arrival</p>
                        <p className="text-lg font-semibold">
                          {flight.arr_iata || flight.arr_icao || "N/A"}
                        </p>
                        <p className="text-sm text-white/80">
                          {flight.arr_time || "Time N/A"}
                        </p>
                        {flight.arr_terminal && (
                          <p className="text-xs text-white/60">
                            Terminal {flight.arr_terminal}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Total Journey Info */}
                  <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-sm text-white/70">
                    {flight.duration && (
                      <span>⏱️ Total Duration: {flight.duration}</span>
                    )}
                    {flight.numberOfStops !== undefined && (
                      <span>
                        {flight.numberOfStops === 0 ? "🟢 Direct Flight" : `🟡 ${flight.numberOfStops} Stop(s)`}
                      </span>
                    )}
                    {flight.price && (
                      <span className="text-green-400 font-semibold">
                        💵 {flight.currency} {flight.price}
                      </span>
                    )}
                    {flight.status && (
                      <span className="text-green-400">
                        Status: {flight.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </main>
  );
}