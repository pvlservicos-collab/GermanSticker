"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface LoadingScreenProps {
  title: string;
  gifUrl: string;
  longWait?: boolean;
  startTime?: number;
}

const curiosidades = [
  "¿Sabías? La Copa 2026 será la primera con 48 selecciones. ¡Va a ser histórica!",
  "¿Sabías? Argentina es tricampeona mundial: 1978, 1986 y 2022. ¡Los campeones del mundo!",
  "¿Sabías? Lionel Messi tiene 8 Balones de Oro, el récord absoluto en la historia.",
  "¿Sabías? La primera Copa del Mundo fue en 1930, en Uruguay.",
  "¿Sabías? El récord de goles en un Mundial es de Just Fontaine: 13 goles en 1958.",
  "¿Sabías? Messi es el máximo goleador histórico de la Selección Argentina con más de 109 goles.",
  "¿Sabías? El Monumental de River Plate es el estadio más grande de Argentina.",
  "¿Sabías? La Copa 2026 se disputará en EE.UU., México y Canadá.",
  "¿Sabías? El gol más rápido en la historia de los Mundiales fue a los 10,8 segundos.",
  "¿Sabías? Argentina ganó el Mundial 2022 en Qatar con una final épica ante Francia.",
  "¿Sabías? Miroslav Klose es el máximo goleador histórico de los Mundiales con 16 goles.",
  "¿Sabías? Argentina es la única selección que ganó Copa del Mundo y Copa América invicta en 2021.",
  "¿Sabías? La camiseta celeste y blanca de Argentina tiene más de 100 años de historia.",
  "¿Sabías? Diego Maradona marcó el 'Gol del Siglo' contra Inglaterra en México 1986.",
  "¿Sabías? La Bombonera, estadio de Boca Juniors, es famosa por su tribuna que vibra.",
  "¿Sabías? Ángel Di María anotó el gol decisivo en la final del Mundial 2022.",
  "¿Sabías? Daniel Passarella fue el capitán del primer Mundial ganado por Argentina en 1978.",
  "¿Sabías? El estadio Azteca en México es el único que albergó dos finales de Mundial.",
];

export default function LoadingScreen({ title, gifUrl, longWait, startTime }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [curiosidadeIndex, setCuriosidadeIndex] = useState(0);
  const start = useRef(startTime || Date.now());

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p !== undefined) p.catch(() => { /* bloqueado pelo browser */ });
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
  }, []);

  const restart = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, []);

  useEffect(() => {
    start.current = startTime || Date.now();
    setPercent(0);
    setElapsed(0);
    setCuriosidadeIndex(Math.floor(Math.random() * curiosidades.length));
  }, [startTime]);

  useEffect(() => {
    if (!longWait) return;
    const interval = setInterval(() => {
      setCuriosidadeIndex((prev) => (prev + 1) % curiosidades.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [longWait]);

  useEffect(() => {
    if (!longWait) {
      const duration = 3000;
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = Math.min(100, Math.round(((now - start.current) / duration) * 100));
        setPercent(progress);
        if (progress >= 100) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - start.current;
      setElapsed(Math.floor(elapsedMs / 1000));

      let newPercent: number;
      if (elapsedMs < 60000) {
        newPercent = Math.round((elapsedMs / 60000) * 80);
      } else if (elapsedMs < 180000) {
        const extra = ((elapsedMs - 60000) / 120000) * 18;
        newPercent = Math.round(80 + extra);
      } else {
        newPercent = 99;
      }

      setPercent((prev) => Math.max(prev, newPercent));
    }, 200);

    return () => clearInterval(interval);
  }, [longWait]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4" style={{ background: "#74ACDF" }}>
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slide-up">
        <h2
          className="text-3xl md:text-4xl font-bold text-copa-blue tracking-[0.1em] text-center"
          style={{ fontFamily: "var(--font-titulo)" }}
        >
          {title}
        </h2>

        {longWait && (
          <p className="text-sm font-bold text-copa-blue text-center -mt-4" style={{ fontFamily: "var(--font-papernotes)" }}>
            No cierres esta pantalla, puede tardar hasta 2 minutos.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", height: 260, aspectRatio: "9/16" }}>
            {!isPlaying && (
              <div
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: 16,
                  background: "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.14) 50%, rgba(0,0,0,0.06) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skeleton-shimmer 1.4s ease-in-out infinite",
                }}
              />
            )}
            <video
              ref={videoRef}
              src="/videoaguardo.mp4"
              autoPlay
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{
                height: 260, width: "auto", aspectRatio: "9/16",
                borderRadius: 16, objectFit: "cover",
                opacity: isPlaying ? 1 : 0,
                transition: "opacity 0.4s ease",
                display: "block",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              style={{
                background: "#002395", color: "#FFDF00", border: "none",
                borderRadius: 10, width: 42, height: 42, fontSize: 17,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={restart}
              aria-label="Recomeçar"
              style={{
                background: "#FFDF00", color: "#002395", border: "2px solid #002395",
                borderRadius: 10, width: 42, height: 42, fontSize: 20,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ↺
            </button>
          </div>
        </div>

        {longWait && (
          <div className="text-center leading-snug">
            <p className="text-base font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              ¡Conseguí tu figurita HOY y participá por un ingreso a la Copa!
            </p>
            <p className="text-4xl font-black text-copa-green my-1" style={{ fontFamily: "var(--font-titulo)" }}>
              Copa del Mundo 2026
            </p>
            <p className="text-sm text-copa-blue mt-2" style={{ fontFamily: "var(--font-papernotes)" }}>
              Sorteo el 11/06/2026, inicio de la Copa.
            </p>
          </div>
        )}

        <p
          className="text-base text-center min-h-[3rem] transition-opacity duration-500"
          style={{ fontFamily: "var(--font-papernotes)" }}
        >
          {longWait ? (
            <span className="text-copa-blue font-bold">{curiosidades[curiosidadeIndex]}</span>
          ) : (
            "Este tiene cara de jugador caro, ¡eh!"
          )}
        </p>

        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {"Cargando..."}
            </span>
            <span className="text-sm font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {percent}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-copa-blue rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
