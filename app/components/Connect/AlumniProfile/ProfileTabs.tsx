import { tabs } from "./profile";

export default function ProfileTabs() {
  return (
    <div className="flex gap-2.5 overflow-x-auto border-b border-[#EDEAE3] py-1">
      {tabs.map((tab, idx) => (
        <button key={tab} className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-all ${idx === 0 ? "border-[#0A0A0A] text-[#0A0A0A]" : "border-transparent text-[#6f6f6f] hover:text-[#0A0A0A]"}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
