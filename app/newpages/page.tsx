'use client';

import React from "react";
import { User, FileText, BookOpen, Globe, Clock, Shield, Award, Users, Star } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white flex flex-col justify-between rounded-2xl m-4 p-6 shadow-lg">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            <div>
              <p className="font-semibold text-lg">Sandeep</p>
              <p className="text-sm text-gray-400">sandeep12@gmail.com</p>
            </div>
          </div>

          <nav className="space-y-3">
            <SidebarItem icon={<BookOpen size={18} />} label="Journey roadmap" />
            <SidebarItem icon={<Users size={18} />} label="Onboarding" active />
            <SidebarItem icon={<FileText size={18} />} label="Universities" />
            <SidebarItem icon={<FileText size={18} />} label="Documents" />
            <SidebarItem icon={<FileText size={18} />} label="Portfolio" />
            <SidebarItem icon={<Clock size={18} />} label="Application Tracking" />
            <SidebarItem icon={<Shield size={18} />} label="Visa & Finance" />
            <SidebarItem icon={<BookOpen size={18} />} label="E-Books" />
            <SidebarItem icon={<Star size={18} />} label="FIRE Mode" />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Welcome to Secure !</h1>
        <p className="text-gray-500 mb-6">Your seamless study abroad experience starts here</p>

        {/* Experience Section */}
        <section className="bg-gray-50 border rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-3">A Seamless Experience Awaits</h2>
          <p className="text-gray-500 mb-6 text-sm">
            At Secure, we’ve reimagined the study abroad journey. From your first consultation to landing at your dream university, every step is designed to be smooth, transparent, and stress-free.
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <ExperienceItem number="1" title="Personalized Consultation" desc="1-on-1 sessions with expert counselors" />
            <ExperienceItem number="2" title="Smart University Matching" desc="AI-powered recommendations based on your profile" />
            <ExperienceItem number="3" title="Application Excellence" desc="Expert guidance on essays, documents, and interviews" />
            <ExperienceItem number="4" title="Visa & Pre-departure" desc="Complete support until you reach your destination" />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Secure client benefits</h2>
          <p className="text-gray-500 mb-6 text-sm">Your seamless study abroad experience starts here</p>

          <div className="grid md:grid-cols-3 gap-6">
            <BenefitItem title="100% Transparency" desc="Real-time updates on every step" icon={<Shield size={28} />} />
            <BenefitItem title="Expert Team" desc="Dedicated counselors & visa specialists" icon={<Users size={28} />} />
            <BenefitItem title="Global Network" desc="Partnerships with 500+ universities" icon={<Globe size={28} />} />
            <BenefitItem title="24/7 Support" desc="Always here when you need us." icon={<Clock size={28} />} />
            <BenefitItem title="95% Success Rate" desc="Proven track record of admissions" icon={<Star size={28} />} />
            <BenefitItem title="Scholarship" desc="Scholarship guidance worth $2M+ secured" icon={<Award size={28} />} />
          </div>
        </section>

        {/* Pricing Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Invest in your future</h2>
          <p className="text-gray-500 mb-6 text-sm">Your seamless study abroad experience starts here</p>

          <div className="grid md:grid-cols-2 gap-6">
            <PricingCard
              title="UK Universities"
              desc="Apply to 3 Tier-1 & 4 Tier-2"
              price="₹ 29,999"
              features={[
                "Application to 8 universities",
                "Essay review & editing",
                "Unlimited counseling sessions",
                "Interview preparation",
                "Pre-departure briefing",
                "Visa assistance",
              ]}
            />
            <PricingCard
              title="USA/ Dubai/ Australia/ Canada"
              desc="Apply to 3 Ivy League & 4 Tier-2"
              price="₹ 69,999"
              features={[
                "Application to 8 universities",
                "Essay review & editing",
                "Unlimited counseling sessions",
                "Interview preparation",
                "Pre-departure briefing",
                "Visa assistance",
              ]}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <div
    className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-sm ${
      active ? "bg-white text-black font-semibold" : "text-gray-300 hover:bg-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const ExperienceItem = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div className="flex space-x-4 items-start">
    <div className="text-white bg-black w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold">{number}</div>
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
);

const BenefitItem = ({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) => (
  <div className="bg-gray-50 rounded-xl border p-6 text-center hover:shadow-md transition-all">
    <div className="flex justify-center mb-3 text-gray-700">{icon}</div>
    <h3 className="font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

const PricingCard = ({ title, desc, price, features }: { title: string; desc: string; price: string; features: string[] }) => (
  <div className="border rounded-2xl p-6 bg-gray-50 flex flex-col justify-between hover:shadow-md transition-all">
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{desc}</p>
      <ul className="space-y-2 text-sm text-gray-700 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center space-x-2">
            <span>✔️</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <p className="text-2xl font-bold mb-2">{price} <span className="text-sm text-gray-500 font-normal">/ Per Individual</span></p>
      <button className="w-full bg-black text-white py-2 rounded-xl font-medium hover:bg-gray-800">Purchase</button>
    </div>
  </div>
);
