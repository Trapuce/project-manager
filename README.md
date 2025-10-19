# ProjectHub

Application de gestion de projet moderne construite avec Next.js, TypeScript et Tailwind CSS.

## Fonctionnalités

- **Authentification** : Connexion, inscription et gestion des sessions
- **Gestion des projets** : Création, modification et suivi des projets
- **Gestion des tâches** : Création, assignation et suivi des tâches
- **Gestion des utilisateurs** : Administration des utilisateurs et des rôles
- **Calendrier** : Visualisation des tâches et projets dans un calendrier
- **Analytics** : Tableaux de bord et statistiques
- **Profil utilisateur** : Gestion du profil et des paramètres

## Technologies

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **État** : Zustand
- **Formulaires** : React Hook Form, Zod
- **Animations** : Framer Motion
- **API** : Client API personnalisé

## Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd project-manager
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
# Créer .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Démarrer le serveur de développement
```bash
npm run dev
```

## Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Construire l'application pour la production
- `npm run start` : Démarrer l'application en production
- `npm run lint` : Lancer le linter

## Structure du projet

```
├── app/                    # Pages Next.js
├── components/             # Composants React
│   ├── ui/                # Composants UI de base
│   ├── auth/              # Composants d'authentification
│   ├── dashboard/         # Composants du tableau de bord
│   ├── projects/          # Composants de gestion des projets
│   ├── tasks/             # Composants de gestion des tâches
│   └── users/             # Composants de gestion des utilisateurs
├── lib/                   # Utilitaires et configuration
│   ├── api/               # Client API et services
│   ├── validations/       # Schémas de validation Zod
│   └── utils.ts           # Fonctions utilitaires
├── stores/                # Stores Zustand
└── hooks/                 # Hooks React personnalisés
```

## API Backend

L'application se connecte à un backend Spring Boot via les endpoints suivants :

- **Authentification** : `/api/auth/*`
- **Utilisateurs** : `/api/users/*`
- **Projets** : `/api/projects/*`
- **Tâches** : `/api/tasks/*`
- **Fichiers** : `/api/files/*`

## Déploiement

### Déploiement avec Docker

#### 1. Développement
```bash
# Démarrer avec Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# Ou en arrière-plan
docker-compose -f docker-compose.dev.yml up -d --build
```

#### 2. Production
```bash
# Démarrer l'application seule
docker-compose up --build

# Démarrer avec Nginx (reverse proxy)
docker-compose --profile production up --build

# Démarrer l'application seule
docker-compose up --build
```

#### 3. Build manuel
```bash
# Construire l'image
docker build -t projecthub .

# Lancer le conteneur
docker run -p 3000:3000 --env-file .env.local projecthub
```

### Configuration

1. Copier le fichier d'environnement
```bash
cp env.example .env.local
```

2. Modifier les variables selon votre environnement
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api-domain.com
# L'URL doit pointer vers votre backend Spring Boot
```

### Déploiement sur serveur

#### Avec Docker Compose (recommandé)
```bash
# Cloner le projet
git clone <repository-url>
cd project-manager

# Configurer l'environnement
cp env.example .env.local
# Éditer .env.local avec vos valeurs

# Démarrer en production
docker-compose --profile production up -d --build
```

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend Spring Boot | `http://localhost:8080` |
| `DOMAIN` | Domaine de production | - |

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request



