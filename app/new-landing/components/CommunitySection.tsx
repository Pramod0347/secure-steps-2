"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Lock, Users } from "lucide-react";

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/LMR90Zvq4PMLvsTZZqCiGx";
const SECURE_LOGO_URL = "https://pub-1ed7e98a27564218aec0343ef05fbd57.r2.dev/secure-logo-gradient.png";

const CommunitySection = () => {
  return (
    <section className="brand-section-bg py-12 sm:py-16 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600">
            Community
          </span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 sm:mb-6 px-2">
          Join our WhatsApp community and stay in the loop.
        </h2>

        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-2">
          Get updates on universities, scholarships, student wins, and guidance
          directly inside one focused community space.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-10 sm:mb-16">
          <Link
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#25D366] text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base shadow-[0_18px_40px_-20px_rgba(37,211,102,0.9)]"
          >
            Join ur community
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </div>

        {/* Chat Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-sm sm:max-w-xl lg:max-w-3xl mx-auto"
        >
          <div className="overflow-hidden rounded-[2rem] border border-[#d7e8db] bg-[#e5ddd5] shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
            <div className="bg-[#0b141a] px-4 sm:px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white sm:h-11 sm:w-11">
                  <Image
                    src={SECURE_LOGO_URL}
                    alt="Secure Steps"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold sm:text-base">Secure Steps Community</p>
                  <p className="text-xs text-white/70 sm:text-sm">Announcements, resources and student support</p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
                  Channel
                </div>
              </div>
            </div>

            <div className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.18))] p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#0b141a]/70">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium backdrop-blur-sm">
                  <Users className="h-3.5 w-3.5 text-[#25D366]" />
                  2.1k members
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium backdrop-blur-sm">
                  <Bell className="h-3.5 w-3.5 text-[#25D366]" />
                  Daily updates
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium backdrop-blur-sm">
                  <Lock className="h-3.5 w-3.5 text-[#25D366]" />
                  Private community
                </span>
              </div>

              <div className="space-y-3">
                <div className="mx-auto w-fit rounded-full bg-[#d1f4cc] px-3 py-1 text-[11px] font-medium text-[#0b141a]/70 shadow-sm">
                  Today
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-[#111b21]">Secure Steps Community</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#3b4a54]">
                    New scholarship shortlist is live. We&apos;ve also added top in-demand
                    programmes and university updates for this intake.
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
                    10:32 AM
                    <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                  </div>
                </div>

                <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed text-[#111b21]">
                    Joined for university updates, stayed for the clarity. This is the kind of
                    student community that actually helps.
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
                    10:35 AM
                    <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[1.25rem] bg-white/85 p-1.5 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-2 rounded-[1rem] bg-white px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="truncate text-xs text-[#667781] sm:text-sm">
                    Open this link to join the WhatsApp Community
                  </p>
                  <Link
                    href={WHATSAPP_COMMUNITY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white transition-transform hover:scale-105 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    Join now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
