import type { Locale } from "@/i18n/config";

// Bandeiras desenhadas em SVG: o Windows não mostra emoji de bandeira.
export function Flag({ locale, className = "" }: { locale: Locale; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      {locale === "pt" && (
        <>
          <rect width="30" height="20" fill="#009b3a" />
          <path d="M15 2.5 27 10 15 17.5 3 10Z" fill="#fedf00" />
          <circle cx="15" cy="10" r="4.6" fill="#002776" />
          <path d="M10.6 9.2q4.6-1.4 8.8 1.4" stroke="#fff" strokeWidth="0.9" fill="none" />
        </>
      )}
      {locale === "en" && (
        <>
          <rect width="30" height="20" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
          ))}
          <rect width="13" height={(20 / 13) * 7} fill="#3c3b6e" />
        </>
      )}
      {locale === "es" && (
        <>
          <rect width="30" height="20" fill="#aa151b" />
          <rect y="5" width="30" height="10" fill="#f1bf00" />
        </>
      )}
    </svg>
  );
}
