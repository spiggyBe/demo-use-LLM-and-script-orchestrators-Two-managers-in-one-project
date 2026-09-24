"use client";

import { createContext, useContext } from "react";
import type { Category, Filter, Priority } from "@/types/todo";

export type Locale = "pl" | "en";

type TranslationShape = {
  appTitle: string;
  localStorageNote: string;
  readmeLink: string;
  languageLabel: string;
  polish: string;
  english: string;
  seedLoading: string;
  seedButton: string;
  seedLoadingNote: string;
  addTitlePlaceholder: string;
  requiredTitle: string;
  descriptionOptional: string;
  titleLabel: string;
  descriptionLabel: string;
  priorityLabel: string;
  categoryLabel: string;
  dueDateLabel: string;
  addTask: string;
  editTitleLabel: string;
  editDescriptionLabel: string;
  save: string;
  cancel: string;
  edit: string;
  remove: string;
  markComplete: (title: string) => string;
  markIncomplete: (title: string) => string;
  empty: string;
  filters: Record<Filter, string>;
  clearCompleted: string;
  stats: { all: string; active: string; completed: string };
  priority: Record<Priority, string>;
  category: Record<Category, string>;
  unknownSeedError: string;
  apiError: (status: number) => string;
};

export const translations: Record<Locale, TranslationShape> = {
  pl: {
    appTitle: "Lista zadań",
    localStorageNote: "Dane przechowywane wyłącznie lokalnie w przeglądarce (localStorage)",
    readmeLink: "Sprawdź cele i zamierzenia tego projektu klikając w ten link",
    languageLabel: "Choose language",
    polish: "Polski",
    english: "English",
    seedLoading: "Wczytywanie…",
    seedButton: "Załaduj przykładowe dane (fake API)",
    seedLoadingNote: "Wczytywanie z fake API…",
    addTitlePlaceholder: "Co trzeba zrobić?",
    requiredTitle: "Tytuł zadania jest wymagany.",
    descriptionOptional: "Opis (opcjonalnie)",
    titleLabel: "Tytuł zadania",
    descriptionLabel: "Opis zadania",
    priorityLabel: "Priorytet",
    categoryLabel: "Kategoria",
    dueDateLabel: "Termin",
    addTask: "Dodaj zadanie",
    editTitleLabel: "Edytuj tytuł zadania",
    editDescriptionLabel: "Edytuj opis zadania",
    save: "Zapisz",
    cancel: "Anuluj",
    edit: "Edytuj",
    remove: "Usuń",
    markComplete: (title) => `Oznacz „${title}” jako ukończone`,
    markIncomplete: (title) => `Oznacz „${title}” jako nieukończone`,
    empty: "Brak zadań do wyświetlenia.",
    filters: { all: "Wszystkie", active: "Aktywne", completed: "Ukończone" },
    clearCompleted: "Wyczyść ukończone",
    stats: { all: "Wszystkie", active: "Aktywne", completed: "Ukończone" },
    priority: { low: "Niski", medium: "Średni", high: "Wysoki" },
    category: { praca: "Praca", dom: "Dom", nauka: "Nauka", inne: "Inne" },
    unknownSeedError: "Nieznany błąd wczytywania danych.",
    apiError: (status) => `Fake API zwróciło błąd: ${status}`,
  },
  en: {
    appTitle: "Todo List",
    localStorageNote: "Data is stored only in your browser (localStorage)",
    readmeLink: "Review this project's goals and intentions by clicking this link",
    languageLabel: "Choose language",
    polish: "Polski",
    english: "English",
    seedLoading: "Loading…",
    seedButton: "Load sample data (fake API)",
    seedLoadingNote: "Loading from fake API…",
    addTitlePlaceholder: "What needs to be done?",
    requiredTitle: "A task title is required.",
    descriptionOptional: "Description (optional)",
    titleLabel: "Task title",
    descriptionLabel: "Task description",
    priorityLabel: "Priority",
    categoryLabel: "Category",
    dueDateLabel: "Due date",
    addTask: "Add task",
    editTitleLabel: "Edit task title",
    editDescriptionLabel: "Edit task description",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    remove: "Delete",
    markComplete: (title) => `Mark “${title}” as complete`,
    markIncomplete: (title) => `Mark “${title}” as incomplete`,
    empty: "No tasks to display.",
    filters: { all: "All", active: "Active", completed: "Completed" },
    clearCompleted: "Clear completed",
    stats: { all: "All", active: "Active", completed: "Completed" },
    priority: { low: "Low", medium: "Medium", high: "High" },
    category: { praca: "Work", dom: "Home", nauka: "Learning", inne: "Other" },
    unknownSeedError: "An unknown error occurred while loading data.",
    apiError: (status) => `The fake API returned an error: ${status}`,
  },
};

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "pl", setLocale: () => undefined });

export function useI18n() {
  const { locale, setLocale } = useContext(LocaleContext);
  return { locale, setLocale, t: translations[locale] };
}
