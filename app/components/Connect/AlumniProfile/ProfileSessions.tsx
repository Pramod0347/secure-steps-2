import { AlumniProfileModel, sessionItems } from "./profile";

export default function ProfileSessions({ model }: { model: AlumniProfileModel }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sessionItems.map((item) => (
        <article key={item.name} className="cursor-pointer rounded-3xl border border-transparent bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#0A0A0A] hover:shadow-[0_12px_28px_-12px_rgba(10,10,10,.12)]">
          <span className="float-right rounded-full bg-[#F7EFFF] px-3 py-1 text-xs font-bold text-[#7A5FB8]">⭐ {model.profile.rating}</span>
          <p className="text-xs font-semibold text-[#6f6f6f]">{item.type}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{item.name}</h3>
          <p className="mt-2 min-h-10 text-sm leading-6 text-[#6f6f6f]">{item.desc}</p>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#FAFAF9] p-3.5">
            <p className="text-sm font-semibold text-[#3a3a3a]">⏱ {item.duration}</p>
            <button className="rounded-full border border-[#EDEAE3] bg-white px-4 py-1.5 text-sm font-bold text-[#0A0A0A]">{item.price}</button>
          </div>
        </article>
      ))}
    </div>
  );
}
