"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/useIsMobile";

export function FloatingFooter() {
  const { locale, theme } = useApp();
  const isDark = theme === "dark";
  const isRtl = locale === "fa";
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(rotateX, springConfig);
  const ySpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rX = mouseY / height - 0.5;
    const rY = mouseX / width - 0.5;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full flex justify-center px-8 mt-16 max-md:mt-8 pointer-events-auto">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: xSpring,
          rotateY: ySpring,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className={`w-full max-w-5xl rounded-3xl p-5 md:py-3.5 md:px-8 border ${
          !isMobile ? "backdrop-blur-2xl" : ""
        } transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
          isDark
            ? "bg-[#09090e]/75 border-emerald-500/30 text-neutral-400"
            : "bg-white/80 border-white/20 text-neutral-600"
        }`}
      >
        <div
          style={{ transform: "translateZ(30px)" }}
          className="flex items-center gap-2"
        >
          <span className="font-black text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            FreelanceOS
          </span>
          <span className="text-[10px] text-neutral-400">
            © {new Date().getFullYear()}
          </span>
        </div>

        <div
          style={{ transform: "translateZ(25px)" }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            {isRtl ? "همه سیستم‌ها فعال" : "All Systems Operational"}
          </span>
        </div>

        <div
          style={{ transform: "translateZ(20px)" }}
          className="flex items-center gap-6 text-xs font-semibold"
        >
          <a
            href="#"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {isRtl ? "قوانین" : "Terms"}
          </a>
          <a
            href="#"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {isRtl ? "حریم خصوصی" : "Privacy"}
          </a>
          <a
            href="#"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {isRtl ? "پشتیبانی" : "Support"}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
