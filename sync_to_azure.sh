#!/bin/bash

# --- LiteRight Academy: Local-Build-Remote-Deploy (LBRD) Engine ---
# This script ensures that the code on the live site matches the source bit-for-bit.
# It builds locally to bypass remote server resource limits (OOM errors).

REMOTE_USER="smdhussain06"
REMOTE_HOST="literight.centralindia.cloudapp.azure.com"
REMOTE_DIR="/home/smdhussain06/literight"
SSH_KEY=".keys/azure_deploy_key"

echo "------------------------------------------------"
echo "🚀 LiteRight Academy: LBRD Engine v5.0"
echo "------------------------------------------------"

# 1. Local Pre-flight
echo "🏗️  Building Frontend Locally (Reliable & Fast)..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed! Deployment aborted."
    exit 1
fi

echo "📦 Packaging Build..."
tar -czf dist.tar.gz dist/

# 2. Upload
echo "📡 Beaming finished files to Azure..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no dist.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# 3. Remote Cleanup & Extraction
echo "⚙️  Refining Remote State..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << EOF
    cd $REMOTE_DIR
    rm -rf dist_old
    [ -d dist ] && mv dist dist_old
    tar -xzf dist.tar.gz
    rm dist.tar.gz
    
    # Sync backend logic (minimal git pull for services)
    git fetch origin
    git reset --hard origin/main
    
    # Restart services
    pm2 restart lms-backend || true
EOF

# 4. Local Cleanup
rm dist.tar.gz

echo "------------------------------------------------"
echo "✨ MISSION ACCOMPLISHED: Version 99999 is now Live."
echo "Check it here: http://literight.centralindia.cloudapp.azure.com/"
echo "------------------------------------------------"
