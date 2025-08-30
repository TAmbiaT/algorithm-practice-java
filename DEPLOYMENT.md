# 🚀 Deployment Guide - Vercel

This guide will walk you through deploying your Algorithm Calculator to Vercel.

## Prerequisites

- A GitHub account
- Your algorithm calculator code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository contains these files:
```
algorithm-practice-java/
├── index.html
├── styles.css
├── algorithms.js
├── app.js
├── vercel.json
├── min-cost-triangulation/
├── max-flow-min-cut/
└── README.md
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)** and sign up/login with your GitHub account

2. **Click "New Project"**

3. **Import your GitHub repository**
   - Select your `algorithm-practice-java` repository
   - Vercel will automatically detect it's a static site

4. **Configure project settings**
   - **Project Name**: `algorithm-calculator` (or your preferred name)
   - **Framework Preset**: Leave as "Other" (Vercel will auto-detect)
   - **Root Directory**: Leave as `./` (root of repository)
   - **Build Command**: Leave empty (not needed for static sites)
   - **Output Directory**: Leave empty (not needed for static sites)

5. **Click "Deploy"**

6. **Wait for deployment** (usually takes 1-2 minutes)

7. **Get your URL** - Vercel will provide a URL like:
   ```
   https://algorithm-calculator.vercel.app
   ```

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd algorithm-practice-java
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm project settings
   - Deploy

### 3. Update Your README

After deployment, update the URLs in your `README.md`:

```markdown
## 🌐 Live Demo

**Try the algorithms online:** [Algorithm Calculator](https://your-actual-url.vercel.app)
```

### 4. Custom Domain (Optional)

If you want a custom domain:

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to "Settings" → "Domains"**
4. **Add your custom domain**
5. **Follow DNS configuration instructions**

## Automatic Deployments

Once deployed, Vercel will automatically:
- **Deploy on every push** to your main branch
- **Create preview deployments** for pull requests
- **Provide instant rollbacks** if needed

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all files are in the correct location
2. **404 errors**: Ensure `index.html` is in the root directory
3. **JavaScript errors**: Check browser console for any script issues

### Performance Optimization

Your site is already optimized with:
- ✅ Static file serving
- ✅ CDN distribution
- ✅ Automatic HTTPS
- ✅ Gzip compression

## Monitoring

Vercel provides:
- **Analytics**: Page views, performance metrics
- **Logs**: Deployment and runtime logs
- **Status**: Uptime monitoring

## Next Steps

After deployment:
1. **Test all functionality** on the live site
2. **Share your URL** in your portfolio/resume
3. **Monitor performance** using Vercel analytics
4. **Consider adding more algorithms** to expand the calculator

---

**🎉 Congratulations!** Your Algorithm Calculator is now live and accessible to anyone with an internet connection!
