"use client";

import { useRouter } from "next/navigation";

export default function OdjaviDugme() {
  const router = useRouter();

  async function odjaviSe() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={odjaviSe}
      className="rounded-full border border-ember-900/40 px-4 py-1.5 text-sm text-ember-100/70 hover:border-ember-400"
    >
      Odjavi se
    </button>
  );
}
