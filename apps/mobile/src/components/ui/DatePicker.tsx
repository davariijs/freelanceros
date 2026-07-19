import * as React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { useApp } from "@/context/AppContext";
import { g2j, j2g, toPersianDigits } from "@/lib/dateConverter";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  required,
}) => {
  const { dir, locale, isDark } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(0);
  const [viewMonth, setViewMonth] = React.useState(0);

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

  const weekdays = isJalali
    ? ["شن", "۱ش", "۲ش", "۳ش", "۴ش", "۵ش", "جم"]
    : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <View className="w-full">
      <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        {placeholder}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        className={`w-full h-11 px-3 mt-1.5 rounded-xl border flex-row items-center justify-between ${
          isDark
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-neutral-300"
        }`}
      >
        <Text
          className={`text-sm ${!value ? "text-neutral-400" : isDark ? "text-neutral-100" : "text-neutral-900"}`}
        >
          {value ? getFormattedValue() : placeholder}
        </Text>
        <CalendarIcon size={14} color="#737373" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          className="flex-1 justify-center items-center p-6 bg-black/60"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className={`w-80 rounded-2xl p-5 border ${isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}
          >
            <View
              className={`flex-row items-center justify-between mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <Text
                className={`text-sm font-bold ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {isJalali ? monthsFa[viewMonth - 1] : monthsEn[viewMonth - 1]}{" "}
                {isJalali ? toPersianDigits(viewYear) : viewYear}
              </Text>
              <View className="flex-row gap-1">
                <TouchableOpacity
                  onPress={() => stepMonth("prev")}
                  className={`h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}
                >
                  <ChevronLeft size={16} color={isDark ? "white" : "#000000"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => stepMonth("next")}
                  className={`h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}
                >
                  <ChevronRight
                    size={16}
                    color={isDark ? "white" : "#000000"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                marginBottom: 8,
              }}
            >
              {weekdays.map((d) => (
                <Text
                  key={d}
                  style={{ width: "14.28%", textAlign: "center" }}
                  className="text-[10px] font-bold text-neutral-400"
                >
                  {d}
                </Text>
              ))}
            </View>

            <View
              style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}
            >
              {emptyDays.map((x) => (
                <View
                  key={`empty-${x}`}
                  style={{ width: "14.28%", height: 36 }}
                />
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
                  <View
                    key={day}
                    style={{
                      width: "14.28%",
                      height: 36,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDaySelect(day)}
                      activeOpacity={0.8}
                      className={`h-8 w-8 rounded-lg items-center justify-center ${
                        isSelected
                          ? isDark
                            ? "bg-neutral-100"
                            : "bg-neutral-950"
                          : isToday
                            ? "border border-neutral-400"
                            : ""
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected
                            ? isDark
                              ? "text-neutral-950"
                              : "text-white"
                            : isDark
                              ? "text-neutral-200"
                              : "text-neutral-800"
                        }`}
                      >
                        {isJalali ? toPersianDigits(day) : day}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
