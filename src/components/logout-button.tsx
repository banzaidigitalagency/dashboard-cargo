"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    window.location.href = "/login";
  }
  return (
    <button onClick={logout} className="text-sm text-neutral-500 hover:text-neutral-900">
      Se déconnecter
    </button>
  );
}
