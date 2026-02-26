import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface StudyConfig {
  title: string;
  description: string;
  focusPoints: string[];
  url?: string;
  startAt: string;
  endAt: string;
  /** When true, study stays open until admin closes it (ignores endAt). */
  openUntilClosed?: boolean;
  /** When true and openUntilClosed is true, study is closed. */
  closed?: boolean;
}

export interface StudyAnswer {
  questionIndex: number;
  question: string;
  answer: string;
}

const STORAGE_KEY_CONFIG = "gds-study-config";
const STORAGE_KEY_QUESTIONS = "gds-study-questions";
const STORAGE_KEY_ANSWERS = "gds-study-answers";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function generateStudyQuestions(config: StudyConfig): string[] {
  const questions: string[] = [];
  const title = config.title.trim();
  const desc = config.description.trim();
  const points = config.focusPoints.filter((p) => p.trim());
  const hasUrl = Boolean(config.url?.trim());

  if (title) {
    questions.push(`What was your overall experience or main goal when using or evaluating "${title}"?`);
  }
  if (desc && questions.length < 5) {
    questions.push(`Based on the study focus (${desc.slice(0, 80)}${desc.length > 80 ? "…" : ""}), what was the most important aspect for you?`);
  }
  if (hasUrl && questions.length < 5) {
    questions.push("How would you rate the usability of the service or product you were asked to focus on?");
  }
  points.slice(0, 2).forEach((point) => {
    if (questions.length < 5 && point.trim()) {
      questions.push(`Regarding "${point.trim()}" — what worked well and what could be improved?`);
    }
  });
  if (questions.length < 5) {
    questions.push("Is there anything else you would like to add that would help us improve?");
  }
  return questions.slice(0, 5);
}

/** Generate up to 5 study questions from PDF/document text (client-side heuristic). */
export function generateStudyQuestionsFromText(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const questions: string[] = [];
  const take = Math.min(5, Math.max(1, sentences.length));
  for (let i = 0; i < take; i++) {
    const s = sentences[i] ?? normalized.slice(0, 120);
    const excerpt = s.length > 100 ? s.slice(0, 97) + "…" : s;
    questions.push(`Based on the theme document: "${excerpt}" — what is your experience or view on this?`);
  }
  while (questions.length < 5) {
    questions.push("Is there anything else you would like to add that would help us improve?");
  }
  return questions.slice(0, 5);
}

interface StudyContextValue {
  config: StudyConfig | null;
  questions: string[];
  answers: StudyAnswer[];
  setConfig: (config: StudyConfig | null) => void;
  saveConfigAndGenerateQuestions: (config: StudyConfig) => void;
  /** Save config and use the provided questions (e.g. after admin edits draft). */
  saveConfigWithQuestions: (config: StudyConfig, questions: string[]) => void;
  setQuestions: (questions: string[]) => void;
  addAnswer: (questionIndex: number, question: string, answer: string) => void;
  clearAnswers: () => void;
  isStudyOpen: () => boolean;
  closeStudy: () => void;
  /** Clear config, questions, and answers — start with a new study. */
  resetStudy: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<StudyConfig | null>(() =>
    loadJson<StudyConfig | null>(STORAGE_KEY_CONFIG, null)
  );
  const [questions, setQuestionsState] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEY_QUESTIONS, [])
  );
  const [answers, setAnswersState] = useState<StudyAnswer[]>(() =>
    loadJson<StudyAnswer[]>(STORAGE_KEY_ANSWERS, [])
  );

  const setConfig = useCallback((next: StudyConfig | null) => {
    setConfigState(next);
    saveJson(STORAGE_KEY_CONFIG, next);
  }, []);

  const saveConfigAndGenerateQuestions = useCallback((nextConfig: StudyConfig) => {
    setConfigState(nextConfig);
    saveJson(STORAGE_KEY_CONFIG, nextConfig);
    const nextQuestions = generateStudyQuestions(nextConfig);
    setQuestionsState(nextQuestions);
    saveJson(STORAGE_KEY_QUESTIONS, nextQuestions);
    setAnswersState([]);
    saveJson(STORAGE_KEY_ANSWERS, []);
  }, []);

  const saveConfigWithQuestions = useCallback((nextConfig: StudyConfig, nextQuestions: string[]) => {
    setConfigState(nextConfig);
    saveJson(STORAGE_KEY_CONFIG, nextConfig);
    const trimmed = nextQuestions.map((q) => q.trim()).filter(Boolean);
    setQuestionsState(trimmed);
    saveJson(STORAGE_KEY_QUESTIONS, trimmed);
    setAnswersState([]);
    saveJson(STORAGE_KEY_ANSWERS, []);
  }, []);

  const closeStudy = useCallback(() => {
    if (!config) return;
    const next = { ...config, closed: true };
    setConfigState(next);
    saveJson(STORAGE_KEY_CONFIG, next);
  }, [config]);

  const setQuestions = useCallback((next: string[]) => {
    setQuestionsState(next);
    saveJson(STORAGE_KEY_QUESTIONS, next);
  }, []);

  const addAnswer = useCallback((questionIndex: number, question: string, answer: string) => {
    setAnswersState((prev) => {
      const filtered = prev.filter((a) => a.questionIndex !== questionIndex);
      const next = [...filtered, { questionIndex, question, answer }];
      saveJson(STORAGE_KEY_ANSWERS, next);
      return next;
    });
  }, []);

  const clearAnswers = useCallback(() => {
    setAnswersState([]);
    saveJson(STORAGE_KEY_ANSWERS, []);
  }, []);

  const isStudyOpen = useCallback(() => {
    if (!config?.startAt) return false;
    const now = new Date().getTime();
    const start = new Date(config.startAt).getTime();
    if (config.openUntilClosed) {
      if (config.closed) return false;
      return now >= start;
    }
    if (!config.endAt) return false;
    const end = new Date(config.endAt).getTime();
    return now >= start && now <= end;
  }, [config]);

  const resetStudy = useCallback(() => {
    setConfigState(null);
    setQuestionsState([]);
    setAnswersState([]);
    saveJson(STORAGE_KEY_CONFIG, null);
    saveJson(STORAGE_KEY_QUESTIONS, []);
    saveJson(STORAGE_KEY_ANSWERS, []);
  }, []);

  const value = useMemo<StudyContextValue>(
    () => ({
      config,
      questions,
      answers,
      setConfig,
      saveConfigAndGenerateQuestions,
      saveConfigWithQuestions,
      setQuestions,
      addAnswer,
      clearAnswers,
      isStudyOpen,
      closeStudy,
      resetStudy,
    }),
    [
      config,
      questions,
      answers,
      setConfig,
      saveConfigAndGenerateQuestions,
      saveConfigWithQuestions,
      setQuestions,
      addAnswer,
      clearAnswers,
      isStudyOpen,
      closeStudy,
      resetStudy,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}
