export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}


export function isLoggedIn() {
  return typeof window !== "undefined" && !!localStorage.getItem("token");
}
