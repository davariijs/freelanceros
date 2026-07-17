import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity as RNTouchableOpacity,
  DeviceEventEmitter,
  Dimensions,
} from "react-native";
import {
  BottomSheetScrollView,
  TouchableOpacity as BSTouchableOpacity,
} from "@gorhom/bottom-sheet";
import { ChevronDown, Check } from "lucide-react-native";
import { cn } from "@/lib/utils";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

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

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  isDark,
  dropdownHeightClass = "max-h-50",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectId = React.useMemo(() => Math.random().toString(), []);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "close-all-selects",
      (activeSelectId) => {
        if (activeSelectId !== selectId) {
          setIsOpen(false);
        }
      },
    );
    return () => subscription.remove();
  }, [selectId]);

  const toggleOpen = () => {
    if (!isOpen) {
      DeviceEventEmitter.emit("close-all-selects", selectId);
    }
    setIsOpen(!isOpen);
  };

  return (
    <View style={{ zIndex: isOpen ? 9999 : 1 }} className="w-full relative">
      <RNTouchableOpacity
        onPress={toggleOpen}
        activeOpacity={0.8}
        className={`w-full h-11 px-3 rounded-xl border flex-row items-center justify-between ${
          isDark
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-neutral-300"
        }`}
      >
        <Text
          className={`text-sm ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
        >
          {selectedLabel}
        </Text>
        <ChevronDown size={14} color="#737373" />
      </RNTouchableOpacity>

      {isOpen && (
        <>
          <RNTouchableOpacity
            style={{
              position: "absolute",
              top: -screenHeight,
              bottom: -screenHeight,
              left: -screenWidth,
              right: -screenWidth,
              backgroundColor: "transparent",
              zIndex: 40,
            }}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />

          <View
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              right: 0,
              zIndex: 50,
              borderRadius: 12,
              borderWidth: 1,
              padding: 4,
              backgroundColor: isDark ? "#171717" : "#ffffff",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            }}
            className={cn("shadow-lg", dropdownHeightClass)}
          >
            <BottomSheetScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={{ width: "100%" }}
            >
              {options.map((opt) => (
                <BSTouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                  className="active:bg-neutral-100/50 dark:active:bg-neutral-800/50"
                >
                  <Text
                    className={`text-xs ${value === opt.value ? "font-bold text-emerald-500" : isDark ? "text-neutral-300" : "text-neutral-700"}`}
                  >
                    {opt.label}
                  </Text>
                  {value === opt.value && <Check size={12} color="#10b981" />}
                </BSTouchableOpacity>
              ))}
            </BottomSheetScrollView>
          </View>
        </>
      )}
    </View>
  );
};
