import Link from "next/link";

export default function ProfileNav() {
  return (
    <nav className="border-b border-[#EDEAE3] bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-4">
        <Link href="/connect" className="inline-flex items-center gap-2 text-sm font-medium text-[#6f6f6f] hover:text-[#0A0A0A]">
          <span>←</span>
          <span>Back to alumni</span>
        </Link>
        <div className="text-base font-extrabold tracking-tight">
          Secure Steps<span className="text-[#E64B9E]">.</span>
        </div>
      </div>
    </nav>
  );
}
