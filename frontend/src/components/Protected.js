"use client";

import { useEffect, useState } from "react";
import { isLoggedIn } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Protected({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return <div className="p-4">Checking authentication...</div>;

  return children;
}
