# Quick Reference Guide

## 🚀 Starting the Application

### Terminal 1 - Backend
```bash
cd /home/momin-sheikh/BlogSystem/Blog.API
dotnet run
```
**URL:** http://localhost:5000  
**Swagger:** http://localhost:5000/swagger

### Terminal 2 - Frontend
```bash
cd /home/momin-sheikh/BlogSystem/blog-frontend
npm run dev
```
**URL:** http://localhost:5173

---

## 🔐 Creating Admin User

### Step 1: Register a User
1. Go to http://localhost:5173/register
2. Enter email and password
3. Click "Create Account"

### Step 2: Add Admin Role (SQL)
```sql
-- Get your user ID
SELECT Id, Email FROM AspNetUsers WHERE Email = 'your@email.com';

-- Get Admin role ID  
SELECT Id FROM AspNetRoles WHERE Name = 'Admin';

-- Add Admin role to user (replace IDs)
INSERT INTO AspNetUserRoles (UserId, RoleId)
VALUES ('YOUR_USER_ID_HERE', 'ADMIN_ROLE_ID_HERE');
```

### Step 3: Login Again
1. Logout if already logged in
2. Login at http://localhost:5173/login
3. You now have admin access!

---

## 📍 Key URLs

| Page | URL | Access |
|------|-----|--------|
| Home | http://localhost:5173 | Public |
| Login | http://localhost:5173/login | Public |
| Register | http://localhost:5173/register | Public |
| Post Detail | http://localhost:5173/post/{slug} | Public |
| Admin Dashboard | http://localhost:5173/admin | Admin Only |
| Create Post | http://localhost:5173/admin/posts/create | Admin Only |
| Manage Posts | http://localhost:5173/admin/posts | Admin Only |
| API Swagger | http://localhost:5000/swagger | Public |

---

## 🎯 Common Tasks

### Create First Category (via Swagger)
1. Go to http://localhost:5000/swagger
2. Register and Login to get token
3. Click "Authorize" button and add: `Bearer YOUR_TOKEN`
4. POST /api/categories with:
```json
{
  "name": "Technology",
  "slug": "technology",
  "isActive": true
}
```

### Create First Post
1. Login as Admin
2. Go to http://localhost:5173/admin/posts/create
3. Fill in:
   - Title: "My First Post"
   - Category: Select from dropdown
   - Content: Write your post
4. Click "Create Post"
5. Go to Manage Posts → Click Publish

### Add Comments
1. Login as any user
2. Go to a published post
3. Scroll to comments section
4. Type your comment
5. Click "Post Comment"

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Database connection failed**
```bash
# Check SQL Server is running
# Update connection string in Blog.API/appsettings.json
# Run migrations:
dotnet ef database update --project Blog.Infrastructure --startup-project Blog.API
```

**Error: Port 5000 already in use**
```bash
# Kill the process
lsof -i :5000
kill -9 <PID>
```

### Frontend Issues

**Error: Cannot connect to API**
- Check backend is running at http://localhost:5000
- Verify `.env` file has correct API URL
- Check CORS is enabled in backend

**Error: Module not found**
```bash
cd blog-frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: Unauthorized (401)**
- Clear browser localStorage
- Login again
- Check JWT token is being sent in requests (F12 → Network tab)

---

## 📝 API Testing with Swagger

### Get JWT Token
1. POST /api/auth/register (if new user)
2. POST /api/auth/login
3. Copy the token from response
4. Click "Authorize" button at top
5. Enter: `Bearer YOUR_TOKEN_HERE`
6. Click "Authorize"

### Test Protected Endpoints
Now you can test:
- GET /api/Posts/allposts
- POST /api/Posts
- PUT /api/Posts/{id}
- DELETE /api/Posts/{id}

---

## 🔄 Reset Database

```bash
cd BlogSystem
dotnet ef database drop --project Blog.Infrastructure --startup-project Blog.API --force
dotnet ef database update --project Blog.Infrastructure --startup-project Blog.API
```

---

## 📦 Production Build

### Backend
```bash
cd Blog.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd blog-frontend
npm run build
# Output in dist/ folder
```

---

## 🎨 Customization

### Change Theme Colors
Edit `blog-frontend/tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#YOUR_COLOR',
    600: '#YOUR_COLOR',
    // ...
  }
}
```

### Change API URL
Edit `blog-frontend/.env`:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

---

## 📞 Support

Check these documents for help:
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete project overview
- **README.md** - Quick start guide
- **Logs** - Check `Blog.API/logs/` folder

---

**Happy Blogging! 🎉**
