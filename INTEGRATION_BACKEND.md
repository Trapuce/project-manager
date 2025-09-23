# Intégration Backend Spring Boot - ProjectHub

## 🚀 Vue d'ensemble

Ce document décrit l'intégration complète entre le frontend Next.js et le backend Spring Boot pour l'application ProjectHub.

## 📁 Structure des fichiers API

```
lib/api/
├── config.ts          # Configuration et types TypeScript
├── client.ts          # Client HTTP avec gestion des tokens
├── auth.ts            # Service d'authentification
├── users.ts           # Service de gestion des utilisateurs
├── projects.ts        # Service de gestion des projets
├── tasks.ts           # Service de gestion des tâches
├── files.ts           # Service de gestion des fichiers
└── index.ts           # Export de tous les services
```

## 🔧 Configuration

### URL de base
- **Backend :** `http://localhost:8080`
- **Frontend :** `http://localhost:3000`
- **CORS :** Configuré pour accepter les requêtes depuis le frontend

### Types de fichiers autorisés
- Images : JPEG, PNG, GIF
- Documents : PDF, Word, TXT
- Taille max : 10MB

## 🔐 Authentification

### Services disponibles
- `authService.login(email, password)` - Connexion
- `authService.register(userData)` - Inscription
- `authService.logout()` - Déconnexion
- `authService.refreshToken()` - Rafraîchissement du token

### Gestion des tokens
- **Access Token :** Stocké dans localStorage, expire après 24h
- **Refresh Token :** Utilisé pour renouveler l'access token
- **Refresh automatique :** Géré par le client API

### Hook d'authentification
```typescript
const { user, isAuthenticated, login, logout } = useAuth()
```

## 👥 Gestion des utilisateurs

### Services disponibles
- `usersService.getUsers()` - Liste paginée des utilisateurs
- `usersService.getCurrentUserProfile()` - Profil de l'utilisateur connecté
- `usersService.searchUsers(term)` - Recherche d'utilisateurs
- `usersService.getUsersByRole(role)` - Utilisateurs par rôle
- `usersService.updateUser(id, data)` - Mise à jour d'un utilisateur

## 📁 Gestion des projets

### Services disponibles
- `projectsService.getProjects()` - Liste paginée des projets
- `projectsService.getMyProjects()` - Projets de l'utilisateur connecté
- `projectsService.createProject(data)` - Création d'un projet
- `projectsService.updateProject(id, data)` - Mise à jour d'un projet
- `projectsService.getProjectStats()` - Statistiques des projets

## ✅ Gestion des tâches

### Services disponibles
- `tasksService.getTasks()` - Liste paginée des tâches
- `tasksService.getMyTasks()` - Tâches de l'utilisateur connecté
- `tasksService.createTask(data)` - Création d'une tâche
- `tasksService.updateTaskStatus(id, status)` - Changement de statut
- `tasksService.assignTask(taskId, userId)` - Attribution d'une tâche

## 📎 Gestion des fichiers

### Services disponibles
- `filesService.uploadFile(file, projectId?, taskId?)` - Upload de fichier
- `filesService.downloadFile(fileId)` - Téléchargement de fichier
- `filesService.getProjectFiles(projectId)` - Fichiers d'un projet
- `filesService.deleteFile(fileId)` - Suppression d'un fichier

## 🎯 Composants intégrés

### Authentification
- `LoginForm` - Formulaire de connexion avec intégration backend
- `SignupForm` - Formulaire d'inscription avec intégration backend
- `AuthProvider` - Provider React pour la gestion de l'état d'authentification

### Dashboard
- `DashboardStats` - Statistiques en temps réel depuis le backend
- `RecentProjects` - Projets récents avec progression calculée
- `DashboardHeader` - Header avec informations utilisateur et déconnexion

## 🔄 Gestion des erreurs

### Refresh automatique des tokens
- Détection automatique des erreurs 401
- Tentative de refresh du token
- Redirection vers la page de connexion si échec

### Gestion des erreurs réseau
- Affichage des messages d'erreur appropriés
- Fallback vers des données par défaut
- Logging des erreurs pour le debugging

## 🚀 Utilisation

### 1. Démarrer le backend
```bash
# Dans le dossier du backend Spring Boot
./mvnw spring-boot:run
```

### 2. Démarrer le frontend
```bash
# Dans le dossier du frontend Next.js
npm run dev
# ou
pnpm dev
```

### 3. Accéder à l'application
- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:8080
- **Swagger UI :** http://localhost:8080/swagger-ui.html

## 📝 Exemples d'utilisation

### Connexion
```typescript
import { authService } from '@/lib/api'

const handleLogin = async () => {
  try {
    await authService.login('user@example.com', 'password')
    // L'utilisateur est maintenant connecté
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}
```

### Récupération des projets
```typescript
import { projectsService } from '@/lib/api'

const loadProjects = async () => {
  try {
    const projects = await projectsService.getMyProjects()
    console.log('Mes projets:', projects)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  }
}
```

### Upload de fichier
```typescript
import { filesService } from '@/lib/api'

const handleFileUpload = async (file: File, projectId: number) => {
  try {
    const uploadedFile = await filesService.uploadFile(file, projectId)
    console.log('Fichier uploadé:', uploadedFile)
  } catch (error) {
    console.error('Erreur d\'upload:', error)
  }
}
```

## 🔧 Configuration avancée

### Variables d'environnement
Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Personnalisation des endpoints
Modifiez `lib/api/config.ts` pour changer les URLs ou ajouter de nouveaux endpoints.

## 🐛 Debugging

### Logs des requêtes
Le client API log automatiquement les erreurs. Vérifiez la console du navigateur pour plus de détails.

### Vérification des tokens
```typescript
import { authService } from '@/lib/api'

console.log('Authentifié:', authService.isAuthenticated())
console.log('Token expiré:', authService.isTokenExpired())
```

## 📚 Documentation API

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
http://localhost:8080/swagger-ui.html

## 🤝 Support

Pour toute question ou problème d'intégration, consultez :
1. Les logs de la console du navigateur
2. Les logs du backend Spring Boot
3. La documentation Swagger UI
4. Les types TypeScript dans `lib/api/config.ts`
