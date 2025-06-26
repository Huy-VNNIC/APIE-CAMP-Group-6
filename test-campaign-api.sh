#!/bin/bash

# Test Marketing Campaign API
echo "🧪 Testing Marketing Campaign API..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API URL
API_URL="http://localhost:5001/api"

# Marketing user token (từ user đã tạo)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWQyMjhkZDc5NTU5NDk5M2FiNDc5ZSIsInJvbGUiOiJtYXJrZXRpbmciLCJpYXQiOjE3NTA5MzQxNTcsImV4cCI6MTc1MTAyMDU1N30.2pBS-G07DKPnNXQz6fze58knB2X1D-qe5nMXEPMJFWE"

echo -e "${BLUE}1. Testing Create Campaign...${NC}"
CAMPAIGN_RESPONSE=$(curl -s -X POST ${API_URL}/marketing/campaigns \
  -H "Content-Type: application/json" \
  -H "x-auth-token: ${TOKEN}" \
  -d '{
    "title": "Test Campaign ' $(date +%s) '",
    "description": "Test campaign created via API",
    "startDate": "2025-06-26T00:00:00.000Z",
    "endDate": "2025-07-26T00:00:00.000Z",
    "targetAudience": "students",
    "status": "active",
    "channels": ["email", "social"],
    "budget": 1000
  }')

if echo "$CAMPAIGN_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Campaign created successfully!${NC}"
    CAMPAIGN_ID=$(echo "$CAMPAIGN_RESPONSE" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo -e "Campaign ID: ${CAMPAIGN_ID}"
    echo "Response: $CAMPAIGN_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Failed to create campaign${NC}"
    echo "Response: $CAMPAIGN_RESPONSE"
fi

echo -e "\n${BLUE}2. Testing Get All Campaigns...${NC}"
CAMPAIGNS_RESPONSE=$(curl -s -X GET ${API_URL}/marketing/campaigns \
  -H "x-auth-token: ${TOKEN}")

if echo "$CAMPAIGNS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Successfully retrieved campaigns!${NC}"
    CAMPAIGN_COUNT=$(echo "$CAMPAIGNS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo -e "Total campaigns: ${CAMPAIGN_COUNT}"
    echo "Response: $CAMPAIGNS_RESPONSE" | jq '.'
else
    echo -e "${RED}❌ Failed to get campaigns${NC}"
    echo "Response: $CAMPAIGNS_RESPONSE"
fi

echo -e "\n${BLUE}Test completed!${NC}"
