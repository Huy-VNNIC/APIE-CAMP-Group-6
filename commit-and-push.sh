#!/bin/bash

# Execute these commands in your terminal to commit and push

# 1. Make sure we're in the right directory
cd /workspaces/APIE-CAMP-Group-6
echo "Current directory: $(pwd)"

# 2. Add the changes to README.md and any other files
git add README.md backend/.env.example cleanup-instructions.txt

# 3. Check what will be committed
echo "Files staged for commit:"
git status

# 4. Commit the changes
git commit -m "Add API key configuration instructions and documentation"

# 5. Check if BFG is available
if [ -f "bfg.jar" ]; then
  echo "BFG found, cleaning repository..."
  
  # Create a pattern file for the API key
  echo "sk-" > api-key-pattern.txt
  
  # Use BFG to remove the API key from history
  java -jar bfg.jar --replace-text api-key-pattern.txt
  
  # Clean up refs and ensure garbage collection
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
else
  echo "BFG not found in current directory"
  echo "You will need to clean the history manually using BFG or git filter-branch"
fi

# 6. Force push the changes (uncomment when ready)
# git push origin main --force

echo ""
echo "=== IMPORTANT ==="
echo "Before force pushing, make sure you have:"
echo "1. Confirmed the API key is removed from history"
echo "2. Updated any API key used in production"
echo ""
echo "When ready, run: git push origin main --force"
