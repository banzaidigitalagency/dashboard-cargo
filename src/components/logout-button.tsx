"use client";

import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    window.location.href = "/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        "text-sm text-[var(--muted)] hover:text-[var(--ink)] transition",
        className
      )}
    >
      Se déconnecter
    </button>
  );
}
