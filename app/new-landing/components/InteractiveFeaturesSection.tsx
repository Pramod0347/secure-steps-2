"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Send, FileText, Download } from "lucide-react";

const InteractiveFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("environment");

  const tabs = [
    { id: "environment", label: "Environment" },
    { id: "curriculum", label: "Curriculum" },
    { id: "tutorials", label: "Tutorials" },
    { id: "projects", label: "Projects" },
  ];

  const tabContent = {
    environment: {
      title: "Interactive Coding Environment",
      description:
        "Practice coding directly in your browser with our real-time coding platform, featuring instant feedback and guided exercises that enhance your learning experience and help you improve faster.",
      content: (
        <div className="space-y-4">
          {/* File Tabs */}
          <div className="flex gap-2">
            <div className="px-6 py-3 bg-white/85 backdrop-blur-sm rounded-xl text-gray-900 text-sm font-medium border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              main.py
            </div>
            <div className="px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl text-gray-600 text-sm font-medium border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              index.js
            </div>
            <div className="px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl text-gray-500 text-sm font-medium border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] flex items-center justify-center">
              <Play className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] font-mono text-sm">
            <div className="space-y-1">
              <div>
                <span className="text-purple-400">import</span>{" "}
                <span className="text-fuchsia-500">random</span>
              </div>
              <div className="h-2" />
              <div>
                <span className="text-gray-900">num</span>{" "}
                <span className="text-pink-400">=</span>{" "}
                <span className="text-fuchsia-500">random</span>
                <span className="text-gray-900">.</span>
                <span className="text-yellow-400">randint</span>
                <span className="text-gray-900">(</span>
                <span className="text-orange-400">1</span>
                <span className="text-gray-900">,</span>{" "}
                <span className="text-orange-400">100</span>
                <span className="text-gray-900">)</span>
              </div>
              <div>
                <span className="text-yellow-400">print</span>
                <span className="text-gray-900">(</span>
                <span className="text-orange-500">f&quot;Your lucky number is: </span>
                <span className="text-sky-500">{"{"}num{"}"}</span>
                <span className="text-orange-500">&quot;</span>
                <span className="text-gray-900">)</span>
              </div>
              <div className="h-2" />
              <div className="text-gray-400">&gt;</div>
            </div>
          </div>
        </div>
      ),
    },
    curriculum: {
      title: "Comprehensive Curriculum",
      description:
        "Master essential programming skills through a structured curriculum covering languages like Python, JavaScript, and more, designed for beginners and advanced learners alike.",
      content: (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.95)] overflow-hidden relative h-[280px]">
          {/* Top fade gradient */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/95 to-transparent z-10 pointer-events-none" />
          {/* Bottom fade gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/95 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div className="animate-scroll-vertical space-y-3">
            {/* Java */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-lg">
                  ☕
                </div>
                <span className="text-gray-800 text-sm font-medium">Java</span>
              </div>
              <span className="text-gray-500 text-sm">12 Weeks</span>
            </div>

            {/* Python */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">
                  🐍
                </div>
                <span className="text-gray-800 text-sm font-medium">Python</span>
              </div>
              <span className="text-gray-500 text-sm">4 Weeks</span>
            </div>

            {/* C++ */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xs">C++</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">C++</span>
              </div>
              <span className="text-gray-500 text-sm">24 Weeks</span>
            </div>

            {/* C# */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-xs">C#</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">C#</span>
              </div>
              <span className="text-gray-500 text-sm">18 Weeks</span>
            </div>

            {/* Rust */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-lg">
                  🦀
                </div>
                <span className="text-gray-800 text-sm font-medium">Rust</span>
              </div>
              <span className="text-gray-500 text-sm">8 Weeks</span>
            </div>

            {/* JavaScript */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-xs">JS</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">JavaScript</span>
              </div>
              <span className="text-gray-500 text-sm">6 Weeks</span>
            </div>

            {/* TypeScript */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xs">TS</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">TypeScript</span>
              </div>
              <span className="text-gray-500 text-sm">5 Weeks</span>
            </div>

            {/* Go */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-xs">Go</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">Go</span>
              </div>
              <span className="text-gray-500 text-sm">10 Weeks</span>
            </div>

            {/* Duplicate items for seamless loop */}
            {/* Java */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-lg">
                  ☕
                </div>
                <span className="text-gray-800 text-sm font-medium">Java</span>
              </div>
              <span className="text-gray-500 text-sm">12 Weeks</span>
            </div>

            {/* Python */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">
                  🐍
                </div>
                <span className="text-gray-800 text-sm font-medium">Python</span>
              </div>
              <span className="text-gray-500 text-sm">4 Weeks</span>
            </div>

            {/* C++ */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xs">C++</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">C++</span>
              </div>
              <span className="text-gray-500 text-sm">24 Weeks</span>
            </div>

            {/* C# */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-xs">C#</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">C#</span>
              </div>
              <span className="text-gray-500 text-sm">18 Weeks</span>
            </div>
          </div>
        </div>
      ),
    },
    tutorials: {
      title: "Expert-Led Tutorials boards",
      description:
        "Learn from industry professionals with step-by-step video tutorials and live Q&A sessions, ensuring you gain practical insights and personalized guidance.",
      content: (
        <div className="space-y-4">
          {/* Video Player */}
          <div className="bg-white/75 backdrop-blur-xl rounded-2xl aspect-[4/3] border border-gray-200 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-gray-500/80 transition-colors cursor-pointer">
              <Play className="w-7 h-7 text-gray-700 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Chat Input - White Background */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="text-gray-500 text-xs mb-2 font-medium">Chat</div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="|"
                className="flex-1 bg-transparent text-gray-900 text-sm outline-none placeholder-gray-400"
                readOnly
              />
              <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Send className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    projects: {
      title: "Project-Based Learning",
      description:
        "Build a portfolio of real-world projects, from simple scripts to full-fledged applications, to showcase your skills and prepare for a career in tech.",
      content: (
        <div className="space-y-4">
          {/* File Drop Zone */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-300 border-dashed shadow-[0_16px_40px_-28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col items-center justify-center min-h-[180px]">
            <FileText className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-700 text-sm mb-1">Drag or drop your files here.</p>
            <p className="text-gray-500 text-xs">Supported formats: .zip, .rar, .docx</p>
          </div>

          {/* Upload Button */}
          <button className="w-full py-4 bg-white/85 backdrop-blur-xl rounded-2xl border border-gray-200 text-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center justify-center gap-2 hover:bg-white transition-colors">
            <Download className="w-5 h-5" />
            <span className="font-medium">Upload Homework</span>
          </button>
        </div>
      ),
    },
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs - only redesigned */}
        <div className="relative z-10 -mb-px flex gap-1 sm:gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 relative rounded-t-3xl border border-gray-200 border-b-0 px-4 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-medium backdrop-blur-lg transition-all duration-300 ${
                index === 0 ? "ml-0" : ""
              } ${
                activeTab === tab.id
                  ? "bg-gradient-to-b from-white via-white to-slate-100 text-gray-900 shadow-[0_20px_42px_-28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-8px_16px_rgba(148,163,184,0.18)]"
                  : "bg-white/65 text-gray-500 hover:text-gray-700 hover:bg-white/80"
              }`}
            >
              {activeTab === tab.id && (
                <>
                  <span className="absolute inset-x-2 top-2 h-[calc(100%-0.75rem)] rounded-2xl bg-gradient-to-b from-white/95 via-white/85 to-white/60" />
                  <span className="absolute left-3 right-3 top-2 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/90 to-transparent" />
                </>
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area - unchanged */}
        <div className="relative -mt-px">
          <div className="relative overflow-hidden rounded-b-3xl sm:rounded-b-[2.5rem] bg-gradient-to-br from-white/95 via-slate-50 to-gray-100 border border-gray-200 border-t-0 p-6 sm:p-10 lg:p-16 min-h-[500px] sm:min-h-[600px] shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.95),transparent_40%),radial-gradient(circle_at_100%_20%,rgba(186,230,253,0.35),transparent_45%)]" />
            <div className="absolute inset-4 sm:inset-6 rounded-2xl sm:rounded-3xl border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full"
              >
                <div className="order-2 lg:order-1">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    {currentContent.title}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    {currentContent.description}
                  </p>
                </div>

                <div className="order-1 lg:order-2">{currentContent.content}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeaturesSection;
