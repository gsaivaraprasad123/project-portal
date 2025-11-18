"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { logout } from "../lib/auth";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // Hide navbar on login/register pages
  const hideNavbar = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    apiFetch("/auth/me")
      .then(setUser)
      .catch(() => {});
  }, []);

  if (hideNavbar) return null;

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center fixed top-0 left-0 z-50">
      <a href="/dashboard" className="text-xl font-semibold">
        Project Portal
      </a>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 text-sm">
            {user.email}
          </span>
        )}

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
