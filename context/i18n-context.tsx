"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language, Translations } from "@/types/i18n"

// Translations
const translations: Translations = {
  fr: {
    // Auth
    login: "Connexion",
    register: "Inscription",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",
    "login-button": "Se connecter",
    "register-button": "S'inscrire",
    "no-account": "Pas encore de compte ?",
    "already-account": "Déjà un compte ?",
    logout: "Déconnexion",

    // Chat
    "new-conversation": "Nouvelle conversation",
    "send-message": "Envoyer un message...",
    "generate-image-prompt": "Décrivez l'image que vous souhaitez générer...",
    "image-generation-mode": "Mode génération d'image",
    welcome: "Bienvenue sur TOSCA AI",
    "welcome-subtitle":
      "Votre assistant IA futuriste. Posez-moi des questions, partagez des fichiers, ou demandez-moi de générer des images.",
    "ask-question": "Poser une question",
    "ask-anything": "Demandez n'importe quoi",
    "share-file": "Partager un fichier",
    "analyze-documents": "Analyser des documents",
    "record-audio": "Enregistrer audio",
    "speak-instead": "Parler au lieu de taper",
    "generate-image": "Générer une image",
    "create-visuals": "Créer des visuels",
    settings: "Paramètres",
    "clear-history": "Effacer l'historique",
    "auth-required": "Connexion requise",
    "auth-message": "Cette fonctionnalité nécessite un compte. Veuillez vous connecter ou vous inscrire.",
    "continue-anyway": "Continuer quand même",
    "go-to-login": "Aller à la connexion",

    // Settings
    theme: "Thème",
    language: "Langue",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  },
  en: {
    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    "login-button": "Login",
    "register-button": "Register",
    "no-account": "Don't have an account yet?",
    "already-account": "Already have an account?",
    logout: "Logout",

    // Chat
    "new-conversation": "New conversation",
    "send-message": "Send a message...",
    "generate-image-prompt": "Describe the image you want to generate...",
    "image-generation-mode": "Image generation mode",
    welcome: "Welcome to TOSCA AI",
    "welcome-subtitle": "Your futuristic AI assistant. Ask me questions, share files, or ask me to generate images.",
    "ask-question": "Ask a question",
    "ask-anything": "Ask anything",
    "share-file": "Share a file",
    "analyze-documents": "Analyze documents",
    "record-audio": "Record audio",
    "speak-instead": "Speak instead of typing",
    "generate-image": "Generate an image",
    "create-visuals": "Create visuals",
    settings: "Settings",
    "clear-history": "Clear history",
    "auth-required": "Authentication required",
    "auth-message": "This feature requires an account. Please login or register.",
    "continue-anyway": "Continue anyway",
    "go-to-login": "Go to login",

    // Settings
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  useEffect(() => {
    // Load language preference from localStorage
    const storedLanguage = localStorage.getItem("tosca_language") as Language
    if (storedLanguage && (storedLanguage === "fr" || storedLanguage === "en")) {
      setLanguageState(storedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("tosca_language", lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

