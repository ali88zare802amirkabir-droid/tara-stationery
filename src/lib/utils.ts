import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

/** Removes Arabic/Persian diacritics and unifies Arabic yeh/kaf with Persian ones. */
export function normalizeFa(input: string): string {
  return input
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u06CC')
    .replace(/\u0643/g, '\u06A9')
    .replace(/\u0629/g, '\u0647')
    .replace(/[\u200c\u200f\u200e]/g, ' ')
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Common Persian → Latin romanisation, used to build URL-safe slugs. */
const TRANSLITERATION: Record<string, string> = {
  'آ': 'a', 'ا': 'a', 'أ': 'a', 'إ': 'a', 'ب': 'b', 'پ': 'p',
  'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
  'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'ك': 'k', 'گ': 'g',
  'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h', 'ی': 'y',
  'ى': 'y', 'ة': 'h', 'ء': '', 'ؤ': 'v', 'ئ': 'y',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

/**
 * Builds a Latin, lowercase, hyphen-separated slug. Persian characters are
 * romanised so the result always satisfies the `^[a-z0-9-]+$` URL contract.
 */
export function slugify(input: string): string {
  const latin = normalizeFa(input)
    .split('')
    .map((char) => TRANSLITERATION[char] ?? char)
    .join('')
    .toLowerCase();

  return latin
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}