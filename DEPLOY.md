# Guide de déploiement sur VPS avec Traefik

Ce guide explique comment déployer le front-end Next.js sur votre VPS où Traefik est déjà configuré.

## Prérequis

- Docker et Docker Compose installés sur le VPS
- Traefik déjà configuré et fonctionnel
- Le réseau Docker `traefik_default` existe (ou ajustez le nom dans docker-compose.yml)
- Le backend est accessible sur `https://projectHub.trapuce.tech/api`

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://projectHub.trapuce.tech
```

### 2. Configuration Traefik

Le fichier `docker-compose.yml` est configuré pour :
- Exposer le front-end sur `project-manager.trapuce.tech`
- Utiliser HTTPS avec Let's Encrypt via Traefik
- Se connecter au réseau Traefik existant

**Configuration du routage** :
- Front-end : `https://project-manager.trapuce.tech`
- Backend : `https://projectHub.trapuce.tech/api` (déjà configuré dans Traefik)

**Important** : Assurez-vous que le DNS pour `project-manager.trapuce.tech` pointe vers votre VPS pour que Traefik puisse générer le certificat SSL automatiquement.

### 3. Configuration du réseau Traefik

Le fichier `docker-compose.yml` est configuré pour utiliser le réseau `web` qui est le réseau externe de votre Traefik. Le certificat resolver utilisé est `myresolver` comme configuré dans votre Traefik.

## Déploiement

### Étape 1 : Cloner/transférer le projet sur le VPS

```bash
# Sur votre VPS
cd /path/to/projects
git clone <votre-repo> project-manager
cd project-manager
```

### Étape 2 : Créer le fichier .env

```bash
cp env.example .env
# Éditez .env si nécessaire
nano .env
```

### Étape 3 : Construire et démarrer le conteneur

```bash
# Construire l'image
docker-compose build

# Démarrer le conteneur
docker-compose up -d

# Vérifier les logs
docker-compose logs -f frontend
```

### Étape 4 : Vérifier que Traefik détecte le service

```bash
# Vérifier les services Traefik
docker logs traefik  # ou le nom de votre conteneur Traefik
```

Le front-end devrait être accessible sur `https://project-manager.trapuce.tech`.

## Mise à jour

Pour mettre à jour l'application :

```bash
# Arrêter le conteneur
docker-compose down

# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer
docker-compose build
docker-compose up -d
```

## Dépannage

### Le conteneur ne démarre pas

Vérifiez les logs :
```bash
docker-compose logs frontend
```

### Traefik ne route pas vers le front-end

1. Vérifiez que le réseau est correct :
```bash
docker network inspect web
```

2. Vérifiez que le conteneur est sur le bon réseau :
```bash
docker inspect project-manager-frontend | grep -A 10 Networks
```

3. Vérifiez les labels Traefik :
```bash
docker inspect project-manager-frontend | grep -A 20 Labels
```

### Erreurs de connexion au backend

Vérifiez que la variable `NEXT_PUBLIC_API_URL` dans le `.env` pointe bien vers `https://projectHub.trapuce.tech` (sans `/api` à la fin).

Note : Les variables `NEXT_PUBLIC_*` doivent être définies au moment du build. Assurez-vous que le fichier `.env` contient `NEXT_PUBLIC_API_URL=https://projectHub.trapuce.tech` avant de construire l'image. Si vous changez cette valeur, vous devrez reconstruire l'image :

```bash
# S'assurer que le .env est à jour
echo "NEXT_PUBLIC_API_URL=https://projectHub.trapuce.tech" > .env

# Reconstruire l'image
docker compose build --no-cache

# Redémarrer
docker compose up -d
```

## Architecture

- **Front-end** : Next.js sur le port 3000 (interne au conteneur), accessible sur `https://project-manager.trapuce.tech`
- **Proxy** : Traefik route le trafic HTTPS vers le conteneur
- **Backend** : Accessible sur `https://projectHub.trapuce.tech/api`

