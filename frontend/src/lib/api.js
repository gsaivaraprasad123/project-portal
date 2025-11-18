export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`http://localhost:4000/api${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error" }));
    throw new Error(error.message);
  }

  return res.json();
}
