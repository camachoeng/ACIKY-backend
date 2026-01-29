#!/bin/bash

# Manual API Testing Script
# Run this to test key endpoints after changes

BASE_URL="http://localhost:3000"

echo "🧪 Testing Yoga Backend API"
echo "================================"

# Test 1: Health Check
echo -e "\n1️⃣ Testing root endpoint..."
curl -s $BASE_URL | jq .

# Test 2: Invalid email registration
echo -e "\n2️⃣ Testing email validation (should fail)..."
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"invalid-email","password":"StrongPass123!"}' | jq .

# Test 3: Weak password registration
echo -e "\n3️⃣ Testing password validation (should fail)..."
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"weak"}' | jq .

# Test 4: Valid registration
echo -e "\n4️⃣ Testing valid registration (should succeed)..."
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123","email":"testuser123@example.com","password":"ValidPass123!"}' | jq .

# Test 5: Spaces API (N+1 fix)
echo -e "\n5️⃣ Testing spaces API..."
curl -s $BASE_URL/api/spaces | jq '.data | length'

# Test 6: Stats API
echo -e "\n6️⃣ Testing stats API..."
curl -s $BASE_URL/api/stats | jq .

# Test 7: Gallery API
echo -e "\n7️⃣ Testing gallery API..."
curl -s $BASE_URL/api/gallery | jq '.data | length'

echo -e "\n✅ Testing complete!"
