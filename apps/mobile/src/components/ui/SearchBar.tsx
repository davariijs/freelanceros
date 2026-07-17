import * as React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  isOpen,
  onClose,
  isDark,
}) => {
  if (!isOpen) return null;

  const handlePressAction = () => {
    if (value.length > 0) {
      onChangeText("");
    } else {
      onClose();
    }
  };

  return (
    <View
      className={`flex-row items-center border rounded-xl px-3 h-11 mb-4 ${
        isDark
          ? "border-neutral-800 bg-neutral-900/50"
          : "border-neutral-300 bg-white"
      }`}
    >
      <Search size={16} color="#737373" style={{ marginRight: 8 }} />
      <TextInput
        autoFocus
        className={`flex-1 text-sm h-full ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="#737373"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handlePressAction}>
        <X size={16} color={isDark ? "#a3a3a3" : "#737373"} />
      </TouchableOpacity>
    </View>
  );
};
