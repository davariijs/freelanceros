"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { SystemWidget } from "@/features/landing/components/SystemWidget";
import { HeroContent } from "@/features/landing/components/HeroContent";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { WorkflowPipeline } from "@/features/landing/components/WorkflowPipeline";
import { CommandPaletteMockLanding } from "@/features/landing/components/CommandPaletteMockLading";
import { FloatingActions } from "@/features/landing/components/FloatingActions";
import { FloatingFooter } from "@/features/landing/components/FloatingFooter";

const HeroCanvas = dynamic(() => import("@/features/landing/components/HeroCanvas"), {
  ssr: false,
});

export function HeroSection() {
  const { t, locale, setIsCommandOpen, isCommandOpen } = useApp();
  const isRtl = locale === "fa";
  const [osState, setOsState] = React.useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);

  const sectionsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px",
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1) {
            setOsState(index as 0 | 1 | 2 | 3 | 4 | 5);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
        e.preventDefault();
        setIsCommandOpen(!isCommandOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandOpen, setIsCommandOpen]);

  const getDeskAnimation = () => {
    if (osState >= 2)
      return { x: "0%", y: isMobile ? "-100px" : "-180px", opacity: 1 };
    if (osState === 1) {
      if (isMobile) {
        return { x: "0%", y: "-140px", opacity: 1 };
      }
      let xShift = "22%";
      if (windowWidth >= 1450 && windowWidth <= 1669) {
        xShift = "27%";
      } else if (windowWidth >= 768 && windowWidth < 1450) {
        xShift = "19%";
      }
      return { x: xShift, y: "0px", opacity: 1 };
    }
    return { x: "0%", y: "0px", opacity: 1 };
  };

  const scrollText =
    t.scrollToExplore ||
    (locale === "fa" ? "برای کاوش اسکرول کنید" : "Scroll to Explore");

  return (
    <div className="relative w-full">
      <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center z-40 pointer-events-none">
        <SystemWidget
          active={osState > 0}
          activeColor="bg-emerald-500"
          inactiveColor="bg-amber-500"
          activeTitle={t.widgetActiveTitleLeft}
          inactiveTitle={t.widgetInactiveTitleLeft}
          activeValue={t.widgetActiveValueLeft}
          inactiveValue={t.widgetInactiveValueLeft}
          className="top-12 left-6 lg:left-12 pointer-events-auto"
        />

        <SystemWidget
          active={osState > 0}
          activeColor="bg-sky-500"
          inactiveColor="bg-neutral-400"
          activeTitle={t.widgetActiveTitleRight}
          inactiveTitle={t.widgetInactiveTitleRight}
          activeValue={t.widgetActiveValueRight}
          inactiveValue={t.widgetInactiveValueRight}
          className="top-12 right-6 lg:right-12 pointer-events-auto"
        />

        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
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
          <div className="flex items-center pointer-events-auto w-full justify-center md:justify-start">
            <HeroContent
              active={osState === 1}
              exit={false}
              title="FreeOS"
              subtitle={t.heroSubtitle}
              ctaPrimary={t.accessDashboard}
              ctaSecondary={t.learnMore}
            />
          </div>
        )}
      </div>

      <div className="relative z-50 w-full flex flex-col items-center pointer-events-none">
        <div
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="h-screen w-full pointer-events-none snap-start snap-always"
        />
        <div
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="h-screen w-full pointer-events-none snap-start snap-always"
        />

        <div
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          className="min-h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-auto snap-start snap-always overflow-hidden px-6"
        >
          <FeaturesGrid osState={osState} />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
          className="min-h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-auto snap-start snap-always overflow-hidden px-6"
        >
          <div className="max-w-4xl text-center mb-12 px-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
              {isRtl ? "اتومیشن پیشرفته" : "WORKSPACE AUTOMATION"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 text-neutral-900 dark:text-neutral-50">
              {isRtl ? "موتور هوشمند گردش کار" : "Dynamic Operations Machine"}
            </h2>
          </div>
          <WorkflowPipeline osState={osState} />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current[4] = el;
          }}
          className="min-h-screen w-full flex flex-col items-center justify-center py-24 relative bg-transparent pointer-events-none snap-start snap-always overflow-hidden px-6"
        >
          <motion.div
            animate={
              osState === 4
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: isMobile ? "none" : "blur(0px)",
                  }
                : {
                    opacity: 0,
                    y: 45,
                    scale: 0.95,
                    filter: isMobile ? "none" : "blur(8px)",
                  }
            }
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className="max-w-4xl text-center mb-12 px-8 pointer-events-none"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
              {isRtl ? "کماند پالت سراسری" : "COMMAND PALETTE SHOWCASE"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 text-neutral-900 dark:text-neutral-50">
              {isRtl
                ? "ناوبری فوق‌سریع با میانبرها"
                : "Keyboard-First Visual Navigation"}
            </h2>
          </motion.div>
        </div>

        <div
          id="mobile-download-section"
          ref={(el) => {
            sectionsRef.current[5] = el;
          }}
          className={`min-h-screen w-full snap-start snap-always flex flex-col items-center justify-between py-16 md:py-24 relative bg-transparent pointer-events-none`}
        >
          <div className="grow flex items-center justify-center w-full">
            <div
              dir="ltr"
              className="max-w-5xl w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pointer-events-none"
            >
              <motion.div
                animate={
                  osState === 5
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: isMobile ? "none" : "blur(0px)",
                      }
                    : {
                        opacity: 0,
                        y: 35,
                        scale: 0.95,
                        filter: isMobile ? "none" : "blur(6px)",
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                }}
                className={`flex flex-col items-center md:items-start gap-6 text-center md:text-left pointer-events-none md:pointer-events-auto pt-[28vh] md:pt-0 ${isRtl ? "md:text-right md:items-end mr-auto" : ""}`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 ${
                    isRtl ? "md:self-end md:text-right" : ""
                  }`}
                >
                  {t.mobileSectionTitle || "Mobile Access"}
                </span>

                <h2
                  className={`text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight ${
                    isRtl ? "md:self-end md:text-right" : ""
                  }`}
                >
                  {t.downloadTodayTitle || "Download Today"}
                </h2>

                <p
                  className={`text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm text-center ${
                    isRtl ? "md:self-end md:text-right" : "md:text-left"
                  }`}
                >
                  {t.downloadTodayDesc}
                </p>

                <div
                  className={`flex gap-4 mt-4 pointer-events-auto ${isRtl ? "md:self-end" : ""}`}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="px-6 py-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 font-extrabold rounded-xl text-xs shadow-md border border-neutral-800 dark:border-neutral-200 cursor-pointer relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <span className="relative z-10">Google Play</span>
                  </motion.button>
                </div>
              </motion.div>

              <div className="md:col-span-1 pointer-events-none" />
            </div>
          </div>

          <motion.div
            animate={
              osState === 5
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: isMobile ? "none" : "blur(0px)",
                  }
                : {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                    rotateX: 15,
                    filter: isMobile ? "none" : "blur(8px)",
                  }
            }
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 14,
              delay: 0.15,
            }}
            className="w-full z-40 pointer-events-auto"
          >
            <FloatingFooter />
          </motion.div>
        </div>

        <div className="h-[50vh] w-full pointer-events-none relative z-30" />
      </div>

      <FloatingActions osState={osState} />

      <CommandPaletteMockLanding
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}
