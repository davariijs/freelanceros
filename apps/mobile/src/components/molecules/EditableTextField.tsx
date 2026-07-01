import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Check, Edit2 } from "lucide-react-native";

interface EditableTextFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
}

export const EditableTextField: React.FC<EditableTextFieldProps> = ({
  value,
  onSave,
  placeholder,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue);
      setIsEditing(false);
    }
  };

  return (
    <View className="flex-row items-center justify-between min-h-12 py-1">
      {isEditing ? (
        <View className="flex-1 flex-row items-center justify-between border-b border-neutral-800 pb-1">
          <TextInput
            className={`flex-1 text-lg font-bold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor="#737373"
            autoFocus
          />
          <TouchableOpacity
            onPress={handleSave}
            className="ml-2 bg-emerald-600/10 p-2 rounded-lg border border-emerald-500/20 active:bg-emerald-600/20"
          >
            <Check size={16} color="#10b981" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className={`text-lg font-black flex-1 mr-4 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {value}
          </Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="p-2 border border-neutral-800 bg-neutral-900/50 rounded-lg active:bg-neutral-800"
          >
            <Edit2 size={14} color="#a3a3a3" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
