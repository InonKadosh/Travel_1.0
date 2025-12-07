"use client";
import { useState } from "react";

export default function AutocompleteInput({
  label,
  placeholder,
  onSelect,
}: {
  label: string;
  placeholder: string;
  onSelect: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function handleChange(e: any) {
    const value = e.target.value;
    setQuery(value);

    // If user manually types a 3-letter IATA code, use it directly
    if (value.length === 3 && /^[A-Za-z]{3}$/.test(value)) {
      onSelect(value.toUpperCase());
    }

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/autocomplete?query=${encodeURIComponent(value)}`
      );
      const data = await res.json();

      const airports = data.response?.airports || [];
      const cities = data.response?.cities || [];

      const list = [
        ...airports.map((a: any) => ({
          label: `${a.name} (${a.iata_code})`,
          iata: a.iata_code,
          type: "airport",
        })),
        ...cities.map((c: any) => ({
          label: `${c.name}, ${c.country_name}`,
          iata: c.city_code || "",
          type: "city",
        })),
      ];

      setResults(list);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  }

  function choose(item: any) {
    setQuery(item.label);
    setOpen(false);
    onSelect(item.iata);
  }

  return (
    <div className="relative">
      <label className="text-white">{label}</label>

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="w-full mt-1 p-3 rounded-lg bg-white/20 text-white border border-white/30"
      />

      {open && results.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white text-black rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((item, i) => (
            <li
              key={i}
              onClick={() => choose(item)}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              {item.type === "airport" ? "✈️" : "🌍"} {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}