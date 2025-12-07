"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userJson));
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white p-8">
      <h1 className="text-3xl font-semibold mb-4">
        Hey, {user.fullName} 👋
      </h1>
      <p className="text-white/70 mb-2">Email: {user.email}</p>
      <p className="text-white/70 mb-6">Phone: {user.phoneNumber}</p>

      <div className="mt-6 text-white/60">
        פה נתחיל לבנות:
        <ul className="list-disc list-inside mt-2">
          <li>החופשות האחרונות שלך</li>
          <li>טיולים מומלצים עבורך</li>
          <li>סוכן ה-AI שיבנה לך מסלול לפי פרופיל</li>
        </ul>
      </div>
    </div>
  );
}