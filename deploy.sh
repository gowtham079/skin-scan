#!/bin/bash

# Skin Scan Deployment Script
# This script helps deploy the Skin Scan application to various platforms

echo "🏥 Skin Scan Deployment Script"
echo "================================"

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    # Install Railway CLI if not installed
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway
    railway login
    
    # Initialize Railway project
    railway init
    
    # Deploy
    railway up
    
    echo "✅ Deployment to Railway completed!"
    echo "Your app will be available at: https://your-app-name.railway.app"
}

# Function to deploy to Render
deploy_render() {
    echo "🎨 Deploying to Render..."
    
    echo "To deploy to Render:"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create a new Web Service"
    echo "4. Use these settings:"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: gunicorn app:app"
    echo "   - Environment: Python 3"
    echo "5. Add environment variables from env.example"
    echo "6. Deploy!"
    
    echo "✅ Render deployment instructions provided!"
}

# Function to deploy with Docker
deploy_docker() {
    echo "🐳 Deploying with Docker..."
    
    # Build Docker image
    docker build -t skin-scan .
    
    # Run container
    docker run -d -p 5000:5000 --name skin-scan-app skin-scan
    
    echo "✅ Docker deployment completed!"
    echo "Your app is running at: http://localhost:5000"
}

# Function to deploy to VPS
deploy_vps() {
    echo "🖥️  VPS Deployment Instructions..."
    
    echo "To deploy to a VPS (DigitalOcean, Linode, etc.):"
    echo "1. Create a new Ubuntu server"
    echo "2. SSH into your server"
    echo "3. Install dependencies:"
    echo "   sudo apt update"
    echo "   sudo apt install python3 python3-pip nginx"
    echo "4. Clone your repository"
    echo "5. Install Python dependencies: pip install -r requirements.txt"
    echo "6. Set up environment variables"
    echo "7. Configure Nginx as reverse proxy"
    echo "8. Use systemd to run your app as a service"
    
    echo "✅ VPS deployment instructions provided!"
}

# Main menu
echo "Select deployment option:"
echo "1) Railway (Recommended - Free tier available)"
echo "2) Render (Free tier available)"
echo "3) Docker (Local deployment)"
echo "4) VPS (DigitalOcean, Linode, etc.)"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_railway
        ;;
    2)
        deploy_render
        ;;
    3)
        deploy_docker
        ;;
    4)
        deploy_vps
        ;;
    5)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid option. Please run the script again."
        exit 1
        ;;
esac

