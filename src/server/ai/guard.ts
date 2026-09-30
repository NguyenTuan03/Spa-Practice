import "server-only";
import { NextResponse } from "next/server";
import { ACCESS_CODE_HEADER } from "@/enums";
import { getAiConfig } from "./client";

// Trả về response lỗi nếu chưa cấu hình AI hoặc sai mã truy cập; undefined nếu hợp lệ.
export function guardAiRequest(request: Request): NextResponse | undefined {
  if (!getAiConfig()) {
    return NextResponse.json({ error: "Chưa cấu hình AI trên server" }, { status: 503 });
  }
  const requiredCode = process.env.ADVANCED_ACCESS_CODE;
  if (requiredCode && request.headers.get(ACCESS_CODE_HEADER) !== requiredCode) {
    return NextResponse.json({ error: "Sai mã truy cập" }, { status: 401 });
  }
  return undefined;
}
