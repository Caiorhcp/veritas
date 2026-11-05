import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/components/Logo";

export const OG_SIZE = { width: 1200, height: 630 };

/** Imagem de compartilhamento: campo vermelho, a marca e o título. */
export function ogImage(title: string, kicker: string, footer = "github.com/Caiorhcp/veritas") {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0c111d", color: "#e3e9f5", padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <path d={MARK_PATH} fill="#9dbcff" />
          </svg>
          <span>{kicker}</span>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 90 ? 56 : title.length > 40 ? 72 : 104, fontWeight: 700, lineHeight: 1, letterSpacing: -3, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26, color: "#a9b7d6" }}>
          <span>{footer}</span>
          <span style={{ display: "flex", width: 120, height: 40, background: "#9dbcff", clipPath: "polygon(0 0, 40% 0, 50% 45%, 60% 0, 100% 0, 100% 100%, 0 100%)" }} />
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
