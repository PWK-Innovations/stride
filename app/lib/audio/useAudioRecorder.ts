"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AudioRecorderState {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

interface AudioRecorderActions {
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export type AudioRecorder = AudioRecorderState & AudioRecorderActions;

export function useAudioRecorder(): AudioRecorder {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Keep audioUrlRef in sync for unmount cleanup
  useEffect(() => {
    audioUrlRef.current = state.audioUrl;
  }, [state.audioUrl]);

  useEffect(() => {
    return () => {
      cleanup();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
    // Only run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revokeCurrentUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    // Guard against double-start: clean up any in-progress recording
    cleanup();
    revokeCurrentUrl();

    setState({
      isRecording: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      error: null,
    });
    chunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Microphone access denied. Please allow microphone access in your browser settings.",
      }));
      return;
    }

    streamRef.current = stream;

    // Prefer webm/opus, fall back to mp4 for Safari
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setState((prev) => ({
        ...prev,
        isRecording: false,
        audioBlob: blob,
        audioUrl: url,
      }));
      // Release mic
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };

    mediaRecorderRef.current = recorder;
    recorder.start();

    setState((prev) => ({ ...prev, isRecording: true, duration: 0 }));

    timerRef.current = setInterval(() => {
      setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  }, [cleanup, revokeCurrentUrl]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    revokeCurrentUrl();
    setState({
      isRecording: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      error: null,
    });
  }, [cleanup, revokeCurrentUrl]);

  return {
    ...state,
    start,
    stop,
    reset,
  };
}
