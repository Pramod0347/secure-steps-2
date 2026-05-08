import { AlumniProfileModel } from "./profile";
import ProfileSessions from "./ProfileSessions";
import ProfileTabs from "./ProfileTabs";
import ProfileTopCards from "./ProfileTopCards";

export default function ProfileContent({ model }: { model: AlumniProfileModel }) {
  return (
    <section className="flex flex-col gap-5">
      <ProfileTopCards model={model} />
      <ProfileTabs />
      <ProfileSessions model={model} />
    </section>
  );
}
