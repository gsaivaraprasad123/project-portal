"use client";

import { useState } from "react";
import { saveToken } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      saveToken(res.access_token);
      router.push("/dashboard");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleLogin}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {err && <div className="text-red-500 mb-2">{err}</div>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <div className="mt-4 text-sm">
          Don't have account? <a href="/register" className="text-blue-600">Register</a>
        </div>
      </form>
    </div>
  );
}
