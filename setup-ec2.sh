#!/bin/bash

# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Create project directory
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Clone your repository (replace with your actual repository URL)
git clone https://github.com/yourusername/orderfood_backend.git

# Navigate to project directory
cd orderfood_backend

# Install project dependencies
npm install

# Build the project
npm run build

# Start the application with PM2
pm2 start dist/main.js --name "orderfood-backend"

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup 