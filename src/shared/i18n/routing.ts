/**
 * author: Claude
 * create time: 2026-03-13 13:50:00
 * last edit time: 2026-03-13 13:50:00
 * description: next-intl routing definition for locale-aware navigation
 */

import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});
