"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left column - visual / contact */}
          <aside className="lg:col-span-1 flex flex-col items-start gap-6">
            <div className="w-full bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-pink-500 to-violet-700 flex items-center justify-center text-white font-bold">SS</div>
                <div>
                  <h3 className="text-lg font-semibold">Secure Steps</h3>
                  <p className="text-sm text-gray-500">Student counselling & study-abroad services</p>
                </div>
              </div>

              <div className="mt-6 text-sm">
                <p className="font-medium">Contact</p>
                <p className="text-gray-600">Christ University Yeshwanthpur Campus</p>
                <p className="text-gray-600">Nagasandra, Near Tumkur Road, Bangalore – 560073</p>
                <p className="mt-2">Email: <a className="text-violet-700 underline" href="mailto:info@securesteps.co.in">info@securesteps.co.in</a></p>
                <p>Phone: <a href="tel:+917093568336" className="text-violet-700 underline">+91 70935 68336</a></p>
              </div>

              <div className="mt-6">
                <Link href="/contact">
                  <a className="inline-block px-4 py-2 rounded-full bg-black text-white text-sm shadow-md hover:opacity-95">Get in touch</a>
                </Link>
              </div>
            </div>

            <nav className="w-full sticky top-28 hidden md:block">
              <div className="bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-500">On this page</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><a href="#scope" className="block text-violet-700 hover:underline">Scope</a></li>
                  <li><a href="#data" className="block text-violet-700 hover:underline">Personal Data</a></li>
                  <li><a href="#collection" className="block text-violet-700 hover:underline">Collection</a></li>
                  <li><a href="#purposes" className="block text-violet-700 hover:underline">Purposes</a></li>
                  <li><a href="#sharing" className="block text-violet-700 hover:underline">Sharing</a></li>
                  <li><a href="#rights" className="block text-violet-700 hover:underline">Your Rights</a></li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Right column - policy content */}
          <article className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <header className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight">Secure Steps — Privacy Policy</h1>
              <p className="mt-2 text-sm text-gray-500">Last updated: <strong>November 2025</strong></p>
              <div className="mt-4 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-50 to-violet-50 border border-gray-100">
                <p className="text-sm">We respect your privacy. This page explains how we collect, use and protect personal information when you visit <span className="font-medium">securesteps.co.in</span> or use our services.</p>
              </div>
            </header>

            <section id="scope" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">1. Scope of the Policy</h2>
              <p className="text-sm text-gray-700">This Policy applies to users of our website, students and applicants who access counselling, document support, payment, communication channels, and offline interactions with Secure Steps.</p>
            </section>

            <section id="data" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">2. Categories of Personal Data Collected</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Identity Data</p>
                  <p>Name, gender, date of birth.</p>

                  <p className="mt-3 font-medium">Contact Data</p>
                  <p>Email, phone, WhatsApp number, city, country.</p>

                  <p className="mt-3 font-medium">Academic Data</p>
                  <p>Transcripts, marksheets, test scores (IELTS, TOEFL, GRE, GMAT, SAT), resumes, SOP/LOR drafts.</p>
                </div>

                <div>
                  <p className="font-medium">Government ID Data</p>
                  <p>Passports or national IDs uploaded for visa/admission requirements.</p>

                  <p className="mt-3 font-medium">Payment Data</p>
                  <p>Transaction IDs, UPI references and gateway logs (card numbers are not stored).</p>

                  <p className="mt-3 font-medium">Technical & Behavioural Data</p>
                  <p>IP address, cookies, device identifiers, clicks, session logs and heatmaps.</p>
                </div>
              </div>
            </section>

            <section id="collection" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">3. How Information Is Collected</h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Website forms and enquiries</li>
                <li>WhatsApp, phone and email communications</li>
                <li>Uploaded documents and application files</li>
                <li>Payment gateway interactions</li>
                <li>Analytics, cookies and tracking pixels (Google, Meta, Microsoft Clarity)</li>
              </ul>
            </section>

            <section id="purposes" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">4. Purposes of Processing</h2>
              <p className="text-sm text-gray-700">We use personal data to provide and improve our services, including:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Counselling, evaluations and university shortlisting</li>
                <li>Document review (SOPs, LORs) and application assistance</li>
                <li>Visa guidance and appointment scheduling</li>
                <li>Customer support, fraud prevention and internal audits</li>
                <li>Analytics and consent-based marketing communications</li>
              </ul>
            </section>

            <section id="legal" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">5. Legal Basis for Processing</h2>
              <p className="text-sm text-gray-700">We rely on explicit consent, contractual necessity, legitimate interests, legal compliance, and fraud prevention as lawful bases for processing personal data.</p>
            </section>

            <section id="sharing" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">6. Sharing of Personal Information</h2>
              <p className="text-sm text-gray-700">We never sell personal data. We may share information with:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Partner universities (only after your instruction)</li>
                <li>Payment processors (e.g. Razorpay)</li>
                <li>CRM and support platforms</li>
                <li>Analytics providers (Google, Meta, Microsoft Clarity)</li>
                <li>Third-party reviewers/editors authorised by you</li>
                <li>Legal and government authorities when required by law</li>
              </ul>
            </section>

            <section id="cross" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">7. Cross‑Border Data Transfers</h2>
              <p className="text-sm text-gray-700">Information may be transferred to countries where universities, service providers, or servers are located. We apply appropriate safeguards to protect such transfers.</p>
            </section>

            <section id="security" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">8. Data Security</h2>
              <p className="text-sm text-gray-700">We implement technical and organisational measures including SSL, restricted document access, encrypted payment gateways, firewalls, and employee confidentiality protocols. However, no online system is entirely risk-free.</p>
            </section>

            <section id="retention" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">9. Data Retention</h2>
              <p className="text-sm text-gray-700">We retain data for the duration of active services, up to two years after completion, and longer when legally required. You can request deletion where permitted by law.</p>
            </section>

            <section id="rights" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">10. Your Rights</h2>
              <p className="text-sm text-gray-700">You may request access, correction, deletion, withdrawal of consent, or a summary of how your data is used. Contact: <a href="mailto:info@securesteps.co.in" className="text-violet-700 underline">info@securesteps.co.in</a>.</p>
            </section>

            <section id="ndnc" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">11. NDNC Consent</h2>
              <p className="text-sm text-gray-700">By providing your phone number you consent to WhatsApp/phone communication even if registered on DND/NDNC, as permitted under TRAI rules for user-initiated service engagement.</p>
            </section>

            <section id="updates" className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">12. Policy Amendments</h2>
              <p className="text-sm text-gray-700">We may update this policy periodically. Continued use of our services implies acceptance of changes.</p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-xl font-semibold">13. Contact</h2>
              <div className="text-sm text-gray-700">
                <p>Secure Steps</p>
                <p>Christ University Yeshwanthpur Campus, Nagasandra, Near Tumkur Road, Bangalore – 560073</p>
                <p className="mt-2">Email: <a href="mailto:info@securesteps.co.in" className="text-violet-700 underline">info@securesteps.co.in</a></p>
                <p>Phone: <a href="tel:+917093568336" className="text-violet-700 underline">+91 70935 68336</a></p>
              </div>
            </section>

          </article>
        </div>
      </section>
    </main>
  );
}
