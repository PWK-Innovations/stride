'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@/components/icons/plus-icon';
import { TrashIcon } from '@/components/icons/trash-icon';
import { SparklesIcon } from '@/components/icons/sparkles-icon';
import { DailyTimeline } from '@/components/features/DailyTimeline';
import {
  requestNotificationPermission,
  scheduleNotifications,
} from '@/lib/notifications/scheduleNotifications';

interface Task {
  id: string;
  title: string;
  notes: string | null;
  duration_minutes: number;
  created_at: string;
}

interface ScheduledBlock {
  task_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

export default function AppPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [buildingSchedule, setBuildingSchedule] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledBlock[]>([]);
  const [overflow, setOverflow] = useState<string[]>([]);
  const [busyWindows, setBusyWindows] = useState<Array<{ start: string; end: string; title?: string }>>([]);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchGoogleStatus();
  }, []);

  const fetchGoogleStatus = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (res.ok) {
        setGoogleConnected(data.googleConnected);
      }
    } catch (error) {
      console.error('Failed to fetch Google status:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, notes, duration_minutes: duration }),
      });

      if (res.ok) {
        setTitle('');
        setNotes('');
        setDuration(30);
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <>
      {/* Add Task Form */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <h2 className="mb-4 text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
          Add a task
        </h2>
        <form onSubmit={addTask} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 placeholder-olive-400 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
              placeholder="Review Q3 report"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 placeholder-olive-400 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
              placeholder="Check metrics and prepare summary"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-olive-700 dark:text-olive-300"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="5"
              step="5"
              className="mt-1 block w-32 rounded-md border border-olive-300 bg-white px-3 py-2 text-olive-900 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
          >
            <PlusIcon className="h-4 w-4" />
            Add task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-6 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        <h2 className="mb-4 text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
          Your tasks ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <p className="text-center text-olive-500 dark:text-olive-400">
            No tasks yet. Add your first task above.
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between rounded-md border border-olive-200 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-800"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-olive-900 dark:text-olive-50">
                    {task.title}
                  </h3>
                  {task.notes && (
                    <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                      {task.notes}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-olive-500 dark:text-olive-500">
                    {task.duration_minutes} minutes
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-4 text-olive-400 hover:text-red-600 dark:text-olive-500 dark:hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Calendar Connection */}
      <div className="mb-8 rounded-lg border border-olive-200 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
        {googleConnected === null ? (
          <p className="text-sm text-olive-500 dark:text-olive-400">
            Checking Google Calendar status...
          </p>
        ) : googleConnected ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Google Calendar connected
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-olive-600 dark:text-olive-400">
              Connect your Google Calendar to schedule around existing events.
            </p>
            <a
              href="/api/auth/google"
              className="inline-flex items-center gap-2 rounded-md bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:bg-olive-500 dark:hover:bg-olive-600"
            >
              Connect Google Calendar
            </a>
          </div>
        )}
      </div>

      {/* Build My Day Button */}
      {tasks.length > 0 && (
        <div className="text-center">
          <button
            onClick={buildMyDay}
            disabled={buildingSchedule}
            className="inline-flex items-center gap-2 rounded-lg bg-olive-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
          >
            <SparklesIcon className="h-6 w-6" />
            {buildingSchedule ? 'Building your day...' : 'Build my day'}
          </button>
        </div>
      )}

      {/* Timeline View */}
      {schedule.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-display font-semibold text-olive-900 dark:text-olive-50">
            Your schedule for today
          </h2>
          <DailyTimeline
            scheduledBlocks={schedule.map((block) => {
              const task = tasks.find((t) => t.id === block.task_id);
              return {
                task_id: block.task_id,
                start_time: block.start_time,
                end_time: block.end_time,
                title: task?.title || 'Unknown task',
              };
            })}
            busyWindows={busyWindows}
          />
        </div>
      )}

      {/* Overflow */}
      {overflow.length > 0 && (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900">
          <p className="font-medium text-yellow-900 dark:text-yellow-100">
            Couldn&apos;t schedule today:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-300">
            {overflow.map((taskId) => {
              const task = tasks.find((t) => t.id === taskId);
              return <li key={taskId}>{task?.title || 'Unknown task'}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );

  async function buildMyDay() {
    setBuildingSchedule(true);
    try {
      const res = await fetch('/api/schedule/build', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to build schedule');
        return;
      }

      setSchedule(data.scheduled_blocks);
      setOverflow(data.overflow);
      setBusyWindows(data.busy_windows || []);

      // Request notification permission and schedule notifications
      const hasPermission = await requestNotificationPermission();
      if (hasPermission && data.scheduled_blocks.length > 0) {
        const blocksWithTitles = data.scheduled_blocks.map((block: any) => {
          const task = tasks.find((t) => t.id === block.task_id);
          return {
            ...block,
            title: task?.title || 'Unknown task',
          };
        });
        scheduleNotifications(blocksWithTitles);
      }
    } catch (error) {
      console.error('Failed to build schedule:', error);
      alert('Failed to build schedule');
    } finally {
      setBuildingSchedule(false);
    }
  }
}
