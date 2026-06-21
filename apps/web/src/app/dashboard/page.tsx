"use client";

import { Button } from "@/components/atoms/Button";
import { useApp } from "@/context/AppContext";

export default function DashboardPage() {
  const { t } = useApp();

  return (
    <div className="space-y-6 py-4 md:py-8">
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.welcome}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed max-w-2xl">
          {t.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-4 pt-2">
        <Button className="w-full sm:w-auto">{t.exploreKanban}</Button>
        <Button variant="secondary" className="w-full sm:w-auto">
          {t.viewTimeline}
        </Button>
      </div>
    </div>
  );
}
