"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Key,
  Sparkles,
  Play,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
  Zap,
  Cpu,
} from "lucide-react";
import { useApiKeys } from "@/context/api-keys-context";

export function ApiKeysModal() {
  const {
    isModalOpen,
    closeModal,
    activeTab,
    setActiveTab,
    geminiKey,
    youtubeKey,
    customAiKey,
    customAiEndpoint,
    customAiModel,
    setGeminiKey,
    setYoutubeKey,
    setCustomAiConfig,
    removeGeminiKey,
    removeYoutubeKey,
    removeCustomAiConfig,
    hasGeminiKey,
    hasYoutubeKey,
    hasCustomAiKey,
  } = useApiKeys();

  const [geminiInput, setGeminiInput] = useState(geminiKey);
  const [youtubeInput, setYoutubeInput] = useState(youtubeKey);
  const [customKeyInput, setCustomKeyInput] = useState(customAiKey);
  const [customEndpointInput, setCustomEndpointInput] = useState(customAiEndpoint);
  const [customModelInput, setCustomModelInput] = useState(customAiModel);

  const [showGemini, setShowGemini] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showCustomKey, setShowCustomKey] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [prevModalOpen, setPrevModalOpen] = useState(isModalOpen);

  if (isModalOpen !== prevModalOpen) {
    setPrevModalOpen(isModalOpen);
    if (isModalOpen) {
      setGeminiInput(geminiKey);
      setYoutubeInput(youtubeKey);
      setCustomKeyInput(customAiKey);
      setCustomEndpointInput(customAiEndpoint);
      setCustomModelInput(customAiModel);
      setSaveSuccessMessage(null);
    }
  }

  const applyPreset = (preset: "groq" | "openrouter" | "deepseek" | "ollama") => {
    if (preset === "groq") {
      setCustomEndpointInput("https://api.groq.com/openai/v1");
      setCustomModelInput("llama-3.3-70b-versatile");
    } else if (preset === "openrouter") {
      setCustomEndpointInput("https://openrouter.ai/api/v1");
      setCustomModelInput("meta-llama/llama-3.3-70b-instruct:free");
    } else if (preset === "deepseek") {
      setCustomEndpointInput("https://api.deepseek.com/v1");
      setCustomModelInput("deepseek-chat");
    } else if (preset === "ollama") {
      setCustomEndpointInput("http://localhost:11434/v1");
      setCustomModelInput("llama3");
    }
  };

  const handleSaveGemini = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiKey(geminiInput);
    setSaveSuccessMessage("Google Gemini Key saved successfully! Unlimited AI mode active.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleSaveCustomAi = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAiConfig({
      endpoint: customEndpointInput,
      key: customKeyInput,
      model: customModelInput,
    });
    setSaveSuccessMessage("Custom AI configuration saved! Live OpenAI-compatible mode active.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleSaveYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    setYoutubeKey(youtubeInput);
    setSaveSuccessMessage("YouTube API Key saved successfully! Live quota active.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleRemoveGemini = () => {
    removeGeminiKey();
    setGeminiInput("");
    setSaveSuccessMessage("Gemini Key removed. Switched back to guest fallback mode.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleRemoveCustomAi = () => {
    removeCustomAiConfig();
    setCustomKeyInput("");
    setSaveSuccessMessage("Custom AI Key removed. Switched back to guest fallback mode.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleRemoveYoutube = () => {
    removeYoutubeKey();
    setYoutubeInput("");
    setSaveSuccessMessage("YouTube Key removed. Switched back to guest mode.");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                    Custom API Settings (BYOK)
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Zap className="h-3 w-3" /> Unlimited
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connect your personal free keys for unlimited runs & zero rate limits
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success Banner */}
            {saveSuccessMessage && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs text-emerald-700 dark:text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-border px-6 pt-2 bg-muted/20 overflow-x-auto">
              <button
                onClick={() => setActiveTab("gemini")}
                className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "gemini"
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Google Gemini
                {hasGeminiKey && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
              </button>

              <button
                onClick={() => setActiveTab("custom-ai")}
                className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "custom-ai"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Cpu className="h-4 w-4" />
                Custom AI (Groq / OpenRouter)
                {hasCustomAiKey && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
              </button>

              <button
                onClick={() => setActiveTab("youtube")}
                className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "youtube"
                    ? "border-red-500 text-red-600 dark:text-red-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Play className="h-4 w-4 fill-red-500 text-red-500" />
                YouTube Data API
                {hasYoutubeKey && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-5">
              {activeTab === "gemini" ? (
                <form onSubmit={handleSaveGemini} className="space-y-4">
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> 100% Free · 1,500 Requests / Day
                      </span>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Get Free Key <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Powers all 22 AI scripting, title generator, and tags tools. Google gives 1,500 free requests every day with no credit card required.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-foreground">Gemini API Key</label>
                      {hasGeminiKey ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Active & Saved
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Not configured (using fallback)</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showGemini ? "text" : "password"}
                        value={geminiInput}
                        onChange={(e) => setGeminiInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 pr-10 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGemini(!showGemini)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {hasGeminiKey ? (
                      <button
                        type="button"
                        onClick={handleRemoveGemini}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Key
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!geminiInput.trim()}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        Save Gemini Key
                      </button>
                    </div>
                  </div>
                </form>
              ) : activeTab === "custom-ai" ? (
                <form onSubmit={handleSaveCustomAi} className="space-y-4">
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" /> Universal OpenAI-Compatible Engine
                      </span>
                      <span className="text-[10px] text-muted-foreground">Free Providers Supported</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Connect high-speed free providers like Groq (Llama 3.3 70B), OpenRouter (100+ free models), DeepSeek, or local Ollama.
                    </p>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-muted-foreground mr-1">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => applyPreset("groq")}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 font-medium text-amber-700 dark:text-amber-300 transition-colors"
                      >
                        ⚡ Groq (Fast Free)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("openrouter")}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-border bg-card hover:bg-accent font-medium text-foreground transition-colors"
                      >
                        🌐 OpenRouter (:free)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("deepseek")}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-border bg-card hover:bg-accent font-medium text-foreground transition-colors"
                      >
                        🐋 DeepSeek
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset("ollama")}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-border bg-card hover:bg-accent font-medium text-foreground transition-colors"
                      >
                        💻 Ollama Local
                      </button>
                    </div>
                  </div>

                  {/* Endpoint URL Input */}
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      API Endpoint / Base URL
                    </label>
                    <input
                      type="text"
                      value={customEndpointInput}
                      onChange={(e) => setCustomEndpointInput(e.target.value)}
                      placeholder="https://api.groq.com/openai/v1"
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* API Key Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-foreground">API Key</label>
                      <div className="flex items-center gap-2">
                        {customEndpointInput.includes("groq") ? (
                          <a
                            href="https://console.groq.com/keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                          >
                            Get Free Groq Key <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : customEndpointInput.includes("openrouter") ? (
                          <a
                            href="https://openrouter.ai/keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                          >
                            Get OpenRouter Key <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : customEndpointInput.includes("deepseek") ? (
                          <a
                            href="https://platform.deepseek.com/api_keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                          >
                            Get DeepSeek Key <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : null}
                        {hasCustomAiKey ? (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : customEndpointInput.includes("localhost") || customEndpointInput.includes("11434") ? (
                          <span className="text-[11px] text-muted-foreground">Optional for Ollama</span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Not configured</span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showCustomKey ? "text" : "password"}
                        value={customKeyInput}
                        onChange={(e) => setCustomKeyInput(e.target.value)}
                        placeholder={
                          customEndpointInput.includes("deepseek")
                            ? "sk-..."
                            : customEndpointInput.includes("groq")
                            ? "gsk_..."
                            : customEndpointInput.includes("openrouter")
                            ? "sk-or-..."
                            : customEndpointInput.includes("localhost") || customEndpointInput.includes("11434")
                            ? "Not required for local Ollama"
                            : "Your API key..."
                        }
                        className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 pr-10 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomKey(!showCustomKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCustomKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Model Name Input */}
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      value={customModelInput}
                      onChange={(e) => setCustomModelInput(e.target.value)}
                      placeholder="llama-3.3-70b-versatile"
                      className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {hasCustomAiKey ? (
                      <button
                        type="button"
                        onClick={handleRemoveCustomAi}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Custom Key
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-amber-700 transition-colors"
                      >
                        Save Custom Provider
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveYoutube} className="space-y-4">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <Play className="h-3.5 w-3.5 fill-red-500 text-red-500" /> 10,000 Quota Units / Day Free
                      </span>
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Google Cloud Console <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Powers deep live channel analytics, playlist inspector, and competitor analysis. Google provides 10,000 quota units free daily.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-foreground">YouTube Data API v3 Key</label>
                      {hasYoutubeKey ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Active & Saved
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Not configured (using server/scraper)</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showYoutube ? "text" : "password"}
                        value={youtubeInput}
                        onChange={(e) => setYoutubeInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 pr-10 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowYoutube(!showYoutube)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showYoutube ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {hasYoutubeKey ? (
                      <button
                        type="button"
                        onClick={handleRemoveYoutube}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Key
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!youtubeInput.trim()}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        Save YouTube Key
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Privacy Badge */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">100% Client-Side Privacy:</span> Your API keys are saved strictly in your browser&apos;s localStorage. They are transmitted directly via headers only during your requests and are <span className="font-medium text-foreground">never saved to our server database</span>.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
