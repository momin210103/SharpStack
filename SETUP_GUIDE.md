# Blog System - Complete Setup Guide

This guide will help you set up and run both the backend API and frontend React application.

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (or SQL Server in Docker)
- A code editor (VS Code recommended)

## Project Structure

```
BlogSystem/
├── Blog.API/              # ASP.NET Core Web API
├── Blog.Application/      # Application layer (Services, DTOs)
├── Blog.Domain/           # Domain layer (Entities, Exceptions)
├── Blog.Infrastructure/   # Infrastructure layer (DbContext, Repositories)
└── blog-frontend/         # React.js Frontend
```

---

## Backend Setup (ASP.NET Core API)

### 1. Configure Database Connection

Edit `Blog.API/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=BlogDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### 2. Run Database Migrations

```bash
cd BlogSystem
dotnet ef database update --project Blog.Infrastructure --startup-project Blog.API
```

This will create the database and all required tables.

### 3. Start the Backend API

```bash
cd Blog.API
dotnet run
```

The API will start at: `http://localhost:5000` (or `https://localhost:5001`)

**Note:** The backend is configured with CORS to allow requests from `http://localhost:5173` (frontend)

### 4. Test the API

- Swagger UI: `http://localhost:5000/swagger`
- Test endpoints like `/api/auth/register` and `/api/posts`

---

## Frontend Setup (React.js)

### 1. Install Dependencies

```bash
cd blog-frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `blog-frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Important:** Make sure the URL matches your backend API URL (without trailing slash on /api)

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will start at: `http://localhost:5173`

---

## First Time Usage

### 1. Register a User

1. Go to `http://localhost:5173`
2. Click "Sign Up" in the navbar
3. Enter email and password
4. Click "Create Account"

### 2. Create Admin User

To access admin features, you need to assign the Admin role to your user:

**Option A: Using SQL Query**
```sql
-- Get your user ID
SELECT Id, Email FROM AspNetUsers WHERE Email = 'your@email.com';

-- Get Admin role ID
SELECT Id FROM AspNetRoles WHERE Name = 'Admin';

-- Add Admin role to user
INSERT INTO AspNetUserRoles (UserId, RoleId)
VALUES ('YOUR_USER_ID', 'ADMIN_ROLE_ID');
```

**Option B: Register with a different approach** (recommended)
The system automatically assigns "User" role on registration. You can manually promote users to Admin via database.

### 3. Login

1. Go to `http://localhost:5173/login`
2. Enter your credentials
3. Click "Sign In"

### 4. Access Admin Dashboard

If you have Admin role:
- Click "Dashboard" in the navbar
- Or go to `http://localhost:5173/admin`

---

## Features Overview

### Public Features (No Login Required)
- ✅ Browse published blog posts
- ✅ View post details
- ✅ Search posts
- ✅ Filter by category
- ✅ Register and login

### User Features (Login Required)
- ✅ Comment on posts
- ✅ Edit your own comments
- ✅ Delete your own comments

### Admin Features (Admin Role Required)
- ✅ Create new posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Publish/unpublish posts
- ✅ View all posts (including drafts)
- ✅ Manage categories
- ✅ Upload images (up to 3 per post)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Public Posts
- `GET /api/posts` - Get published posts (with pagination)
- `GET /api/posts/{slug}` - Get post by slug

### Admin Posts
- `GET /api/Posts/allposts` - Get all posts
- `GET /api/Posts/unpublished` - Get unpublished posts
- `POST /api/Posts` - Create post
- `PUT /api/Posts/{id}` - Update post
- `DELETE /api/Posts/{id}` - Delete post
- `PUT /api/Posts/{id}/publish` - Publish post

### Comments
- `GET /api/posts/{postId}/comments` - Get comments
- `POST /api/posts/{postId}/comments` - Create comment
- `PUT /api/posts/{postId}/comments/{commentId}` - Update comment
- `DELETE /api/posts/{postId}/comments/{commentId}` - Delete comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Search
- `GET /api/search?q={query}` - Search posts

---

## Troubleshooting

### Backend Issues

**Issue: Database connection fails**
- Check SQL Server is running
- Verify connection string in `appsettings.json`
- Ensure database exists (run migrations)

**Issue: CORS errors**
- Verify CORS is enabled in `Program.cs`
- Check frontend URL matches CORS policy

### Frontend Issues

**Issue: API calls fail with 404**
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running
- Check backend URL (with/without https)

**Issue: JWT token issues**
- Clear browser localStorage
- Login again
- Check JWT configuration in backend

**Issue: Can't access admin features**
- Verify user has Admin role in database
- Check JWT token contains Admin role claim

---

## Development Tips

### Backend Development
```bash
# Watch mode (auto-restart on changes)
cd Blog.API
dotnet watch run

# Create new migration
dotnet ef migrations add MigrationName --project Blog.Infrastructure --startup-project Blog.API

# View logs
# Check Blog.API/logs/ folder
```

### Frontend Development
```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Production Deployment

### Backend
1. Update `appsettings.Production.json` with production settings
2. Build: `dotnet publish -c Release`
3. Deploy to IIS, Azure App Service, or Docker

### Frontend
1. Update `.env` with production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Netlify, Vercel, AWS S3)

---

## Tech Stack

### Backend
- .NET 8.0
- Entity Framework Core 8
- ASP.NET Core Identity
- JWT Authentication
- SQL Server
- Serilog (Logging)
- AutoMapper
- FluentValidation

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- React Hot Toast
- React Icons
- JWT Decode

---

## Project Architecture

### Backend (Clean Architecture)
```
Domain Layer (Entities, Exceptions)
    ↓
Application Layer (Services, DTOs, Interfaces)
    ↓
Infrastructure Layer (DbContext, Repositories, Identity)
    ↓
API Layer (Controllers, Middleware, Extensions)
```

### Frontend (Component-Based)
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── context/        # React Context (Auth)
├── config/         # Configuration
└── App.jsx         # Root component
```

---

## License

This project is part of the BlogSystem solution.

## Support

For issues or questions, please check:
- API Swagger documentation: `http://localhost:5000/swagger`
- Frontend console logs (F12 in browser)
- Backend logs in `Blog.API/logs/`

---

**Happy Blogging! 🎉**
