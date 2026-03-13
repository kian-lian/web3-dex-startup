/**
 * author: Claude
 * create time: 2026-03-13 13:50:00
 * last edit time: 2026-03-13 13:50:00
 * description: Locale-aware navigation exports — use instead of next/link and next/navigation
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
