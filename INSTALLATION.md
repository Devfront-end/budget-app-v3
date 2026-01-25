# 🚀 Guide d'Installation - Smart Budget

Ce guide vous accompagne étape par étape pour installer et démarrer l'application Smart Budget.

---

## 📋 Prérequis Système

- **macOS** (votre système actuel)
- **Accès administrateur** (pour certaines installations)
- **Connexion Internet**
- **Git** (normalement préinstallé sur macOS)

---

## Étape 1 : Installation de Node.js

Node.js est requis pour exécuter le backend et le frontend. Choisissez **l'une** des 3 options ci-dessous :

### 🟢 Option 1 : Installation Officielle (Recommandée pour débuter)

**La plus simple et rapide**

1. **Téléchargez Node.js** :
   - Ouvrez votre navigateur
   - Allez sur https://nodejs.org/
   - Cliquez sur le bouton **"Download Node.js (LTS)"** - version 20.x
   - Le fichier `.pkg` se télécharge automatiquement

2. **Installez Node.js** :
   - Localisez le fichier téléchargé (généralement dans `~/Downloads/`)
   - Double-cliquez sur `node-vXX.XX.X.pkg`
   - Suivez l'assistant d'installation :
     - Cliquez sur "Continuer"
     - Acceptez la licence
     - Choisissez l'emplacement d'installation (laisser par défaut)
     - Cliquez sur "Installer"
     - Entrez votre mot de passe administrateur
     - Attendez la fin de l'installation (1-2 minutes)

3. **Vérifiez l'installation** :
   ```bash
   # Ouvrez un nouveau terminal et tapez :
   node --version
   # Devrait afficher : v20.x.x
   
   npm --version
   # Devrait afficher : 10.x.x
   ```

4. **Si les commandes fonctionnent** ✅ :
   - Node.js est installé !
   - Passez directement à l'**Étape 2**

---

### 🔵 Option 2 : Via Homebrew (Recommandée pour développeurs)

**Meilleur contrôle et mises à jour faciles**

#### A. Installer Homebrew (si pas déjà installé)

1. **Vérifiez si Homebrew est installé** :
   ```bash
   which brew
   ```
   
   - Si vous voyez `/opt/homebrew/bin/brew` → Homebrew est installé, passez à l'étape B
   - Si vous voyez `brew not found` → Continuez ci-dessous

2. **Installez Homebrew** :
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   
   - Appuyez sur **ENTER** quand demandé
   - Entrez votre **mot de passe administrateur** (les caractères ne s'affichent pas, c'est normal)
   - Attendez la fin de l'installation (5-10 minutes)

3. **Configurez Homebrew dans votre terminal** :
   ```bash
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. **Vérifiez Homebrew** :
   ```bash
   brew --version
   # Devrait afficher : Homebrew 4.x.x
   ```

#### B. Installer Node.js avec Homebrew

1. **Installez Node.js** :
   ```bash
   brew install node@20
   ```
   
   - Attendez la fin du téléchargement et de l'installation (5 minutes)

2. **Ajoutez Node.js au PATH** :
   ```bash
   echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Vérifiez l'installation** :
   ```bash
   node --version
   npm --version
   ```

4. **Si les commandes fonctionnent** ✅ :
   - Node.js est installé !
   - Passez à l'**Étape 2**

---

### 🟣 Option 3 : Via nvm (Recommandée pour projets multiples)

**Permet de gérer plusieurs versions de Node.js**

1. **Installez nvm** :
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. **Configurez nvm** :
   ```bash
   echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
   echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
   echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Installez Node.js LTS** :
   ```bash
   nvm install --lts
   nvm use --lts
   nvm alias default node
   ```

4. **Vérifiez l'installation** :
   ```bash
   node --version
   npm --version
   ```

5. **Si les commandes fonctionnent** ✅ :
   - Node.js est installé !
   - Passez à l'**Étape 2**

---

## Étape 2 : Installation des Dépendances du Projet

Maintenant que Node.js est installé, nous allons installer les dépendances.

### Backend

1. **Naviguez vers le dossier backend** :
   ```bash
   cd /Users/jules/budget-app/backend
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```
   
   - Attendez la fin (2-3 minutes)
   - Vous verrez de nombreux packages s'installer
   - Ignorez les warnings (normal pour les dépendances)

3. **Vérifiez que tout est installé** :
   ```bash
   ls node_modules | wc -l
   # Devrait afficher un nombre > 500
   ```

### Frontend

1. **Naviguez vers le dossier frontend** :
   ```bash
   cd /Users/jules/budget-app/frontend
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```
   
   - Attendez la fin (2-3 minutes)

3. **Vérifiez que tout est installé** :
   ```bash
   ls node_modules | wc -l
   # Devrait afficher un nombre > 300
   ```

✅ **Les dépendances sont maintenant installées !**

---

## Étape 3 : Installation de PostgreSQL et Redis

Vous avez **2 options** : Docker (plus simple) ou installation locale.

### 🐳 Option A : Avec Docker (Recommandée)

**Tout en un, facile à gérer**

#### 1. Installer Docker Desktop

1. **Téléchargez Docker Desktop** :
   - Allez sur https://www.docker.com/products/docker-desktop
   - Cliquez sur "Download for Mac" (choisir Apple Silicon si M1/M2/M3)
   - Installez le fichier `.dmg`

2. **Lancez Docker Desktop** :
   - Ouvrez Docker depuis Applications
   - Acceptez les conditions
   - Attendez que Docker démarre (icône baleine dans la barre de menu)

3. **Vérifiez Docker** :
   ```bash
   docker --version
   docker-compose --version
   ```

#### 2. Configurer l'environnement

```bash
cd /Users/jules/budget-app

# Créez le fichier .env
cp .env.example .env

# Éditez le fichier .env (optionnel, les valeurs par défaut fonctionnent)
nano .env
```

Contenu du `.env` :
```env
DB_PASSWORD=password123
JWT_SECRET=votre-secret-jwt-super-securise-minimum-32-caracteres
```

Appuyez sur `Ctrl+X`, puis `Y`, puis `Enter` pour sauvegarder.

#### 3. Démarrer tous les services

```bash
# Démarrez PostgreSQL, Redis, Backend, Frontend
docker-compose up -d

# Vérifiez que tout tourne
docker-compose ps
```

Vous devriez voir 4 services "Up" :
- ✅ smart-budget-db (PostgreSQL)
- ✅ smart-budget-redis (Redis)
- ✅ smart-budget-backend (API)
- ✅ smart-budget-frontend (UI)

#### 4. Initialiser la base de données

```bash
# Exécutez les migrations Prisma
docker-compose exec backend npx prisma migrate dev --name init

# Vérifiez que la base est créée
docker-compose exec backend npx prisma studio
```

#### 5. Accédez à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:3000
- **Prisma Studio** : http://localhost:5555 (outil de gestion DB)

✅ **Avec Docker, c'est terminé ! Passez à l'Étape 4**

---

### 💻 Option B : Installation Locale (Sans Docker)

#### 1. Installer PostgreSQL

**Via Homebrew** :
```bash
# Installez PostgreSQL
brew install postgresql@15

# Démarrez le service
brew services start postgresql@15

# Créez la base de données
createdb budget_app

# Créez l'utilisateur
psql postgres -c "CREATE USER budget_user WITH PASSWORD 'password123';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE budget_app TO budget_user;"
psql postgres -c "ALTER USER budget_user CREATEDB;"
```

**Vérifiez** :
```bash
psql -U budget_user -d budget_app -c "SELECT version();"
```

#### 2. Installer Redis

```bash
# Installez Redis
brew install redis

# Démarrez le service
brew services start redis

# Vérifiez
redis-cli ping
# Devrait répondre : PONG
```

#### 3. Configurer le Backend

```bash
cd /Users/jules/budget-app/backend

# Copiez le fichier d'environnement
cp .env.example .env

# Éditez le fichier .env
nano .env
```

Modifiez la `DATABASE_URL` :
```env
DATABASE_URL="postgresql://budget_user:password123@localhost:5432/budget_app?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="votre-secret-jwt-super-securise-minimum-32-caracteres"
```

#### 4. Initialiser Prisma

```bash
# Générez le client Prisma
npx prisma generate

# Exécutez les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrez Prisma Studio
npx prisma studio
```

#### 5. Configurer le Frontend

```bash
cd /Users/jules/budget-app/frontend

# Copiez le fichier d'environnement
cp .env.example .env
```

Le fichier `.env` devrait contenir :
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Étape 4 : Démarrage de l'Application

### Avec Docker (si vous avez choisi l'Option A) :

✅ **Déjà démarré !** L'application tourne automatiquement.

```bash
# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down

# Redémarrer l'application
docker-compose up -d
```

### Sans Docker (si vous avez choisi l'Option B) :

**Ouvrez 2 terminaux** :

#### Terminal 1 - Backend

```bash
cd /Users/jules/budget-app/backend
npm run dev
```

Vous devriez voir :
```
✅ Database connected successfully
✅ Redis connected successfully
🚀 Server running on port 3000
```

#### Terminal 2 - Frontend

```bash
cd /Users/jules/budget-app/frontend
npm run dev
```

Vous devriez voir :
```
  VITE v5.0.10  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Étape 5 : Accéder à l'Application

### Ouvrez votre navigateur

1. **Frontend** : http://localhost:5173 (ou http://localhost si Docker)
2. **Backend API** : http://localhost:3000/health

### Créez votre compte

1. Allez sur http://localhost:5173
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire :
   - Prénom / Nom (optionnel)
   - Nom d'utilisateur
   - Email
   - Mot de passe (minimum 8 caractères)
4. Cliquez sur "S'inscrire"
5. Connectez-vous avec vos identifiants

✅ **Vous êtes maintenant dans l'application !**

---

## 🔧 Commandes Utiles

### Docker

```bash
# Voir tous les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Supprimer tout (y compris les données)
docker-compose down -v

# Reconstruire les images
docker-compose build
docker-compose up -d
```

### Backend

```bash
cd backend

# Démarrer en développement
npm run dev

# Lancer les tests
npm test

# Vérifier le code (ESLint)
npm run lint

# Formater le code (Prettier)
npm run format

# Prisma Studio (interface graphique DB)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_de_la_migration

# Réinitialiser la base de données
npx prisma migrate reset
```

### Frontend

```bash
cd frontend

# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Lancer les tests
npm test

# Vérifier le code
npm run lint

# Formater le code
npm run format
```

---

## 🐛 Résolution de Problèmes

### Erreur : "node: command not found"

**Solution** : Node.js n'est pas dans le PATH
```bash
# Redémarrez votre terminal
# OU ajoutez Node.js au PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Erreur : "Cannot connect to database"

**Solution** : PostgreSQL n'est pas démarré
```bash
# Avec Docker
docker-compose up -d postgres

# Sans Docker
brew services start postgresql@15
```

### Erreur : "Redis connection failed"

**Solution** : Redis n'est pas démarré
```bash
# Avec Docker
docker-compose up -d redis

# Sans Docker
brew services start redis
```

### Erreur : "Port 3000 already in use"

**Solution** : Un autre processus utilise le port
```bash
# Trouvez le processus
lsof -i :3000

# Tuez le processus (remplacez PID par le numéro)
kill -9 PID

# OU utilisez un autre port dans backend/.env
PORT=3001
```

### Erreur : "Prisma Client not generated"

**Solution** : Générez le client Prisma
```bash
cd backend
npx prisma generate
```

### Les changements de code ne se reflètent pas

**Solution** : Le hot reload est cassé
```bash
# Redémarrez le serveur
# Ctrl+C puis relancez npm run dev
```

---

## 📚 Ressources Supplémentaires

### Documentation

- **Node.js** : https://nodejs.org/docs
- **React** : https://react.dev
- **Prisma** : https://www.prisma.io/docs
- **PostgreSQL** : https://www.postgresql.org/docs
- **Redis** : https://redis.io/docs
- **Docker** : https://docs.docker.com

### Tutoriels

- **Prisma Getting Started** : https://www.prisma.io/docs/getting-started
- **React Tutorial** : https://react.dev/learn
- **TypeScript Handbook** : https://www.typescriptlang.org/docs

---

## ✅ Checklist d'Installation

Cochez au fur et à mesure :

- [ ] Node.js installé et vérifié (`node --version`)
- [ ] npm installé et vérifié (`npm --version`)
- [ ] Dépendances backend installées (`cd backend && npm install`)
- [ ] Dépendances frontend installées (`cd frontend && npm install`)
- [ ] PostgreSQL installé et démarré
- [ ] Redis installé et démarré
- [ ] Base de données créée
- [ ] Migrations Prisma exécutées
- [ ] Fichiers `.env` configurés
- [ ] Backend démarre sans erreur (`npm run dev`)
- [ ] Frontend démarre sans erreur (`npm run dev`)
- [ ] Application accessible dans le navigateur
- [ ] Compte utilisateur créé
- [ ] Connexion réussie

---

## 🎉 Félicitations !

Votre environnement de développement Smart Budget est maintenant opérationnel !

**Prochaines étapes** :
1. Explorez le dashboard
2. Créez vos premières transactions
3. Configurez vos catégories
4. Ajoutez vos comptes bancaires

**Besoin d'aide ?**
- Consultez le README.md
- Vérifiez la documentation dans `/docs`
- Ouvrez une issue sur GitHub

---

*Guide créé le 4 janvier 2026*
*Version Smart Budget: 1.0.0*
