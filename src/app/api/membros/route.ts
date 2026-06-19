import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Rate limiting: 10 req/IP/minuto
const membrosRL = new Map<string, { count: number; resetAt: number }>();
function checkRL(ip: string): boolean {
  const now = Date.now();
  const e = membrosRL.get(ip);
  if (!e || now > e.resetAt) { membrosRL.set(ip, { count: 1, resetAt: now + 60_000 }); return true; }
  if (e.count >= 10) return false;
  e.count++;
  return true;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRL(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const emailParam = (searchParams.get("email") || "").trim().toLowerCase().slice(0, 255);
  const fone = (searchParams.get("fone") || "").replace(/\D/g, "").slice(0, 15);

  if (!emailParam && fone.length < 8) {
    return NextResponse.json({ error: "E-Mail ou telefone inválido" }, { status: 400 });
  }

  let pedidos, items;

  if (emailParam) {
    pedidos = await sql`
      SELECT id, nome, clube, sticker_url, preview_url, pdf_url, status, created_at
      FROM pedidos
      WHERE email = ${emailParam} AND sticker_url IS NOT NULL
      ORDER BY created_at DESC
    `;
    items = await sql`
      SELECT item_type, offer_name, product_name, price, status, created_at
      FROM pedido_items
      WHERE email = ${emailParam}
      ORDER BY created_at DESC
    `.catch(() => []);
  } else {
    const fonePattern = `%${fone}%`;
    pedidos = await sql`
      SELECT id, nome, clube, sticker_url, preview_url, pdf_url, status, created_at
      FROM pedidos
      WHERE (telefone LIKE ${fonePattern} OR ${fone} LIKE ('%' || telefone || '%'))
        AND sticker_url IS NOT NULL
      ORDER BY created_at DESC
    `;
    const resolvedEmail = (await sql`
      SELECT email FROM pedidos
      WHERE (telefone LIKE ${fonePattern} OR ${fone} LIKE ('%' || telefone || '%'))
        AND email IS NOT NULL
      ORDER BY created_at DESC LIMIT 1
    `)[0]?.email || null;
    const [byEmail, byPhone] = await Promise.all([
      resolvedEmail ? sql`SELECT item_type, offer_name, product_name, price, status, created_at FROM pedido_items WHERE email = ${resolvedEmail} ORDER BY created_at DESC` : [],
      sql`SELECT item_type, offer_name, product_name, price, status, created_at FROM pedido_items WHERE telefone LIKE ${fonePattern} OR ${fone} LIKE ('%' || telefone || '%') ORDER BY created_at DESC`.catch(() => []),
    ]);
    const seen = new Set<string>();
    items = [...byEmail, ...byPhone].filter(i => {
      const key = `${i.offer_name}|${i.created_at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const nome = pedidos[0]?.nome || null;

  if (!pedidos.length && !items.length) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ nome, pedidos, items });
}
