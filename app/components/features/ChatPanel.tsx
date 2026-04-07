'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createLogger } from '@/lib/logger';
import { trackEvent } from '@/lib/analytics';

const logger = createLogger('chat:panel');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolStatus?: string;
}

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  getTaskList: 'Fetching your tasks',
  getCalendarEvents: 'Checking your calendar',
  createScheduledBlocks: 'Building your schedule',
  checkForConflicts: 'Checking for conflicts',
  updateTask: 'Updating task',
  createTask: 'Creating task',
};

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  onScheduleChange?: () => void;
}

export function ChatPanel({ open, onClose, onScheduleChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open && !historyLoaded) {
      loadHistory();
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, historyLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function loadHistory() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`/api/agent/history?date=${today}&timezone=${encodeURIComponent(tz)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages?.length > 0) {
          setMessages(data.messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })));
        }
      }
    } catch (error) {
      logger.warn('Failed to load chat history', { error });
    } finally {
      setHistoryLoaded(true);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    trackEvent("chat_message_sent", { messageLength: text.length });
    setInput('');
    setSending(true);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '', toolStatus: 'Thinking' };
    setMessages((prev) => [...prev, assistantMsg]);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, timezone }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Agent request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (!done) {
          buffer += decoder.decode(value, { stream: true });
        } else {
          // Flush remaining decoder bytes
          buffer += decoder.decode();
        }

        const lines = buffer.split('\n\n');
        buffer = done ? '' : (lines.pop() || '');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'tool') {
              const label = TOOL_DISPLAY_NAMES[event.name] || event.name;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, toolStatus: label };
                }
                return updated;
              });
            } else if (event.type === 'text') {
              fullText += event.content;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: fullText, toolStatus: undefined };
                }
                return updated;
              });
            } else if (event.type === 'error') {
              throw new Error(event.content || 'Agent error');
            }
          } catch (parseError) {
            if (parseError instanceof Error && parseError.message === 'Agent error') throw parseError;
          }
        }

        if (done) break;
      }

      // Clear tool status on done
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'assistant') {
          updated[updated.length - 1] = { ...last, toolStatus: undefined };
        }
        return updated;
      });

      // Schedule may have changed
      if (onScheduleChange) onScheduleChange();
    } catch (error) {
      logger.error('Chat send failed', { error });
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'assistant') {
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
          };
        }
        return updated;
      });
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-olive-200 bg-white shadow-xl dark:border-olive-800 dark:bg-olive-950 lg:inset-y-auto lg:bottom-6 lg:right-6 lg:top-20 lg:w-96 lg:rounded-2xl lg:border lg:shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-olive-200 px-4 py-3 dark:border-olive-800">
          <h2 className="font-display text-lg font-semibold text-olive-900 dark:text-olive-50">
            Chat with Stride
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-olive-400 hover:text-olive-600 dark:text-olive-500 dark:hover:text-olive-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-olive-500 dark:text-olive-400">
                Ask Stride to manage your schedule.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Build my day', "What's next?", 'Add a task'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => { setInput(chip); inputRef.current?.focus(); }}
                    className="rounded-full border border-olive-300 px-3 py-1 text-xs text-olive-600 hover:bg-olive-50 dark:border-olive-700 dark:text-olive-400 dark:hover:bg-olive-900"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-olive-600 text-white dark:bg-olive-500'
                    : 'bg-olive-100 text-olive-900 dark:bg-olive-900 dark:text-olive-100'
                }`}
              >
                {msg.toolStatus && !msg.content && (
                  <div className="flex items-center gap-2 text-olive-500 dark:text-olive-400">
                    <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {msg.toolStatus}...
                  </div>
                )}
                {msg.content && (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-olive-200 p-4 dark:border-olive-800">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Stride anything..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-olive-300 bg-white px-3 py-2 text-sm text-olive-900 placeholder-olive-400 focus:border-olive-500 focus:outline-none focus:ring-1 focus:ring-olive-500 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-100"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="rounded-lg bg-olive-600 p-2 text-white hover:bg-olive-700 disabled:opacity-50 dark:bg-olive-500 dark:hover:bg-olive-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
