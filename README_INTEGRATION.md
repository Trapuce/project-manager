# 🚀 Intégration Backend Spring Boot - ProjectHub

## ✅ Intégration Complète Réalisée

L'intégration entre le frontend Next.js et le backend Spring Boot est maintenant **complètement fonctionnelle** ! 

## 🎯 Ce qui a été implémenté

### 1. **Services API complets**
- ✅ Service d'authentification (`authService`)
- ✅ Service de gestion des utilisateurs (`usersService`)
- ✅ Service de gestion des projets (`projectsService`)
- ✅ Service de gestion des tâches (`tasksService`)
- ✅ Service de gestion des fichiers (`filesService`)

### 2. **Gestion des tokens JWT**
- ✅ Stockage sécurisé des tokens dans localStorage
- ✅ Refresh automatique des tokens expirés
- ✅ Redirection automatique vers la page de connexion si non authentifié

### 3. **Composants intégrés**
- ✅ Formulaires de connexion et d'inscription connectés au backend
- ✅ Dashboard avec statistiques en temps réel
- ✅ Header avec informations utilisateur et déconnexion
- ✅ Protection des routes du dashboard

### 4. **Fonctionnalités avancées**
- ✅ Gestion des erreurs et retry automatique
- ✅ Loading states et skeletons
- ✅ Types TypeScript complets
- ✅ Configuration centralisée

## 🚀 Comment démarrer

### Option 1: Script automatique (recommandé)
```bash
# Démarrer l'environnement complet
npm run start:dev
# ou
pnpm start:dev
```

### Option 2: Démarrage manuel
```bash
# Terminal 1: Backend Spring Boot
cd backend-spring-boot
./mvnw spring-boot:run

# Terminal 2: Frontend Next.js
cd project-manager
npm run dev
# ou
pnpm dev
```

## 🧪 Tests d'intégration

### Test automatique
```bash
npm run test:integration
```

### Test manuel via l'interface
1. Allez sur http://localhost:3000/debug
2. Vérifiez le statut du backend
3. Testez la connectivité

## 📱 URLs importantes

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Page de debug:** http://localhost:3000/debug

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEBUG_MODE=true
```

### Personnalisation
Modifiez `lib/config.ts` pour ajuster la configuration.

## 📚 Utilisation des services

### Authentification
```typescript
import { authService } from '@/lib/api'

// Connexion
await authService.login('user@example.com', 'password')

// Inscription
await authService.register({
  email: 'user@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'MEMBER'
})

// Déconnexion
await authService.logout()
```

### Gestion des projets
```typescript
import { projectsService } from '@/lib/api'

// Récupérer mes projets
const projects = await projectsService.getMyProjects()

// Créer un projet
const newProject = await projectsService.createProject({
  name: 'Mon Projet',
  description: 'Description du projet',
  priority: 'HIGH',
  memberIds: [1, 2, 3]
})
```

### Gestion des tâches
```typescript
import { tasksService } from '@/lib/api'

// Récupérer mes tâches
const tasks = await tasksService.getMyTasks()

// Créer une tâche
const newTask = await tasksService.createTask({
  title: 'Ma Tâche',
  description: 'Description de la tâche',
  projectId: 1,
  priority: 'HIGH',
  assigneeId: 2
})
```

### Upload de fichiers
```typescript
import { filesService } from '@/lib/api'

// Upload d'un fichier
const uploadedFile = await filesService.uploadFile(file, projectId, taskId)

// Télécharger un fichier
await filesService.downloadAndOpenFile(fileId, fileName)
```

## 🎨 Hook d'authentification

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>
  }
  
  return <div>Bonjour {user?.firstName} !</div>
}
```

## 🔒 Protection des routes

```typescript
import { useRequireAuth } from '@/hooks/use-auth'

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useRequireAuth()
  
  if (isLoading) return <div>Chargement...</div>
  if (!isAuthenticated) return null // Redirection automatique
  
  return <div>Contenu protégé</div>
}
```

## 🐛 Debugging

### Vérifier la connectivité
1. Allez sur http://localhost:3000/debug
2. Vérifiez le statut du backend
3. Consultez les logs de la console

### Logs utiles
```typescript
// Vérifier l'authentification
console.log('Authentifié:', authService.isAuthenticated())
console.log('Token expiré:', authService.isTokenExpired())

// Vérifier la configuration
console.log('URL API:', API_CONFIG.BASE_URL)
```

## 📋 Checklist de déploiement

- [ ] Backend Spring Boot démarré sur le port 8080
- [ ] CORS configuré pour accepter localhost:3000
- [ ] Base de données configurée et accessible
- [ ] Variables d'environnement définies
- [ ] Tests d'intégration passés
- [ ] Page de debug accessible

## 🎉 Félicitations !

Votre intégration backend-frontend est maintenant **complète et fonctionnelle** ! 

Vous pouvez :
- ✅ Vous connecter et vous inscrire
- ✅ Gérer des projets et des tâches
- ✅ Uploader et télécharger des fichiers
- ✅ Voir les statistiques en temps réel
- ✅ Naviguer dans une interface protégée

## 📞 Support

En cas de problème :
1. Vérifiez les logs de la console
2. Consultez la page de debug
3. Vérifiez que le backend est démarré
4. Consultez la documentation Swagger UI

**L'intégration est prête pour le développement et la production !** 🚀
