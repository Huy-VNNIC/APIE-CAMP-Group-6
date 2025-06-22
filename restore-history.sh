#!/bin/bash

# Script to restore commit history from remote branches
echo "Starting history restoration process..."

# Setup
git config --global --add safe.directory /workspaces/APIE-CAMP-Group-6

# Step 1: Backup current state
echo "Backing up current state to a branch called 'backup-clean'..."
git branch backup-clean

# Step 2: Fetch all remote branches
echo "Fetching all remote branches and history..."
git fetch --all

# Step 3: Check available remote branches
echo "Available remote branches:"
git branch -r

# Step 4: Attempt to restore from origin/main from before the cleanup
echo "Attempting to restore from origin/main (this requires that the force push hasn't happened yet)..."
git reset --hard origin/main

# Step 5: If that didn't work, try other remote branches
echo "If you don't see your commit history, try these commands with different branch names:"
echo ""
echo "For the dev branch:"
echo "git reset --hard origin/dev-from-fbd9381"
echo ""
echo "For other branches, use:"
echo "git checkout origin/BRANCH_NAME"
echo "git checkout -b history-restored"
echo ""
echo "Once you have your history back:"
echo "1. Fix the backend/controllers/marketingAI.controller.js file to use environment variables"
echo "2. Create a proper .env.example file"
echo "3. Make sure no API keys are in the code"
echo "4. IMPORTANT: Visit this URL to allow the push or invalidate the key:"
echo "   https://github.com/Huy-VNNIC/APIE-CAMP-Group-6/security/secret-scanning/unblock-secret/2yrfgXI4BkzLhrH9tJrQAv3SX7O"

echo ""
echo "IMPORTANT: If history is restored but you get push errors:"
echo "1. Fix the API key in the backend/controllers/marketingAI.controller.js file"
echo "2. Commit those changes"
echo "3. Try pushing again"
echo "4. Or visit the GitHub URL to allow the specific key"
