"use client";
import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5277";
    const res = await fetch(`${API_URL}/api/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phoneNumber,
      }),
    });

    const data = await res.json();
    setMsg(data.message || "Something went wrong");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-900 via-neutral-950 to-black text-white px-4">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-800">
        
        <h1 className="text-3xl font-semibold text-center mb-6">
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 outline-none transition"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 outline-none transition"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 outline-none transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-blue-500 outline-none transition"
            placeholder="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition active:scale-95"
          >
            Register
          </button>
        </div>

        {msg && (
          <p className="text-center text-sm mt-4 text-gray-300">{msg}</p>
        )}

        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}