"use client";

import * as React from "react";
import { useApp } from "@/context/AppContext";
import { Note } from "@/schemas/note";
import { Button } from "@/components/atoms/Button";
import { RichTextEditor } from "@/components/molecules/RichTextEditor";
import { Select } from "@/components/atoms/Select";
import {
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/hooks/useNotes";
import { useTasksQuery } from "@/hooks/useTasks";
import { Plus, FileText, Trash2, Check, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { t, dir } = useApp();
  const { data: notes = [], isLoading } = useNotesQuery();
  const { data: tasks = [] } = useTasksQuery();

  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

  React.useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  const handleCreateNote = () => {
    createNoteMutation.mutate(undefined, {
      onSuccess: (newNote) => {
        setSelectedNote(newNote);
        setIsConfirmingDelete(false);
      },
    });
  };

  const handleUpdateNote = (id: string, key: string, value: any) => {
    updateNoteMutation.mutate({ id, [key]: value });
    setSelectedNote((prev) =>
      prev && prev.id === id ? { ...prev, [key]: value } : prev,
    );
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id, {
      onSuccess: () => {
        const remaining = notes.filter((n) => n.id !== id);
        setSelectedNote(remaining.length > 0 ? remaining[0] : null);
        setIsConfirmingDelete(false);
      },
    });
  };

  const taskOptions = [
    { label: "Unlinked", value: "NONE" },
    ...tasks.map((t) => ({
      label: t.title.substring(0, 15) + "...",
      value: t.id,
    })),
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 py-4 md:py-8">
      <div
        className={cn(
          "w-full md:w-64 flex flex-col gap-4 shrink-0",
          dir === "rtl"
            ? "md:border-l md:border-neutral-200 md:dark:border-neutral-800 md:pl-6"
            : "md:border-r md:border-neutral-200 md:dark:border-neutral-800 md:pr-6",
        )}
      >
        <Button
          onClick={handleCreateNote}
          className="w-full flex items-center gap-1.5 justify-center"
        >
          <Plus className="h-4 w-4" />
          {t.newNote}
        </Button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <p className="text-xs text-neutral-400 text-center py-8">
              {t.mainloading}
            </p>
          ) : notes.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8">
              {t.noNotes}
            </p>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsConfirmingDelete(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all border text-xs",
                  dir === "rtl" ? "text-right" : "text-left",
                  selectedNote?.id === note.id
                    ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold"
                    : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/30 text-neutral-500",
                )}
              >
                <div className="truncate mb-1">
                  {note.title || "Untitled Note"}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="w-full h-150 md:h-187.5 grow flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {selectedNote ? (
          <div className="grow flex flex-col p-6 space-y-4 h-full">
            <div className="flex flex-col gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) =>
                  handleUpdateNote(selectedNote.id, "title", e.target.value)
                }
                className="text-xl font-bold bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-neutral-900 dark:text-neutral-100 w-full"
                placeholder={t.noteTitle}
              />
              <div className="flex items-center gap-2 self-stretch justify-start shrink-0 h-11">
                <Select
                  value={(selectedNote as any).taskId || "NONE"}
                  options={taskOptions}
                  onChange={(val) =>
                    handleUpdateNote(
                      selectedNote.id,
                      "taskId",
                      val === "NONE" ? undefined : val,
                    )
                  }
                  className="w-full sm:w-40 text-xs"
                />

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleUpdateNote(
                      selectedNote.id,
                      "updatedAt",
                      new Date().toISOString(),
                    )
                  }
                  className="h-11 px-3 flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-lg shrink-0"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">{t.saveNote}</span>
                </Button>

                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 bg-red-500/10 h-11 px-2 rounded-lg border border-red-500/20 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-neutral-500 hover:bg-neutral-100"
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="h-11 w-11 p-0 text-red-500 hover:bg-red-500/10 border border-neutral-200 dark:border-neutral-800 rounded-lg shrink-0 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grow min-h-0">
              <RichTextEditor
                value={selectedNote.content}
                onChange={(val) =>
                  handleUpdateNote(selectedNote.id, "content", val)
                }
                placeholder={t.noteContent}
              />
            </div>
          </div>
        ) : (
          <div className="grow flex flex-col items-center justify-center p-12 text-center">
            <FileText className="h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500">{t.noNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
