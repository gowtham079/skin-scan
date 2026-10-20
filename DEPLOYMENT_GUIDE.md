# 🚀 Skin Scan Deployment Guide (Render)

This guide provides step-by-step instructions for deploying your **Skin Scan** web application to **[Render](https://render.com)**.

---

## 📋 Highlights & Changes Made Before Deployment

1. **Security & Sensitive Data Removed:**
   - Removed hardcoded Gmail credentials and secret keys from `app.py`.
   - All configurations are loaded dynamically via environment variables (`os.environ.get()`) using `python-dotenv`.
   - Untracked the local SQLite database (`instance/skin_scan.db`) to ensure user credentials and records are never committed to Git.
   - Updated `.gitignore` to prevent sensitive files (`.env`, `instance/`, `*.db`) from being tracked.
2. **Streamlined for Fast Production Builds:**
   - Removed unnecessary Docker files (`Dockerfile`, `docker-compose.yml`) in favor of Render's native, lightweight Python environment.
   - Cleaned up heavy offline ML training assets (120MB+ raw CSVs, Jupyter notebooks, ONNX models).
   - Only the active TensorFlow.js browser model (`sc_detector/artifacts/tfjs/mobilen_model/`) is deployed, making deployments build in ~30 seconds.
   - Pinned production dependencies with `gunicorn`, `python-dotenv`, and `psycopg2-binary`.

---

## 🎯 Option 1: Deploy with Render Web Service (Recommended)

### Step 1: Push Changes to GitHub
Make sure all updated files are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure Skin Scan for Render deployment and secure sensitive data"
git push origin master
```

### Step 2: Create Web Service on Render
1. Visit [dashboard.render.com](https://dashboard.render.com/) and log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`skin-scan`).
4. Configure the service settings:
   - **Name:** `skin-scan` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `master` (or `main`)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`

### Step 3: Add Environment Variables
Under the **Environment Variables** section in Render, add:
| Key | Example Value | Description |
|-----|---------------|-------------|
| `FLASK_APP` | `app.py` | Main application entry point |
| `FLASK_ENV` | `production` | Production mode |
| `SECRET_KEY` | *(generate random 32-char string)* | Session signing key |
| `PYTHON_VERSION` | `3.11.9` | Python runtime version |
| `MAIL_SERVER` | `smtp.gmail.com` | (Optional) SMTP host |
| `MAIL_PORT` | `587` | (Optional) SMTP port |
| `MAIL_USE_TLS` | `True` | (Optional) Enable TLS |
| `MAIL_USERNAME` | `your-email@gmail.com` | (Optional) Your email |
| `MAIL_PASSWORD` | `your-app-password` | (Optional) 16-character Google App Password |
| `MAIL_DEFAULT_SENDER` | `your-email@gmail.com` | (Optional) Sender email |

> [!TIP]
> **Email Notifications are Optional:** If `MAIL_USERNAME` or `MAIL_PASSWORD` are left blank, user registration and prediction logging will still work smoothly without crashing.

### Step 4: Deploy
Click **Create Web Service**. Render will install requirements and start your web server. Your app will be live at:
`https://<your-service-name>.onrender.com`

---

## 🎯 Option 2: 1-Click Blueprint Deployment (`render.yaml`)

Because this repository includes a [`render.yaml`](file:///d:/All%20projects/skin-scan/render.yaml) blueprint:
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Select your `skin-scan` repository.
4. Render will automatically read `render.yaml` and configure the build command, start command, and environment variables!
5. Fill in any optional credentials (such as Gmail app password) and click **Apply**.

---

## 🗄️ Database Note for Render Free Tier

- **SQLite (Default):** On Render's free tier, local file storage is ephemeral (restarts reset SQLite data).
- **Persistent PostgreSQL (Recommended for production):**
  1. On Render Dashboard, click **New +** → **PostgreSQL**.
  2. Copy the **Internal Database URL**.
  3. In your `skin-scan` Web Service settings, add an environment variable `DATABASE_URL` with that URL.
  4. The application automatically detects PostgreSQL and initializes the tables!

---

## 🧪 Testing Locally Before Pushing

```bash
# Run the application locally
python app.py
```
Open [http://localhost:5000](http://localhost:5000) in your browser.
