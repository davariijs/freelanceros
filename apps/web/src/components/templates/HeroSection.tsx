"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { motion, useScroll } from "framer-motion";
import { SystemWidget } from "@/components/molecules/SystemWidget";
import { HeroContent } from "@/components/organisms/HeroContent";
import { FeaturesGrid } from "@/components/organisms/FeaturesGrid";

const HeroCanvas = dynamic(() => import("@/components/organisms/HeroCanvas"), {
  ssr: false,
});

export function HeroSection() {
  const { t, locale } = useApp();
  const { scrollY } = useScroll();
  const [osState, setOsState] = React.useState<0 | 1 | 2>(0);

  React.useEffect(() => {
    return scrollY.on("change", (latest) => {
      if (latest < 60) {
        setOsState(0);
      } else if (latest >= 60 && latest < 750) {
        setOsState(1);
      } else {
        setOsState(2);
      }
    });
  }, [scrollY]);

  const getDeskAnimation = () => {
    if (osState === 2) return { x: "22%", y: "-150px", opacity: 0 };
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
          className="top-12 left-6 lg:left-12"
        />

        <SystemWidget
          active={osState > 0}
          activeColor="bg-sky-500"
          inactiveColor="bg-neutral-400"
          activeTitle={t.widgetActiveTitleRight}
          inactiveTitle={t.widgetInactiveTitleRight}
          activeValue={t.widgetActiveValueRight}
          inactiveValue={t.widgetInactiveValueRight}
          className="top-12 right-6 lg:right-12"
        />

        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <motion.div
            animate={getDeskAnimation()}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            className="w-full h-full flex items-center justify-center"
          >
            <HeroCanvas />
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

        <HeroContent
          active={osState === 1}
          exit={osState === 2}
          title={t.heroTitle}
          subtitle={t.heroSubtitle}
          ctaPrimary={t.accessDashboard}
          ctaSecondary={t.learnMore}
        />

        <FeaturesGrid active={osState === 2} />
      </div>

      <div className="h-[300vh] w-full pointer-events-none relative z-30" />
    </div>
  );
}
