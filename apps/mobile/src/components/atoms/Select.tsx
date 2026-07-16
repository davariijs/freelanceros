import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  isDark: boolean;
  dropdownHeightClass?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, isDark }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <View className="w-full relative z-50">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
        className={`w-full h-11 px-3 rounded-xl border flex-row items-center justify-between ${
          isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-300"
        }`}
      >
        <Text className={`text-sm ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>{selectedLabel}</Text>
        <ChevronDown size={14} color="#737373" />
      </TouchableOpacity>

      {isOpen && (
        <View className={`absolute top-12 left-0 right-0 z-50 rounded-xl border p-1 shadow-lg ${
          isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
        }`}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="flex-row items-center justify-between px-3 py-2.5 rounded-lg active:bg-neutral-100/50 dark:active:bg-neutral-800/50"
            >
              <Text className={`text-xs ${value === opt.value ? "font-bold text-emerald-500" : (isDark ? "text-neutral-300" : "text-neutral-700")}`}>
                {opt.label}
              </Text>
              {value === opt.value && <Check size={12} color="#10b981" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};