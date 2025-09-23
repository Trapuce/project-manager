import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

export function ProfileHeader() {
  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">JD</AvatarFallback>
        </Avatar>
        <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-bold">Jean Dupont</h1>
          <p className="text-muted-foreground">jean.dupont@email.com</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge>Administrateur</Badge>
          <Badge variant="secondary">Actif depuis 2 ans</Badge>
        </div>
      </div>
    </div>
  )
}
