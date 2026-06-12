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
    name: "Paquetito Copa 2026",
    desc: "Torna a experiência mais imersiva com o PDF das embalagens oficiais",
    renderImage: (bought) => <ProductImg src="/embalagensfigurinhas.webp" alt="Kit Embalagem Copa 2026" bought={bought} />,
    acquireUrl: "https://checkout.figurinhadacopadomundo.com/VCCL1O8SD2HQ",
    downloadLabel: "Descarregar PDF",
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
    desc: "Descarrega o PDF para imprimir e decorar a tua casa",
    renderImage: (bought) => <ProductImg src="/poster.webp" alt="Poster A4 PDF" bought={bought} />,
    acquireUrl: "https://checkout.figurinhadacopadomundo.com/VCCL1O8SD2HR",
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
    name: "Cromo Ronaldo",
    desc: "Camisola da seleção — pacote em PDF para impressão",
    renderImage: (bought) => <ProductImg src="/figurinhamodelo.webp" alt="Cromo Ronaldo" bought={bought} />,
    acquireUrl: "https://checkout.figurinhadacopadomundo.com/VCCL1O8SD2HT",
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
      border: "2px solid #C8102E",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", background: "#e2e8f0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pedido.preview_url || pedido.sticker_url}
          alt={pedido.nome || "cromo"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)",
        }} />
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 800, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {pedido.nome || "Cromo"}
          </p>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: 11, margin: "2px 0 0" }}>Copa 2026</p>
        </div>
      </div>
      <div style={{ padding: "14px 14px 14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <a
            href={`/api/download?url=${encodeURIComponent(pedido.sticker_url)}&name=cromo-${(pedido.nome || "copa").toLowerCase().replace(/\s+/g, "-")}`}
            style={{ display: "block", textAlign: "center", background: "#C8102E", color: "#fff", borderRadius: 10, padding: "10px 8px", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: ".03em" }}
          >⬇ Descarregar PNG</a>
          {pedido.pdf_url && (
            <a
              href={`/api/download?url=${encodeURIComponent(pedido.pdf_url)}&name=cromo-pdf-${(pedido.nome || "copa").toLowerCase().replace(/\s+/g, "-")}`}
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
      border: bought && !infoMode ? "2px solid #C8102E" : "2px solid transparent",
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
          <div style={{ position: "absolute", top: 10, right: 10, background: "#C8102E", borderRadius: 8, padding: "4px 9px" }}>
            <span style={{ color: "#FFD700", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ TEU</span>
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
                  background: "#C8102E", color: "#fff",
                  borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                  textDecoration: "none", letterSpacing: ".03em",
                }}
              >⬇ {product.downloadLabel || "Descarregar"}</a>
            ) : bought && !downloadUrl ? (
              <div style={{
                textAlign: "center", background: "#f0fdf4",
                color: "#166534", borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                border: "1px solid #bbf7d0",
              }}>{product.boughtMessage || "✓ Disponível"}</div>
            ) : product.acquireUrl ? (
              <a
                href={product.acquireUrl}
                style={{
                  display: "block", textAlign: "center",
                  background: "#FFD700", color: "#C8102E",
                  borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
                  textDecoration: "none", letterSpacing: ".03em",
                  boxShadow: "0 4px 12px rgba(116,172,223,.5)",
                }}
              >Adquirir agora</a>
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
      a.download = layout === "a4" ? "poster-completo-a4.pdf" : "poster-cromo-4x4.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      if (isUpload && isB) setUploadErrorB("Erro ao gerar. Tenta de novo.");
      else if (isUpload) setUploadError("Erro ao gerar. Tenta de novo.");
      else setGenError("Erro ao gerar. Tenta de novo.");
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
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#C8102E" }}>
        {layout === "a4" ? "📄 Poster Completo (A4)" : "🖼 Grilla 4×4"}
      </p>
      <input ref={inputR} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
        onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div onClick={() => inputR.current?.click()} style={{
          flex: 1, border: "1.5px dashed #cbd5e1", borderRadius: 7, padding: "7px 6px",
          textAlign: "center", cursor: "pointer", background: "#f8fafc", minWidth: 0,
        }}>
          <p style={{ margin: 0, fontSize: 9, color: file ? "#334155" : "#94a3b8", fontWeight: file ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file ? file.name : "Selecionar imagem"}
          </p>
        </div>
        <button onClick={() => file && runGenerate(file, layout)} disabled={loading || !file} style={{
          flexShrink: 0, background: file ? "#C8102E" : "#f1f5f9",
          color: file ? "#fff" : "#94a3b8", border: "none", borderRadius: 7,
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
      border: bought ? "2px solid #C8102E" : "2px solid transparent",
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
            <div style={{ position: "absolute", top: 10, right: 10, background: "#C8102E", borderRadius: 8, padding: "4px 9px" }}>
              <span style={{ color: "#FFD700", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ TEU</span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px" }}>
          <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>Poster A4</p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>PDF para imprimir e decorar a tua casa</p>

          {bought ? (
            <>
              <button onClick={() => runGenerate("auto")} disabled={genLoading || !stickerUrl} style={{
                width: "100%", background: "#C8102E", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 8px", fontSize: 13, fontWeight: 700,
                cursor: genLoading || !stickerUrl ? "default" : "pointer",
                opacity: genLoading || !stickerUrl ? 0.7 : 1, letterSpacing: ".03em",
              }}>
                {genLoading ? "A gerar PDF..." : "⬇ Descarregar PDF 4×4"}
              </button>
              {genError && <p style={{ color: "#dc2626", fontSize: 11, margin: "4px 0 0", textAlign: "center" }}>{genError}</p>}

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, color: "#64748b" }}>Gerar com outra foto:</p>
                <UploadSection file={uploadFile} setFile={setUploadFile} loading={uploadLoading} error={uploadError} layout="grid" inputR={inputRef} />
                <UploadSection file={uploadFileB} setFile={setUploadFileB} loading={uploadLoadingB} error={uploadErrorB} layout="a4" inputR={inputRefB} />
              </div>
            </>
          ) : (
            <a href="https://checkout.figurinhadacopadomundo.com/VCCL1O8SD2HR" style={{
              display: "block", textAlign: "center",
              background: "#FFD700", color: "#C8102E",
              borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
              textDecoration: "none", letterSpacing: ".03em",
              boxShadow: "0 4px 12px rgba(116,172,223,.5)",
            }}>Adquirir agora</a>
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
      border: bought ? "2px solid #C8102E" : "2px solid transparent",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
        <ProductImg src="/figurinhamodelo.webp" alt="Cromo Ronaldo" bought={bought} />
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
          <div style={{ position: "absolute", top: 10, right: 10, background: "#C8102E", borderRadius: 8, padding: "4px 9px" }}>
            <span style={{ color: "#FFD700", fontSize: 10, fontWeight: 800, letterSpacing: ".04em" }}>✓ TEU</span>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>Cromo Ronaldo</p>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>Cromo exclusivo do Ronaldo para descarregar em PNG ou em PDF para impressão</p>
        {bought ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a
              href="/Fig Messi total.png"
              download="cromo-messi.png"
              style={{
                display: "block", textAlign: "center",
                background: "#C8102E", color: "#fff",
                borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                textDecoration: "none", letterSpacing: ".03em",
              }}
            >⬇ Descarregar PNG</a>
            <a
              href="/cromoronaldo.pdf"
              download="cromo-ronaldo.pdf"
              style={{
                display: "block", textAlign: "center",
                background: "#f8fafc", color: "#334155",
                borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700,
                textDecoration: "none", border: "1px solid #e2e8f0",
              }}
            >📄 Descarregar PDF</a>
          </div>
        ) : (
          <a
            href="https://checkout.figurinhadacopadomundo.com/VCCL1O8SD2HT"
            style={{
              display: "block", textAlign: "center",
              background: "#FFD700", color: "#C8102E",
              borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 900,
              textDecoration: "none", letterSpacing: ".03em",
              boxShadow: "0 4px 12px rgba(116,172,223,.5)",
            }}
          >Adquirir agora</a>
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
  const foneParam = searchParams.get("fone") || "";

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MemberData | null>(null);

  const fetchMember = async (fone: string) => {
    const digits = fone.replace(/\D/g, "");
    if (digits.length < 9) { setError("Insere um número de WhatsApp válido (9 dígitos)."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/membros?fone=${digits}`);
      if (res.status === 404) { setError("Nenhuma compra encontrada para esse número. Verifica se o escreveste corretamente."); setData(null); return; }
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("Erro ao pesquisar. Tenta de novo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foneParam) { setPhone(foneParam); fetchMember(foneParam); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foneParam]);

  useEffect(() => {
    if (!data || !data.pedidos?.length) return;
    const digits = phone.replace(/\D/g, "");
    track("recebeu_figurinha", { email: digits || undefined, nome: data.nome || undefined });
    const temBumpPago = data.items?.some(i => i.item_type === "order_bump" && i.status === "pago");
    if (temBumpPago) track("recebeu_figurinha_plus", { email: digits || undefined, nome: data.nome || undefined });
  }, [data, phone]);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#006600",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "40px 32px 64px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(200,16,46,.12)", borderRadius: 12, padding: "8px 18px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <span className="membros-badge" style={{ color: "#C8102E", fontWeight: 800, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase" }}>
            Cromo Copa 2026
          </span>
        </div>
        <h1 className="membros-h1" style={{ color: "#C8102E", fontSize: 28, fontWeight: 900, margin: "0 0 8px", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
          ÁREA DE TRANSFERÍVEIS
        </h1>
        <p style={{ color: "rgba(0,35,149,.6)", fontSize: 14, margin: 0, fontWeight: 500 }}>
          Acede a todos os teus produtos comprados
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
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#C8102E", margin: "0 0 6px" }}>
                Entrar com o teu WhatsApp
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Usa o mesmo número que usaste na compra
              </p>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Ex: 912345678"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && fetchMember(phone)}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "2px solid #e2e8f0", borderRadius: 12, padding: "14px 16px",
                fontSize: 16, outline: "none", marginBottom: 12, color: "#0f172a", fontFamily: "inherit",
              }}
            />
            {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}
            <button
              onClick={() => fetchMember(phone)}
              disabled={loading}
              style={{
                width: "100%", background: "#C8102E", color: "#fff", border: "none",
                borderRadius: 12, padding: "15px 20px", fontSize: 15, fontWeight: 800,
                cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                letterSpacing: ".06em", textTransform: "uppercase",
              }}
            >
              {loading ? "A pesquisar..." : "ACEDER AOS MEUS PRODUTOS →"}
            </button>
          </div>
        )}

        {/* ── Member area ── */}
        {data && (
          <>
            {/* Welcome bar */}
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
                  background: "#FFD700",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>⚽</div>
                <div>
                  <p style={{ color: "rgba(255,255,255,.5)", fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>
                    Área de membros
                  </p>
                  <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: "-.01em" }}>
                    {data.nome || "Cliente"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setData(null); setPhone(""); }}
                style={{
                  background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)",
                  border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}
              >
                Mudar número
              </button>
            </div>

            {/* Row 1 — Figuritas */}
            {data.pedidos.length > 0 && (
              <ProductRow title={`Os Teus Cromos (${data.pedidos.length})`}>
                {data.pedidos.map(p => <StickerCard key={p.id} pedido={p} />)}
              </ProductRow>
            )}

            {/* Upsell: gerar outro cromo */}
            <div style={{ position: "relative", marginBottom: 28 }}>
              <div style={{
                position: "absolute", inset: -6, borderRadius: 24,
                background: "linear-gradient(270deg,#C8102E,#006600,#FFD700,#FFFFFF)",
                backgroundSize: "300% 300%", animation: "borderSpin 4s ease infinite",
                filter: "blur(14px)", opacity: .6, zIndex: 0,
              }} />
              <div style={{
                position: "relative", zIndex: 1,
                padding: 3, borderRadius: 18,
                background: "linear-gradient(270deg,#C8102E,#006600,#FFD700,#FFFFFF)",
                backgroundSize: "300% 300%", animation: "borderSpin 4s ease infinite",
              }}>
                <div style={{
                  background: "#fff", borderRadius: 16, padding: "18px 20px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
                }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: ".08em", textTransform: "uppercase" }}>
                      Oferta exclusiva
                    </p>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#C8102E", lineHeight: 1.3 }}>
                      Gera outro cromo por apenas <span style={{ color: "#006600" }}>€2,00</span>
                    </p>
                  </div>
                  <a href="/?start=1"
                    onClick={() => { try { sessionStorage.removeItem("figurinha_sticker_url"); sessionStorage.removeItem("figurinha_sticker_id"); } catch {/**/} }}
                    style={{
                      display: "block", width: "100%", boxSizing: "border-box",
                      background: "linear-gradient(135deg, #00DD55 0%, #00BB33 100%)",
                      color: "#fff", borderRadius: 12, padding: "14px 18px",
                      fontSize: 15, fontWeight: 900, textDecoration: "none",
                      letterSpacing: ".06em", textAlign: "center",
                      boxShadow: "0 4px 16px rgba(0,35,149,.35)",
                    }}>
                    APROVEITAR! ⚽
                  </a>
                </div>
              </div>
            </div>

            {/* Row 2 — Productos */}
            <ProductRow title="Produtos Copa 2026">
              {CATALOG.map(product =>
                product.renderCard
                  ? <div key={product.id} style={{ flexShrink: 0, scrollSnapAlign: "start" }}>{product.renderCard(data, 250)}</div>
                  : <CatalogCard key={product.id} product={product} data={data} width={250} />
              )}
            </ProductRow>

            {/* Support */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <a
                href="https://api.whatsapp.com/send?phone=559294621319&text=Hola%2C%20necesito%20ayuda%20con%20mi%20compra."
                target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(0,35,149,.5)", fontSize: 13, textDecoration: "underline", fontWeight: 500 }}
              >
                Problemas com algum produto? Contacta o suporte
              </a>
            </div>

            {/* Aviso sorteo */}
            <div style={{
              background: "linear-gradient(135deg, #00DD55 0%, #00BB33 100%)",
              borderRadius: 16, padding: "16px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              boxShadow: "0 4px 16px rgba(0,35,149,.3)", textAlign: "center",
            }}>
              <span style={{ fontSize: 24 }}>🏆⚽</span>
              <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
                Já estás a participar no sorteio de{" "}
                <span style={{ color: "#FFD700" }}>€1.000</span>!
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 600 }}>
                Sorteio a <span style={{ color: "#FFD700", fontWeight: 800 }}>11/07/2026</span>
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

