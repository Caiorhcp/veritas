import { type NextRequest, NextResponse } from "next/server";
import { hasLocale, LOCALE_COOKIE, LOCALES, negotiate } from "@/i18n/config";

// Endereço sem idioma (/, /skills, links antigos): manda para a língua escolhida antes ou para a do navegador.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(saved) ? saved : negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // fora: arquivos internos do Next e qualquer arquivo com extensão (ícone, sitemap, robots)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
