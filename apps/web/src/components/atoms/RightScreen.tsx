"use client";

import * as React from "react";
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/useIsMobile";

interface RightScreenProps {
  active: boolean;
}

export function RightScreen({ active }: RightScreenProps) {
  const { t } = useApp();
  const isMobile = useIsMobile();

  const text = active ? "Start Today!" : "FreeOS";
  const letters = Array.from(text);

  const handleRedirect = () => {
    const hasToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token="));
    window.location.href = hasToken ? "/dashboard" : "/login";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.85,
      filter: isMobile ? "none" : "blur(6px)",
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: isMobile ? "none" : "blur(0px)",

      transition: {
        type: "spring" as const,
        stiffness: 140,
        damping: 11,
      },
    },

    exit: {
      opacity: 0,
      y: -12,
      filter: isMobile ? "none" : "blur(6px)",

      transition: {
        duration: 0.15,
      },
    },
  } as const;

  return (
    <group position={[-0.15, 0.94, 0.16]} rotation={[0, -Math.PI * -0.9, 0]}>
      <Html transform distanceFactor={0.8} className="select-none">
        <div
          onClick={handleRedirect}
          className="w-101 h-60 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden p-4 flex flex-col justify-between font-mono scale-[1.025] relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0)_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none z-20 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_100%)] z-0" />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.05, 0.18, 0.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_60%)] z-0 pointer-events-none"
          />

          <motion.div
            animate={{
              y: ["-20%", "280%"],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-x-0 h-6 bg-linear-to-b from-transparent via-emerald-500/15 to-transparent z-10 pointer-events-none"
          />

          <div className="flex justify-between items-center border-b border-neutral-900 pb-2 z-10">
            <span className="text-[10px] font-black text-neutral-400">
              {t.leftScreenSystemCore}
            </span>
            <span className="text-[7px] font-semibold text-emerald-500/80">
              REV_8
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center py-2 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={text}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex justify-center items-center flex-wrap gap-1"
              >
                {letters.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="text-3xl font-black tracking-wider text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center pt-2 border-t border-neutral-900 z-10">
            <span className="text-[7px] text-neutral-500 tracking-widest font-semibold uppercase">
              {t.leftScreenOsStatus}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}
