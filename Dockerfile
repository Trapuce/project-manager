# Dockerfile simple pour Next.js frontend
FROM node:18-alpine

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json pnpm-lock.yaml* ./

# Installer les dépendances
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build de l'application
RUN corepack enable pnpm && pnpm run build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["pnpm", "start"]

