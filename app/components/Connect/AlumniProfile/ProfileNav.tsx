import Link from "next/link";

export default function ProfileNav() {
  return (
    <nav className="flex items-center justify-between border-b border-[#EDEAE3] pb-5 mb-5">
      <Link href="/connect" className="inline-flex items-center gap-2 text-sm font-medium text-[#6f6f6f] hover:text-[#0A0A0A] transition-colors">
        <span>←</span>
        <span>Back to alumni</span>
      </Link>
    </nav>
  );
}
