"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

export type ApiKeyTab = "gemini" | "custom-ai" | "youtube";

interface ApiKeysContextType {
  geminiKey: string;
  youtubeKey: string;
  customAiKey: string;
  customAiEndpoint: string;
  customAiModel: string;
  setGeminiKey: (key: string) => void;
  setYoutubeKey: (key: string) => void;
  setCustomAiConfig: (config: { endpoint?: string; key?: string; model?: string }) => void;
  removeGeminiKey: () => void;
  removeYoutubeKey: () => void;
  removeCustomAiConfig: () => void;
  hasGeminiKey: boolean;
  hasYoutubeKey: boolean;
  hasCustomAiKey: boolean;
  isModalOpen: boolean;
  activeTab: ApiKeyTab;
  openModal: (tab?: ApiKeyTab) => void;
  closeModal: () => void;
  setActiveTab: (tab: ApiKeyTab) => void;
}

const STORAGE_KEY_GEMINI = "yct_custom_gemini_api_key";
const STORAGE_KEY_YOUTUBE = "yct_custom_youtube_api_key";
const STORAGE_KEY_CUSTOM_AI_KEY = "yct_custom_ai_key";
const STORAGE_KEY_CUSTOM_AI_ENDPOINT = "yct_custom_ai_endpoint";
const STORAGE_KEY_CUSTOM_AI_MODEL = "yct_custom_ai_model";

const emptySubscribe = () => () => {};

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export function ApiKeysProvider({ children }: { children: React.ReactNode }) {
  const [geminiKey, setGeminiKeyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY_GEMINI) || "";
      } catch {}
    }
    return "";
  });

  const [youtubeKey, setYoutubeKeyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY_YOUTUBE) || "";
      } catch {}
    }
    return "";
  });

  const [customAiKey, setCustomAiKeyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY_CUSTOM_AI_KEY) || "";
      } catch {}
    }
    return "";
  });

  const [customAiEndpoint, setCustomAiEndpointState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY_CUSTOM_AI_ENDPOINT) || "https://api.groq.com/openai/v1";
      } catch {}
    }
    return "https://api.groq.com/openai/v1";
  });

  const [customAiModel, setCustomAiModelState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY_CUSTOM_AI_MODEL) || "llama-3.3-70b-versatile";
      } catch {}
    }
    return "llama-3.3-70b-versatile";
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ApiKeyTab>("gemini");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const setGeminiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiKeyState(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEY_GEMINI, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY_GEMINI);
      }
    } catch (e) {
      console.error("Failed to save Gemini key:", e);
    }
  };

  const setYoutubeKey = (key: string) => {
    const trimmed = key.trim();
    setYoutubeKeyState(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem(STORAGE_KEY_YOUTUBE, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY_YOUTUBE);
      }
    } catch (e) {
      console.error("Failed to save YouTube key:", e);
    }
  };

  const setCustomAiConfig = (config: { endpoint?: string; key?: string; model?: string }) => {
    if (config.key !== undefined) {
      const trimmedKey = config.key.trim();
      setCustomAiKeyState(trimmedKey);
      try {
        if (trimmedKey) localStorage.setItem(STORAGE_KEY_CUSTOM_AI_KEY, trimmedKey);
        else localStorage.removeItem(STORAGE_KEY_CUSTOM_AI_KEY);
      } catch {}
    }
    if (config.endpoint !== undefined) {
      const trimmedEndpoint = config.endpoint.trim();
      setCustomAiEndpointState(trimmedEndpoint);
      try {
        if (trimmedEndpoint) localStorage.setItem(STORAGE_KEY_CUSTOM_AI_ENDPOINT, trimmedEndpoint);
        else localStorage.removeItem(STORAGE_KEY_CUSTOM_AI_ENDPOINT);
      } catch {}
    }
    if (config.model !== undefined) {
      const trimmedModel = config.model.trim();
      setCustomAiModelState(trimmedModel);
      try {
        if (trimmedModel) localStorage.setItem(STORAGE_KEY_CUSTOM_AI_MODEL, trimmedModel);
        else localStorage.removeItem(STORAGE_KEY_CUSTOM_AI_MODEL);
      } catch {}
    }
  };

  const removeGeminiKey = () => {
    setGeminiKeyState("");
    try {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    } catch {}
  };

  const removeYoutubeKey = () => {
    setYoutubeKeyState("");
    try {
      localStorage.removeItem(STORAGE_KEY_YOUTUBE);
    } catch {}
  };

  const removeCustomAiConfig = () => {
    setCustomAiKeyState("");
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_AI_KEY);
    } catch {}
  };

  const openModal = (tab?: ApiKeyTab) => {
    if (tab) setActiveTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ApiKeysContext.Provider
      value={{
        geminiKey: mounted ? geminiKey : "",
        youtubeKey: mounted ? youtubeKey : "",
        customAiKey: mounted ? customAiKey : "",
        customAiEndpoint: mounted ? customAiEndpoint : "https://api.groq.com/openai/v1",
        customAiModel: mounted ? customAiModel : "llama-3.3-70b-versatile",
        setGeminiKey,
        setYoutubeKey,
        setCustomAiConfig,
        removeGeminiKey,
        removeYoutubeKey,
        removeCustomAiConfig,
        hasGeminiKey: mounted && Boolean(geminiKey),
        hasYoutubeKey: mounted && Boolean(youtubeKey),
        hasCustomAiKey: mounted && Boolean(customAiKey),
        isModalOpen,
        activeTab,
        openModal,
        closeModal,
        setActiveTab,
      }}
    >
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error("useApiKeys must be used within an ApiKeysProvider");
  }
  return context;
}
