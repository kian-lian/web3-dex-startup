/**
 * author: Claude
 * create time: 2026-03-13 13:50:00
 * last edit time: 2026-03-13 13:50:00
 * description: i18n configuration — supported locales and default locale
 */

export const DEFAULT_LOCALE = "en" as const;

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
