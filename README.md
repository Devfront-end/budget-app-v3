# 💰 Smart Budget - Personal Finance Management

> Application de gestion de budget personnel avec sécurité bancaire, analytics IA, et fonctionnalités avancées.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

## 🌟 Fonctionnalités

### Core Features
- ✅ **Authentication** - JWT avec sécurité renforcée (bcrypt, rate limiting)
- 💳 **Transactions** - Gestion complète revenus/dépenses avec catégories
- 🏦 **Comptes bancaires** - Multi-comptes avec synchronisation
- 🔄 **Abonnements** - Suivi des paiements récurrents
- 🎯 **Wishlist** - Objectifs d'épargne avec progression
- 💰 **Paiements 4X** - Gestion des paiements échelonnés
- 📊 **Analytics** - Tableaux de bord et visualisations avancées

### Security (OWASP Compliant)
- 🔐 Hachage bcrypt (cost factor 12)
- 🛡️ Protection CSRF
- 🚫 Protection XSS (DOMPurify)
- 💉 Protection SQL Injection (Prisma ORM)
- 🚦 Rate limiting sur toutes les routes sensibles
- 📝 Audit logs complets
- 🔒 Chiffrement E2EE optionnel

### Tech Stack

#### Backend
- **Runtime**: Node.js 18+ + Express
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 15+ avec Prisma ORM
- **Cache**: Redis 7+
- **Auth**: JWT + bcrypt
- **Logging**: Winston
- **Testing**: Jest

#### Frontend
- **Framework**: React 18+ avec TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + HeadlessUI
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP Client**: Axios
- **PWA**: Service Worker + Manifest

#### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: Ready for GitHub Actions

## 📋 Prérequis

- **Node.js** 18+ et npm 9+
- **PostgreSQL** 15+
- **Redis** 7+
- **Docker** et Docker Compose (optionnel mais recommandé)

## 🚀 Installation

### Option 1: Installation Locale

#### 1. Cloner le repository
\`\`\`bash
git clone https://github.com/yourusername/smart-budget.git
cd smart-budget
\`\`\`

#### 2. Backend Setup
\`\`\`bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer la DATABASE_URL dans .env
# DATABASE_URL="postgresql://budget_user:password@localhost:5432/budget_app"

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# (Optionnel) Seed la base de données
npx prisma db seed

# Démarrer le serveur de développement
npm run dev
\`\`\`

Le backend sera disponible sur `http://localhost:3000`

#### 3. Frontend Setup
\`\`\`bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
\`\`\`

Le frontend sera disponible sur `http://localhost:5173`

### Option 2: Installation avec Docker (Recommandé)

#### 1. Configurer les variables d'environnement
\`\`\`bash
# Créer un fichier .env à la racine
cp .env.example .env

# Éditer les variables sensibles
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
\`\`\`

#### 2. Lancer l'application
\`\`\`bash
# Build et démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Exécuter les migrations Prisma
docker-compose exec backend npx prisma migrate deploy
\`\`\`

L'application complète sera disponible sur:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

#### 3. Arrêter l'application
\`\`\`bash
docker-compose down

# Supprimer les volumes (données)
docker-compose down -v
\`\`\`

## 📁 Structure du Projet

\`\`\`
smart-budget/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs (logique métier)
│   │   ├── services/        # Services (business logic)
│   │   ├── middleware/      # Middleware (auth, erreurs, logs)
│   │   ├── routes/          # Routes API
│   │   ├── config/          # Configuration (DB, Redis)
│   │   ├── utils/           # Utilitaires (logger, helpers)
│   │   ├── types/           # Types TypeScript
│   │   ├── app.ts           # Configuration Express
│   │   └── server.ts        # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma    # Schéma de base de données
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Composants UI réutilisables
│   │   │   ├── features/    # Composants métier
│   │   │   └── layouts/     # Layouts (Header, Sidebar)
│   │   ├── pages/           # Pages de l'application
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services (axios)
│   │   ├── store/           # Redux store et slices
│   │   ├── utils/           # Utilitaires
│   │   ├── types/           # Types TypeScript
│   │   ├── App.tsx          # Composant principal
│   │   └── main.tsx         # Point d'entrée
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml        # Orchestration Docker
├── .env.example              # Variables d'environnement
├── .github/
│   └── copilot-instructions.md
└── README.md
\`\`\`

## 🛠️ Scripts Disponibles

### Backend
\`\`\`bash
npm run dev          # Démarrage en développement (nodemon)
npm run build        # Build TypeScript → dist/
npm start            # Démarrage en production
npm test             # Tests avec Jest
npm run lint         # ESLint
npm run format       # Prettier

# Prisma
npx prisma studio    # Interface graphique de la DB
npx prisma migrate dev   # Créer une migration
npx prisma generate  # Générer le client Prisma
\`\`\`

### Frontend
\`\`\`bash
npm run dev          # Démarrage en développement (Vite)
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
npm test             # Tests avec Vitest
npm run lint         # ESLint
npm run format       # Prettier
\`\`\`

## 📡 API Endpoints

### Authentication
\`\`\`
POST   /api/v1/auth/register          # Inscription
POST   /api/v1/auth/login             # Connexion
POST   /api/v1/auth/logout            # Déconnexion
POST   /api/v1/auth/refresh-token     # Rafraîchir le token
POST   /api/v1/auth/forgot-password   # Mot de passe oublié
POST   /api/v1/auth/reset-password    # Réinitialiser le mot de passe
\`\`\`

### Dashboard
\`\`\`
GET    /api/v1/dashboard/summary             # Vue d'ensemble
GET    /api/v1/dashboard/stats               # Statistiques
GET    /api/v1/dashboard/recent-transactions # Transactions récentes
\`\`\`

### Transactions
\`\`\`
GET    /api/v1/transactions          # Liste des transactions
POST   /api/v1/transactions          # Créer une transaction
GET    /api/v1/transactions/:id      # Détails d'une transaction
PUT    /api/v1/transactions/:id      # Modifier une transaction
DELETE /api/v1/transactions/:id      # Supprimer une transaction
POST   /api/v1/transactions/import   # Import CSV
GET    /api/v1/transactions/export   # Export (CSV/PDF)
\`\`\`

### Catégories
\`\`\`
GET    /api/v1/categories            # Liste des catégories
POST   /api/v1/categories            # Créer une catégorie
PUT    /api/v1/categories/:id        # Modifier une catégorie
DELETE /api/v1/categories/:id        # Supprimer une catégorie
\`\`\`

### Comptes Bancaires
\`\`\`
GET    /api/v1/bank-accounts         # Liste des comptes
POST   /api/v1/bank-accounts         # Créer un compte
GET    /api/v1/bank-accounts/:id     # Détails d'un compte
PUT    /api/v1/bank-accounts/:id     # Modifier un compte
DELETE /api/v1/bank-accounts/:id     # Supprimer un compte
POST   /api/v1/bank-accounts/:id/sync # Synchroniser un compte
\`\`\`

### Abonnements
\`\`\`
GET    /api/v1/subscriptions         # Liste des abonnements
POST   /api/v1/subscriptions         # Créer un abonnement
GET    /api/v1/subscriptions/upcoming # Abonnements à venir
GET    /api/v1/subscriptions/stats   # Statistiques
PUT    /api/v1/subscriptions/:id     # Modifier un abonnement
DELETE /api/v1/subscriptions/:id     # Supprimer un abonnement
\`\`\`

### Wishlist
\`\`\`
GET    /api/v1/wishlist              # Liste des items
POST   /api/v1/wishlist              # Créer un item
PUT    /api/v1/wishlist/:id          # Modifier un item
DELETE /api/v1/wishlist/:id          # Supprimer un item
POST   /api/v1/wishlist/:id/add-savings      # Ajouter de l'épargne
GET    /api/v1/wishlist/:id/savings-history  # Historique d'épargne
\`\`\`

### Payment Plans (Paiements 4X)
\`\`\`
GET    /api/v1/payment-plans         # Liste des plans
POST   /api/v1/payment-plans         # Créer un plan
PUT    /api/v1/payment-plans/:id     # Modifier un plan
DELETE /api/v1/payment-plans/:id     # Supprimer un plan
POST   /api/v1/payment-plans/:id/record-payment # Enregistrer un paiement
\`\`\`

### Analytics
\`\`\`
GET    /api/v1/analytics/overview     # Vue d'ensemble
GET    /api/v1/analytics/trends       # Tendances
GET    /api/v1/analytics/categories   # Analyse par catégorie
GET    /api/v1/analytics/predictions  # Prédictions IA
\`\`\`

## 🔐 Sécurité

### Authentification
- Tokens JWT avec expiration (7 jours par défaut)
- Mots de passe hachés avec bcrypt (cost factor 12)
- HttpOnly cookies pour les refresh tokens
- Rate limiting sur les endpoints sensibles (5 tentatives / 15 min)

### Protection
- **CSRF**: Tokens CSRF sur toutes les mutations
- **XSS**: Sanitization avec DOMPurify
- **SQL Injection**: Prisma ORM (requêtes préparées)
- **Headers**: Helmet.js pour headers de sécurité
- **CORS**: Configuration stricte des origines

### Audit
- Tous les logs sont enregistrés avec Winston
- Audit logs pour toutes les actions critiques
- Stockage sécurisé dans PostgreSQL

## 🧪 Tests

### Backend
\`\`\`bash
cd backend
npm test                 # Tests unitaires
npm run test:watch       # Mode watch
npm run test:coverage    # Couverture de code
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm test                 # Tests avec Vitest
npm run test:ui          # Interface de test
npm run test:coverage    # Couverture de code
\`\`\`

## 📦 Déploiement

### Production avec Docker
\`\`\`bash
# Build les images de production
docker-compose -f docker-compose.yml build

# Démarrer en production
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

### Variables d'environnement en production
\`\`\`bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=<secret-minimum-32-caractères>
FRONTEND_URL=https://votre-domaine.com

# Frontend
VITE_API_URL=https://api.votre-domaine.com/api/v1
\`\`\`

### Migrations en production
\`\`\`bash
# Exécuter les migrations
docker-compose exec backend npx prisma migrate deploy

# Vérifier l'état
docker-compose exec backend npx prisma migrate status
\`\`\`

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines
- Utiliser TypeScript strict mode
- Suivre le style guide Airbnb
- Écrire des tests pour les nouvelles fonctionnalités
- Maintenir une couverture de code > 80%
- Documenter les fonctions complexes

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Jules** - [GitHub](https://github.com/yourusername)

## 🙏 Remerciements

- [Prisma](https://www.prisma.io/) - ORM moderne pour Node.js
- [React](https://reactjs.org/) - Bibliothèque UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Express](https://expressjs.com/) - Framework Node.js
- [PostgreSQL](https://www.postgresql.org/) - Base de données

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue](https://github.com/yourusername/smart-budget/issues)
- Consulter la [documentation](https://docs.smartbudget.app)

---

**Made with ❤️ and TypeScript**
# budget-app-v3
