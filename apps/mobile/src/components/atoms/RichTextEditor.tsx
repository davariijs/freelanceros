import * as React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  useColorScheme,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { RichTextRenderer } from "./RichTextRenderer";
import { Smile } from "lucide-react-native";
import EmojiPicker from "rn-emoji-keyboard";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { theme, t } = useApp();
  const systemTheme = useColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  const [tab, setTab] = React.useState<"edit" | "preview">("edit");
  const [selection, setSelection] = React.useState({ start: 0, end: 0 });
  const [isEmojiOpen, setIsEmojiOpen] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);

  const injectText = (before: string, after: string = "") => {
    const start = selection.start;
    const end = selection.end;
    const currentText = value || "";
    const selectedText = currentText.substring(start, end);
    const replacement = before + selectedText + after;

    const newText =
      currentText.substring(0, start) +
      replacement +
      currentText.substring(end);
    onChange(newText);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleEmojiSelect = (emojiObject: any) => {
    injectText(emojiObject.emoji);
  };

  return (
    <View
      className={`border rounded-xl overflow-hidden min-h-50 flex-col ${isDark ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-neutral-50"}`}
    >
      <View
        className={`flex-row items-center justify-between p-2 border-b ${isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"}`}
      >
        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={() => setTab("edit")}
            className={`px-3 py-1.5 rounded-lg ${tab === "edit" ? (isDark ? "bg-neutral-800" : "bg-neutral-100") : ""}`}
          >
            <Text
              className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}
            >
              {t.write || "Write"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("preview")}
            className={`px-3 py-1.5 rounded-lg ${tab === "preview" ? (isDark ? "bg-neutral-800" : "bg-neutral-100") : ""}`}
          >
            <Text
              className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}
            >
              {t.preview || "Preview"}
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "edit" && (
          <View className="flex-row gap-0.5">
            <TouchableOpacity
              onPress={() => injectText("**", "**")}
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Text
                className={`font-extrabold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                B
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => injectText("*", "*")}
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Text
                className={`italic font-serif text-sm ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                I
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => injectText("# ")}
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Text
                className={`font-bold text-xs ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                H1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => injectText("`", "`")}
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Text
                className={`font-mono text-xs ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {"< >"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEmojiOpen(true)}
              className="h-8 w-8 items-center justify-center rounded-lg"
            >
              <Smile size={15} color={isDark ? "#ffffff" : "#171717"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-1 p-3 min-h-35">
        {tab === "edit" ? (
          <TextInput
            ref={inputRef}
            multiline
            value={value}
            onChangeText={onChange}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            placeholder={placeholder}
            placeholderTextColor={isDark ? "#737373" : "#a3a3a3"}
            textAlignVertical="top"
            className={`flex-1 text-sm bg-transparent p-0 ${isDark ? "text-white" : "text-neutral-900"}`}
          />
        ) : (
          <RichTextRenderer text={value} placeholder={placeholder} />
        )}
      </View>

      <EmojiPicker
        open={isEmojiOpen}
        onClose={() => setIsEmojiOpen(false)}
        onEmojiSelected={handleEmojiSelect}
        theme={{
          container: isDark ? "#09090e" : "#ffffff",
          header: isDark ? "#ffffff" : "#09090e",
          backdrop: "rgba(0,0,0,0.4)",
        }}
      />
    </View>
  );
};
