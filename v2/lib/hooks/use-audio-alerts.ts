"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useConfigStore } from "@/lib/stores/config";

export function useAudioAlerts() {
  const howlRef = useRef<Howl | null>(null);
  const soundEnabled = useConfigStore((s) => s.soundEnabled);

  useEffect(() => {
    howlRef.current = new Howl({
      src: ["/sounds/notif.mp3"],
      preload: true,
      volume: 1.0,
    });

    return () => {
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, []);

  const playAlert = useCallback(() => {
    if (!soundEnabled) return;
    howlRef.current?.play();
  }, [soundEnabled]);

  const speakText = useCallback(
    (text: string) => {
      if (!soundEnabled) return;
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    },
    [soundEnabled],
  );

  return { playAlert, speakText };
}
