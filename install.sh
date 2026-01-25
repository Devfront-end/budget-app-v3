#!/bin/bash

# Script d'installation automatique - Smart Budget
# Ce script installe et configure automatiquement l'application

set -e  # Arrêter en cas d'erreur

echo "🚀 Installation automatique de Smart Budget"
echo "==========================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

log_success() {
    echo -e "${GREEN}✅ ${NC}$1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  ${NC}$1"
}

log_error() {
    echo -e "${RED}❌ ${NC}$1"
}

# Détection de l'OS
if [[ "$OSTYPE" != "darwin"* ]]; then
    log_error "Ce script est conçu pour macOS uniquement"
    exit 1
fi

log_info "Système détecté : macOS"
echo ""

# 1. Vérification et installation de Homebrew
echo "📦 Étape 1/6 : Vérification de Homebrew..."
if command -v brew &> /dev/null; then
    log_success "Homebrew est déjà installé"
else
    log_warning "Homebrew n'est pas installé. Installation en cours..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Ajouter Homebrew au PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
    eval "$(/opt/homebrew/bin/brew shellenv)"
    
    log_success "Homebrew installé avec succès"
fi
echo ""

# 2. Vérification et installation de Node.js
echo "📦 Étape 2/6 : Vérification de Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js est déjà installé : $NODE_VERSION"
else
    log_warning "Node.js n'est pas installé. Installation en cours..."
    brew install node@20
    
    # Ajouter Node au PATH
    echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
    
    log_success "Node.js installé avec succès : $(node --version)"
fi
echo ""

# 3. Installation des dépendances du backend
echo "📦 Étape 3/6 : Installation des dépendances du backend..."
cd backend
if [ -d "node_modules" ]; then
    log_warning "Les dépendances du backend sont déjà installées"
else
    log_info "Installation en cours... (cela peut prendre 2-3 minutes)"
    npm install --silent
    log_success "Dépendances du backend installées"
fi
cd ..
echo ""

# 4. Installation des dépendances du frontend
echo "📦 Étape 4/6 : Installation des dépendances du frontend..."
cd frontend
if [ -d "node_modules" ]; then
    log_warning "Les dépendances du frontend sont déjà installées"
else
    log_info "Installation en cours... (cela peut prendre 2-3 minutes)"
    npm install --silent
    log_success "Dépendances du frontend installées"
fi
cd ..
echo ""

# 5. Demander quelle méthode d'installation pour la base de données
echo "🗄️  Étape 5/6 : Configuration de la base de données..."
echo ""
echo "Choisissez une option :"
echo "  1) Docker (recommandé - plus simple)"
echo "  2) Installation locale (PostgreSQL + Redis)"
echo ""
read -p "Votre choix (1 ou 2) : " db_choice

if [ "$db_choice" = "1" ]; then
    # Installation avec Docker
    echo ""
    log_info "Vérification de Docker..."
    
    if command -v docker &> /dev/null; then
        log_success "Docker est installé"
    else
        log_error "Docker n'est pas installé"
        log_info "Veuillez installer Docker Desktop : https://www.docker.com/products/docker-desktop"
        log_info "Puis relancez ce script"
        exit 1
    fi
    
    # Créer le fichier .env
    if [ ! -f ".env" ]; then
        log_info "Création du fichier .env..."
        cp .env.example .env
        log_success "Fichier .env créé"
    fi
    
    # Démarrer Docker Compose
    log_info "Démarrage des services Docker..."
    docker-compose up -d
    
    # Attendre que PostgreSQL soit prêt
    log_info "Attente du démarrage de PostgreSQL..."
    sleep 10
    
    # Exécuter les migrations
    log_info "Initialisation de la base de données..."
    docker-compose exec -T backend npx prisma migrate dev --name init
    
    log_success "Base de données configurée avec Docker"
    
elif [ "$db_choice" = "2" ]; then
    # Installation locale
    echo ""
    log_info "Installation de PostgreSQL..."
    if brew list postgresql@15 &> /dev/null; then
        log_success "PostgreSQL est déjà installé"
    else
        brew install postgresql@15
        log_success "PostgreSQL installé"
    fi
    
    log_info "Installation de Redis..."
    if brew list redis &> /dev/null; then
        log_success "Redis est déjà installé"
    else
        brew install redis
        log_success "Redis installé"
    fi
    
    # Démarrer les services
    log_info "Démarrage des services..."
    brew services start postgresql@15
    brew services start redis
    
    # Attendre que PostgreSQL démarre
    sleep 5
    
    # Créer la base de données
    log_info "Création de la base de données..."
    createdb budget_app || log_warning "La base de données existe déjà"
    
    # Créer l'utilisateur
    psql postgres -c "CREATE USER budget_user WITH PASSWORD 'password123';" || log_warning "L'utilisateur existe déjà"
    psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE budget_app TO budget_user;" || true
    psql postgres -c "ALTER USER budget_user CREATEDB;" || true
    
    # Configurer le backend
    cd backend
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_success "Fichier .env du backend créé"
    fi
    
    # Générer le client Prisma
    log_info "Génération du client Prisma..."
    npx prisma generate
    
    # Exécuter les migrations
    log_info "Initialisation de la base de données..."
    npx prisma migrate dev --name init
    
    cd ..
    
    # Configurer le frontend
    cd frontend
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_success "Fichier .env du frontend créé"
    fi
    cd ..
    
    log_success "Base de données configurée localement"
else
    log_error "Choix invalide"
    exit 1
fi
echo ""

# 6. Résumé final
echo "🎉 Étape 6/6 : Installation terminée !"
echo "====================================="
echo ""
log_success "Smart Budget est prêt à être utilisé !"
echo ""
echo "Pour démarrer l'application :"
echo ""

if [ "$db_choice" = "1" ]; then
    echo "  ${GREEN}L'application est déjà en cours d'exécution avec Docker !${NC}"
    echo ""
    echo "  📱 Frontend : ${BLUE}http://localhost${NC}"
    echo "  🔌 Backend  : ${BLUE}http://localhost:3000${NC}"
    echo ""
    echo "Commandes utiles :"
    echo "  - Voir les logs    : ${YELLOW}docker-compose logs -f${NC}"
    echo "  - Arrêter          : ${YELLOW}docker-compose down${NC}"
    echo "  - Redémarrer       : ${YELLOW}docker-compose up -d${NC}"
else
    echo "  ${YELLOW}Terminal 1 - Backend :${NC}"
    echo "    cd backend"
    echo "    npm run dev"
    echo ""
    echo "  ${YELLOW}Terminal 2 - Frontend :${NC}"
    echo "    cd frontend"
    echo "    npm run dev"
    echo ""
    echo "  📱 Frontend : ${BLUE}http://localhost:5173${NC}"
    echo "  🔌 Backend  : ${BLUE}http://localhost:3000${NC}"
fi

echo ""
echo "📚 Documentation complète : ${BLUE}./INSTALLATION.md${NC}"
echo "📖 README               : ${BLUE}./README.md${NC}"
echo ""
log_success "Bon développement ! 🚀"
