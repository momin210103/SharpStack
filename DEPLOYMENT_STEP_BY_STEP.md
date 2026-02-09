# 🚀 30-Minute Deployment Tutorial

## Step-by-Step: Deploy Your BlogSystem for FREE

**Goal**: Get your blog live on the internet in 30 minutes!

**Setup**: Vercel (Frontend) + Railway (Backend) + Neon (Database) + Cloudinary (Images)

---

## ⏱️ Phase 1: Database Setup (5 minutes)

### **Step 1.1: Create Neon Account**
1. Go to https://neon.tech
2. Sign up with GitHub (fastest)
3. Click **"Create Project"**
4. Name: `blog-database`
5. Region: Choose closest to you
6. Click **"Create Project"**

### **Step 1.2: Get Connection String**
1. On dashboard, click **"Connection Details"**
2. Copy the **"Connection string"** (looks like):
   ```
   postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
   ```
3. **SAVE THIS** - You'll need it later! 📝

### **Step 1.3: Test Connection (Optional)**
```bash
# If you have psql installed:
psql "postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
```

✅ **Done!** Database is ready. Time: ~5 minutes

---

## ⏱️ Phase 2: Backend Deployment (10 minutes)

### **Step 2.1: Prepare Backend Code**

**Check if you have Dockerfile in Blog.API folder**
```bash
cd /home/momin-sheikh/BlogSystem/Blog.API
ls -la Dockerfile
```

**If NO Dockerfile, create one:**
```dockerfile
# Blog.API/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["Blog.API/Blog.API.csproj", "Blog.API/"]
COPY ["Blog.Application/Blog.Application.csproj", "Blog.Application/"]
COPY ["Blog.Domain/Blog.Domain.csproj", "Blog.Domain/"]
COPY ["Blog.Infrastructure/Blog.Infrastructure.csproj", "Blog.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Blog.API/Blog.API.csproj"

# Copy everything else
COPY . .

# Build
WORKDIR "/src/Blog.API"
RUN dotnet build "Blog.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Blog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Blog.API.dll"]
```

### **Step 2.2: Update appsettings.json**

Add production settings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Will be set via environment variable"
  },
  "AllowedOrigins": "https://your-blog.vercel.app",
  "Jwt": {
    "Secret": "Will be set via environment variable",
    "Issuer": "BlogSystem",
    "Audience": "BlogSystem"
  }
}
```

### **Step 2.3: Push to GitHub**
```bash
cd /home/momin-sheikh/BlogSystem
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### **Step 2.4: Deploy on Railway**

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your **BlogSystem** repository
6. Railway auto-detects .NET → Click **"Deploy"**

### **Step 2.5: Add Environment Variables**

In Railway dashboard:
1. Click your deployed service
2. Click **"Variables"** tab
3. Add these variables:

```bash
# Database
DATABASE_URL = [Your Neon connection string from Step 1.2]

# JWT Secret (generate random string)
JWT_SECRET = [Generate: openssl rand -base64 32]

# ASP.NET Environment
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:8080

# CORS (we'll update this in Phase 3)
ALLOWED_ORIGINS = *
```

### **Step 2.6: Run Migrations**

**Option A: Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run dotnet ef database update --project Blog.API
```

**Option B: Local with Neon URL**
```bash
# In your local BlogSystem folder
export DATABASE_URL="your-neon-connection-string"
dotnet ef database update --project Blog.API
```

### **Step 2.7: Get Backend URL**

1. In Railway dashboard, click **"Settings"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `blog-api-production.up.railway.app`)
4. **SAVE THIS** - You'll need it! 📝

✅ **Done!** Backend is live. Time: ~10 minutes

---

## ⏱️ Phase 3: Frontend Deployment (10 minutes)

### **Step 3.1: Update Environment Variables**

```bash
cd /home/momin-sheikh/BlogSystem/blog-frontend
```

Create `.env.production`:
```bash
VITE_API_URL=https://[your-railway-url]/api
```

Example:
```bash
VITE_API_URL=https://blog-api-production.up.railway.app/api
```

### **Step 3.2: Test Build Locally**
```bash
npm run build
npm run preview
```

If it works, proceed!

### **Step 3.3: Push to GitHub**
```bash
git add .
git commit -m "Add production environment"
git push origin main
```

### **Step 3.4: Deploy on Vercel**

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **BlogSystem** repo
5. In settings:
   - **Root Directory**: `blog-frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Environment Variables"**
7. Add:
   ```
   VITE_API_URL = https://[your-railway-url]/api
   ```
8. Click **"Deploy"**

### **Step 3.5: Get Frontend URL**

After deployment completes:
1. Vercel shows your live URL (e.g., `your-blog.vercel.app`)
2. **COPY THIS URL** 📝

✅ **Done!** Frontend is live. Time: ~10 minutes

---

## ⏱️ Phase 4: Final Configuration (5 minutes)

### **Step 4.1: Update CORS in Backend**

1. Go to Railway dashboard
2. Click your backend service
3. Click **"Variables"**
4. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://your-blog.vercel.app
   ```
5. Click **"Deploy"** to restart

### **Step 4.2: Setup Image Storage (Cloudinary)**

1. Go to https://cloudinary.com
2. Sign up (free)
3. On dashboard, note these values:
   - Cloud Name
   - API Key
   - API Secret

4. Add to Railway backend variables:
   ```bash
   CLOUDINARY_CLOUD_NAME = [your-cloud-name]
   CLOUDINARY_API_KEY = [your-api-key]
   CLOUDINARY_API_SECRET = [your-api-secret]
   ```

### **Step 4.3: Update Backend Code for Cloudinary**

**Install Cloudinary package:**
```bash
cd Blog.Infrastructure
dotnet add package CloudinaryDotNet
```

**Update your image upload service** (if not already using Cloudinary)

✅ **Done!** Everything configured. Time: ~5 minutes

---

## 🎉 Phase 5: Test Your Deployed Blog!

### **Step 5.1: Visit Your Blog**
```
https://your-blog.vercel.app
```

### **Step 5.2: Test Features**

✅ Home page loads  
✅ Posts display  
✅ Can read a post  
✅ Can register/login  
✅ Admin can create post with rich text editor  
✅ Images upload and display  
✅ Comments work  

### **Step 5.3: Set Up Custom Domain (Optional)**

**On Vercel:**
1. Click **"Settings"** → **"Domains"**
2. Add your domain (e.g., `myblog.com`)
3. Follow DNS instructions

**On Railway:**
1. Click **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Add domain (e.g., `api.myblog.com`)

---

## 🐛 Troubleshooting

### **Problem: Backend 502 Error**
**Solution:**
- Check Railway logs: Click service → "Logs" tab
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### **Problem: CORS Error on Frontend**
**Solution:**
- Verify ALLOWED_ORIGINS in Railway matches Vercel URL exactly
- Restart backend after changing variables

### **Problem: Images Not Uploading**
**Solution:**
- Verify Cloudinary credentials
- Check backend logs for errors
- Test Cloudinary connection in code

### **Problem: Frontend Build Fails**
**Solution:**
- Check Node version matches package.json
- Clear Vercel cache and redeploy
- Verify all dependencies installed

---

## 📊 Your Deployed Architecture

```
┌─────────────────────────────────────────────┐
│         USER'S BROWSER                       │
│         https://your-blog.vercel.app         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         VERCEL (Frontend CDN)                │
│         - React/Vite App                     │
│         - Global CDN                         │
│         - Automatic HTTPS                    │
└──────────────────┬──────────────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────┐
│         RAILWAY (Backend Server)             │
│         - .NET API                           │
│         - Always running                     │
│         - Automatic HTTPS                    │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌────────────────┐
│  NEON DB      │    │  CLOUDINARY    │
│  PostgreSQL   │    │  Images        │
│  3GB Free     │    │  25GB Free     │
└───────────────┘    └────────────────┘

Total Cost: $0/month 🎉
```

---

## ✅ Success Checklist

```
✅ Database deployed on Neon
✅ Backend deployed on Railway
✅ Frontend deployed on Vercel
✅ CORS configured correctly
✅ Environment variables set
✅ Migrations ran successfully
✅ Images working with Cloudinary
✅ Can create/read/update/delete posts
✅ Rich text editor working
✅ Authentication working
```

---

## 🎯 What's Next?

### **Immediate:**
- [ ] Create first real blog post
- [ ] Add some categories
- [ ] Test all features thoroughly
- [ ] Share your blog URL! 🎉

### **Soon:**
- [ ] Set up custom domain
- [ ] Add Google Analytics
- [ ] Set up automated backups
- [ ] Optimize images
- [ ] Add SEO meta tags

### **Later:**
- [ ] Add comments moderation
- [ ] Email notifications
- [ ] RSS feed
- [ ] Search functionality
- [ ] Newsletter integration

---

## 🆘 Need Help?

If you get stuck:
1. Check the platform-specific logs
2. Review the troubleshooting section above
3. Ask me! I'm here to help 🤗

---

## 🎉 Congratulations!

Your blog is now LIVE on the internet! 🚀

Share it with the world:
- Tweet about it 🐦
- Post on LinkedIn 💼
- Share with friends 👥
- Start writing! ✍️

**Your blog is at**: `https://your-blog.vercel.app`

Enjoy your new blog! 🎊
