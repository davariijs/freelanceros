"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { motion, useScroll } from "framer-motion";
import { SystemWidget } from "@/components/molecules/SystemWidget";
import { HeroContent } from "@/components/organisms/HeroContent";
import { FeaturesGrid } from "@/components/organisms/FeaturesGrid";
import { WorkflowPipeline } from "@/components/organisms/WorkflowPipeline";
import { CommandPaletteMock } from "@/components/molecules/CommandPaletteMock";

const HeroCanvas = dynamic(() => import("@/components/organisms/HeroCanvas"), {
  ssr: false,
});

export function HeroSection() {
  const { t, locale } = useApp();
  const isRtl = locale === "fa";
  const { scrollY } = useScroll();
  const [osState, setOsState] = React.useState<0 | 1 | 2 | 3 | 4>(0);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    return scrollY.on("change", (latest) => {
      const vh = window.innerHeight;
      const sectionIndex = Math.round(latest / vh);
      const clamped = Math.min(4, Math.max(0, sectionIndex)) as
        0 | 1 | 2 | 3 | 4;
      setOsState(clamped);
    });
  }, [scrollY]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getDeskAnimation = () => {
    if (osState >= 2) return { x: "0%", y: "-180px", opacity: 1 };
    if (osState === 1) return { x: "22%", y: "0px", opacity: 1 };
    return { x: "0%", y: "0px", opacity: 1 };
  };

  const scrollText =
    t.scrollToExplore ||
    (locale === "fa" ? "برای کاوش اسکرول کنید" : "Scroll to Explore");

  return (
    <div className="relative w-full">
      <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center z-10">
        <SystemWidget
          active={osState > 0}
          activeColor="bg-emerald-500"
          inactiveColor="bg-amber-500"
          activeTitle={t.widgetActiveTitleLeft}
          inactiveTitle={t.widgetInactiveTitleLeft}
          activeValue={t.widgetActiveValueLeft}
          inactiveValue={t.widgetInactiveValueLeft}
          className={`top-12 left-6 lg:left-12 ${osState >= 2 ? "pointer-events-none" : "pointer-events-auto"}`}
        />

        <SystemWidget
          active={osState > 0}
          activeColor="bg-sky-500"
          inactiveColor="bg-neutral-400"
          activeTitle={t.widgetActiveTitleRight}
          inactiveTitle={t.widgetInactiveTitleRight}
          activeValue={t.widgetActiveValueRight}
          inactiveValue={t.widgetInactiveValueRight}
          className={`top-12 right-6 lg:right-12 ${osState >= 2 ? "pointer-events-none" : "pointer-events-auto"}`}
        />

        <div
          className={`absolute inset-0 w-full h-full overflow-hidden ${osState >= 2 ? "pointer-events-none" : "pointer-events-auto"}`}
        >
          <motion.div
            animate={getDeskAnimation()}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            className="w-full h-full flex items-center justify-center"
          >
            <HeroCanvas osState={osState} />
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 mx-auto w-fit z-10 text-center pointer-events-none">
          <motion.p
            animate={
              osState === 0
                ? { opacity: 1, y: [0, -14, 0] }
                : { opacity: 0, y: 15 }
            }
            transition={
              osState === 0
                ? { repeat: Infinity, duration: 1.4, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            className="text-xs font-bold tracking-widest uppercase text-neutral-400"
          >
            {scrollText}
          </motion.p>
        </div>

        {osState < 2 && (
          <div
            className={`${
              osState >= 2 ? "pointer-events-none" : "pointer-events-auto"
            } flex items-center`}
          >
            <HeroContent
              active={osState === 1}
              exit={osState >= 2}
              title="FreelanceOs"
              subtitle={t.heroSubtitle}
              ctaPrimary={t.accessDashboard}
              ctaSecondary={t.learnMore}
            />
          </div>
        )}
      </div>

      <div className="relative z-30 w-full flex flex-col items-center pointer-events-none">
        <div className="h-screen w-full pointer-events-none snap-start snap-always" />
        <div className="h-screen w-full pointer-events-none snap-start snap-always" />
        <div className="h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-auto snap-start snap-always overflow-hidden">
          <FeaturesGrid osState={osState} />
        </div>
        <div className="h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-auto snap-start snap-always overflow-hidden">
          <div className="max-w-4xl text-center mb-12">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
              {isRtl ? "اتومیشن پیشرفته" : "WORKSPACE AUTOMATION"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-neutral-900 dark:text-neutral-50">
              {isRtl ? "موتور هوشمند گردش کار" : "Dynamic Operations Machine"}
            </h2>
          </div>
          <WorkflowPipeline osState={osState} />
        </div>

        <div
          onClick={() => setIsPaletteOpen(true)}
          className="h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-auto snap-start snap-always overflow-hidden cursor-pointer"
        >
          <div className="max-w-4xl text-center mb-12">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
              {isRtl ? "کماند پالت سراسری" : "COMMAND PALETTE SHOWCASE"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-neutral-900 dark:text-neutral-50">
              {isRtl
                ? "ناوبری فوق‌سریع با میانبرها"
                : "Keyboard-First Visual Navigation"}
            </h2>
          </div>
        </div>

        <div className="h-[50vh] w-full pointer-events-none relative z-30" />
      </div>

      <CommandPaletteMock
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </div>
  );
}
