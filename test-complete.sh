#!/bin/bash

# Script de test pour Smart Budget
echo "🧪 Test Smart Budget API"
echo "========================"

BASE_URL="http://localhost:3000/api/v1"

# 1. Connexion
echo -e "\n📝 1. Connexion..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@budget.app","password":"Demo1234!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur de connexion"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "✅ Connecté! Token: ${TOKEN:0:20}..."

# 2. Créer les catégories par défaut (si pas déjà fait)
echo -e "\n📁 2. Initialisation des catégories..."
CATEGORIES=$(curl -s -X POST $BASE_URL/categories/init-defaults \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo $CATEGORIES | jq '.'

# 3. Lister les catégories
echo -e "\n📋 3. Liste des catégories..."
CATEGORIES_LIST=$(curl -s -X GET $BASE_URL/categories \
  -H "Authorization: Bearer $TOKEN")
echo $CATEGORIES_LIST | jq '.data.categories[] | {name, icon, color}'

# Récupérer l'ID de la première catégorie
CATEGORY_ID=$(echo $CATEGORIES_LIST | jq -r '.data.categories[0].id')
echo -e "\n🎯 Catégorie sélectionnée: $CATEGORY_ID"

# 4. Créer une transaction
echo -e "\n💸 4. Création d'une transaction de test..."
TRANSACTION=$(curl -s -X POST $BASE_URL/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 42.50,
    \"type\": \"EXPENSE\",
    \"description\": \"Test Carrefour\",
    \"categoryId\": \"$CATEGORY_ID\",
    \"date\": \"$(date +%Y-%m-%d)\"
  }")
echo $TRANSACTION | jq '.'

# 5. Lister les transactions
echo -e "\n📊 5. Liste des transactions..."
TRANSACTIONS=$(curl -s -X GET "$BASE_URL/transactions?limit=5" \
  -H "Authorization: Bearer $TOKEN")
echo $TRANSACTIONS | jq '.data.transactions[] | {description, amount, type, date}'

echo -e "\n✅ Tests terminés!"
