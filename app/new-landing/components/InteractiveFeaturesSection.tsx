"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, FileText, Upload } from "lucide-react";

const InteractiveFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("icebreaker");
  const [activeSubTab, setActiveSubTab] = useState("strength");

  const tabs = [
    { id: "icebreaker", label: "Ice Breaker" },
    { id: "prism", label: "Prism Test" },
    { id: "guidance", label: "Guidance" },
    { id: "applications", label: "Applications" },
  ];

  const subTabs = [
    { id: "strength", label: "Strength Profile" },
    { id: "recommended", label: "Recommended Fields" },
  ];

  // Strength Profile content for sub-tab
  const StrengthProfileContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-sm rounded-xl px-5 py-3 border border-gray-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Brain className="w-4 h-4 text-indigo-500" />
          <span>Your Personality Assessment Results</span>
        </div>
      </div>

      {/* Strength Tags */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.95)]">
        <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider font-medium">Core Strengths</p>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            Analytical
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Strategic
          </span>
          <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
            Curious
          </span>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider font-medium">Thinking Style</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Logical Reasoning</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Problem Solving</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Creative Thinking</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Recommended Fields content for sub-tab
  const RecommendedFieldsContent = () => (
    <div className="space-y-3">
      {/* Data Science */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-white backdrop-blur-sm border border-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
            📊
          </div>
          <div>
            <span className="text-gray-800 text-sm font-semibold block">Data Science</span>
            <span className="text-indigo-600 text-xs">98% Match</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border-[3px] border-indigo-500 flex items-center justify-center">
          <span className="text-indigo-600 text-xs font-bold">98%</span>
        </div>
      </div>

      {/* Business Analytics */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-white backdrop-blur-sm border border-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">
            📈
          </div>
          <div>
            <span className="text-gray-800 text-sm font-semibold block">Business Analytics</span>
            <span className="text-purple-600 text-xs">94% Match</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border-[3px] border-purple-500 flex items-center justify-center">
          <span className="text-purple-600 text-xs font-bold">94%</span>
        </div>
      </div>

      {/* Technology Management */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-50 to-white backdrop-blur-sm border border-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-xl">
            💻
          </div>
          <div>
            <span className="text-gray-800 text-sm font-semibold block">Technology Management</span>
            <span className="text-cyan-600 text-xs">91% Match</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border-[3px] border-cyan-500 flex items-center justify-center">
          <span className="text-cyan-600 text-xs font-bold">91%</span>
        </div>
      </div>
    </div>
  );

  const tabContent = {
    icebreaker: {
      title: "Interactive Findings",
      description:
        "Our first approach helps you gain a clear understanding of where your interests truly lie, allowing you to make the most of your natural preferences and strengths.",
      content: (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-2">
            {subTabs.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSubTab === subTab.id
                    ? "bg-white text-gray-900 shadow-md border border-gray-200"
                    : "bg-white/50 text-gray-500 hover:bg-white/80 hover:text-gray-700"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubTab === "strength" ? <StrengthProfileContent /> : <RecommendedFieldsContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      ),
    },
    prism: {
      title: "Which colour are you?",
      description:
        "Discover, validate your interests on a much deeper level, unlocking your true potential and creating positive impact on your career and personality.",
      content: (
        <div className="space-y-3">
          {/* Red - The Director */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-white backdrop-blur-sm border border-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-red-700 font-semibold text-sm block">Red – The Director</span>
              <span className="text-gray-500 text-xs">Decisive, competitive, goal-oriented</span>
            </div>
          </div>

          {/* Blue - The Analyst */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-white backdrop-blur-sm border border-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-blue-700 font-semibold text-sm block">Blue – The Analyst</span>
              <span className="text-gray-500 text-xs">Precise, systematic, data-driven</span>
            </div>
          </div>

          {/* Yellow - The Visionary */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-50 to-white backdrop-blur-sm border border-yellow-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-yellow-700 font-semibold text-sm block">Yellow – The Visionary</span>
              <span className="text-gray-500 text-xs">Creative, enthusiastic, innovative</span>
            </div>
          </div>

          {/* Green - The Supporter */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-white backdrop-blur-sm border border-green-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-green-700 font-semibold text-sm block">Green – The Supporter</span>
              <span className="text-gray-500 text-xs">Empathetic, patient, collaborative</span>
            </div>
          </div>
        </div>
      ),
    },
    guidance: {
      title: "Industry led Insights",
      description:
        "Gain clarity on where you truly belong. Our industry experts carefully analyse your assessment reports, providing actionable insights that help you align your strengths with the right career path and prepare you to take off to your next step with confidence.",
      content: (
        <div className="space-y-4">
          {/* Guidance Items */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.95)]">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider font-medium">Decide your future</p>
            <div className="space-y-3">
              {[
                { label: "Work Environment", icon: "🏢", gradient: "from-indigo-50", border: "border-indigo-100", bg: "bg-indigo-500/20" },
                { label: "Problem Solving", icon: "🧩", gradient: "from-purple-50", border: "border-purple-100", bg: "bg-purple-500/20" },
                { label: "Research Driven", icon: "🔬", gradient: "from-cyan-50", border: "border-cyan-100", bg: "bg-cyan-500/20" },
                { label: "Collaborative Teams", icon: "🤝", gradient: "from-emerald-50", border: "border-emerald-100", bg: "bg-emerald-500/20" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r ${item.gradient} to-white border ${item.border} hover:shadow-md transition-all duration-200 cursor-default`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-xl`}>
                    {item.icon}
                  </div>
                  <span className="text-gray-800 text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    applications: {
      title: "Final representing documents",
      description:
        "We build a portfolio of your real world projects, from small club activities to leadership position experiences to showcase your skills and secure admit at your dream university.",
      content: (
        <div className="space-y-4">
          {/* Drag & Drop Upload Area */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-dashed border-gray-300 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Drag or drop your files here.</p>
            <p className="text-gray-400 text-xs">Supported formats: .zip, .rar, .docx</p>
          </div>

          {/* Upload Homework Button */}
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md text-gray-700 text-sm font-medium transition-all duration-200 hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Upload Homework
          </button>

          {/* Doc types info */}
          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs">
              Drag or drop your docs here to get started
            </p>
            <p className="text-gray-400 text-xs mt-1">
              All Your Academics, Financials, Scorecards, SOP, LOR
            </p>
          </div>

          {/* View Templates Link */}
          <div className="text-center">
            <button className="text-gray-800 text-sm font-medium hover:text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 transition-colors">
              View free portfolio Templates
            </button>
          </div>
        </div>
      ),
    },
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="pb-12 sm:pb-16 lg:pb-24 pt-4 sm:pt-6 lg:pt-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
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

        {/* Content Area */}
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
