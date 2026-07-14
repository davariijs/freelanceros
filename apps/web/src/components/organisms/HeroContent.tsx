"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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

export const HeroContent = React.memo(
  ({
    active,
    exit,
    title,
    subtitle,
    ctaPrimary,
    ctaSecondary,
  }: HeroContentProps) => {
    const subtitleVariants = {
      hidden: {
        opacity: 0,
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.4,
          duration: 0.6,
          ease: "easeOut" as const,
        },
      },
    } as const;

    const buttonsVariants = {
      hidden: {
        opacity: 0,
        y: 15,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.5,
          duration: 0.5,
          ease: "easeOut" as const,
        },
      },
    } as const;

    const getAnimationState = () => {
      if (exit) {
        return {
          opacity: 0,
          x: -100,
        };
      }
      if (active) {
        return {
          opacity: 1,
          x: 0,
        };
      }
      return {
        opacity: 0,
        x: -60,
      };
    };

    return (
      <motion.div
        animate={getAnimationState()}
        transition={{
          type: "spring",
          stiffness: 75,
          damping: 16,
        }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-12 lg:left-32 md:bottom-auto md:top-[52%] lg:top-1/3 z-20 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-center md:text-left rtl:md:text-right flex flex-col items-center md:items-start gap-6 pointer-events-auto px-6 md:px-0"
      >
        <div
          dir="ltr"
          className="text-center md:text-left rtl:md:text-right w-full flex justify-center md:justify-start rtl:md:justify-end"
        >
          <LetterReveal text={title} active={active && !exit} />
        </div>

        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate={active && !exit ? "visible" : "hidden"}
          className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md mx-auto md:mx-0"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={buttonsVariants}
          initial="hidden"
          animate={active && !exit ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <Link href="/login" className="w-full sm:w-auto">
            <ShimmerButton label={ctaPrimary} />
          </Link>
          <SlideFillButton label={ctaSecondary} />
        </motion.div>
      </motion.div>
    );
  },
);

HeroContent.displayName = "HeroContent";
