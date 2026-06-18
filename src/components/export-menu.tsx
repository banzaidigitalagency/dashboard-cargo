"use client";
import { useState } from "react";
import { buildMarkdown, buildCsv, exportFilename, type ExportSnapshot } from "@/lib/export";

export function ExportMenu({ snapshot }: { snapshot: ExportSnapshot }) {
  const [copied, setCopied] = useState(false);

  async function copyForClaude() {
    const md = buildMarkdown(snapshot);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback: ouvre une fenêtre avec le texte à copier manuellement
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace;padding:24px">${md.replace(/</g, "&lt;")}</pre>`);
        w.document.title = "Copier pour Claude";
      }
    }
  }

  function downloadCsv() {
    const csv = buildCsv(snapshot);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFilename(snapshot, "csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-2 no-print">
      <button
        type="button"
        onClick={copyForClaude}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
          copied
            ? "bg-[var(--green)] text-[var(--navy)]"
            : "bg-[var(--navy)] text-white hover:bg-[var(--navy-700)]"
        }`}
        title="Copie un résumé Markdown prêt à coller dans Claude"
      >
        {copied ? (
          <>✓ Copié</>
        ) : (
          <>
            <SparkIcon /> Copier pour Claude
          </>
        )}
      </button>
      <button
        type="button"
        onClick={downloadCsv}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline-strong)] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--ink-2)] hover:border-[var(--navy)] transition"
        title="Télécharge les créas au format CSV (Excel)"
      >
        <DownloadIcon /> CSV
      </button>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
