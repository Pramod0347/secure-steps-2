"use client";

import React from "react";
import { Shield, Mail, Phone, Lock, Database, Eye, Globe, Clock, UserCheck, Bell, FileText, MapPin } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 pt-28 md:pt-36 pb-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#DA202E] to-[#3B367D] mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We respect your privacy. This page explains how we collect, use, and protect your personal information when you use our services.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <span>Last updated:</span>
            <span className="font-semibold text-gray-700">November 2025</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10 space-y-8">

            <Section icon={<Eye className="w-5 h-5" />} number="1" title="Scope of the Policy">
              <p>
                This Policy applies to users of our website, students and applicants accessing counselling, document support, payment, communication channels and offline interactions.
              </p>
            </Section>

            <Section icon={<Database className="w-5 h-5" />} number="2" title="Categories of Personal Data Collected">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <DataCategory title="Identity Data" items={["Name", "Gender", "Date of birth"]} color="blue" />
                <DataCategory title="Contact Data" items={["Email", "Phone", "WhatsApp", "City", "Country"]} color="green" />
                <DataCategory title="Academic Data" items={["Transcripts", "Certificates", "Test scores", "SOP/LOR files"]} color="purple" />
                <DataCategory title="Government ID" items={["Passport", "National ID"]} color="amber" />
                <DataCategory title="Payment Data" items={["Transaction IDs", "UPI references"]} color="pink" />
                <DataCategory title="Technical Data" items={["IP address", "Cookies", "Device info"]} color="gray" />
              </div>
            </Section>

            <Section icon={<FileText className="w-5 h-5" />} number="3" title="How Information Is Collected">
              <div className="space-y-2 mt-2">
                <CollectionMethod icon="📝">Website forms and enquiries</CollectionMethod>
                <CollectionMethod icon="💬">WhatsApp, phone and email communication</CollectionMethod>
                <CollectionMethod icon="📄">Uploaded documents and application files</CollectionMethod>
                <CollectionMethod icon="💳">Payment gateway interactions</CollectionMethod>
                <CollectionMethod icon="📊">Analytics and tracking pixels (Google, Meta, Microsoft Clarity)</CollectionMethod>
              </div>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} number="4" title="Purposes of Processing">
              <p className="mb-3">Personal data is used to provide and improve services, including:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <PurposeItem>Counselling and university shortlisting</PurposeItem>
                <PurposeItem>Document review and application assistance</PurposeItem>
                <PurposeItem>Visa process and appointment support</PurposeItem>
                <PurposeItem>Fraud prevention and internal audits</PurposeItem>
                <PurposeItem>Customer support services</PurposeItem>
                <PurposeItem>Analytics and consent-based communication</PurposeItem>
              </div>
            </Section>

            <Section icon={<Lock className="w-5 h-5" />} number="5" title="Legal Basis for Processing">
              <p className="mb-3">We rely on the following lawful bases for processing personal data:</p>
              <div className="flex flex-wrap gap-2">
                <LegalBadge>Explicit Consent</LegalBadge>
                <LegalBadge>Contractual Necessity</LegalBadge>
                <LegalBadge>Legitimate Interests</LegalBadge>
                <LegalBadge>Legal Compliance</LegalBadge>
                <LegalBadge>Fraud Prevention</LegalBadge>
              </div>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} number="6" title="Sharing of Personal Information">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-green-800 text-sm font-medium">
                  ✓ We never sell your personal data
                </p>
              </div>
              <p className="mb-3">We may share information with:</p>
              <div className="space-y-2">
                <SharingItem title="Partner Universities" desc="Only after your instruction" />
                <SharingItem title="Payment Processors" desc="e.g., Razorpay" />
                <SharingItem title="CRM & Support Platforms" desc="For service delivery" />
                <SharingItem title="Analytics Providers" desc="Google, Meta, Microsoft Clarity" />
                <SharingItem title="Third-party Reviewers" desc="Authorised editors" />
                <SharingItem title="Legal Authorities" desc="When required by law" />
              </div>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} number="7" title="Cross-Border Data Transfers">
              <p>
                Information may be transferred to countries where universities, service providers or servers are located. Appropriate safeguards are applied in accordance with applicable data protection laws.
              </p>
            </Section>

            <Section icon={<Lock className="w-5 h-5" />} number="8" title="Data Security">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                <SecurityFeature icon="🔒">SSL Encryption</SecurityFeature>
                <SecurityFeature icon="🛡️">Access Control</SecurityFeature>
                <SecurityFeature icon="🔥">Firewalls</SecurityFeature>
                <SecurityFeature icon="📋">Confidentiality Protocols</SecurityFeature>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                However, no online system is entirely risk-free.
              </p>
            </Section>

            <Section icon={<Clock className="w-5 h-5" />} number="9" title="Data Retention">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Data is retained during active services and up to <strong>two years afterward</strong>, or longer when legally required. You may request deletion where permitted by law.
                </p>
              </div>
            </Section>

            <Section icon={<UserCheck className="w-5 h-5" />} number="10" title="Your Rights">
              <p className="mb-3">You have the right to:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <RightItem>Access your data</RightItem>
                <RightItem>Request correction</RightItem>
                <RightItem>Request deletion</RightItem>
                <RightItem>Withdraw consent</RightItem>
                <RightItem>Get usage summary</RightItem>
                <RightItem>Data portability</RightItem>
              </div>
            </Section>

            <Section icon={<Bell className="w-5 h-5" />} number="11" title="NDNC Consent">
              <p>
                By providing your phone number you consent to WhatsApp/phone communication even if registered on DND/NDNC, as permitted under TRAI rules for user-initiated service interaction.
              </p>
            </Section>

            <Section icon={<FileText className="w-5 h-5" />} number="12" title="Policy Amendments">
              <p>
                This policy may be updated periodically. Continued use of services implies acceptance of updates. We will notify you of significant changes via email or website notice.
              </p>
            </Section>

            {/* Contact Section */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#DA202E] to-[#3B367D] text-white flex items-center justify-center text-sm font-bold">13</span>
                Contact Us
              </h3>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 mb-1">Secure Steps</p>
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Christ University Yeshwanthpur Campus, Nagasandra, Near Tumkur Road, Bangalore – 560073
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="mailto:info@securesteps.co.in" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-violet-700">info@securesteps.co.in</p>
                  </div>
                </a>
                <a href="tel:+917093568336" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-violet-700">+91 70935 68336</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your privacy matters to us. If you have any questions, please don&apos;t hesitate to contact us.</p>
        </div>
      </div>
    </main>
  );
}

// Reusable Section Component
function Section({ icon, number, title, children }: { icon: React.ReactNode; number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#DA202E] to-[#3B367D] text-white flex items-center justify-center text-sm font-bold">{number}</span>
        <span className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          {title}
        </span>
      </h2>
      <div className="pl-11 text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

// Data Category Component
function DataCategory({ title, items, color }: { title: string; items: string[]; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    pink: "bg-pink-50 border-pink-200 text-pink-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };
  
  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <p className="font-medium text-sm mb-1">{title}</p>
      <p className="text-xs opacity-80">{items.join(" • ")}</p>
    </div>
  );
}

// Collection Method Component
function CollectionMethod({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  );
}

// Purpose Item Component
function PurposeItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-violet-50 rounded-lg text-violet-700 text-sm">
      <span className="text-violet-500">✓</span>
      {children}
    </div>
  );
}

// Legal Badge Component
function LegalBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
      {children}
    </span>
  );
}

// Sharing Item Component
function SharingItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-sm text-gray-800">{title}</span>
      <span className="text-xs text-gray-500">{desc}</span>
    </div>
  );
}

// Security Feature Component
function SecurityFeature({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-lg text-center">
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-green-700 font-medium">{children}</span>
    </div>
  );
}

// Right Item Component
function RightItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-blue-700 text-sm">
      <span className="text-blue-500">•</span>
      {children}
    </div>
  );
}
