"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setMsg("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5277";
      const res = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        setMsg("Server returned invalid response");
        console.error("Raw response:", text);
        return;
      }

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        return;
      }

      // ✔ נשמור את הטוקן והמשתמש
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMsg("Login successful!");

      // נעבור לדף הבית / דשבורד
      router.push("/");
    } catch (error) {
      console.error(error);
      setMsg("Client error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-linear-to-br from-neutral-900 via-neutral-950 to-black text-white px-4">

      <div className="w-full max-w-sm backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-black/20 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-black/20 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          Login
        </button>

        {msg && (
          <p className="text-center mt-3 text-sm text-red-400">
            {msg}
          </p>
        )}

        <p className="text-center mt-6 text-white/70 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}