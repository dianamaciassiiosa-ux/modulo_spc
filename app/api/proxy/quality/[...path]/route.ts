import { NextRequest, NextResponse } from "next/server";

const QUALITY_API_URL = process.env.QUALITY_API_URL || process.env.NEXT_PUBLIC_QUALITY_API_URL;

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!QUALITY_API_URL) {
    return NextResponse.json(
      { error: "QUALITY_API_URL not configured on server" },
      { status: 503 }
    );
  }

  const { path } = await context.params;
  const targetPath = path.join("/");
  const search = req.nextUrl.search || "";

  const targetUrl = `${QUALITY_API_URL}/${targetPath}${search}`;

  const incomingCookie = req.headers.get("cookie") ?? "";

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();

    if (
      lower === "host" ||
      lower === "connection" ||
      lower === "content-length"
    ) {
      return;
    }

    headers.set(key, value);
  });

  if (incomingCookie) {
    headers.set("cookie", incomingCookie);
  }

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.arrayBuffer();

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();

    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();

      if (
        lower === "content-encoding" ||
        lower === "transfer-encoding" ||
        lower === "content-length"
      ) {
        return;
      }

      responseHeaders.set(key, value);
    });

    const setCookie = backendResponse.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("set-cookie", setCookie);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[QUALITY PROXY] Error:", error);
    return NextResponse.json(
      { error: "Quality API proxy error", details: String(error) },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
