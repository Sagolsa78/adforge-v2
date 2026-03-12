"use client";

import { useState, useCallback } from "react";
import { BrandContext } from "@/types/onboarding.types";

interface Props {
  url: string;
  ctx: BrandContext[];
  ratings: Record<number, number>;
  bm: Set<number>;
  likes: Set<number>;
  selCtx: number | null;
  onSelect: (id: number) => void;
  onRate: (id: number, stars: number) => void;
  onToggleBm: (id: number) => void;
  onToggleLike: (id: number) => void;
  onUseSelected: () => void;
  onNewAnalysis: () => void;
  onCopy: (text: string) => void;
}

export default function Page3Results({ url, ctx, ratings, bm, likes, selCtx, onSelect, onRate, onToggleBm, onToggleLike, onUseSelected, onNewAnalysis, onCopy }: Props) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"all" | "fav" | "bm">("all");

  const toggle = useCallback((id: number) => {
    setExpanded((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const selCount = selCtx != null ? 1 : 0;
  const filtered = ctx.filter((c) => {
    if (filter === "fav") return likes.has(c.id);
    if (filter === "bm") return bm.has(c.id);
    return true;
  });

  return (
    <div className="page active">
      <div className="wrap lg" style={{ maxWidth: 1140 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <button className="btn btn-o" style={{ padding: "5px 11px", fontSize: 12, marginBottom: 14 }} onClick={onNewAnalysis}>← New Analysis</button>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.6px", marginBottom: 4 }}>Brand DNA Results</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <p style={{ color: "var(--ink3)", fontSize: 13, fontWeight: 500 }}>{url}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(5,150,105,.08)", border: "1px solid rgba(5,150,105,.2)", color: "var(--emerald)", padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                <span className="pulse" />
                {ctx.length} Brand Identities Generated
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Selected</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.5px" }}>{selCount > 0 ? selCount : "—"}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-v" style={{ padding: "8px 16px", fontSize: "12.5px" }} disabled={selCtx === null} onClick={onUseSelected}>Use Selected →</button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, padding: "10px 16px", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--r12)", boxShadow: "var(--sh0)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".07em", marginRight: 4 }}>Filter</span>
            {(["all", "fav", "bm"] as const).map((f) => {
              const count = f === "all" ? ctx.length : f === "fav" ? Array.from(likes).length : bm.size;
              return (
                <button key={f} className={`ftab${filter === f ? " on" : ""}`} onClick={() => setFilter(f)} style={{ padding: "5px 14px", borderRadius: 20, border: "1.5px solid var(--border)", background: filter === f ? "var(--violet)" : "transparent", color: filter === f ? "#fff" : "var(--ink2)", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  {f === "all" ? `All ${count}` : f === "fav" ? `⭐ Favourited (${count})` : `🔖 Bookmarked (${count})`}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".07em" }}>View</span>
            {(["list", "grid"] as const).map((v) => (
              <button key={v} className={`view-tog${view === v ? " on" : ""}`} onClick={() => setView(v)} style={{ width: 30, height: 30, borderRadius: 7, border: "1.5px solid var(--border)", background: view === v ? "var(--violet)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: view === v ? "#fff" : "var(--ink3)" }}>
                {v === "list" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className={view === "grid" ? "ctx-grid-view" : "ctx-list"}>
          {filtered.map((c) => {
            const idx = c.id - 1;
            const isExp = expanded.has(c.id);
            const isSel = selCtx === c.id;
            return (
              <div key={c.id} className={`ctx-card${isSel ? " selected" : ""}`}>
                <div className={`ctx-card-accent ctx-accent-${idx % 5}`} />
                <div className="ctx-card-inner">
                  <div className="ctx-card-body">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <div className={`ctx-num-badge ctx-num-${idx % 5}`}>{String(idx + 1).padStart(2, "0")}</div>
                      <div>
                        <div className="ctx-title">{c.title}</div>
                      </div>
                    </div>
                    <div className={`ctx-body-text${!isExp ? " collapsed" : ""}`}>{c.body}</div>
                    <button className={`ctx-expand-btn${isExp ? " open" : ""}`} onClick={() => toggle(c.id)}>
                      {isExp ? "Show less" : "Read more"} <span className="ctx-expand-chevron">▼</span>
                    </button>
                  </div>
                  <div className="ctx-card-side">
                    <button className={`ctx-sel-btn`} onClick={() => onSelect(c.id)}>
                      {isSel ? "✓ Selected" : "Select this context"}
                    </button>
                    <div className="ctx-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} className={`star-btn${(ratings[c.id] || 0) >= s ? " lit" : ""}`} onClick={() => onRate(c.id, s)}>★</button>
                      ))}
                    </div>
                    <div className="ctx-side-actions">
                      <button className={`ctx-act-btn${likes.has(c.id) ? " fav-on" : ""}`} onClick={() => onToggleLike(c.id)} title="Favourite">♥</button>
                      <button className={`ctx-act-btn${bm.has(c.id) ? " on" : ""}`} onClick={() => onToggleBm(c.id)} title="Bookmark">🔖</button>
                      <button className="ctx-act-btn" onClick={() => onCopy(c.body)} title="Copy">📋</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className={`p3-bottom-bar${selCtx != null ? " show" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="p3-sel-badge">Context {selCtx != null ? String(selCtx).padStart(2, "0") : ""} selected</div>
            <p style={{ fontSize: 13, color: "var(--ink2)" }}>Ready to generate content from this positioning angle</p>
          </div>
          <button className="btn btn-v" style={{ padding: "10px 22px" }} onClick={onUseSelected}>Continue to Templates →</button>
        </div>
      </div>
    </div>
  );
}
