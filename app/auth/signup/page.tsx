import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Target } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4 gap-8">
      <Link href="/" className="flex items-center justify-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-foreground">
          ProjectHub
        </span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardDescription>Rejoignez ProjectHub pour gérer vos projets efficacement</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}
