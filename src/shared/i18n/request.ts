/**
 * author: kian-lian
 * create time: 2026-03-13 13:50:00
 * last edit time: 2026-03-13 15:05:48
 * description: next-intl request configuration — loads locale-specific messages
 */

import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`./messages/${locale}/common.json`)).default,
      ...(await import(`./messages/${locale}/swap.json`)).default,
      ...(await import(`./messages/${locale}/wallet.json`)).default,
      ...(await import(`./messages/${locale}/portfolio.json`)).default,
    },
  };
});
