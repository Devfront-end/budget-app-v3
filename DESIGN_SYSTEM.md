# 🎨 Design System Premium - Smart Budget

## Vue d'ensemble

Smart Budget utilise un design system premium basé sur le **glassmorphism** avec une approche mobile-first et des animations micro-interactions pour une expérience utilisateur native.

## 🎨 Palette de Couleurs

### Couleurs Primaires
```css
--primary-50: #EEF2FF
--primary-500: #4F46E5 (Indigo principal)
--primary-600: #4338CA
--secondary-500: #7C3AED (Violet)
--secondary-600: #6D28D9
```

### Couleurs Fonctionnelles
```css
--success-500: #10B981 (Revenus, actions positives)
--success-600: #059669
--danger-500: #F43F5E (Dépenses, alertes)
--danger-600: #E11D48
```

### Dégradés
- **Primary Gradient**: `from-primary-500 to-secondary-500`
- **Success Gradient**: `from-success-500 to-success-600`
- **Danger Gradient**: `from-danger-500 to-danger-600`

## 📐 Composants

### 1. Glass Card
```tsx
<div className="glass-card">
  {/* Contenu */}
</div>
```
- **Style**: Fond blanc/80% transparent, backdrop-blur-xl, rounded-3xl
- **Usage**: Conteneurs principaux, sections, widgets

### 2. Balance Card (Credit Card Style)
```tsx
<BalanceCard balance={5847.32} />
```
- **Style**: Dégradé primary→secondary, pattern décoratif, rounded-3xl
- **Usage**: Affichage du solde principal sur Dashboard

### 3. FAB (Floating Action Button)
```tsx
<FABButton 
  icon="➕" 
  label="Ajouter" 
  onClick={handleClick} 
  variant="primary" 
/>
```
- **Variants**: `primary | success | danger`
- **Animations**: scale(1.1) au hover, scale(0.9) au tap
- **Usage**: Actions rapides sur Dashboard

### 4. Transaction Item
```tsx
<TransactionItem
  icon="🛒"
  title="Carrefour"
  date="Aujourd'hui, 14:30"
  amount={47.32}
  type="EXPENSE"
  color="#F43F5E"
/>
```
- **Style**: Fond white/50% hover white/70%, rounded-2xl, icône colorée
- **Animations**: Slide-in de gauche (x: -20 → 0)

### 5. Stats Card
```tsx
<StatsCard
  title="Revenus ce mois"
  value="3 200,00 €"
  change={12.5}
  icon="💰"
/>
```
- **Features**: Indicateur de variation (↑/↓), icône, valeur principale
- **Usage**: KPIs sur Dashboard

### 6. Bottom Navigation (Mobile)
```tsx
<BottomNav />
```
- **Style**: Fixed bottom, backdrop-blur-xl, ombre flottante
- **Items**: Accueil, Transactions, Analytics, Objectifs
- **Animation**: Indicateur actif animé avec layoutId

### 7. Skeleton Loader
```tsx
<SkeletonCard />
```
- **Animation**: Shimmer effect (gradient qui se déplace)
- **Usage**: États de chargement

## 🎭 Animations

### Framer Motion Variants
```typescript
// Conteneur avec stagger
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Items enfants
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

### Micro-interactions
- **Hover**: `scale(1.05)` pour les cartes cliquables
- **Tap**: `scale(0.95)` pour les boutons
- **Slide-in**: Transactions avec `x: -20 → 0`
- **Fade-in**: Chargement avec `opacity: 0 → 1`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 1024px (Bottom Nav, Header simplifié)
- **Desktop**: ≥ 1024px (Sidebar, Header complet)

### Mobile-First
```tsx
<div className="lg:hidden">
  {/* Version mobile */}
</div>
<div className="hidden lg:block">
  {/* Version desktop */}
</div>
```

## 🎨 Typographie

### Fonts
- **Titres**: Outfit (bold, semi-bold)
- **Corps**: Inter (regular, medium)

### Échelle
```css
text-xs: 0.75rem
text-sm: 0.875rem
text-base: 1rem
text-lg: 1.125rem
text-xl: 1.25rem
text-2xl: 1.5rem
text-3xl: 1.875rem
text-5xl: 3rem
```

## 🔘 Boutons

### Styles Disponibles
```tsx
// Primary - Dégradé bleu/violet
<button className="btn-primary">Confirmer</button>

// Secondary - Transparent avec bordure
<button className="btn-secondary">Annuler</button>

// Success - Dégradé vert
<button className="btn-success">Valider</button>

// Danger - Dégradé rouge
<button className="btn-danger">Supprimer</button>

// FAB - Floating Action Button
<button className="btn-fab">+</button>
```

## 📦 Inputs

### Input Premium
```tsx
<input className="input-premium" placeholder="Montant" />
```
- **Style**: Rounded-2xl, backdrop-blur, bordure focus primary-500

## 🏷️ Badges

### Types
```tsx
<span className="badge-success">Revenu</span>
<span className="badge-danger">Dépense</span>
<span className="badge-warning">En attente</span>
<span className="badge-info">Info</span>
```

## 🌈 Backgrounds

### Gradient de fond
```tsx
<div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  {/* Contenu */}
</div>
```

## 🎯 Best Practices

### 1. Utiliser les composants réutilisables
- Import depuis `@/components/ui/PremiumComponents`
- Ne pas recréer les styles en inline

### 2. Respecter les espacements
- **Marges**: mb-4, mb-6, mb-8 (multiples de 4)
- **Padding**: p-4, p-6, p-8
- **Gap**: gap-3, gap-4, gap-6

### 3. Animations cohérentes
- Toujours utiliser Framer Motion pour les animations
- Respecter les variants définis
- Duration par défaut: 0.3s

### 4. Mobile-First
- Commencer par le design mobile
- Ajouter les breakpoints desktop avec `lg:`
- Tester sur toutes les tailles

### 5. Accessibilité
- Toujours ajouter des labels
- Ratios de contraste WCAG AA minimum
- Focus visible sur tous les éléments interactifs

## 🚀 Prochaines Étapes

1. ✅ Tailwind config avec design tokens
2. ✅ CSS glassmorphism components
3. ✅ Composants UI réutilisables
4. ✅ Dashboard premium
5. ✅ Bottom navigation mobile
6. ⏳ Pages Transactions avec design premium
7. ⏳ Modales avec backdrop-blur
8. ⏳ Formulaires avec validation et animations
9. ⏳ Dark mode complet
10. ⏳ Graphiques avec Recharts + glassmorphism

## 📚 Ressources

- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Glassmorphism**: https://css.glass
- **React Icons**: https://react-icons.github.io/react-icons
