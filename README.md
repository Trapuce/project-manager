# ProjectHub - Application de Gestion de Projets

Une application moderne et complète de gestion de projets construite avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

### Authentification
- **Connexion/Inscription** : Interface sécurisée avec validation des formulaires
- **Réinitialisation de mot de passe** : Système de récupération de compte
- **Gestion des sessions** : Authentification persistante

### Gestion des Utilisateurs
- **Profils utilisateurs** : Informations personnelles et préférences
- **Système de rôles** : Admin, Manager, Membre avec permissions différenciées
- **Gestion d'équipe** : Vue d'ensemble des membres et leurs statuts

### Gestion des Projets
- **CRUD complet** : Création, lecture, mise à jour, suppression
- **Statuts de projets** : Planifié, En cours, En pause, Terminé, Archivé
- **Priorités** : Basse, Moyenne, Haute
- **Assignation d'équipes** : Attribution de membres aux projets
- **Suivi d'activité** : Historique des modifications

### Gestion des Tâches
- **Interface complète** : Liste, détail, création, modification
- **Assignation** : Attribution de tâches aux membres de l'équipe
- **Sous-tâches** : Décomposition des tâches complexes
- **Commentaires** : Communication sur les tâches
- **Pièces jointes** : Upload et gestion de fichiers
- **Filtres avancés** : Recherche, tri, pagination

### Dashboard & Analytics
- **Vue d'ensemble** : Métriques clés et statistiques
- **Graphiques interactifs** : Évolution des projets et tâches
- **Performance d'équipe** : Suivi de la productivité
- **Échéances** : Alertes pour les dates limites
- **Analytics détaillés** : Page dédiée aux analyses approfondies

### Calendrier
- **Vues multiples** : Mois, semaine, jour
- **Planning des tâches** : Visualisation des échéances
- **Sidebar interactive** : Détails des tâches du jour sélectionné
- **Création rapide** : Ajout de tâches directement depuis le calendrier

### Système de Notifications
- **Notifications in-app** : Dropdown avec compteur de non-lues
- **Types variés** : Tâches, projets, équipe
- **Gestion complète** : Marquer comme lu, supprimer
- **Horodatage** : Affichage du temps écoulé

### Interface Utilisateur
- **Design moderne** : Interface épurée avec palette émeraude
- **Mode sombre/clair** : Basculement automatique ou manuel
- **Responsive** : Adaptation mobile et desktop
- **Accessibilité** : Support des lecteurs d'écran et navigation clavier
- **Animations fluides** : Transitions et micro-interactions

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Composants UI** : shadcn/ui + Radix UI
- **Graphiques** : Recharts
- **Dates** : date-fns
- **Icônes** : Lucide React
- **Thèmes** : next-themes
- **Fonts** : Geist Sans & Mono

## 📁 Structure du Projet

\`\`\`
app/
├── auth/                    # Pages d'authentification
│   ├── login/
│   ├── signup/
│   └── reset-password/
├── dashboard/               # Interface principale
│   ├── analytics/           # Page d'analytics
│   ├── calendar/            # Vue calendrier
│   ├── profile/             # Profil utilisateur
│   ├── projects/            # Gestion des projets
│   ├── settings/            # Paramètres
│   ├── tasks/               # Gestion des tâches
│   └── users/               # Gestion d'équipe
└── api/                     # Routes API
    └── upload/              # Upload de fichiers

components/
├── analytics/               # Composants d'analytics
├── auth/                    # Formulaires d'authentification
├── calendar/                # Composants du calendrier
├── dashboard/               # Navigation et header
├── profile/                 # Composants de profil
├── projects/                # Composants de projets
├── tasks/                   # Composants de tâches
├── ui/                      # Composants UI de base
└── users/                   # Composants utilisateurs
\`\`\`

## 🎨 Design System

### Palette de Couleurs
- **Primaire** : Émeraude (#10b981)
- **Secondaire** : Gris neutres
- **Accents** : Bleu, rouge, jaune pour les statuts

### Typographie
- **Titres** : Geist Sans (weights: 400, 500, 600, 700)
- **Corps** : Geist Sans (weight: 400)
- **Code** : Geist Mono

### Composants
- **Cartes** : Bordures subtiles, ombres légères
- **Boutons** : États hover/focus, variants multiples
- **Formulaires** : Validation en temps réel, états d'erreur
- **Navigation** : Sidebar fixe, breadcrumbs contextuels

## 🚀 Démarrage Rapide

1. **Installation des dépendances**
   \`\`\`bash
   npm install
   \`\`\`

2. **Lancement en développement**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Accès à l'application**
   - Ouvrir [http://localhost:3000](http://localhost:3000)
   - Page d'accueil avec liens vers l'authentification
   - Dashboard accessible après connexion

## 📱 Fonctionnalités Responsive

- **Mobile First** : Design optimisé pour mobile
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation adaptative** : Sidebar collapsible sur mobile
- **Grilles flexibles** : Adaptation automatique du contenu
- **Touch-friendly** : Boutons et zones de clic optimisés

## 🔧 Personnalisation

### Thèmes
- Modification des couleurs dans `app/globals.css`
- Variables CSS personnalisées pour les thèmes
- Support automatique du mode sombre

### Composants
- Tous les composants sont modulaires et réutilisables
- Props TypeScript pour une intégration type-safe
- Variants configurables via class-variance-authority

## 📊 Métriques et Analytics

- **Projets** : Nombre total, statuts, progression
- **Tâches** : Répartition par statut, assignation, échéances
- **Équipe** : Performance, charge de travail, activité
- **Tendances** : Évolution temporelle, graphiques interactifs

## 🔒 Sécurité

- **Validation** : Côté client et serveur
- **Sanitisation** : Nettoyage des entrées utilisateur
- **Authentification** : Gestion sécurisée des sessions
- **Permissions** : Contrôle d'accès basé sur les rôles

---

**ProjectHub** - Gérez vos projets avec efficacité et style ! 🎯
