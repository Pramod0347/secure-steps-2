import { AlumniProfileModel, sessionItems } from "./profile";

export default function ProfileSessions({ model }: { model: AlumniProfileModel }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {sessionItems.map((item) => (
        <article key={item.name} className="group cursor-pointer rounded-2xl border border-[#EDEAE3] bg-white/80 p-6 transition hover:border-[#0A0A0A] hover:shadow-[0_12px_28px_-12px_rgba(10,10,10,.15)] backdrop-blur-sm">
          <span className="float-right rounded-full bg-[#F7EFFF] px-3 py-1.5 text-xs font-bold text-[#7A5FB8]">⭐ {model.profile.rating}</span>
          <p className="text-xs font-semibold uppercase letter-spacing-wider text-[#6f6f6f]">{item.type}</p>
          <h3 className="mt-2.5 text-xl font-extrabold tracking-tight text-[#0A0A0A]">{item.name}</h3>
          <p className="mt-2.5 min-h-10 text-sm leading-6 text-[#6f6f6f]">{item.desc}</p>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-[#FAFAF9] p-3.5">
            <p className="text-sm font-semibold text-[#3a3a3a]">⏱ {item.duration}</p>
            <button className="rounded-full border border-[#EDEAE3] bg-white px-4 py-1.5 text-sm font-bold text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:text-white">{item.price}</button>
          </div>
        </article>
      ))}
    </div>
  );
}
