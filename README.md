# BlogSystem - Modern Blog Platform

A full-stack blogging platform with a modern, aesthetic design built using ASP.NET Core Web API (backend) and React.js (frontend).

![Tech Stack](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## 🚀 Features

### For Visitors
- 📖 Browse and read published blog posts
- 🔍 Search posts by title or content
- 🏷️ Filter posts by categories
- 💬 View comments on posts
- 📱 Fully responsive design

### For Registered Users
- 🔐 Secure authentication with JWT
- ✍️ Comment on blog posts
- ✏️ Edit and delete own comments
- 👤 Personalized experience

### For Administrators
- 📝 Create, edit, and delete blog posts
- 📊 Manage post publishing status
- 🖼️ Upload images (up to 3 per post)
- 🗂️ Manage categories
- 📈 Admin dashboard with overview
- 🔒 Role-based access control

## 🛠️ Tech Stack

### Backend (ASP.NET Core)
- **.NET 8.0** - Latest LTS version
- **Entity Framework Core** - ORM with SQL Server
- **ASP.NET Identity** - User authentication
- **JWT** - Token-based authorization
- **Clean Architecture** - Separation of concerns
- **Serilog** - Structured logging
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Swagger** - API documentation

### Frontend (React.js)
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Beautiful notifications
- **JWT Decode** - Token handling
- **React Icons** - Icon library

## 📁 Project Structure

```
BlogSystem/
├── Blog.API/              # Web API (Controllers, Middleware, Extensions)
├── Blog.Application/      # Business Logic (Services, DTOs, Interfaces)
├── Blog.Domain/           # Domain Models (Entities, Exceptions)
├── Blog.Infrastructure/   # Data Access (DbContext, Repositories, Identity)
├── blog-frontend/         # React.js Frontend Application
└── SETUP_GUIDE.md         # Detailed setup instructions
```

## ⚡ Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (or Docker with SQL Server)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BlogSystem
```

### 2. Setup Backend
```bash
# Update connection string in Blog.API/appsettings.json

# Run migrations
dotnet ef database update --project Blog.Infrastructure --startup-project Blog.API

# Start API
cd Blog.API
dotnet run
```
**Backend runs at:** `http://localhost:5000`

### 3. Setup Frontend
```bash
cd blog-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start dev server
npm run dev
```
**Frontend runs at:** `http://localhost:5173`

### 4. First Steps
1. Visit `http://localhost:5173`
2. Click "Sign Up" and create an account
3. Login with your credentials
4. Start exploring!

**To access admin features:**
- Manually add "Admin" role to your user in the database
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions

## 📖 API Documentation

Once the backend is running, access Swagger UI at:
```
http://localhost:5000/swagger
```

## 🎨 UI Screenshots

### Public Pages
- **Home Page**: Modern card-based layout with post grid
- **Post Detail**: Clean reading experience with comment system
- **Login/Register**: Elegant authentication forms

### Admin Dashboard
- **Dashboard**: Overview with statistics
- **Post Management**: Full CRUD operations
- **Rich Text Editor**: Easy content creation

## 🔑 Key Features Implementation

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, User)
- Protected routes on both frontend and backend
- Token refresh and expiration handling

### Blog Post Management
- Create posts with title, content, and category
- Publish/unpublish workflow
- Slug-based URLs for SEO
- Image upload support (max 3 per post)
- Soft delete support

### Comment System
- Authenticated users can comment
- Edit and delete own comments
- Admin can delete any comment
- Pagination support
- Real-time display

### Search & Filtering
- Full-text search across title and content
- Category-based filtering
- Pagination for large result sets
- Case-insensitive search

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with ASP.NET Identity
- ✅ Role-based authorization
- ✅ CORS configuration
- ✅ SQL injection protection (EF Core)
- ✅ XSS protection
- ✅ HTTPS support
- ✅ Input validation
- ✅ Global error handling

## 📝 Environment Variables

### Backend (.NET)
Configure in `Blog.API/appsettings.json`:
- Database connection string
- JWT settings (Key, Issuer, Audience)
- File upload settings
- Logging configuration

### Frontend (React)
Configure in `blog-frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

### Frontend
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

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

## 🚢 Deployment

### Backend Options
- **IIS** - Windows Server
- **Azure App Service** - Cloud PaaS
- **Docker** - Containerization
- **Linux + Nginx** - Reverse proxy

### Frontend Options
- **Vercel** - Zero-config deployment
- **Netlify** - Static hosting
- **AWS S3 + CloudFront** - CDN
- **Azure Static Web Apps** - Integrated with backend

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive setup instructions
- [Blog.API/ERROR_HANDLING_GUIDE.md](./Blog.API/ERROR_HANDLING_GUIDE.md) - Error handling details
- [Blog.API/SEARCH_FUNCTIONALITY_GUIDE.md](./Blog.API/SEARCH_FUNCTIONALITY_GUIDE.md) - Search implementation
- [Blog.API/SERILOG_CONFIGURATION_GUIDE.md](./Blog.API/SERILOG_CONFIGURATION_GUIDE.md) - Logging setup
- [blog-frontend/README.md](./blog-frontend/README.md) - Frontend documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern best practices
- Clean Architecture principles
- RESTful API design
- Responsive UI/UX

## 📞 Support

For detailed setup instructions and troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Made with ❤️ using .NET 8 and React 18**
# SharpStack
