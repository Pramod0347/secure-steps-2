import { notFound } from "next/navigation";
import { alumniDirectory } from "@/app/components/Connect/Revamp/data";
import ProfileContent from "@/app/components/Connect/AlumniProfile/ProfileContent";
import IdentityCard from "@/app/components/Connect/AlumniProfile/IdentityCard";
import ProfileNav from "@/app/components/Connect/AlumniProfile/ProfileNav";
import { buildAlumniProfileModel } from "@/app/components/Connect/AlumniProfile/profile";

type PageProps = {
  params: Promise<{ alumniId: string }>;
};

export default async function AlumniProfilePage({ params }: PageProps) {
  const { alumniId } = await params;
  const profile = alumniDirectory.find((item) => item.id === alumniId);

  if (!profile) notFound();
  const model = buildAlumniProfileModel(profile);

  return (
    <main className="min-h-screen bg-[#F4F2EE] text-[#0A0A0A] pt-28 md:pt-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/80 bg-white/70 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <ProfileNav />
          <div className="mt-6 grid w-full gap-6 lg:grid-cols-[340px_1fr]">
            <IdentityCard model={model} />
            <ProfileContent model={model} />
          </div>
        </div>
      </div>
    </main>
  );
}
