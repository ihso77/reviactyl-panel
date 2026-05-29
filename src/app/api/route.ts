import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Reviactyl Panel API", status: "running" });
}
