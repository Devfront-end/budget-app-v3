# 🚀 Smart Budget - Aide-Mémoire

## 🎉 Installation terminée avec succès !

### ✅ Ce qui a été fait :

**Installation automatisée**
- ✅ Homebrew installé
- ✅ Node.js v20.19.6 installé
- ✅ Toutes les dépendances npm installées

**Corrections TypeScript**
- ✅ Options strictes ajustées pour le développement
- ✅ Imports corrigés (authenticateJWT)
- ✅ Types Router explicites
- ✅ Configuration Vite.env créée
- ✅ PostCSS converti en ESM
- ✅ Classes CSS Tailwind corrigées

**Docker optimisé**
- ✅ OpenSSL installé dans les containers Alpine
- ✅ Backend compilé et lancé
- ✅ Frontend construit avec Nginx
- ✅ PostgreSQL et Redis opérationnels

**Base de données**
- ✅ Migrations Prisma appliquées
- ✅ Schéma complet déployé
- ✅ 11 tables créées

### 🌐 L'application est accessible :
- **Frontend**: http://localhost
- **Backend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 📝 Scripts créés :
- `./install.sh` - Installation complète automatisée
- `./start.sh` - Démarrage rapide des services
- `SUCCESS.md` - Guide complet de l'installation

### 🚀 Prochaines étapes :
1. Ouvrir http://localhost dans votre navigateur
2. Créer un compte utilisateur
3. Commencer à gérer vos finances !

---

## Démarrage rapide

```bash
# Démarrer l'application
./start.sh

# OU manuellement
docker-compose up -d
```

## 🌐 URLs importantes

- **Application**: http://localhost
- **API Backend**: http://localhost:3000
- **Database**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## 📝 Commandes essentielles

### Gestion des services
```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f

# Voir le statut
docker-compose ps
```

### Base de données
```bash
# Accéder à PostgreSQL
docker-compose exec postgres psql -U postgres -d budget_app

# Créer une migration
docker-compose exec backend npx prisma migrate dev --name ma_migration

# Reset la base (⚠️ efface tout)
docker-compose exec backend npx prisma migrate reset
```

### Développement
```bash
# Rebuild après modification
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Installer des dépendances
cd backend && npm install package-name
cd frontend && npm install package-name
```

## 🛠️ Dépannage rapide

### Réinstaller complètement
```bash
docker-compose down -v
./install.sh
```

### Voir les erreurs
```bash
docker-compose logs backend --tail=50
docker-compose logs frontend --tail=50
```

### Nettoyer Docker
```bash
docker-compose down
docker system prune -a
```

## 📁 Fichiers importants

- `docker-compose.yml` - Configuration Docker
- `backend/prisma/schema.prisma` - Schéma de la base de données
- `backend/.env` - Variables d'environnement backend
- `frontend/.env` - Variables d'environnement frontend

## 🔑 Identifiants par défaut

**PostgreSQL**
- User: `postgres`
- Password: `postgres`
- Database: `budget_app`

**JWT Secret** (à changer en production)
- Défini dans `backend/.env`

## ✅ Vérification santé

```bash
# Vérifier que tout fonctionne
curl http://localhost              # Frontend
curl http://localhost:3000/api/v1  # Backend
docker-compose ps                  # Services Docker
```
