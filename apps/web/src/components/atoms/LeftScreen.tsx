"use client";

import * as React from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { ThreeEvent } from "@react-three/fiber";

export function LeftScreen() {
  const { t, locale } = useApp();
  const isRtl = locale === "fa";

  const handleRedirect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const hasToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("token="));
    window.location.href = hasToken ? "/dashboard" : "/login";
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group
      position={[0.64, 0.95, 0.14]}
      rotation={[0, -Math.PI * 0.92, 0]}
      onClick={handleRedirect}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <Html transform distanceFactor={0.8} className="select-none">
        <div
          dir="ltr"
          className="w-103 h-59 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden p-4 flex flex-col justify-between font-mono scale-[1.025] relative"
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
              duration: 4.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-x-0 h-6 bg-linear-to-b from-transparent via-emerald-500/15 to-transparent z-10 pointer-events-none"
          />

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={`flex justify-between items-center border-b border-neutral-900 pb-2 z-10 ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}
          >
            <span className="text-[10px] font-black text-neutral-400">
              {t.rightScreenTitle}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={`flex gap-4 items-center my-3 z-10 ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}
          >
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] text-neutral-500 font-bold tracking-wider">
                {t.rightScreenEfficiency}
              </span>
              <span className="text-2xl font-black text-neutral-100">
                89.4 %
              </span>
            </div>

            <div className="w-28 h-10 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 30">
                <motion.path
                  d="M0,25 Q15,5 30,18 T60,8 T90,20 T100,5"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  animate={{
                    strokeDashoffset: [200, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    strokeDasharray: 200,
                  }}
                />
              </svg>
            </div>
          </div>

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className={`flex-1 bg-neutral-900/40 border border-neutral-800/30 rounded p-2.5 flex flex-col gap-1 overflow-hidden text-[9px] z-10 ${isRtl ? "text-right items-end" : "text-left items-start"}`}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-neutral-500"
            >
              {t.rightScreenLog1}
            </motion.span>
            <span className="text-neutral-400">{t.rightScreenLog2}</span>
            <span className="text-emerald-500/80 font-bold">
              {t.rightScreenLog3}
            </span>
          </div>

          <div className="text-center pt-2 border-t border-neutral-900 z-10">
            <span className="text-[9px] font-black text-neutral-400 tracking-widest animate-pulse">
              {t.rightScreenAction}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}
