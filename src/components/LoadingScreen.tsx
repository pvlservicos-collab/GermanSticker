"use client";

import { useState, useEffect, useRef } from "react";


interface LoadingScreenProps {
  title: string;
  gifUrl: string;
  longWait?: boolean;
  startTime?: number;
}

const curiosidades = [
  "Sabias? O Mundial 2026 será o primeiro com 48 seleções. Vai ser histórico!",
  "Sabias? Portugal é campeão da Europa desde 2016, com uma vitória épica sobre a França!",
  "Sabias? Cristiano Ronaldo tem mais de 120 golos pela Seleção Nacional, um recorde mundial!",
  "Sabias? O primeiro Mundial foi em 1930, no Uruguai.",
  "Sabias? O recorde de golos num Mundial pertence a Just Fontaine: 13 golos em 1958.",
  "Sabias? Portugal alcançou o 3.º lugar no Mundial de 1966 com o lendário Eusébio.",
  "Sabias? O Estádio da Luz tem capacidade para mais de 64.000 espetadores.",
  "Sabias? O Mundial 2026 vai disputar-se nos EUA, México e Canadá.",
  "Sabias? O golo mais rápido da história dos Mundiais foi marcado aos 10,8 segundos.",
  "Sabias? Portugal venceu o Euro 2016 em Paris, batendo a França na final.",
  "Sabias? Miroslav Klose é o maior goleador histórico dos Mundiais com 16 golos.",
  "Sabias? Portugal esteve presente nos últimos 5 Mundiais consecutivos.",
  "Sabias? A camisola vermelha de Portugal tem mais de 100 anos de história.",
  "Sabias? Eusébio foi o melhor marcador do Mundial de 1966, com 9 golos.",
  "Sabias? O Estádio do Dragão, casa do FC Porto, foi inaugurado em novembro de 2003.",
  "Sabias? Portugal venceu a primeira Liga das Nações da UEFA em 2019.",
  "Sabias? Bruno Fernandes é o capitão atual da Seleção Nacional de Portugal.",
  "Sabias? O FC Porto venceu a Liga dos Campeões em 1987 e 2004.",
  "Sabias? Cristiano Ronaldo marcou golos em 5 Mundiais diferentes, um recorde único.",
  "Sabias? A Seleção Nacional é conhecida como os 'Navegadores', em homenagem aos descobrimentos.",
  "Sabias? Luís Figo foi eleito melhor jogador do mundo pela FIFA em 2001.",
  "Sabias? No Mundial de 2022, Portugal eliminou a Suíça com um hat-trick de Gonçalo Ramos.",
  "Sabias? Portugal e Espanha vão coorganizar o Mundial de 2030.",
  "Sabias? O Benfica é o clube com mais títulos nacionais em Portugal.",
  "Sabias? O Sporting CP, fundado em 1906, é um dos clubes mais antigos de Portugal.",
  "Sabias? Diogo Jota, João Félix e Rafael Leão são as grandes esperanças da nova geração portuguesa.",
  "Sabias? Portugal venceu a Liga das Nações de 2019, realizada em solo português.",
];

export default function LoadingScreen({ title, gifUrl, longWait, startTime }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [curiosidadeIndex, setCuriosidadeIndex] = useState(0);
  const start = useRef(startTime || Date.now());


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
    <section className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4" style={{ background: "#006600" }}>
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slide-up">
        <h2
          className="text-3xl md:text-4xl font-bold text-copa-blue tracking-[0.1em] text-center"
          style={{ fontFamily: "var(--font-titulo)" }}
        >
          {title}
        </h2>

        {longWait && (
          <p className="text-sm font-bold text-copa-blue text-center -mt-4" style={{ fontFamily: "var(--font-papernotes)" }}>
            Não feches este ecrã, pode demorar até 2 minutos.
          </p>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.giphy.com/media/yPNVFnPOyo3E4Peg8C/giphy.gif"
          alt="Ronaldo"
          style={{ height: 260, width: "auto", borderRadius: 16, objectFit: "cover", display: "block" }}
        />

        {longWait && (
          <div className="text-center leading-snug">
            <p className="text-base font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              Obtém o teu cromo HOJE e participa num ingresso para o Mundial!
            </p>
            <p className="text-4xl font-black text-copa-green my-1" style={{ fontFamily: "var(--font-titulo)" }}>
              Copa do Mundo 2026
            </p>
            <p className="text-sm text-copa-blue mt-2" style={{ fontFamily: "var(--font-papernotes)" }}>
              Sorteio a 11/06/2026, início do Mundial.
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
            "Este é um craque!"
          )}
        </p>

        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {"A carregar..."}
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
