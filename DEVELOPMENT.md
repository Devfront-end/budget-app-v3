# 🎯 Guide de développement - Fonctionnalités Smart Budget

## 📋 Statut actuel

### ✅ Infrastructure (Complète)
- Backend API avec Express + TypeScript
- Frontend React + Redux + TypeScript
- Base de données PostgreSQL avec Prisma
- Authentification JWT sécurisée
- Docker containers opérationnels

### 🔨 Fonctionnalités à développer

Les **controllers backend** et **pages frontend** sont en place mais nécessitent l'implémentation de la logique métier.

---

## 🏗️ Architecture des fonctionnalités

### 1. 💸 Transactions
**Backend**: `backend/src/controllers/transaction.controller.ts`
**Frontend**: `frontend/src/pages/Transactions.tsx`
**Service**: `frontend/src/services/transactionService.ts`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Liste paginée avec filtres (type, catégorie, compte, dates)
- 🔨 Formulaire création/édition
- 🔨 Upload de pièces jointes (reçus)
- 🔨 Recherche avancée
- 🔨 Export CSV/PDF

**Endpoints API**:
```typescript
GET    /api/v1/transactions?page=1&limit=50&type=EXPENSE&categoryId=xxx
GET    /api/v1/transactions/:id
POST   /api/v1/transactions
PUT    /api/v1/transactions/:id
DELETE /api/v1/transactions/:id
```

---

### 2. 🏷️ Catégories
**Backend**: `backend/src/controllers/category.controller.ts`
**Frontend**: `frontend/src/pages/Categories.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 CRUD catégories (nom, type, couleur, icône)
- 🔨 Catégories par défaut au premier login
- 🔨 Statistiques par catégorie
- 🔨 Validation: impossible de supprimer si transactions liées

**Endpoints API**:
```typescript
GET    /api/v1/categories?type=EXPENSE
POST   /api/v1/categories
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

---

### 3. 🏦 Comptes bancaires
**Backend**: `backend/src/controllers/bankAccount.controller.ts`
**Frontend**: `frontend/src/pages/BankAccounts.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Gestion multi-comptes (courant, épargne, carte crédit)
- 🔨 Solde en temps réel
- 🔨 Historique des mouvements
- 🔨 Archivage de comptes
- 🔨 Calcul solde total

**Endpoints API**:
```typescript
GET    /api/v1/bank-accounts?includeArchived=false
GET    /api/v1/bank-accounts/:id
POST   /api/v1/bank-accounts
PUT    /api/v1/bank-accounts/:id
DELETE /api/v1/bank-accounts/:id
```

---

### 4. 🔄 Abonnements
**Backend**: `backend/src/controllers/subscription.controller.ts`
**Frontend**: `frontend/src/pages/Subscriptions.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Tracking abonnements récurrents
- 🔨 Fréquences: DAILY, WEEKLY, MONTHLY, YEARLY
- 🔨 Calcul coût annuel
- 🔨 Prochaine date de facturation
- 🔨 Alertes avant prélèvement
- 🔨 Statuts: ACTIVE, CANCELLED, PAUSED

**Endpoints API**:
```typescript
GET    /api/v1/subscriptions
GET    /api/v1/subscriptions/:id
POST   /api/v1/subscriptions
PUT    /api/v1/subscriptions/:id
DELETE /api/v1/subscriptions/:id
```

---

### 5. 🎁 Wishlist
**Backend**: `backend/src/controllers/wishlist.controller.ts`
**Frontend**: `frontend/src/pages/Wishlist.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Objectifs d'épargne personnalisés
- 🔨 Montant cible et échéance
- 🔨 Priorités (HIGH, MEDIUM, LOW)
- 🔨 Progression en pourcentage
- 🔨 Contributions manuelles
- 🔨 Projection d'atteinte objectif

**Endpoints API**:
```typescript
GET    /api/v1/wishlist
GET    /api/v1/wishlist/:id
POST   /api/v1/wishlist
PUT    /api/v1/wishlist/:id
DELETE /api/v1/wishlist/:id
POST   /api/v1/wishlist/:id/contribute
```

---

### 6. 💳 Paiements échelonnés (4X)
**Backend**: `backend/src/controllers/paymentPlan.controller.ts`
**Frontend**: `frontend/src/pages/PaymentPlans.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Achats en plusieurs mensualités
- 🔨 Taux d'intérêt et frais
- 🔨 Calendrier de paiements
- 🔨 Statuts: PENDING, PAID, LATE, CANCELLED
- 🔨 Tracking du solde restant
- 🔨 Alertes d'échéances

**Endpoints API**:
```typescript
GET    /api/v1/payment-plans
GET    /api/v1/payment-plans/:id
POST   /api/v1/payment-plans
PUT    /api/v1/payment-plans/:id
DELETE /api/v1/payment-plans/:id
POST   /api/v1/payment-plans/:id/pay
```

---

### 7. 📊 Analytics
**Backend**: `backend/src/controllers/analytics.controller.ts`
**Frontend**: `frontend/src/pages/Analytics.tsx`

**Fonctionnalités à implémenter**:
- ✅ Structure de base créée
- 🔨 Graphiques de tendances
- 🔨 Évolution mensuelle/annuelle
- 🔨 Répartition par catégorie (pie charts)
- 🔨 Prévisions basées sur l'historique
- 🔨 Comparaisons période à période
- 🔨 Export rapports PDF/CSV

**Endpoints API**:
```typescript
GET    /api/v1/analytics/overview?startDate=xxx&endDate=xxx
GET    /api/v1/analytics/by-category
GET    /api/v1/analytics/trends
GET    /api/v1/analytics/forecast
```

---

## 🚀 Marche à suivre pour chaque fonctionnalité

### Étape 1: Backend Controller
1. Ouvrir le fichier controller correspondant
2. Remplacer les stubs par la vraie logique:
   - Validation des entrées
   - Requêtes Prisma
   - Gestion des erreurs
   - Logs
3. Tester avec curl ou Postman

### Étape 2: Frontend Service
1. Créer/compléter le service dans `frontend/src/services/`
2. Définir les interfaces TypeScript
3. Implémenter les appels API avec axios
4. Gérer les erreurs

### Étape 3: Frontend Components
1. Créer composants réutilisables dans `frontend/src/components/`
2. Formulaires avec react-hook-form + zod
3. Tableaux avec pagination
4. Modals pour création/édition

### Étape 4: Frontend Pages
1. Compléter les pages dans `frontend/src/pages/`
2. Intégrer Redux pour le state
3. Ajouter les composants
4. Gérer loading et erreurs
5. Ajouter notifications toast

### Étape 5: Tests
1. Tester CRUD complet
2. Vérifier permissions utilisateur
3. Tester cas limites
4. Valider UX

---

## 📦 Composants UI à créer

### Composants réutilisables recommandés:
```
frontend/src/components/ui/
├── Button.tsx          # Boutons avec variantes
├── Input.tsx           # Inputs avec validation
├── Select.tsx          # Dropdowns
├── Modal.tsx           # Modales
├── Table.tsx           # Tableaux avec pagination
├── Card.tsx            # Cartes
├── Badge.tsx           # Labels/tags
├── DatePicker.tsx      # Sélecteur de dates
├── AmountInput.tsx     # Input pour montants
└── LoadingSpinner.tsx  # Indicateur de chargement
```

---

## 🎨 Design Pattern

### Redux Slices
```typescript
frontend/src/store/slices/
├── authSlice.ts       ✅ (existant)
├── transactionSlice.ts
├── categorySlice.ts   ✅ (existant)
├── bankAccountSlice.ts
├── subscriptionSlice.ts
├── wishlistSlice.ts
├── paymentPlanSlice.ts
└── analyticsSlice.ts
```

### Services API
```typescript
frontend/src/services/
├── api.ts              ✅ (existant)
├── authService.ts      ✅ (existant)
├── transactionService.ts ✅ (existant)
├── categoryService.ts
├── bankAccountService.ts
├── subscriptionService.ts
├── wishlistService.ts
├── paymentPlanService.ts
└── analyticsService.ts
```

---

## 🔐 Sécurité à respecter

✅ **Toujours vérifier**:
1. Authentification (JWT middleware)
2. Autorisation (userId match)
3. Validation des entrées (backend + frontend)
4. Sanitization des données
5. Rate limiting sur endpoints sensibles
6. Logs d'audit pour actions importantes

---

## 📝 Exemple d'implémentation complète

### Transaction Controller (Backend)
```typescript
static async create(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { amount, type, categoryId, bankAccountId, description, date } = req.body;

    // Validation
    if (!amount || !type || !categoryId || !bankAccountId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Missing required fields' },
      });
    }

    // Création
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId!,
        amount: parseFloat(amount),
        type,
        categoryId,
        bankAccountId,
        description,
        date: date ? new Date(date) : new Date(),
      },
      include: { category: true, bankAccount: true },
    });

    // Log + Response
    logger.info(\`Transaction created: \${transaction.id}\`);
    res.status(201).json({
      success: true,
      data: { transaction },
      message: 'Transaction created successfully',
    });
  } catch (error: any) {
    logger.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create transaction' },
    });
  }
}
```

---

## ✅ Checklist par fonctionnalité

### Avant de marquer comme "terminé":
- [ ] Backend: Controller implémenté et testé
- [ ] Backend: Validation des données
- [ ] Backend: Gestion d'erreurs robuste
- [ ] Backend: Logs appropriés
- [ ] Frontend: Service API créé
- [ ] Frontend: Composants UI créés
- [ ] Frontend: Page complète et fonctionnelle
- [ ] Frontend: Redux slice intégré
- [ ] Frontend: Gestion loading/erreurs
- [ ] Tests: CRUD complet fonctionne
- [ ] Tests: Cas limites gérés
- [ ] UX: Interface intuitive
- [ ] UX: Messages d'erreur clairs

---

## 🚦 Ordre recommandé de développement

1. **Catégories** (simple, base pour transactions)
2. **Comptes bancaires** (nécessaire pour transactions)
3. **Transactions** (fonctionnalité principale)
4. **Analytics** (utilise les transactions)
5. **Abonnements** (extension des transactions)
6. **Wishlist** (indépendant)
7. **Paiements échelonnés** (le plus complexe)

---

## 📚 Ressources

- **Prisma Docs**: https://www.prisma.io/docs
- **React Hook Form**: https://react-hook-form.com
- **Recharts**: https://recharts.org
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Note**: Les structures de base sont en place. Il suffit de remplacer les stubs par la logique métier suivant les patterns déjà établis dans le controller d'authentification.

**Temps estimé par fonctionnalité**: 2-4 heures
**Temps total estimé**: 14-28 heures de développement
