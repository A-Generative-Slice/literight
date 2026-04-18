#!/bin/bash
MYPASS='Iaminsane@06'
REMOTE_USER="smdhussain06"
REMOTE_HOST="literight.centralindia.cloudapp.azure.com"
REMOTE_DIR="/home/smdhussain06/literight"

echo "Deploying..."
sshpass -p "$MYPASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && git fetch origin && git reset --hard origin/main"
sshpass -p "$MYPASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && rm -rf dist && npm run build"
sshpass -p "$MYPASS" ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && rm -f backend/data/lms.db && pm2 restart lms-backend && sudo systemctl reload nginx"
echo "Done!"
