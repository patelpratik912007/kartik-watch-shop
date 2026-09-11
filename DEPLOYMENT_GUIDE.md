# 🌐 Kartik Watch Shop — Live Deployment Guide

This guide explains how to make **Kartik Watch Shop** live on the internet so anyone can visit it on their phone, laptop, or tablet.

---

## ⚡ Option 1: Instant Public Live Link in 10 Seconds (No Signup)

If you want to test the website live on your phone right now or share a live demo with someone:

1. Double-click **`start-live-tunnel.bat`** in this folder.
2. It will automatically generate a public HTTPS link (e.g., `https://xxxx.loca.lt`).
3. Open this link on your phone or send it to anyone!

---

## 🚀 Option 2: Permanent Free Live Hosting on Vercel or Netlify (Recommended)

This gives you a fast, permanent 24/7 live website with a custom link like `https://kartik-watch-shop.vercel.app`.

### Deploying on Netlify (Drag & Drop — No Code Required):
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the **`frontend`** folder from your computer into the browser.
3. In 30 seconds, your luxury watch boutique is live on the internet with free HTTPS!

### Deploying on Vercel (via GitHub):
1. Push this project to your GitHub account (see Git steps below).
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your `kartik-watch-shop` repository.
4. Click **Deploy**. Vercel will automatically read `vercel.json` and deploy the entire shop!

---

## 🛠 Option 3: Full-Stack Cloud Deployment on Render.com (Python + Frontend + DB)

If you want the Python Flask REST API, user accounts, and database live in the cloud:

1. Create a free account at [https://render.com](https://render.com).
2. Push your project to GitHub (see Git steps below).
3. In Render Dashboard, click **New +** → **Web Service**.
4. Connect your GitHub repository `kartik-watch-shop`.
5. Render will automatically detect `render.yaml` and `Procfile`:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python backend/setup_db.py && gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT`
   - **Environment Variables**:
     - `DB_TYPE`: `sqlite`
6. Click **Deploy Web Service**.
7. Your full-stack store will be live at `https://kartik-watch-shop.onrender.com`!

---

## 📦 How to Push this Project to GitHub (First Time Setup)

Open a terminal or PowerShell in this folder and run:

```bash
# 1. Add all files
git add .

# 2. Commit the changes
git commit -m "Kartik Watch Shop - Ready for live production deployment"

# 3. Rename branch to main (if not already)
git branch -M main

# 4. Create a new empty repository on github.com, then connect it:
git remote add origin https://github.com/YOUR_USERNAME/kartik-watch-shop.git

# 5. Push code to GitHub
git push -u origin main
```

---

## ⚙️ Local Development Note (Fixed)
The previous startup delay error (*where the browser opened before Python was ready and required a manual refresh*) has been completely resolved. When you run `start-server.bat`, Python verifies server readiness and automatically opens the browser at `http://localhost:5000/` with zero connection errors.
