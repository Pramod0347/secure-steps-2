import { tabs } from "./profile";

export default function ProfileTabs() {
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {tabs.map((tab, idx) => (
        <button key={tab} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold ${idx === 0 ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#EDEAE3] bg-transparent text-[#0A0A0A]"}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}
