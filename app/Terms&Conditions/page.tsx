"use client";

import React from "react";
import { FileText, Mail, Phone, Shield, Users, CreditCard, Scale, AlertTriangle, Globe, BookOpen } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 pt-28 md:pt-36 pb-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#DA202E] to-[#3B367D] mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By accessing Secure Steps, you agree to be bound by these terms.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <span>Last updated:</span>
            <span className="font-semibold text-gray-700">November 2025</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-10 space-y-8">

            <Section icon={<Shield className="w-5 h-5" />} number="1" title="Agreement to Terms">
              <p>
                By accessing or using our services, you agree to comply with and be legally bound by these Terms. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </Section>

            <Section icon={<BookOpen className="w-5 h-5" />} number="2" title="Nature of Services">
              <p>
                Secure Steps provides advisory and documentation support for study-abroad applications, including guidance for admissions, visa preparation, university selection, and academic strategy.
              </p>
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Important:</strong> All services are advisory. Secure Steps does not guarantee admissions, visas, scholarships, deadlines, or outcomes reliant on third-party decision makers.
                </p>
              </div>
            </Section>

            <Section icon={<Users className="w-5 h-5" />} number="3" title="Eligibility">
              <p>
                Users must be <strong>18 years or older</strong>, or <strong>16+ with parental consent</strong> to use our services.
              </p>
            </Section>

            <Section icon={<FileText className="w-5 h-5" />} number="4" title="Accuracy of Information">
              <p>
                Users must provide accurate documents and data. Secure Steps is not responsible for inaccurate, misleading, or fraudulent information provided by the user.
              </p>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} number="5" title="Service Delivery">
              <p className="mb-3">Service begins once any of the following occurs:</p>
              <ul className="space-y-2">
                <ListItem>A counsellor reviews your profile</ListItem>
                <ListItem>A document is opened for revision</ListItem>
                <ListItem>A strategy call is scheduled</ListItem>
              </ul>
              <p className="mt-3 text-gray-600 text-sm italic">
                Hence refunds cease at this stage.
              </p>
            </Section>

            <Section icon={<CreditCard className="w-5 h-5" />} number="6" title="Payments">
              <p>
                Payments are processed securely through authorised gateways. All prices are inclusive/exclusive of applicable taxes (as displayed at checkout).
              </p>
            </Section>

            <Section icon={<CreditCard className="w-5 h-5" />} number="7" title="Refund & Cancellation">
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>✓ Full refunds</strong> are available only within <strong>24 hours</strong> of payment if no service activity has occurred.
                  </p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>✗ No refunds</strong> are issued once service has commenced.
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Refunds for duplicate or failed transactions are processed after verification.
                </p>
              </div>
            </Section>

            <Section icon={<Shield className="w-5 h-5" />} number="8" title="Intellectual Property">
              <p>
                All templates, SOP structures, LOR samples, video lessons, checklists, and written content belong exclusively to Secure Steps and are protected by copyright laws.
              </p>
            </Section>

            <Section icon={<AlertTriangle className="w-5 h-5" />} number="9" title="Prohibited Use">
              <p className="mb-3">The following activities are strictly prohibited:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ProhibitedItem>Copy or redistribute content</ProhibitedItem>
                <ProhibitedItem>Harass staff members</ProhibitedItem>
                <ProhibitedItem>Misuse platform tools</ProhibitedItem>
                <ProhibitedItem>Engage in fraud</ProhibitedItem>
                <ProhibitedItem>Breach systems/security</ProhibitedItem>
              </div>
            </Section>

            <Section icon={<Scale className="w-5 h-5" />} number="10" title="Limitation of Liability">
              <p className="mb-3">Secure Steps is not liable for:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <LiabilityItem>Visa rejections</LiabilityItem>
                <LiabilityItem>Admission decisions</LiabilityItem>
                <LiabilityItem>Embassy delays</LiabilityItem>
                <LiabilityItem>System downtime</LiabilityItem>
                <LiabilityItem>Loss of data due to user error</LiabilityItem>
                <LiabilityItem>Indirect or consequential damages</LiabilityItem>
              </div>
            </Section>

            <Section icon={<Shield className="w-5 h-5" />} number="11" title="Indemnification">
              <p>
                Users indemnify Secure Steps from claims arising from misuse, violation of laws, or breach of these Terms.
              </p>
            </Section>

            <Section icon={<Globe className="w-5 h-5" />} number="12" title="Force Majeure">
              <p>
                Secure Steps is not responsible for delays due to natural disasters, strikes, internet outages, government actions, pandemics, or third-party failures.
              </p>
            </Section>

            <Section icon={<Scale className="w-5 h-5" />} number="13" title="Governing Law & Jurisdiction">
              <p>
                These Terms are governed by the <strong>laws of India</strong>. Disputes shall be resolved through arbitration under the Arbitration and Conciliation Act, 1996, seated in Bangalore, Karnataka. Courts of Bangalore have exclusive jurisdiction.
              </p>
            </Section>

            <Section icon={<FileText className="w-5 h-5" />} number="14" title="Entire Agreement">
              <p>
                These Terms constitute the entire agreement between Secure Steps and the user, superseding all prior agreements.
              </p>
            </Section>

            {/* Contact Section */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#DA202E] to-[#3B367D] text-white flex items-center justify-center text-sm font-bold">15</span>
                Contact Us
              </h3>
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
          <p>These Terms explain the rules and conditions for using <strong>securesteps.co.in</strong> and its services.</p>
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

// List Item Component
function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0"></span>
      <span>{children}</span>
    </li>
  );
}

// Prohibited Item Component
function ProhibitedItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-700 text-sm">
      <span className="text-red-500">✗</span>
      {children}
    </div>
  );
}

// Liability Item Component
function LiabilityItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-gray-600 text-sm">
      <span className="text-gray-400">•</span>
      {children}
    </div>
  );
}
