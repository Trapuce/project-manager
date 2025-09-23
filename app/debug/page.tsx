import { BackendStatus } from '@/components/debug/backend-status'

export default function DebugPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Debug - Intégration Backend</h1>
        <p className="text-muted-foreground">
          Page de debug pour tester la connectivité avec le backend Spring Boot
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BackendStatus />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Assurez-vous que le backend Spring Boot est démarré sur le port 8080</p>
            <p>2. Vérifiez que l'URL de base est correcte dans la configuration</p>
            <p>3. Testez la connectivité avec le bouton "Vérifier à nouveau"</p>
            <p>4. Consultez les logs du backend pour plus de détails</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">URLs utiles</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Frontend:</span>
              <br />
              <code className="text-muted-foreground">http://localhost:3000</code>
            </div>
            <div>
              <span className="font-medium">Backend API:</span>
              <br />
              <code className="text-muted-foreground">http://localhost:8080</code>
            </div>
            <div>
              <span className="font-medium">Swagger UI:</span>
              <br />
              <code className="text-muted-foreground">http://localhost:8080/swagger-ui.html</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
