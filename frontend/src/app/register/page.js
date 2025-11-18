"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [role, setRole] = useState("member");
  const [err, setErr] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, client_id: clientId, role })
      });

      router.push("/login");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleRegister}>
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

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

        <input
          type="text"
          placeholder="Client ID"
          className="w-full p-2 border mb-3"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />

        <select
          className="w-full p-2 border mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>

        <div className="mt-4 text-sm">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </div>
      </form>
    </div>
  );
}
