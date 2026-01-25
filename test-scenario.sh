#!/bin/bash
# Scénario de test complet - Smart Budget

echo "🎬 Démarrage du scénario de test complet"
echo "======================================"

API="http://localhost:3000/api/v1"
TIMESTAMP=$(date +%s)
EMAIL="user${TIMESTAMP}@test.com"
PASSWORD="Test123!@#"

# 1. Inscription
echo -e "\n1️⃣  Inscription..."
REGISTER=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"user${TIMESTAMP}\",\"password\":\"$PASSWORD\",\"firstName\":\"Alice\",\"lastName\":\"Test\"}")

if echo "$REGISTER" | grep -q '"success":true'; then
  echo "✅ Compte créé: $EMAIL"
else
  echo "❌ Erreur inscription"
  echo "$REGISTER"
  exit 1
fi

# 2. Connexion
echo -e "\n2️⃣  Connexion..."
LOGIN=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Connecté!"
else
  echo "❌ Erreur connexion"
  exit 1
fi

# 3. Initialisation Catégories
echo -e "\n3️⃣  Init Catégories..."
INIT_CATS=$(curl -s -X POST "$API/categories/init-defaults" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# 4. Lister Catégories & Récupérer ID
CATS=$(curl -s -X GET "$API/categories" -H "Authorization: Bearer $TOKEN")
CAT_ID=$(echo "$CATS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CAT_ID" ]; then
  echo "✅ Catégorie trouvée (ID: $CAT_ID)"
else
  echo "❌ Aucune catégorie trouvée"
  exit 1
fi

# 5. Créer Transaction
echo -e "\n4️⃣  Création Transaction..."
TX=$(curl -s -X POST "$API/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 50.00,
    \"type\": \"EXPENSE\",
    \"description\": \"Test Achat\",
    \"categoryId\": \"$CAT_ID\",
    \"date\": \"$(date +%Y-%m-%d)\"
  }")

if echo "$TX" | grep -q '"success":true'; then
  echo "✅ Transaction créée"
else
  echo "❌ Erreur transaction"
  echo "$TX"
  exit 1
fi

# 6. Dashboard Summary
echo -e "\n5️⃣  Dashboard Summary..."
SUMMARY=$(curl -s -X GET "$API/dashboard/summary" -H "Authorization: Bearer $TOKEN")

echo "$SUMMARY" | grep -o '"totalExpenses":[^,]*'
echo "✅ Scénario terminé avec succès!"
