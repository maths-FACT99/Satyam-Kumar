import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  BookOpen,
  HelpCircle,
  Minimize2,
  Maximize2,
  Trash2,
  Phone,
  Calendar,
  CheckCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  MapPin,
  ExternalLink,
  BrainCircuit,
  Zap,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  mode?: string;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDemo: () => void;
  defaultPrompt?: string;
  studentClass?: string;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({
  isOpen,
  onClose,
  onBookDemo,
  defaultPrompt,
  studentClass,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Namaste! I am **Maths Expert AI**, your 24x7 intelligent Mathematics & Science Mentor at **Maths Fact** (mentored by master educator Satyam Sir).\n\nI combine deep mathematical reasoning with intuitive conceptual coaching so you never have to fear math again!\n\n✨ **What would you like to master today?**\n- 🎯 **Step-by-step problem solver** (Algebra, Geometry, Trigonometry, Calculus)\n- 💡 **Visual concept breakdown** (Why theorems and formulas work)\n- ⚡ **Topper speed tricks & MCQ shortcuts**\n- 📍 **Maths Fact Center details & Google Maps location**\n- 🎟️ **1-Week Free Demo Class registration** (Class 3 to 12 CBSE & ICSE)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(studentClass || 'Class X');
  const [selectedMode, setSelectedMode] = useState<'step_by_step' | 'intuition' | 'exam_trick' | 'practice' | 'center'>('step_by_step');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showMathSymbols, setShowMathSymbols] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mathSymbols = ['x²', 'x³', '√', 'π', 'θ', '±', '≤', '≥', '≠', '∫', 'Δ', 'α', 'β', '÷', '×', '°', '∞'];

  const modeOptions = [
    { id: 'step_by_step', label: 'Step-by-Step Solver', icon: BrainCircuit, color: 'text-amber-400' },
    { id: 'intuition', label: 'Conceptual Intuition', icon: Lightbulb, color: 'text-emerald-400' },
    { id: 'exam_trick', label: 'Topper Shortcuts', icon: Zap, color: 'text-cyan-400' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'text-violet-400' },
    { id: 'center', label: 'Google Maps & Demo', icon: MapPin, color: 'text-red-400' },
  ] as const;

  const quickPrompts = [
    { label: '📍 Google Maps Location', prompt: 'Where is Maths Fact located and how do I open it on Google Maps?' },
    { label: '📐 Pythagoras Theorem', prompt: 'Please explain Pythagoras theorem with practical intuition and Maths Expert tricks.' },
    { label: '🔢 Solve 2x² + 5x - 3 = 0', prompt: 'How do I solve 2x² + 5x - 3 = 0 step-by-step using both quadratic formula and factoring?' },
    { label: '📊 Trigonometry Hand Trick', prompt: 'Teach me the finger trick to memorize sin, cos, tan for standard angles 0°, 30°, 45°, 60°, 90°.' },
    { label: '🎯 1-Week Free Demo', prompt: 'Tell me about the 1-Week Free Demo Class at Maths Fact and how to join.' },
    { label: '🏆 Class 10 Board 100/100', prompt: 'What is the Maths Expert strategy to score 100/100 in Class 10 Board Mathematics?' },
  ];

  useEffect(() => {
    if (defaultPrompt && isOpen) {
      handleSend(defaultPrompt);
    }
  }, [defaultPrompt, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await api.sendAiChat(text, history, selectedClass, selectedMode);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I am currently analyzing this concept. For direct assistance, call or WhatsApp Satyam Sir directly at **7004995470** / **8294112559** or find our center on [Google Maps](https://share.google/C3HdMlXd1OStDMGqf)!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Chat session refreshed! What concept, formula, or problem should we solve together now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown asterisks and hash tags for clean audio narration
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\$/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const insertSymbol = (sym: string) => {
    setInput((prev) => prev + sym);
    inputRef.current?.focus();
  };

  return (
    <div
      id="ai-chat-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl h-[92vh] max-h-[780px] rounded-3xl bg-[#0B0E17] border border-red-900/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#121626] via-[#171C30] to-[#0D101C] border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Realistic Satyam Sir Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-red-500 shadow-md shadow-red-950/60 bg-black">
                <img
                  src="/satyam_sir_real.jpg"
                  alt="Satyam Sir Real Photo"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/satyam_sir.jpg';
                  }}
                />
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0B0E17] shadow-sm shadow-emerald-500/50 animate-pulse"
                title="AI Mentor Online"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-1.5">
                  <span>Maths Expert</span>
                  <span className="text-amber-400">AI</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-900/60 to-amber-900/60 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Gemini 3.8 Intelligence
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span>Mentored by Satyam Sir</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-medium">Concept-Based Coaching</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Google Maps link button */}
            <a
              href="https://share.google/C3HdMlXd1OStDMGqf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all shadow-sm"
              title="Find Maths Fact on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5 text-blue-400/70" />
            </a>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title="Close Tutor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade & Mode Selector Sub-bar */}
        <div className="px-4 py-2 bg-[#080A10] border-b border-zinc-800/80 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          {/* Grade selection */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-zinc-400">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#121624] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 focus:outline-none focus:border-red-500 font-medium"
            >
              <option value="Class III">Class III</option>
              <option value="Class IV">Class IV</option>
              <option value="Class V">Class V</option>
              <option value="Class VI">Class VI</option>
              <option value="Class VII">Class VII</option>
              <option value="Class VIII">Class VIII</option>
              <option value="Class IX">Class IX</option>
              <option value="Class X">Class X (CBSE / ICSE)</option>
              <option value="Class XI">Class XI (Sci / Comm)</option>
              <option value="Class XII">Class XII (Board Exam)</option>
            </select>
          </div>

          {/* Mode pills */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
            {modeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedMode(opt.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-950/60 border border-red-500'
                      : 'bg-[#121624] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : opt.color}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              onClose();
              onBookDemo();
            }}
            className="shrink-0 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600/30 to-amber-600/30 hover:from-red-600/40 hover:to-amber-600/40 text-amber-200 border border-red-500/40 font-bold text-[11px] transition-all"
          >
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>1-Week Free Demo</span>
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-2xl overflow-hidden border border-red-500/80 shrink-0 bg-black mt-1 shadow-md">
                  <img
                    src="/satyam_sir_real.jpg"
                    alt="Satyam Sir"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/satyam_sir.jpg';
                    }}
                  />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 shadow-xl text-xs sm:text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white rounded-tr-sm ml-auto border border-red-500/40'
                    : 'bg-[#111522] text-zinc-200 border border-zinc-800 rounded-tl-sm shadow-black/40'
                }`}
              >
                {/* Message Header for AI */}
                {msg.role === 'model' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-400">Maths Expert AI</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Concept Explanation</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Audio Voice Listen Button */}
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className={`p-1 rounded-md text-[10px] flex items-center gap-1 transition-colors ${
                          speakingId === msg.id
                            ? 'bg-amber-500 text-black font-bold'
                            : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        title={speakingId === msg.id ? 'Stop listening' : 'Listen to explanation'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Copy solution"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Render formatted message content */}
                <div className="whitespace-pre-wrap font-sans space-y-2.5 text-zinc-200">
                  {msg.content}
                </div>

                {/* Message Footer */}
                <div
                  className={`text-[10px] mt-3 flex items-center gap-2 ${
                    msg.role === 'user' ? 'text-red-200 justify-end' : 'text-zinc-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.role === 'model' && (
                    <>
                      <span>•</span>
                      <span className="text-amber-400/80 font-medium">Concept-First Pedagogy</span>
                    </>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1 text-zinc-300 shadow-sm">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl overflow-hidden border border-red-500 shrink-0 bg-black mt-1">
                <img
                  src="/satyam_sir_real.jpg"
                  alt="Satyam Sir"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-2xl rounded-tl-sm p-4 bg-[#111522] border border-red-900/40 text-xs text-zinc-300 flex items-center gap-3 shadow-xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-semibold text-zinc-200">
                  Maths Expert is breaking down the solution step-by-step...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Math Symbol Toolbar Drawer */}
        {showMathSymbols && (
          <div className="px-4 py-2 bg-[#090C14] border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none animate-in fade-in">
            <span className="text-[10px] font-semibold text-zinc-500 mr-1">Insert:</span>
            {mathSymbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => insertSymbol(sym)}
                className="px-2 py-1 rounded bg-[#141926] hover:bg-zinc-800 border border-zinc-700/80 text-amber-300 text-xs font-mono font-bold transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Quick Suggestion Prompts Bar */}
        <div className="px-3 sm:px-4 py-2 bg-[#07090F] border-t border-zinc-800/80 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-none">
          <span className="text-[10px] font-bold text-zinc-500 shrink-0 uppercase tracking-wider">Quick:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={loading}
              className="shrink-0 px-3 py-1 rounded-full bg-[#121624] hover:bg-zinc-800 border border-zinc-700/80 hover:border-red-500/60 text-zinc-300 hover:text-white text-xs transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#0E121B] border-t border-zinc-800 flex items-center gap-2 shrink-0"
        >
          {/* Toggle math symbols */}
          <button
            type="button"
            onClick={() => setShowMathSymbols(!showMathSymbols)}
            className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              showMathSymbols
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-[#141824] border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Math Symbols Toolbar"
          >
            ∑/π
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Maths Expert any problem, theorem, or question (${selectedClass})...`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-[#07090F] border border-zinc-700 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500/40 transition-all disabled:opacity-40 shrink-0 flex items-center gap-1 font-bold text-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
