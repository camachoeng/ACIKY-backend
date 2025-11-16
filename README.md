# 🧘 ACIKY Backend API

REST API backend for ACIKY (Asociación Cubana de Instructores de Kundalini Yoga) website content management system.

## 🚀 Features

- **Authentication System** - Secure login/register with session management
- **Role-Based Access Control** - Admin, Instructor, and User roles
- **Content Management** - CRUD operations for:
  - Blog posts
  - Activities/Classes
  - Routes (Rutas Doradas)
  - Testimonials
  - Events
  - Gallery
  - FAQs
  - Contact messages
- **RESTful API** - Clean, documented endpoints
- **MySQL Database** - Relational data storage
- **CORS Enabled** - Frontend integration ready

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/camachoeng/ACIKY.git
   cd yoga-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=yoga_db
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   SESSION_SECRET=your_secret_key_here
   ```

4. **Set up the database**
   
   Run the SQL migration scripts in MySQL Workbench or command line in this order:
   - Create the database schema
   - Run migrations for all tables
   - Insert initial data

5. **Create an admin user**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run at `http://localhost:3000`

## 📚 API Documentation

See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for complete endpoint reference.

### Quick Reference

#### Public Endpoints
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post
- `GET /api/activities` - Get all activities
- `GET /api/routes` - Get all routes

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status

#### Admin Endpoints (Requires Admin Role)
- `POST /api/blog` - Create blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- Similar CRUD endpoints for activities, routes, etc.

## 🗂️ Project Structure

```
yoga-backend/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── blogController.js    # Blog CRUD operations
│   ├── activityController.js
│   └── routeController.js
├── middleware/
│   └── auth.js              # Auth & authorization middleware
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── blog.js              # Blog endpoints
│   ├── activities.js
│   └── routes.js
├── .env                     # Environment variables (not in Git)
├── .gitignore
├── package.json
├── server.js                # Express app entry point
└── README.md                # This file
```

## 🔐 Security

- Passwords are hashed with bcrypt
- Session-based authentication with httpOnly cookies
- CORS configured for specific origins
- SQL injection prevention with parameterized queries
- Input validation on all endpoints
- Role-based access control for admin operations

## 🌐 CORS Configuration

Currently configured for:
- `http://127.0.0.1:5500` (Live Server)

For production, update `server.js`:
```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
}));
```

## 🚢 Deployment

### Recommended Hosting Platforms
- **Heroku** - Easy deployment with MySQL add-on
- **Railway** - Modern, developer-friendly
- **Render** - Free tier available
- **DigitalOcean** - Full control with App Platform

### Deployment Checklist
- [ ] Set environment variables on hosting platform
- [ ] Update CORS origins for production domain
- [ ] Set up cloud MySQL database (ClearDB, PlanetScale, etc.)
- [ ] Configure SSL/HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Update frontend API URLs to production backend

## 🧪 Testing

Test the API endpoints using:
- Postman
- cURL
- Browser fetch API
- Your frontend application

Example test:
```javascript
fetch('http://localhost:3000/api/blog')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL client
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **express-session** - Session management
- **dotenv** - Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary to ACIKY.

## 👥 Authors

- **ACIKY Team** - [GitHub](https://github.com/camachoeng)

## 📧 Support

For issues or questions, contact: acikyrespiray@gmail.com

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 2025
