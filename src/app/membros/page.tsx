"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { track } from "@/lib/track";

interface Pedido {
  id: number;
  nome: string | null;
  sticker_url: string;
  preview_url: string | null;
  pdf_url: string | null;
  created_at: string;
}

interface PedidoItem {
  item_type: string;
  offer_name: string | null;
  offer_hash: string | null;
  product_name: string | null;
  price: number;
  status: string;
  created_at: string;
}

interface MemberData {
  nome: string | null;
  pedidos: Pedido[];
  items: PedidoItem[];
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

interface CatalogProduct {
  id: string;
  name: string;
  desc: React.ReactNode;
  renderImage: (bought: boolean) => React.ReactNode;
  acquireUrl?: string;
  downloadLabel?: string;
  infoMode?: boolean;
  checkBought?: (d: MemberData) => boolean;
  getDownloadUrl?: (d: MemberData) => string | null;
  boughtExtra?: React.ReactNode;
  boughtMessage?: string;
  renderCard?: (data: MemberData, width: number) => React.ReactNode;
}

function ProductImg({ src, alt, bought }: { src: string; alt: string; bought: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
        filter: bought ? "none" : "grayscale(0.65)",
      }}
    />
  );
}

const CATALOG: CatalogProduct[] = [
  {
    id: "pacote-pdf",
    name: "WM-Paket 2026",
    desc: "Erlebe das WM-Erlebnis intensiver mit dem offiziellen PDF-Paket",
    renderImage: (bought) => <ProductImg src="/embalagensfigurinhas.webp" alt="WM-Paket 2026" bought={bought} />,
    acquireUrl: "https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07",
    downloadLabel: "PDF herunterladen",
    checkBought: (d) =>
      d.items.some(i =>
        i.offer_name?.toLowerCase().includes("pacote") ||
        i.product_name?.toLowerCase().includes("pacote") ||
        i.offer_name?.toLowerCase().includes("pacotinho") ||
        i.product_name?.toLowerCase().includes("pacotinho") ||
        i.offer_name?.toLowerCase().includes("paquetito") ||
        i.product_name?.toLowerCase().includes("paquetito") ||
        i.offer_name?.toLowerCase().includes("kit") ||
        i.product_name?.toLowerCase().includes("kit")
      ),
    getDownloadUrl: () => "/embalagemfigurinha.pdf",
  },
  {
    id: "poster-a2",
    name: "Poster A4",
    desc: "PDF zum Ausdrucken und Dekorieren zu Hause herunterladen",
    renderImage: (bought) => <ProductImg src="/poster.webp" alt="Poster A4 PDF" bought={bought} />,
    acquireUrl: "https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07",
    checkBought: (d) =>
      d.items.some(i =>
        i.offer_name?.toLowerCase().includes("poster") ||
        i.product_name?.toLowerCase().includes("poster") ||
        i.offer_name?.toLowerCase().includes("poste") ||
        i.product_name?.toLowerCase().includes("poste")
      ),
    getDownloadUrl: () => null,
    renderCard: (data, width) => <PosterA4Card data={data} width={width} />,
  },
  {
    id: "messi",
    name: "Sammelkarte Ronaldo",
    desc: "Nationalmannschafts-Trikot – PDF-Paket zum Ausdrucken",
    renderImage: (bought) => <ProductImg src="/figurinhamodelo.webp" alt="Sammelkarte Ronaldo" bought={bought} />,
    acquireUrl: "https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07",
    checkBought: (d) =>
      d.items.some(i =>
        i.offer_name?.toLowerCase().includes("messi") ||
        i.product_name?.toLowerCase().includes("messi") ||
        i.offer_name?.toLowerCase().includes("neymar") ||
        i.product_name?.toLowerCase().includes("neymar") ||
        i.offer_name?.toLowerCase().includes("camisa") ||
        i.product_name?.toLowerCase().includes("camisa")
      ),
    getDownloadUrl: () => null,
    renderCard: (data, width) => <MessiCard data={data} width={width} />,
  },
];

// ─── Card components ──────────────────────────────────────────────────────────

function StickerCard({ pedido }: { pedido: Pedido }) {
  return (
    <div style={{
      flexShrink: 0, width: 190, scrollSnapAlign: "start",
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,.14)",
      background: "#fff",
      border: "2px solid #000000",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", background: "#e2e8f0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pedido.preview_url || pedido.sticker_url}
          alt={pedido.nome || "Sammelkarte"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)",
        }} />
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 800, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {pedido.nome || "Sammelkarte"}
          </p>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 11, margin: "2px 0 0" }}>WM 2026</p>
        </div>
      </div>
      <div style={{ padding: "14px 14px 14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <a
            href={`/api/download?url=${encodeURIComponent(pedido.sticker_url)}&name=sammelkarte-${(pedido.nome || "wm").toLowerCase().replace(/\s+/g, "-")}`}
            style={{ display: "block", textAlign: "center", background: "#000000", color: "#FABD00", borderRadius: 10, padding: "10px 8px", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: ".03em" }}
          >⬇ PNG herunterladen</a>
          {pedido.pdf_url && (
            <a
              href={`/api/download?url=${encodeURIComponent(pedido.pdf_url)}&name=sammelkarte-pdf-${(pedido.nome || "wm").toLowerCase().replace(/\s+/g, "-")}`}
              style={{ display: "block", textAlign: "center", background: "#f8fafc", color: "#334155", borderRadius: 10, padding: "10px 8px", fontSize: 12, fontWeight: 700, textDecoration: "none", border: "1px solid #e2e8f0" }}
            >📄 PDF</a>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogCard({ product, data, width = 240 }: { product: CatalogProduct; data: MemberData; width?: number }) {
  const infoMode = !!product.infoMode;
  const bought = infoMode ? true : (product.checkBought ? product.checkBought(data) : false);
  const downloadUrl = bought && !infoMode ? product.getDownloadUrl?.(data) ?? null : null;

  return (
    <div style={{
      flexShrink: 0, width, scrollSnapAlign: "start",
      borderRadius: 20, overflow: "hidden",
      boxShadow: bought || infoMode ? "0 8px 32px rgba(0,0,0,.13)" : "0 4px 16px rgba(0,0,0,.09)",
      background: "#fff",
      border: bought && !infoMode ? "2px solid #000000" : "2px solid transparent",
      transition: "box-shadow .2s",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
        {product.renderImage(bought)}
        {!bought && !infoMode && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,15,15,.5)",
            backdropFilter: "grayscale(1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 26 }}>🔒</span>
            </div>
          </div>
        )}
        {bought && !infoMode && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "#000000", borderRadius: 8, padding: "4px 9px" }}>
            <span style={{ color: "#FABD00", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ DEIN</span>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>
          {product.name}
        </p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
          {product.desc}
        </p>

        {infoMode ? (
          product.boughtExtra && <div>{product.boughtExtra}</div>
        ) : (
          <>
            {bought && product.boughtExtra && (
              <div style={{ marginBottom: 12 }}>{product.boughtExtra}</div>
            )}
            {bought && downloadUrl ? (
              <a
                href={downloadUrl}
                style={{
                  display: "block", textAlign: "center",
                  background: "#000000", color: "#FABD00",
                  borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                  textDecoration: "none", letterSpacing: ".03em",
                }}
              >⬇ {product.downloadLabel || "Herunterladen"}</a>
            ) : bought && !downloadUrl ? (
              <div style={{
                textAlign: "center", background: "#f0fdf4",
                color: "#166534", borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                border: "1px solid #bbf7d0",
              }}>{product.boughtMessage || "✓ Verfügbar"}</div>
            ) : product.acquireUrl ? (
              <a
                href={product.acquireUrl}
                style={{
                  display: "block", textAlign: "center",
                  background: "#FABD00", color: "#000000",
                  borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
                  textDecoration: "none", letterSpacing: ".03em",
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                }}
              >Jetzt kaufen</a>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function PosterA4Card({ data, width = 250 }: { data: MemberData; width?: number }) {
  const bought = data.items.some(i =>
    i.offer_name?.toLowerCase().includes("poster") ||
    i.product_name?.toLowerCase().includes("poster") ||
    i.offer_name?.toLowerCase().includes("poste") ||
    i.product_name?.toLowerCase().includes("poste")
  );
  const stickerUrl = data.pedidos[0]?.sticker_url ?? null;

  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadFileB, setUploadFileB] = useState<File | null>(null);
  const [uploadLoadingB, setUploadLoadingB] = useState(false);
  const [uploadErrorB, setUploadErrorB] = useState<string | null>(null);
  const inputRefB = useRef<HTMLInputElement>(null);

  const runGenerate = async (source: "auto" | File, layout: "grid" | "a4" = "grid") => {
    const isUpload = source instanceof File;
    const isB = layout === "a4";
    if (isUpload && isB) { setUploadLoadingB(true); setUploadErrorB(null); }
    else if (isUpload) { setUploadLoading(true); setUploadError(null); }
    else { setGenLoading(true); setGenError(null); }
    try {
      let file: File;
      if (isUpload) {
        file = source;
      } else {
        if (!stickerUrl) throw new Error("sem-url");
        const r = await fetch(`/api/download?url=${encodeURIComponent(stickerUrl)}&name=sticker`);
        if (!r.ok) throw new Error("fetch");
        const blob = await r.blob();
        file = new File([blob], "sticker.png", { type: blob.type || "image/png" });
      }
      const form = new FormData();
      form.append("file", file);
      form.append("layout", layout);
      const res = await fetch("/api/gerar-pdf", { method: "POST", body: form });
      if (!res.ok) throw new Error("pdf");
      const pdfBlob = await res.blob();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = layout === "a4" ? "poster-komplett-a4.pdf" : "poster-sammelkarte-4x4.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      if (isUpload && isB) setUploadErrorB("Fehler beim Erstellen. Bitte erneut versuchen.");
      else if (isUpload) setUploadError("Fehler beim Erstellen. Bitte erneut versuchen.");
      else setGenError("Fehler beim Erstellen. Bitte erneut versuchen.");
    } finally {
      if (isUpload && isB) setUploadLoadingB(false);
      else if (isUpload) setUploadLoading(false);
      else setGenLoading(false);
    }
  };

  const UploadSection = ({ file, setFile, loading, error, layout, inputR }: {
    file: File | null; setFile: (f: File | null) => void;
    loading: boolean; error: string | null;
    layout: "grid" | "a4"; inputR: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#000000" }}>
        {layout === "a4" ? "📄 Komplett-Poster (A4)" : "🖼 Raster 4×4"}
      </p>
      <input ref={inputR} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div onClick={() => inputR.current?.click()} style={{
          flex: 1, border: "1.5px dashed #cbd5e1", borderRadius: 7, padding: "7px 6px",
          textAlign: "center", cursor: "pointer", background: "#f8fafc", minWidth: 0,
        }}>
          <p style={{ margin: 0, fontSize: 9, color: file ? "#334155" : "#94a3b8", fontWeight: file ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file ? file.name : "Bild auswählen"}
          </p>
        </div>
        <button onClick={() => file && runGenerate(file, layout)} disabled={loading || !file} style={{
          flexShrink: 0, background: file ? "#000000" : "#f1f5f9",
          color: file ? "#FABD00" : "#94a3b8", border: "none", borderRadius: 7,
          padding: "7px 10px", fontSize: 11, fontWeight: 800,
          cursor: loading || !file ? "default" : "pointer", whiteSpace: "nowrap",
        }}>
          {loading ? "..." : "⬇ PDF"}
        </button>
      </div>
      {error && <p style={{ color: "#dc2626", fontSize: 10, margin: "3px 0 0" }}>{error}</p>}
    </div>
  );

  return (
    <div className="poster-card-outer" style={{
      flexShrink: 0, scrollSnapAlign: "start",
      borderRadius: 20, overflow: "hidden",
      boxShadow: bought ? "0 8px 32px rgba(0,0,0,.13)" : "0 4px 16px rgba(0,0,0,.09)",
      background: "#fff",
      border: bought ? "2px solid #000000" : "2px solid transparent",
    }}>
      <div className="poster-card-inner">
        <div className="poster-card-image" style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <ProductImg src="/poster.webp" alt="Poster A4" bought={bought} />
          {!bought && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(15,15,15,.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 26 }}>🔒</span>
              </div>
            </div>
          )}
          {bought && (
            <div style={{ position: "absolute", top: 10, right: 10, background: "#000000", borderRadius: 8, padding: "4px 9px" }}>
              <span style={{ color: "#FABD00", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ DEIN</span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px" }}>
          <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>Poster A4</p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>PDF zum Ausdrucken und Dekorieren zu Hause</p>

          {bought ? (
            <>
              <button onClick={() => runGenerate("auto")} disabled={genLoading || !stickerUrl} style={{
                width: "100%", background: "#000000", color: "#FABD00", border: "none",
                borderRadius: 10, padding: "10px 8px", fontSize: 13, fontWeight: 700,
                cursor: genLoading || !stickerUrl ? "default" : "pointer",
                opacity: genLoading || !stickerUrl ? 0.7 : 1, letterSpacing: ".03em",
              }}>
                {genLoading ? "PDF wird erstellt..." : "⬇ PDF 4×4 herunterladen"}
              </button>
              {genError && <p style={{ color: "#dc2626", fontSize: 11, margin: "4px 0 0", textAlign: "center" }}>{genError}</p>}

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, color: "#64748b" }}>Mit einem anderen Foto erstellen:</p>
                <UploadSection file={uploadFile} setFile={setUploadFile} loading={uploadLoading} error={uploadError} layout="grid" inputR={inputRef} />
                <UploadSection file={uploadFileB} setFile={setUploadFileB} loading={uploadLoadingB} error={uploadErrorB} layout="a4" inputR={inputRefB} />
              </div>
            </>
          ) : (
            <a href="https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07" style={{
              display: "block", textAlign: "center",
              background: "#FABD00", color: "#000000",
              borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
              textDecoration: "none", letterSpacing: ".03em",
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",
            }}>Jetzt kaufen</a>
          )}
        </div>
      </div>
    </div>
  );
}

function MessiCard({ data, width = 250 }: { data: MemberData; width?: number }) {
  const bought = data.items.some(i =>
    i.offer_name?.toLowerCase().includes("messi") ||
    i.product_name?.toLowerCase().includes("messi") ||
    i.offer_name?.toLowerCase().includes("neymar") ||
    i.product_name?.toLowerCase().includes("neymar") ||
    i.offer_name?.toLowerCase().includes("camisa") ||
    i.product_name?.toLowerCase().includes("camisa")
  );

  return (
    <div style={{
      flexShrink: 0, width, scrollSnapAlign: "start",
      borderRadius: 20, overflow: "hidden",
      boxShadow: bought ? "0 8px 32px rgba(0,0,0,.13)" : "0 4px 16px rgba(0,0,0,.09)",
      background: "#fff",
      border: bought ? "2px solid #000000" : "2px solid transparent",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
        <ProductImg src="/figurinhamodelo.webp" alt="Sammelkarte Ronaldo" bought={bought} />
        {!bought && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(15,15,15,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 26 }}>🔒</span>
            </div>
          </div>
        )}
        {bought && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "#000000", borderRadius: 8, padding: "4px 9px" }}>
            <span style={{ color: "#FABD00", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ DEIN</span>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>Sammelkarte Ronaldo</p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>Exklusive Ronaldo-Sammelkarte als PNG oder PDF zum Ausdrucken herunterladen</p>
        {bought ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a
              href="/Fig Messi total.png"
              download="sammelkarte-messi.png"
              style={{
                display: "block", textAlign: "center",
                background: "#000000", color: "#FABD00",
                borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                textDecoration: "none", letterSpacing: ".03em",
              }}
            >⬇ PNG herunterladen</a>
            <a
              href="/cromoronaldo.pdf"
              download="sammelkarte-ronaldo.pdf"
              style={{
                display: "block", textAlign: "center",
                background: "#f8fafc", color: "#334155",
                borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                textDecoration: "none", border: "1px solid #e2e8f0",
              }}
            >📄 PDF herunterladen</a>
          </div>
        ) : (
          <a
            href="https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07"
            style={{
              display: "block", textAlign: "center",
              background: "#FABD00", color: "#000000",
              borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
              textDecoration: "none", letterSpacing: ".03em",
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",
            }}
          >Jetzt kaufen</a>
        )}
      </div>
    </div>
  );
}

function ProductRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ color: "#0f172a", fontWeight: 900, fontSize: 22, margin: "0 0 18px", letterSpacing: "-.01em" }}>
        {title}
      </h3>
      <div className="product-row-scroll">
        {children}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function MembrosContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MemberData | null>(null);

  const fetchMember = async (val: string) => {
    const normalized = val.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) { setError("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/membros?email=${encodeURIComponent(normalized)}`);
      if (res.status === 404) { setError("Für diese E-Mail wurde kein Kauf gefunden. Bitte überprüfe die Eingabe."); setData(null); return; }
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("Fehler bei der Suche. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailParam) { setEmail(emailParam); fetchMember(emailParam); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam]);

  useEffect(() => {
    if (!data || !data.pedidos?.length) return;
    track("recebeu_figurinha", { email: email || undefined, nome: data.nome || undefined });
    const temBumpPago = data.items?.some(i => i.item_type === "order_bump" && i.status === "pago");
    if (temBumpPago) track("recebeu_figurinha_plus", { email: email || undefined, nome: data.nome || undefined });
  }, [data, email]);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#FABD00",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "40px 32px 64px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(0,0,0,.12)", borderRadius: 12, padding: "8px 18px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <span className="membros-badge" style={{ color: "#000000", fontWeight: 800, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase" }}>
            WM-Sammelkarte 2026
          </span>
        </div>
        <h1 className="membros-h1" style={{ color: "#000000", fontSize: 28, fontWeight: 900, margin: "0 0 8px", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
          DOWNLOADBEREICH
        </h1>
        <p style={{ color: "rgba(0,0,0,.6)", fontSize: 14, margin: 0, fontWeight: 500 }}>
          Zugang zu allen gekauften Produkten
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* ── Login ── */}
        {!data && (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,.15)", maxWidth: 460, margin: "0 auto 16px",
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🏆</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#000000", margin: "0 0 6px" }}>
                Mit E-Mail anmelden
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Verwende dieselbe E-Mail wie beim Kauf
              </p>
            </div>
            <input
              type="email"
              inputMode="email"
              placeholder="deine@email.de"
              value={email}
              autoComplete="email"
              onChange={e => setEmail(e.target.value.trim())}
              onKeyDown={e => e.key === "Enter" && fetchMember(email)}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "2px solid #e2e8f0", borderRadius: 12, padding: "14px 16px",
                fontSize: 16, outline: "none", marginBottom: 12, color: "#0f172a", fontFamily: "inherit",
              }}
            />
            {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}
            <button
              onClick={() => fetchMember(email)}
              disabled={loading}
              style={{
                width: "100%", background: "#000000", color: "#FABD00", border: "none",
                borderRadius: 12, padding: "15px 20px", fontSize: 15, fontWeight: 800,
                cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                letterSpacing: ".06em", textTransform: "uppercase",
              }}
            >
              {loading ? "Suchen..." : "MEINE PRODUKTE AUFRUFEN →"}
            </button>
          </div>
        )}

        {/* ── Member area ── */}
        {data && (
          <>
            {/* Willkommensleiste */}
            <div style={{
              background: "#0f172a",
              borderRadius: 18, padding: "20px 24px",
              marginBottom: 36,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 8px 32px rgba(0,0,0,.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#FABD00",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>⚽</div>
                <div>
                  <p style={{ color: "rgba(255,255,255,.5)", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>
                    Mitgliederbereich
                  </p>
                  <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: "-.01em" }}>
                    {data.nome || "Kunde"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setData(null); setEmail(""); }}
                style={{
                  background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)",
                  border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}
              >
                E-Mail ändern
              </button>
            </div>

            {/* Reihe 1 — Sammelkarten */}
            {data.pedidos.length > 0 && (
              <ProductRow title={`Deine Karten (${data.pedidos.length})`}>
                {data.pedidos.map(p => <StickerCard key={p.id} pedido={p} />)}
              </ProductRow>
            )}

            {/* Upsell: eine weitere Karte erstellen */}
            <div style={{ position: "relative", marginBottom: 28 }}>
              <div style={{
                position: "absolute", inset: -6, borderRadius: 24,
                background: "linear-gradient(270deg,#000000,#FABD00,#DD0000,#FFFFFF)",
                backgroundSize: "300% 300%", animation: "borderSpin 4s ease infinite",
                filter: "blur(14px)", opacity: .6, zIndex: 0,
              }} />
              <div style={{
                position: "relative", zIndex: 1,
                padding: 3, borderRadius: 18,
                background: "linear-gradient(270deg,#000000,#FABD00,#DD0000,#FFFFFF)",
                backgroundSize: "300% 300%", animation: "borderSpin 4s ease infinite",
              }}>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: "18px 20px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
                }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".08em", textTransform: "uppercase" }}>
                      Exklusives Angebot
                    </p>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#000000", lineHeight: 1.3 }}>
                      Erstelle eine weitere Karte für nur <span style={{ color: "#DD0000" }}>€2,99</span>
                    </p>
                  </div>
                  <a href="/?start=1"
                    onClick={() => { try { sessionStorage.removeItem("figurinha_sticker_url"); sessionStorage.removeItem("figurinha_sticker_id"); } catch {/**/} }}
                    style={{
                      display: "block", width: "100%", boxSizing: "border-box",
                      background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                      color: "#FABD00", borderRadius: 12, padding: "14px 18px",
                      fontSize: 15, fontWeight: 900, textDecoration: "none",
                      letterSpacing: ".06em", textAlign: "center",
                      boxShadow: "0 4px 16px rgba(0,0,0,.35)",
                    }}>
                    JETZT NUTZEN! ⚽
                  </a>
                </div>
              </div>
            </div>

            {/* Reihe 2 — Produkte */}
            <ProductRow title="WM 2026 Produkte">
              {CATALOG.map(product =>
                product.renderCard
                  ? <div key={product.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>{product.renderCard(data, 250)}</div>
                  : <CatalogCard key={product.id} product={product} data={data} width={250} />
              )}
            </ProductRow>

            {/* Support */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <a
                href="https://api.whatsapp.com/send?phone=559294621319&text=Hallo%2C%20ich%20brauche%20Hilfe%20mit%20meinem%20Kauf."
                target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(0,0,0,.5)", fontSize: 13, textDecoration: "underline", fontWeight: 500 }}
              >
                Probleme mit einem Produkt? Support kontaktieren
              </a>
            </div>

            {/* Verlosungshinweis */}
            <div style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
              borderRadius: 16, padding: "16px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              boxShadow: "0 4px 16px rgba(0,0,0,.3)", textAlign: "center",
            }}>
              <span style={{ fontSize: 24 }}>🏆⚽</span>
              <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
                Du nimmst bereits an der Verlosung von{" "}
                <span style={{ color: "#FABD00" }}>€1.000</span> teil!
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 600 }}>
                Ziehung am <span style={{ color: "#FABD00", fontWeight: 800 }}>11.07.2026</span>
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }

        .product-row-scroll {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 12px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .product-row-scroll > div {
          flex-shrink: 0;
          scroll-snap-align: start;
        }

        .poster-card-outer { width: 250px; }
        .poster-card-inner { display: flex; flex-direction: column; }
        .poster-card-image { width: 100%; aspect-ratio: 3/4; }

        @media (max-width: 640px) {
          .product-row-scroll {
            display: flex;
            flex-direction: column;
            overflow-x: visible;
            scroll-snap-type: none;
            gap: 14px;
            padding-bottom: 0;
          }
          .product-row-scroll > div {
            width: 100% !important;
            flex-shrink: unset;
          }
          .membros-badge {
            font-size: 9px !important;
            padding: 5px 10px !important;
          }
          .membros-h1 {
            font-size: 20px !important;
            letter-spacing: .02em !important;
          }
          .poster-card-outer { width: 100% !important; }
        }
        @keyframes borderSpin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}

export default function Membros() {
  return (
    <Suspense>
      <MembrosContent />
    </Suspense>
  );
}
