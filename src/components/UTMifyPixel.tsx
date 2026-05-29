"use client";
import { useEffect } from "react";

export default function UTMifyPixel() {
  useEffect(() => {
    (window as any).pixelId = "6a1915dda9b3c3e00a76276a";
    const a = document.createElement("script");
    a.setAttribute("async", "");
    a.setAttribute("defer", "");
    a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
    document.head.appendChild(a);
  }, []);
  return null;
}
