import { useTranslations } from "next-intl";

export default function SwapPage() {
  const t = useTranslations("swap");

  return (
    <div className="text-center text-zinc-500 dark:text-zinc-400">
      {t("comingSoon")}
    </div>
  );
}
