"use client";
import ResultScreen from "@/components/ResultScreen";

export default function VerPreco() {
  return (
    <ResultScreen
      stickerUrl="/figurinhamiguel.webp"
      stickerId="preview"
      onRetry={() => {}}
      checkoutUrl="https://buy.stripe.com/eVq28r49t01Pewtb2v5Vu07"
      price="$3.500"
    />
  );
}
