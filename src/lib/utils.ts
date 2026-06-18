import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(
  price: number | undefined,
  currencyCode: string | null = "USD",
) {
  if (price === undefined) return "";
  const realCurrencyCode = currencyCode || "USD";

  const locales: Record<string, string> = {
    ARS: "es-AR",
    MXN: "es-MX",
    USD: "en-US",
    EUR: "es-ES",
    CLP: "es-CL",
    COP: "es-CO",
    UYU: "es-UY",
    BRL: "pt-BR",
    PEN: "es-PE",
    BOB: "es-BO",
    PYG: "es-PY",
    GBP: "en-GB",
    VES: "es-VE",
    CRC: "es-CR",
    DOP: "es-DO",
    GTQ: "es-GT",
    HNL: "es-HN",
    NIO: "es-NI",
    PAB: "es-PA",
    CAD: "en-CA",
    CHF: "de-CH",
  };
  const locale = locales[realCurrencyCode] || "en-US";

  const zeroDecimalCurrencies = ["CLP", "COP", "PYG", "JPY", "VES"];
  const hasDecimals = !zeroDecimalCurrencies.includes(realCurrencyCode);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: realCurrencyCode,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(price);
}

export function hexToHsl(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  if (hex.length !== 6) return '0 0% 0%';

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
