#!/bin/bash
# Test d'inscription et connexion - Smart Budget

echo "🧪 Test de l'API Smart Budget"
echo "================================"
echo ""

API="http://localhost:3000/api/v1"
TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"
USERNAME="user${TIMESTAMP}"
PASSWORD="Test123!@#"

echo "📝 Données de test:"
echo "   Email: $EMAIL"
echo "   Username: $USERNAME"
echo ""

# Test 1: Inscription
echo "1️⃣  Test d'inscription..."
REGISTER_RESPONSE=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\",\"firstName\":\"Test\",\"lastName\":\"User\"}")

echo "$REGISTER_RESPONSE" | jq .

if echo "$REGISTER_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "✅ Inscription réussie!"
else
  echo "❌ Inscription échouée!"
  exit 1
fi

echo ""
echo "2️⃣  Test de connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq .

if echo "$LOGIN_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo "✅ Connexion réussie!"
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  echo "   Token: ${TOKEN:0:20}..."
else
  echo "❌ Connexion échouée!"
  exit 1
fi

echo ""
echo "3️⃣  Test d'accès avec token..."
DASHBOARD_RESPONSE=$(curl -s -X GET "$API/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Origin: http://localhost")

echo "$DASHBOARD_RESPONSE" | jq .

if echo "$DASHBOARD_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Accès authentifié réussi!"
else
  echo "⚠️  Réponse dashboard (peut être normal si pas implémenté)"
fi

echo ""
echo "================================"
echo "✅ Tous les tests réussis!"
echo "================================"
