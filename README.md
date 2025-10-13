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

1. Construire l'application
```bash
npm run build
```

2. Démarrer en production
```bash
npm run start
```

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request



