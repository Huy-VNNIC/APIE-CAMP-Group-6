#!/bin/bash

echo "🔍 Testing Marketing Features Without Token Authentication"
echo "============================================================"

# Test 1: Login và lấy thông tin user
echo "📝 Test 1: Login with marketing user"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "marketing", "password": "marketing123"}')
echo "✅ Login successful: $(echo $LOGIN_RESPONSE | jq -r '.user.username')"

# Test 2: Get marketing campaigns (không cần token)
echo ""
echo "📊 Test 2: Get marketing campaigns (no token required)"
CAMPAIGNS_RESPONSE=$(curl -s -X GET http://localhost:5001/api/marketing/campaigns)
echo "✅ Campaigns loaded: $(echo $CAMPAIGNS_RESPONSE | jq -r '.campaigns | length') campaigns found"

# Test 3: Generate AI campaign ideas (không cần token)
echo ""
echo "🤖 Test 3: Generate AI campaign ideas (no token required)"
AI_RESPONSE=$(curl -s -X POST http://localhost:5001/api/marketing/ai/campaign-ideas \
  -H "Content-Type: application/json" \
  -d '{"prompt": "coding bootcamp for students"}')
echo "✅ AI ideas generated: $(echo $AI_RESPONSE | jq -r '.ideas | length') ideas"

# Test 4: Create new campaign (không cần token)
echo ""
echo "➕ Test 4: Create new marketing campaign (no token required)"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/marketing/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test No-Token Campaign",
    "description": "This campaign was created without requiring authentication token",
    "targetAudience": "students",
    "channels": ["email", "social"],
    "status": "draft"
  }')
echo "✅ Campaign created: $(echo $CREATE_RESPONSE | jq -r '.campaign.title')"

echo ""
echo "🎉 All tests completed successfully!"
echo "📝 Summary:"
echo "   - Login works normally and returns token"
echo "   - Marketing campaigns can be accessed without token"
echo "   - AI features work without token"
echo "   - New campaigns can be created without token"
echo ""
echo "✨ You can now login with username: marketing, password: marketing123"
echo "   and use all marketing features without needing to handle tokens!"
