"use client";
import ResultScreen from "@/components/ResultScreen";

export default function VerPreco() {
  return (
    <ResultScreen
      stickerUrl="/mateo.webp"
      stickerId="preview"
      onRetry={() => {}}
      checkoutUrl="https://pay.hotmart.com/T106028174P?checkoutMode=10"
      price="$3.500"
    />
  );
}
