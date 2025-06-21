#!/bin/bash

# Marketing API Test Script
echo "========================================"
echo "Marketing API Test Script"
echo "========================================"

# Base URL
API_URL=${API_URL:-"http://localhost:5000/api"}
echo "Using API URL: $API_URL"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Login and Get Token
echo -e "\n${BLUE}Logging in as marketing user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "marketing", "password": "marketing123"}')

# Extract token from login response
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Login failed - no token received${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
else
  echo -e "${GREEN}Successfully logged in!${NC}"
fi

# Create a test campaign
echo -e "\n${BLUE}Creating a test marketing campaign...${NC}"
CAMPAIGN_RESPONSE=$(curl -s -X POST "$API_URL/marketing/campaigns" \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing" \
  -d '{
    "title": "Summer Coding Workshop",
    "description": "Special workshop series for beginner coders during summer break",
    "startDate": "2023-06-15",
    "endDate": "2023-08-15",
    "targetAudience": "students",
    "status": "active",
    "channels": ["email", "social", "website"],
    "budget": 5000
  }')

# Extract campaign ID
CAMPAIGN_ID=$(echo "$CAMPAIGN_RESPONSE" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$CAMPAIGN_ID" ]; then
  echo -e "${RED}Failed to create campaign${NC}"
  echo "Response: $CAMPAIGN_RESPONSE"
else
  echo -e "${GREEN}Successfully created campaign with ID: $CAMPAIGN_ID${NC}"
fi

# Create promotional content
echo -e "\n${BLUE}Creating promotional content...${NC}"
CONTENT_RESPONSE=$(curl -s -X POST "$API_URL/marketing/promotional-content" \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing" \
  -d "{
    \"title\": \"Learn to Code This Summer!\",
    \"contentType\": \"banner\",
    \"description\": \"Promotional banner for summer coding workshop\",
    \"content\": \"<div>Join our summer coding workshop and learn to code in 8 weeks!</div>\",
    \"imageUrl\": \"https://example.com/images/summer-code.jpg\",
    \"linkUrl\": \"https://example.com/summer-workshop\",
    \"status\": \"published\",
    \"campaign\": \"$CAMPAIGN_ID\"
  }")

# Extract content ID
CONTENT_ID=$(echo "$CONTENT_RESPONSE" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$CONTENT_ID" ]; then
  echo -e "${RED}Failed to create promotional content${NC}"
  echo "Response: $CONTENT_RESPONSE"
else
  echo -e "${GREEN}Successfully created promotional content with ID: $CONTENT_ID${NC}"
fi

# Create partnership
echo -e "\n${BLUE}Creating a partnership...${NC}"
PARTNERSHIP_RESPONSE=$(curl -s -X POST "$API_URL/marketing/partnerships" \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing" \
  -d '{
    "partnerName": "Tech University",
    "partnerType": "educational",
    "contactPerson": {
      "name": "Jane Smith",
      "email": "jane@techuniversity.edu",
      "phone": "555-123-4567"
    },
    "startDate": "2023-06-01",
    "endDate": "2023-12-31",
    "description": "Partnership to provide discounted courses for Tech University students",
    "goals": ["Increase enrollment by 20%", "Cross-promote educational materials"],
    "benefits": ["Discounted courses", "Exclusive workshops"],
    "status": "active"
  }')

# Extract partnership ID
PARTNERSHIP_ID=$(echo "$PARTNERSHIP_RESPONSE" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$PARTNERSHIP_ID" ]; then
  echo -e "${RED}Failed to create partnership${NC}"
  echo "Response: $PARTNERSHIP_RESPONSE"
else
  echo -e "${GREEN}Successfully created partnership with ID: $PARTNERSHIP_ID${NC}"
fi

# Add metrics
echo -e "\n${BLUE}Adding engagement metrics...${NC}"
METRICS_RESPONSE=$(curl -s -X POST "$API_URL/marketing/metrics" \
  -H "Content-Type: application/json" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing" \
  -d "{
    \"date\": \"$(date -I)\",
    \"userSegment\": \"students\",
    \"metrics\": {
      \"activeUsers\": 1250,
      \"pageViews\": 4500,
      \"averageSessionDuration\": 320,
      \"bounceRate\": 25,
      \"courseEnrollments\": 75,
      \"courseCompletions\": 42,
      \"quizAttempts\": 156,
      \"feedbackSubmissions\": 38
    },
    \"source\": \"campaign\",
    \"campaign\": \"$CAMPAIGN_ID\",
    \"notes\": \"Initial metrics for summer workshop campaign\"
  }")

# Extract metrics ID
METRICS_ID=$(echo "$METRICS_RESPONSE" | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$METRICS_ID" ]; then
  echo -e "${RED}Failed to create metrics${NC}"
  echo "Response: $METRICS_RESPONSE"
else
  echo -e "${GREEN}Successfully created metrics with ID: $METRICS_ID${NC}"
fi

# Get all campaigns
echo -e "\n${BLUE}Getting all campaigns...${NC}"
CAMPAIGNS_LIST=$(curl -s -X GET "$API_URL/marketing/campaigns" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing")

echo -e "${GREEN}Retrieved campaigns:${NC}"
echo "$CAMPAIGNS_LIST" | grep -o '"title":"[^"]*' | sed 's/"title":"/- /'

# Get metrics summary
echo -e "\n${BLUE}Getting metrics summary...${NC}"
METRICS_SUMMARY=$(curl -s -X GET "$API_URL/marketing/metrics/summary" \
  -H "x-auth-token: $TOKEN" \
  -H "x-user-role: marketing")

echo -e "${GREEN}Metrics Summary:${NC}"
echo "$METRICS_SUMMARY"

echo -e "\n${BLUE}==========================${NC}"
echo -e "${GREEN}All tests completed!${NC}"
echo -e "${BLUE}==========================${NC}"
