"use client";

import React from "react";
import Link from "next/link";

export default function Page() {
  return (
<main className="min-h-screen bg-gray-50 text-gray-800 pt-28 md:pt-36 pb-16">
      <section className=" bg-white  p-8">

        {/* --- TITLE AFTER MAIN HEADER --- */}
        <h1 className="text-3xl font-extrabold tracking-tight text-left mb-10 underline underline-offset-[6px]">
          Secure Steps — Privacy Policy
        </h1>

        {/* CONTENT */}
        <div className="space-y-10 text-sm text-gray-700 leading-relaxed">

          <section id="scope">
            <h2 className="text-lg font-semibold mb-2">• 1. Scope of the Policy</h2>
            <p>
              This Policy applies to users of our website, students and applicants
              accessing counselling, document support, payment, communication
              channels and offline interactions.
            </p>
          </section>

          <section id="data">
            <h2 className="text-lg font-semibold mb-2">• 2. Categories of Personal Data Collected</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identity Data – Name, gender, date of birth</li>
              <li>Contact Data – Email, phone, WhatsApp number, city, country</li>
              <li>Academic Data – Transcripts, certificates, test scores, SOP/LOR files</li>
              <li>Government ID – Passport or national ID for visa/admission purposes</li>
              <li>Payment Data – Transaction IDs, UPI references (card numbers not stored)</li>
              <li>Technical & Behavioural Data – IP, cookies, device info, clicks, heatmaps</li>
            </ul>
          </section>

          <section id="collection">
            <h2 className="text-lg font-semibold mb-2">• 3. How Information Is Collected</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Website forms and enquiries</li>
              <li>WhatsApp, phone and email communication</li>
              <li>Uploaded documents and application files</li>
              <li>Payment gateway interactions</li>
              <li>Analytics and tracking pixels (Google, Meta, Microsoft Clarity)</li>
            </ul>
          </section>

          <section id="purposes">
            <h2 className="text-lg font-semibold mb-2">• 4. Purposes of Processing</h2>
            <p>Personal data is used to provide and improve services, including:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Counselling and university shortlisting</li>
              <li>Document review and application assistance</li>
              <li>Visa process and appointment support</li>
              <li>Fraud prevention, internal audits and customer support</li>
              <li>Analytics and consent-based communication</li>
            </ul>
          </section>

          <section id="legal">
            <h2 className="text-lg font-semibold mb-2">• 5. Legal Basis for Processing</h2>
            <p>
              We rely on explicit consent, contractual necessity, legitimate
              interests, legal compliance and fraud prevention as lawful bases for
              processing personal data.
            </p>
          </section>

          <section id="sharing">
            <h2 className="text-lg font-semibold mb-2">• 6. Sharing of Personal Information</h2>
            <p>We never sell personal data. We may share information with:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Partner universities (only after your instruction)</li>
              <li>Payment processors (e.g., Razorpay)</li>
              <li>CRM & support platforms</li>
              <li>Analytics providers (Google, Meta, Microsoft Clarity)</li>
              <li>Authorised third-party editors/reviewers</li>
              <li>Legal/government authorities when required</li>
            </ul>
          </section>

          <section id="cross">
            <h2 className="text-lg font-semibold mb-2">• 7. Cross-Border Data Transfers</h2>
            <p>
              Information may be transferred to countries where universities,
              service providers or servers are located. Appropriate safeguards are
              applied.
            </p>
          </section>

          <section id="security">
            <h2 className="text-lg font-semibold mb-2">• 8. Data Security</h2>
            <p>
              SSL encryption, access control, firewalls and confidentiality
              protocols are used. However, no online system is entirely risk-free.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-lg font-semibold mb-2">• 9. Data Retention</h2>
            <p>
              Data is retained during active services and up to two years
              afterward, or longer when legally required. You may request deletion
              where permitted by law.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-lg font-semibold mb-2">• 10. Your Rights</h2>
            <p>
              You may request access, correction, deletion, consent withdrawal or
              usage summary. Contact:{" "}
              <a
                href="mailto:info@securesteps.co.in"
                className="text-violet-700 underline"
              >
                info@securesteps.co.in
              </a>
              .
            </p>
          </section>

          <section id="ndnc">
            <h2 className="text-lg font-semibold mb-2">• 11. NDNC Consent</h2>
            <p>
              By providing your phone number you consent to WhatsApp/phone
              communication even if registered on DND/NDNC, as permitted under
              TRAI rules for user-initiated service interaction.
            </p>
          </section>

          <section id="updates">
            <h2 className="text-lg font-semibold mb-2">• 12. Policy Amendments</h2>
            <p>
              This policy may be updated periodically. Continued use of services
              implies acceptance of updates.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-lg font-semibold mb-2">• 13. Contact</h2>
            <p>Secure Steps</p>
            <p>
              Christ University Yeshwanthpur Campus, Nagasandra, Near Tumkur
              Road, Bangalore – 560073
            </p>
            <p className="mt-2">
              Email:{" "}
              <a
                href="mailto:info@securesteps.co.in"
                className="text-violet-700 underline"
              >
                info@securesteps.co.in
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+917093568336" className="text-violet-700 underline">
                +91 70935 68336
              </a>
            </p>

            {/* Highlight Box */}
            <div className="mt-5 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-50 to-violet-50 border border-gray-100 text-left">
              <p className="text-sm">
                We respect your privacy. This page explains how we collect, use
                and protect personal information when you visit{" "}
                <span className="font-medium">securesteps.co.in</span> or use our
                services.
              </p>
              <p className="mt-2 text-sm text-gray-500 text-left">
                Last updated: <strong>November 2025</strong>
              </p>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
