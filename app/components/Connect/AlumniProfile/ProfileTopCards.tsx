import { AlumniProfileModel } from "./profile";

export default function ProfileTopCards({ model }: { model: AlumniProfileModel }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl bg-white p-7">
        <p className="text-3xl font-extrabold leading-none">&quot;</p>
        <p className="mt-3 text-[15.5px] leading-7 text-[#0A0A0A]">The best mentor I could&apos;ve asked for. Honest, specific, and kind guidance from day one.</p>
        <p className="mt-4 text-sm text-[#6f6f6f]">— Student review</p>
      </div>
      <div className="relative flex min-h-[180px] flex-col rounded-3xl bg-white p-7">
        <p className="max-w-[220px] text-[15px] leading-6">Check my course breakdown and module guide</p>
        <div className="absolute right-6 top-6 grid h-14 w-16 place-items-center rounded-xl bg-[#F4F2EE]">↗</div>
        <p className="mt-auto text-xs text-[#6f6f6f]">securesteps.co.in/alumni/{model.profile.id}/guide</p>
      </div>
    </div>
  );
}
