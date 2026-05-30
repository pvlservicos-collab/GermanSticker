"use client";
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function EsperaPreview() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div style={{ minHeight: "100dvh", background: "#74ACDF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button
          onClick={() => setStarted(true)}
          style={{ background: "#002395", color: "#fff", border: "none", borderRadius: 16, padding: "18px 36px", fontSize: 18, fontWeight: 800, cursor: "pointer" }}
        >
          ▶ Ver tela de espera
        </button>
      </div>
    );
  }

  return (
    <LoadingScreen
      title="GENERANDO TU FIGURITA"
      gifUrl="/sorteio.webp"
      longWait
      startTime={Date.now()}
    />
  );
}
