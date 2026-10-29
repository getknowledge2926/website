# Website Deployment & Publishing Guide

**Get Knowledge** is built with pure, modern HTML5, CSS3, and JavaScript. Because it has **no server, no database, and no build steps**, it can be hosted for **100% FREE** with near-instant load times on any static hosting platform.

---

## Option 1: Deploy on GitHub Pages (Recommended — 100% Free)

GitHub Pages provides free hosting with automatic HTTPS and free custom domain support (`yourname.github.io` or `yourdomain.com`).

### Steps:
1. Initialize Git in the project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Get Knowledge website"
   ```
2. Create a new public or private repository on [GitHub](https://github.com/new) (e.g., `getknowledge-website`).
3. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/getknowledge-website.git
   git branch -M main
   git push -u origin main
   ```
4. In your GitHub repository:
   - Navigate to **Settings** &rarr; **Pages** (under Code and automation in the left sidebar).
   - Under **Build and deployment** &rarr; **Branch**, select `main` and root folder `/ (root)`.
   - Click **Save**.
5. Within 1 to 2 minutes, your website will be live at:
   ```text
   https://YOUR_USERNAME.github.io/getknowledge-website/
   ```

---

## Option 2: Deploy on Netlify (Drag-and-Drop in 30 Seconds — 100% Free)

1. Visit [Netlify](https://app.netlify.com/drop) and sign in.
2. Drag and drop the entire project folder directly into the browser upload box.
3. Your website is deployed immediately on a secure Netlify URL (e.g., `getknowledge.netlify.app`).
4. To connect a custom domain:
   - Go to **Domain management** &rarr; **Add a domain** &rarr; Enter your domain (e.g., `getknowledge.in`).

---

## Option 3: Deploy on Vercel (100% Free)

1. Connect your repository on [vercel.com/new](https://vercel.com/new) and click **Deploy**.
2. Vercel automatically deploys static HTML projects with global CDN acceleration and free SSL certificates.

---

## Option 4: Testing Locally

Open a terminal in the website folder and run:
```bash
python3 -m http.server 8000
```
Then open: `http://localhost:8000`
