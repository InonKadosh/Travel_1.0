"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // בדיקה אם המשתמש מחובר (ע״י localStorage כרגע)
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="w-full fixed top-0 left-0 bg-black/40 backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white">
        Travel<span className="text-blue-400">Agent</span>
      </Link>

      <div className="flex gap-4">
        {!isLoggedIn ? (
          <>
            {/* User NOT logged in */}
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white hover:text-black transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* User logged in */}
            <Link
              href="/profile"
              className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/20 transition"
            >
              My Trips
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}