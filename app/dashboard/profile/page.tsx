import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { ProfileActivity } from "@/components/profile/profile-activity"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <ProfileHeader />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <ProfileActivity />
        </div>
      </div>
    </div>
  )
}
