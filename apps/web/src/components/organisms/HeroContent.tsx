"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { LetterReveal } from "@/components/molecules/LetterReveal";
import { ShimmerButton } from "@/components/atoms/ShimmerButton";
import { SlideFillButton } from "@/components/atoms/SlideFillButton";

interface HeroContentProps {
  active: boolean;
  exit: boolean;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export function HeroContent({
  active,
  exit,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroContentProps) {
  const { locale } = useApp();

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.4, duration: 0.6, ease: "easeOut" as const },
    },
  } as const;

  const buttonsVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, duration: 0.5, ease: "easeOut" as const },
    },
  } as const;

  const getAnimationState = () => {
    if (exit) return { opacity: 0, x: -100, filter: "blur(15px)" };
    if (active) return { opacity: 1, x: 0, filter: "blur(0px)" };
    return { opacity: 0, x: -60, filter: "blur(12px)" };
  };

  return (
    <motion.div
      animate={getAnimationState()}
      transition={{ type: "spring", stiffness: 75, damping: 16 }}
      className="absolute left-6 lg:left-32 z-20 max-w-xl text-left rtl:text-right flex flex-col items-start gap-6 pointer-events-auto"
    >
      <div dir="ltr" className="text-left w-full">
        <LetterReveal text={title} active={active && !exit} />
      </div>

      <motion.p
        variants={subtitleVariants}
        initial="hidden"
        animate={active && !exit ? "visible" : "hidden"}
        className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md"
      >
        {subtitle}
      </motion.p>

      <motion.div
        variants={buttonsVariants}
        initial="hidden"
        animate={active && !exit ? "visible" : "hidden"}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link href="/login" className="w-full sm:w-auto">
          <ShimmerButton label={ctaPrimary} />
        </Link>
        <SlideFillButton label={ctaSecondary} />
      </motion.div>
    </motion.div>
  );
}
