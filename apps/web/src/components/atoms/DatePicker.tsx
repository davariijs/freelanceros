"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { g2j, j2g, toPersianDigits } from "@/utils/dateConverter";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
  placeholder,
  required,
}) => {
  const { dir, locale } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(0);
  const [viewMonth, setViewMonth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const today = new Date();
  const isJalali = locale === "fa";

  React.useEffect(() => {
    const baseDate = value ? new Date(value) : new Date();
    if (isJalali) {
      const [jy, jm] = g2j(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      );
      setViewYear(jy);
      setViewMonth(jm);
    } else {
      setViewYear(baseDate.getFullYear());
      setViewMonth(baseDate.getMonth() + 1);
    }
  }, [value, locale, isJalali, isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalDays = isJalali
    ? viewMonth < 7
      ? 31
      : viewMonth < 12
        ? 30
        : 29
    : new Date(viewYear, viewMonth, 0).getDate();

  const [gregorianYear, gregorianMonth] = isJalali
    ? j2g(viewYear, viewMonth, 1)
    : [viewYear, viewMonth];

  const firstDayIndex = isJalali
    ? (new Date(gregorianYear, gregorianMonth - 1, 1).getDay() + 1) % 7
    : new Date(viewYear, viewMonth - 1, 1).getDay();

  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const monthsEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsFa = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const handleDaySelect = (day: number) => {
    if (isJalali) {
      const [gYear, gMonth, gDay] = j2g(viewYear, viewMonth, day);
      const isoDate = `${gYear}-${String(gMonth).padStart(2, "0")}-${String(gDay).padStart(2, "0")}`;
      onChange(isoDate);
    } else {
      const isoDate = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onChange(isoDate);
    }
    setIsOpen(false);
  };

  const stepMonth = (dirStep: "prev" | "next") => {
    const offset = dirStep === "next" ? 1 : -1;
    let nextMonth = viewMonth + offset;
    let nextYear = viewYear;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    } else if (nextMonth < 1) {
      nextMonth = 12;
      nextYear--;
    }

    setViewYear(nextYear);
    setViewMonth(nextMonth);
  };

  const getFormattedValue = () => {
    if (!value) return "";
    const date = new Date(value);
    if (isJalali) {
      const [jy, jm, jd] = g2j(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      );
      return toPersianDigits(`${jy}/${jm}/${jd}`);
    }
    return date.toLocaleDateString();
  };

  const [todayJYear, todayJMonth, todayJDay] = g2j(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        {placeholder}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-3 mt-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400/50 text-neutral-900 dark:text-neutral-100 flex items-center justify-between text-left",
          dir === "rtl" ? "text-right" : "text-left",
        )}
      >
        <span className={!value ? "text-neutral-400" : ""}>
          {value ? getFormattedValue() : placeholder || "Select date"}
        </span>
        <CalendarIcon className="h-4 w-4 text-neutral-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-neutral-950/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-lg animate-in fade-in duration-200",
              "absolute top-full left-0 right-0 mt-2 hidden md:block",
              "max-md:fixed max-md:inset-0 max-md:m-auto max-md:h-fit max-md:w-72 max-md:block max-md:shadow-2xl",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between mb-4",
                dir === "rtl" && "flex-row-reverse",
              )}
            >
              <span className="text-sm font-bold">
                {isJalali ? monthsFa[viewMonth - 1] : monthsEn[viewMonth - 1]}{" "}
                {isJalali ? toPersianDigits(viewYear) : viewYear}
              </span>
              <div className="flex gap-1" dir="ltr">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => stepMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => stepMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-400 mb-2">
              {isJalali
                ? ["شن", "۱ش", "۲ش", "۳ش", "۴ش", "۵ش", "جم"].map((d) => (
                    <div key={d}>{d}</div>
                  ))
                : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {emptyDays.map((x) => (
                <div key={`empty-${x}`} />
              ))}
              {daysArray.map((day) => {
                const isSelected = value
                  ? isJalali
                    ? g2j(
                        new Date(value).getFullYear(),
                        new Date(value).getMonth() + 1,
                        new Date(value).getDate(),
                      )[2] === day &&
                      g2j(
                        new Date(value).getFullYear(),
                        new Date(value).getMonth() + 1,
                        new Date(value).getDate(),
                      )[1] === viewMonth
                    : new Date(value).getDate() === day &&
                      new Date(value).getMonth() === viewMonth - 1
                  : false;

                const isToday = isJalali
                  ? todayJDay === day &&
                    todayJMonth === viewMonth &&
                    todayJYear === viewYear
                  : today.getDate() === day &&
                    today.getMonth() === viewMonth - 1 &&
                    today.getFullYear() === viewYear;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                      isSelected &&
                        "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-900",
                      isToday &&
                        !isSelected &&
                        "border border-neutral-400 dark:border-neutral-600",
                    )}
                  >
                    {isJalali ? toPersianDigits(day) : day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
