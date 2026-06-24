"use client";

import * as React from "react";
import { Bold, Italic, Heading1, Code, Smile, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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
  const [tab, setTab] = React.useState<"edit" | "preview">("edit");
  const [showEmojis, setShowEmojis] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const emojiRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const injectText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const selectedText = currentText.substring(start, end);
    const replacement = before + selectedText + after;

    const newText =
      currentText.substring(0, start) +
      replacement +
      currentText.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 0);
  };

  const parseMarkdown = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-xl font-bold my-3 text-neutral-900 dark:text-white">$1</h1>',
    );
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-extrabold text-neutral-950 dark:text-white">$1</strong>',
    );
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono text-neutral-900 dark:text-neutral-100">$1</code>',
    );
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const pickerTheme = theme === "dark" ? "dark" : "light";

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-950 flex flex-col h-full min-h-75">
      <div className="h-11 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs gap-1.5",
              tab === "edit" && "bg-neutral-100 dark:bg-neutral-800",
            )}
            onClick={() => setTab("edit")}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>{t.write}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs gap-1.5",
              tab === "preview" && "bg-neutral-100 dark:bg-neutral-800",
            )}
            onClick={() => setTab("preview")}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t.preview || "Preview"}</span>
          </Button>
        </div>

        {tab === "edit" && (
          <div className="flex items-center gap-1 relative" ref={emojiRef}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => injectText("**", "**")}
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => injectText("*", "*")}
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => injectText("# ")}
            >
              <Heading1 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => injectText("`", "`")}
            >
              <Code className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <Smile className="h-3.5 w-3.5" />
            </Button>

            {showEmojis && (
              <div className="absolute right-0 top-10 z-50 shadow-2xl">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    injectText(emojiData.emoji);
                    setShowEmojis(false);
                  }}
                  theme={pickerTheme as any}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grow p-4 bg-white dark:bg-neutral-950/20">
        {tab === "edit" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-transparent border-none text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-0 resize-none text-sm leading-relaxed placeholder-neutral-400"
            placeholder={placeholder}
          />
        ) : (
          <div
            className="prose dark:prose-invert text-sm leading-relaxed whitespace-pre-wrap text-neutral-900 dark:text-neutral-100"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(value) || "Nothing to preview",
            }}
          />
        )}
      </div>
    </div>
  );
};
