"use client";

import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pt-28 md:pt-36 pb-16">
      <section className=" bg-white p-8">
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-extrabold tracking-tight text-left mb-10 underline underline-offset-[6px]">
          Secure Steps — Terms & Conditions
        </h1>

        {/* CONTENT */}
        <div className="space-y-10 text-sm text-gray-700 leading-relaxed">

          <section id="agreement">
            <h2 className="text-lg font-semibold mb-2">• 1. Agreement to Terms</h2>
            <p>
              By accessing or using our services, you agree to comply with and be legally
              bound by these Terms.
            </p>
          </section>

          <section id="services">
            <h2 className="text-lg font-semibold mb-2">• 2. Nature of Services</h2>
            <p>
              Secure Steps provides advisory and documentation support for study-abroad
              applications, including guidance for admissions, visa preparation, university
              selection, and academic strategy.
            </p>
            <p className="mt-1">
              All services are advisory. Secure Steps does not guarantee admissions, visas,
              scholarships, deadlines, or outcomes reliant on third-party decision makers.
            </p>
          </section>

          <section id="eligibility">
            <h2 className="text-lg font-semibold mb-2">• 3. Eligibility</h2>
            <p>Users must be 18+ or 16+ with parental consent.</p>
          </section>

          <section id="accuracy">
            <h2 className="text-lg font-semibold mb-2">• 4. Accuracy of Information</h2>
            <p>
              Users must provide accurate documents and data. Secure Steps is not
              responsible for inaccurate, misleading, or fraudulent information provided by
              the user.
            </p>
          </section>

          <section id="delivery">
            <h2 className="text-lg font-semibold mb-2">• 5. Service Delivery</h2>
            <p>Service begins once:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>A counsellor reviews your profile</li>
              <li>A document is opened for revision</li>
              <li>A strategy call is scheduled</li>
            </ul>
            <p className="mt-1">
              Hence refunds cease at this stage.
            </p>
          </section>

          <section id="payments">
            <h2 className="text-lg font-semibold mb-2">• 6. Payments</h2>
            <p>
              Payments are processed securely through authorised gateways. All prices are
              inclusive/exclusive of applicable taxes (as displayed).
            </p>
          </section>

          <section id="refund">
            <h2 className="text-lg font-semibold mb-2">• 7. Refund & Cancellation</h2>
            <p>
              Full refunds are available only within 24 hours of payment if no service
              activity has occurred. No refunds are issued once service has commenced.
            </p>
            <p className="mt-1">
              Refunds for duplicate or failed transactions are processed after verification.
            </p>
          </section>

          <section id="intellectual">
            <h2 className="text-lg font-semibold mb-2">• 8. Intellectual Property</h2>
            <p>
              All templates, SOP structures, LOR samples, video lessons, checklists, and
              written content belong exclusively to Secure Steps.
            </p>
          </section>

          <section id="prohibited">
            <h2 className="text-lg font-semibold mb-2">• 9. Prohibited Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy or redistribute content</li>
              <li>Harass staff</li>
              <li>Misuse tools</li>
              <li>Engage in fraud</li>
              <li>Attempt to breach systems/security</li>
            </ul>
          </section>

          <section id="liability">
            <h2 className="text-lg font-semibold mb-2">• 10. Limitation of Liability</h2>
            <p>
              Secure Steps is not liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Visa rejections</li>
              <li>Admission decisions</li>
              <li>Embassy delays</li>
              <li>System downtime</li>
              <li>Loss of data due to user error</li>
              <li>Any indirect or consequential damages</li>
            </ul>
          </section>

          <section id="indemnification">
            <h2 className="text-lg font-semibold mb-2">• 11. Indemnification</h2>
            <p>
              Users indemnify Secure Steps from claims arising from misuse, violation of
              laws, or breach of Terms.
            </p>
          </section>

          <section id="force-majeure">
            <h2 className="text-lg font-semibold mb-2">• 12. Force Majeure</h2>
            <p>
              Secure Steps is not responsible for delays due to natural disasters, strikes,
              internet outages, government actions, pandemics, or third-party failures.
            </p>
          </section>

          <section id="law">
            <h2 className="text-lg font-semibold mb-2">• 13. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Disputes shall be resolved
              through arbitration under the Arbitration and Conciliation Act, 1996, seated
              in Bangalore, Karnataka. Courts of Bangalore have exclusive jurisdiction.
            </p>
          </section>

          <section id="entire">
            <h2 className="text-lg font-semibold mb-2">• 14. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between Secure Steps and the user.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-lg font-semibold mb-2">• 15. Contact</h2>
            <p>Email: <span className="text-violet-700 font-medium">info@securesteps.co.in</span></p>
            <p>Phone: <span className="text-violet-700 font-medium">+91 70935 68336</span></p>

            <div className="mt-5 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-50 to-violet-50 border border-gray-100 text-left">
              <p className="text-sm">
                These Terms explain the rules and conditions for using
                <span className="font-medium"> securesteps.co.in</span> and its services.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Last updated: <strong>November 2025</strong>
              </p>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
