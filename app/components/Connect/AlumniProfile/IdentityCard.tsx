import { AlumniProfileModel } from "./profile";

export default function IdentityCard({ model }: { model: AlumniProfileModel }) {
  const { profile, profileCode, universityLine, currentRole } = model;

  return (
    <aside className="rounded-3xl bg-gradient-to-b from-[#E0CFFF] to-[#C8B4FF] p-7 lg:sticky lg:top-6 lg:h-fit">
      <div className="mb-6 flex items-center justify-between">
        <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold">Start page</button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-sm">↗</button>
      </div>

      <div className="relative mx-auto mb-5 h-36 w-36">
        <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#F2E6FF] to-[#7A5FB8] text-5xl font-extrabold">
          {profile.initials}
        </div>
        <div className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-[#7A5FB8] text-sm font-bold text-white">✓</div>
      </div>

      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/55">Alumni · ID {profileCode}</p>
        <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight">{profile.title}</h1>
        <p className="mt-2 text-[13.5px] leading-6 text-black/70">
          {universityLine}<br />
          Currently: {currentRole}
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white/45 p-4">
        <p className="text-xs font-bold">Identity protected</p>
        <p className="mt-1 text-xs leading-5 text-black/80">Full name, photo and contact are shared only after your completed session.</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white p-3 text-center"><p className="text-[11px] font-semibold text-[#6f6f6f]">Rating</p><p className="text-lg font-extrabold text-[#E64B9E]">{profile.rating}★</p></div>
        <div className="rounded-xl bg-white p-3 text-center"><p className="text-[11px] font-semibold text-[#6f6f6f]">Sessions</p><p className="text-lg font-extrabold">{profile.sessions}</p></div>
        <div className="rounded-xl bg-white p-3 text-center"><p className="text-[11px] font-semibold text-[#6f6f6f]">Response</p><p className="text-lg font-extrabold">2h</p></div>
      </div>
    </aside>
  );
}
