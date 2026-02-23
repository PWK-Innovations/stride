"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/icons/plus-icon";
import { TrashIcon } from "@/components/icons/trash-icon";

import type { ExtractedTask } from "@/types/database";

interface ExtractedTasksReviewProps {
  tasks: ExtractedTask[];
  loading: boolean;
  error: string | null;
  onConfirm: (tasks: ExtractedTask[]) => void;
  onCancel: () => void;
}

export function ExtractedTasksReview({
  tasks: initialTasks,
  loading,
  error,
  onConfirm,
  onCancel,
}: ExtractedTasksReviewProps): React.ReactNode {
  const [editableTasks, setEditableTasks] = useState<ExtractedTask[]>(initialTasks);

  // Sync when tasks prop changes (from loading → loaded)
  const [prevTasks, setPrevTasks] = useState(initialTasks);
  if (initialTasks !== prevTasks) {
    setPrevTasks(initialTasks);
    setEditableTasks(initialTasks);
  }

  const updateTask = (index: number, field: keyof ExtractedTask, value: string | number) => {
    setEditableTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, [field]: value } : task,
      ),
    );
  };

  const removeTask = (index: number) => {
    setEditableTasks((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-olive-300 border-t-olive-600 dark:border-olive-600 dark:border-t-olive-300" />
          <p className="text-sm text-olive-600 dark:text-olive-400">
            Analyzing photo for tasks...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/30">
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
        <button
          onClick={onCancel}
          className="mt-3 text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (editableTasks.length === 0 && initialTasks.length === 0) {
    return (
      <div className="rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <p className="text-sm text-olive-600 dark:text-olive-400">
          No tasks found in the image. Try a clearer photo of a to-do list or assignment.
        </p>
        <button
          onClick={onCancel}
          className="mt-3 text-sm text-olive-600 underline hover:text-olive-800 dark:text-olive-400 dark:hover:text-olive-200"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
      <h3 className="mb-4 text-lg font-display font-semibold text-olive-900 dark:text-olive-50">
        Extracted tasks ({editableTasks.length})
      </h3>

      <div className="space-y-3">
        {editableTasks.map((task, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-md border border-olive-200 bg-olive-50 p-3 dark:border-olive-700 dark:bg-olive-800"
          >
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(index, "title", e.target.value)}
                className="block w-full rounded-md border border-olive-300 bg-white px-3 py-1.5 text-sm text-olive-900 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-600 dark:bg-olive-700 dark:text-olive-100"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-olive-500 dark:text-olive-400">
                  Duration:
                </label>
                <input
                  type="number"
                  value={task.duration_minutes}
                  onChange={(e) =>
                    updateTask(index, "duration_minutes", parseInt(e.target.value) || 30)
                  }
                  min="5"
                  step="5"
                  className="w-20 rounded-md border border-olive-300 bg-white px-2 py-1 text-xs text-olive-900 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-600 dark:bg-olive-700 dark:text-olive-100"
                />
                <span className="text-xs text-olive-500 dark:text-olive-400">
                  min
                </span>
              </div>
            </div>
            <button
              onClick={() => removeTask(index)}
              className="mt-1 text-olive-400 hover:text-red-600 dark:text-olive-500 dark:hover:text-red-500"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onConfirm(editableTasks)}
          disabled={editableTasks.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
        >
          <PlusIcon className="h-4 w-4" />
          Add {editableTasks.length} task{editableTasks.length !== 1 ? "s" : ""}
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border border-olive-300 px-4 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
