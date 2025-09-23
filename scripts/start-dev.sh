#!/bin/bash

# Script de démarrage pour le développement
# Ce script démarre le backend Spring Boot et le frontend Next.js

echo "🚀 Démarrage de l'environnement de développement ProjectHub"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Java est installé (pour le backend Spring Boot)
if ! command -v java &> /dev/null; then
    print_warning "Java n'est pas installé. Le backend Spring Boot ne pourra pas démarrer."
fi

# Vérifier si Maven est installé
if ! command -v mvn &> /dev/null; then
    print_warning "Maven n'est pas installé. Le backend Spring Boot ne pourra pas démarrer."
fi

print_status "Vérification des dépendances..."

# Vérifier si pnpm est installé, sinon utiliser npm
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    print_success "pnpm détecté"
else
    PACKAGE_MANAGER="npm"
    print_success "npm détecté"
fi

# Installer les dépendances du frontend si nécessaire
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances du frontend..."
    $PACKAGE_MANAGER install
    if [ $? -eq 0 ]; then
        print_success "Dépendances du frontend installées"
    else
        print_error "Erreur lors de l'installation des dépendances du frontend"
        exit 1
    fi
else
    print_success "Dépendances du frontend déjà installées"
fi

print_status "Démarrage des services..."

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    print_status "Arrêt des services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup SIGINT SIGTERM

# Démarrer le backend Spring Boot (si disponible)
if [ -f "pom.xml" ] || [ -f "../pom.xml" ]; then
    print_status "Démarrage du backend Spring Boot..."
    if [ -f "pom.xml" ]; then
        mvn spring-boot:run &
    else
        cd .. && mvn spring-boot:run &
    fi
    BACKEND_PID=$!
    print_success "Backend Spring Boot démarré (PID: $BACKEND_PID)"
else
    print_warning "Fichier pom.xml non trouvé. Veuillez démarrer le backend manuellement."
    BACKEND_PID=""
fi

# Attendre un peu pour que le backend démarre
sleep 3

# Démarrer le frontend Next.js
print_status "Démarrage du frontend Next.js..."
$PACKAGE_MANAGER run dev &
FRONTEND_PID=$!
print_success "Frontend Next.js démarré (PID: $FRONTEND_PID)"

print_success "Environnement de développement démarré !"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo "📚 Swagger:  http://localhost:8080/swagger-ui.html"
echo "🐛 Debug:    http://localhost:3000/debug"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Attendre que les processus se terminent
wait
