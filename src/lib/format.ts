const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Arabic thousands separator (U+066C) — the standard separator in Persian text. */
const THOUSANDS_SEPARATOR = '٬';
const DECIMAL_SEPARATOR = '٫';

/**
 * Locale-aware formatting is intentionally avoided on the server so that the
 * markup rendered on the server is byte-identical to the first client paint.
 * Digits and separators are mapped manually instead.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

const group = (value: number): string => new Intl.NumberFormat('en-US').format(Math.round(value));

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '۰';
  return toPersianDigits(group(value)).replace(/,/g, THOUSANDS_SEPARATOR);
}

/** Decimals use the Persian decimal separator: 4.8 -> «۴٫۸» */
export function formatDecimal(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return '۰';
  return toPersianDigits(value.toFixed(fractionDigits)).replace('.', DECIMAL_SEPARATOR);
}

/** 1250000 -> «۱٬۲۵۰٬۰۰۰» */
export function formatPrice(value: number): string {
  return toPersianDigits(group(value)).replace(/,/g, THOUSANDS_SEPARATOR);
}

/** Compact price used inside dense tables: 1250000 -> «۱٫۲۵ میلیون» */
export function formatCompactPrice(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${toPersianDigits(millions.toFixed(millions % 1 === 0 ? 0 : 2)).replace('.', DECIMAL_SEPARATOR)} میلیون`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${toPersianDigits(thousands.toFixed(thousands % 1 === 0 ? 0 : 1)).replace('.', DECIMAL_SEPARATOR)} هزار`;
  }
  return formatPrice(value);
}

const jalaliFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const jalaliShortFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return jalaliFormatter.format(date);
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return jalaliShortFormatter.format(date);
}

export function latinDigits(value: string | number): string {
  return String(value).replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06F0));
}