# 🚀 Skin Scan Deployment Guide

This guide will help you deploy your Skin Scan application so it can be accessed from different systems and mobile devices via a public link.

## 📋 Prerequisites

- Python 3.9+
- Git
- GitHub account (for most deployment options)
- Email account for sending notifications

## 🎯 Quick Start Options

### Option 1: Railway (Recommended - Easiest)

Railway offers a free tier and is perfect for Flask applications.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Skin Scan repository
5. Add environment variables (see Environment Variables section)
6. Deploy!

**Your app will be available at:** `https://your-app-name.railway.app`

### Option 2: Render (Free Tier Available)

Render provides excellent free hosting for web applications.

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up and connect GitHub
3. Create "New Web Service"
4. Connect your repository
5. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3
6. Add environment variables
7. Deploy!

**Your app will be available at:** `https://your-app-name.onrender.com`

### Option 3: Heroku (Paid Plans)

**Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables
5. Deploy: `git push heroku main`

## 🔧 Environment Variables

Create a `.env` file or set these in your hosting platform:

```bash
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here

# Email Configuration (Gmail)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password-here
MAIL_DEFAULT_SENDER=your-email@gmail.com

# Application Configuration
HOST=0.0.0.0
PORT=5000
DEBUG=False
```

### Setting up Gmail App Password

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings
3. Security → App passwords
4. Generate a new app password
5. Use this password in `MAIL_PASSWORD`

## 🐳 Docker Deployment

If you prefer containerized deployment:

```bash
# Build the image
docker build -t skin-scan .

# Run the container
docker run -d -p 5000:5000 --name skin-scan-app skin-scan
```

## 🖥️ VPS Deployment (DigitalOcean, Linode, etc.)

For full control over your server:

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip nginx git -y

# Install Python packages
pip3 install -r requirements.txt
```

### 2. Application Setup
```bash
# Clone your repository
git clone https://github.com/yourusername/skin-scan.git
cd skin-scan

# Set up environment variables
cp env.example .env
nano .env  # Edit with your values

# Create systemd service
sudo nano /etc/systemd/system/skin-scan.service
```

### 3. Systemd Service File
```ini
[Unit]
Description=Skin Scan Flask App
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/your/skin-scan
Environment=PATH=/path/to/your/skin-scan/venv/bin
ExecStart=/path/to/your/skin-scan/venv/bin/gunicorn --workers 3 --bind unix:skin-scan.sock -m 007 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        include proxy_params;
        proxy_pass http://unix:/path/to/your/skin-scan/skin-scan.sock;
    }
}
```

## 📱 Mobile Access

Once deployed, your app will be accessible on:
- **Desktop browsers:** Chrome, Firefox, Safari, Edge
- **Mobile browsers:** All modern mobile browsers
- **Tablets:** iPad, Android tablets

The app is already mobile-responsive and will work great on all devices!

## 🔒 Security Considerations

1. **Change the secret key** in production
2. **Use HTTPS** (most hosting platforms provide this automatically)
3. **Set up proper email credentials**
4. **Regular backups** of your database
5. **Monitor usage** and set up alerts

## 🚨 Troubleshooting

### Common Issues:

1. **App won't start:**
   - Check environment variables
   - Verify all dependencies are installed
   - Check logs for error messages

2. **Email not working:**
   - Verify Gmail app password
   - Check firewall settings
   - Test SMTP connection

3. **Database issues:**
   - Ensure database file permissions
   - Check disk space
   - Verify SQLite installation

### Getting Help:

- Check your hosting platform's logs
- Use the deployment scripts provided
- Test locally first with `python app.py`

## 📊 Monitoring

Set up monitoring for:
- Application uptime
- Response times
- Error rates
- Database performance

## 🎉 Success!

Once deployed, you'll have:
- ✅ Public URL accessible from anywhere
- ✅ Mobile-friendly interface
- ✅ AI-powered skin lesion detection
- ✅ User authentication and data storage
- ✅ Email notifications
- ✅ Admin dashboard

Your Skin Scan application will be live and accessible to users worldwide! 🌍

## 🔗 Quick Links

- [Railway](https://railway.app) - Recommended hosting
- [Render](https://render.com) - Free tier available
- [Heroku](https://heroku.com) - Popular platform
- [DigitalOcean](https://digitalocean.com) - VPS hosting
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833) - Email setup

