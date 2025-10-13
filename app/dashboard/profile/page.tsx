import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeInTransition>
        <ProfileHeader />
      </FadeInTransition>
      <SectionTransition delay={0.1}>
        <ProfileForm />
      </SectionTransition>
    </div>
  )
}
