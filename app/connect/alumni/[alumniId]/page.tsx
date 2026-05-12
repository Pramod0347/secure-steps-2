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
    <main className="min-h-screen bg-[#F4F2EE] text-[#0A0A0A]">
      <ProfileNav />

      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 px-6 py-7 lg:grid-cols-[340px_1fr]">
        <IdentityCard model={model} />
        <ProfileContent model={model} />
      </div>
    </main>
  );
}
