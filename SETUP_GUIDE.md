# 🛠️ Complete Setup Guide for Skin Scan Deployment

## Step 1: Install Git (Required)

### For Windows:
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download the latest version
3. Run the installer with default settings
4. **Important:** Restart your PowerShell/Command Prompt after installation

### Verify Installation:
Open PowerShell and run:
```bash
git --version
```
You should see something like: `git version 2.40.1.windows.1`

## Step 2: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Choose a username (remember this!)
4. Enter email and password
5. Verify your email

## Step 3: Create GitHub Repository

1. After logging into GitHub, click the "+" icon in top right
2. Select "New repository"
3. Repository name: `skin-scan` (or any name you prefer)
4. Description: "AI-powered skin lesion detection app"
5. Make it **Public** (required for free hosting)
6. **DO NOT** check "Add a README file" (we already have files)
7. Click "Create repository"

## Step 4: Upload Your Code to GitHub

### Option A: Using GitHub Desktop (Easier)
1. Download GitHub Desktop from [desktop.github.com](https://desktop.github.com)
2. Install and sign in with your GitHub account
3. Click "Clone a repository from the Internet"
4. Select your repository
5. Choose a local folder
6. Copy all your Skin Scan files to that folder
7. In GitHub Desktop, you'll see all your files
8. Add a commit message like "Initial commit"
9. Click "Commit to main"
10. Click "Push origin"

### Option B: Using Command Line
1. Open PowerShell in your Skin Scan folder
2. Run these commands one by one:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Skin Scan app"

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/skin-scan.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 5: Deploy to Railway (Free Hosting)

1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `skin-scan` repository
6. Railway will automatically detect it's a Python app
7. Add environment variables (see below)
8. Click "Deploy"

## Step 6: Environment Variables

In Railway, go to your project → Variables tab and add:

```
SECRET_KEY=your-super-secret-key-here-change-this
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
```

## Step 7: Set Up Gmail for Email Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Click "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `MAIL_PASSWORD` variable

## Step 8: Access Your Live App!

After deployment (5-10 minutes), Railway will give you a URL like:
`https://skin-scan-production-xxxx.up.railway.app`

This URL will work on:
- ✅ Desktop computers
- ✅ Mobile phones
- ✅ Tablets
- ✅ Any device with a web browser

## 🎉 Success!

Your Skin Scan app is now live and accessible worldwide!

## Need Help?

If you get stuck at any step, let me know and I'll help you through it!

