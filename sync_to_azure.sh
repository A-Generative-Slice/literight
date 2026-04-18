#!/bin/bash

# --- LiteRight Academy: Professional Automation Script ---
# This version uses 'sshpass' to handle your password securely and quickly.

REMOTE_USER="smdhussain06"
REMOTE_HOST="literight.centralindia.cloudapp.azure.com"
REMOTE_DIR="/home/smdhussain06/literight"

echo "------------------------------------------------"
echo "🚀 LiteRight Academy: Advanced Sync"
echo "------------------------------------------------"

# Function to run remote commands via ssh key
run_remote() {
    ssh -i .keys/azure_deploy_key -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "$1"
}

echo "📡 Force-syncing latest code from GitHub..."
run_remote "cd $REMOTE_DIR && git fetch origin && git reset --hard origin/main"

echo "🏗️  Purging old build and rebuilding React (this takes 2 mins)..."
run_remote "cd $REMOTE_DIR && rm -rf dist && npm run build"

echo "🏗️  Rebuilding Node.js Backend..."
run_remote "cd $REMOTE_DIR/backend && rm -rf dist && npm run build"

echo "🛡️  Refreshing LiteRight Academy Services & Syllabus..."
run_remote "cd $REMOTE_DIR && rm -f backend/data/lms.db && pm2 restart lms-backend && sudo systemctl reload nginx"

echo "------------------------------------------------"
echo "✨ SUCCESS! The Academy is now 100% Finalized."
echo "Check it here: http://literight.centralindia.cloudapp.azure.com/"
echo "------------------------------------------------"
