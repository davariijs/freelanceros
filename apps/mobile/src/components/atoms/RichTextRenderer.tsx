import * as React from "react";
import {
  Text,
  View,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { useApp } from "@/context/AppContext";

interface RichTextRendererProps {
  text?: string | null;
  placeholder?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  text,
  placeholder = "...",
}) => {
  const { theme } = useApp();
  const systemTheme = useSystemColorScheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";

  if (!text) {
    return (
      <Text className="text-xs text-neutral-500 italic">{placeholder}</Text>
    );
  }

  const parseMarkdown = (rawText: string) => {
    const lines = rawText.split("\n");

    return lines.map((line: string, lineIndex: number) => {
      const isHeading = line.startsWith("# ");
      const cleanLine = isHeading ? line.slice(2) : line;

      const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

      const renderedLine = parts.map((part: string, index: number) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text
              key={index}
              className={`font-black ${isDark ? "text-white" : "text-black"}`}
            >
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <Text key={index} className="italic text-neutral-400">
              {part.slice(1, -1)}
            </Text>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <Text
              key={index}
              className="font-mono bg-neutral-900 px-1 py-0.5 rounded text-xs text-red-500"
            >
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      });

      return (
        <View key={lineIndex} className={isHeading ? "mt-3 mb-1" : "mt-1"}>
          <Text
            className={`leading-relaxed ${
              isHeading
                ? `text-lg font-bold ${isDark ? "text-white" : "text-black"}`
                : `text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`
            }`}
          >
            {renderedLine}
          </Text>
        </View>
      );
    });
  };

  return <View className="flex-col">{parseMarkdown(text)}</View>;
};
