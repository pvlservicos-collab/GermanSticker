import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateAdminRequest } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { pedidoId?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const pedidoId = Number(body?.pedidoId);
  if (!pedidoId) return NextResponse.json({ error: "pedidoId obrigatório" }, { status: 400 });

  try {
    const sql = getDb();
    await sql`UPDATE pedidos SET whats_enviado = TRUE WHERE id = ${pedidoId}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[whats-ok]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
