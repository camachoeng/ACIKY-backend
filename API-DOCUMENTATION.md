# ACIKY Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via session cookies. Admin-only endpoints require the user to have `role = 'admin'`.

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

### Check Authentication Status
```http
GET /api/auth/check
```

---

## Blog Endpoints

### Get All Blog Posts (Public)
```http
GET /api/blog?category=Noticias&published=true&limit=10&offset=0
```

**Query Parameters:**
- `category` (optional): Filter by category
- `published` (optional): Filter published posts (default: true)
- `limit` (optional): Number of posts (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "slug": "post-title",
      "content": "<p>HTML content</p>",
      "excerpt": "Short description",
      "category": "Noticias",
      "tags": "yoga,kundalini",
      "featured_image": "/images/post.jpg",
      "published": true,
      "views": 150,
      "author_id": 1,
      "author_name": "Admin",
      "published_at": "2025-01-01T00:00:00.000Z",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Get Single Blog Post (Public)
```http
GET /api/blog/:slug
```

**Example:**
```http
GET /api/blog/bienvenidos-a-aciky
```

### Create Blog Post (Admin Only)
```http
POST /api/blog
Content-Type: application/json
Cookie: session_id=...

{
  "title": "New Post",
  "slug": "new-post",
  "content": "<h2>Content</h2><p>Paragraph</p>",
  "excerpt": "Short description",
  "category": "Educación",
  "tags": "yoga,meditación",
  "featured_image": "/images/new-post.jpg",
  "published": true
}
```

### Update Blog Post (Admin Only)
```http
PUT /api/blog/:id
Content-Type: application/json
Cookie: session_id=...

{
  "title": "Updated Title",
  "published": true
}
```

### Delete Blog Post (Admin Only)
```http
DELETE /api/blog/:id
Cookie: session_id=...
```

---

## Activities Endpoints

### Get All Activities (Public)
```http
GET /api/activities?active=true&featured=true&difficulty_level=beginner&limit=20&offset=0
```

**Query Parameters:**
- `active` (optional): Filter active activities (default: true)
- `featured` (optional): Filter featured activities
- `difficulty_level` (optional): beginner, intermediate, advanced, all
- `limit` (optional): Number of activities (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Clase Matutina",
      "description": "Full description",
      "short_description": "Brief description",
      "schedule": "Lunes a Viernes 6:00 AM - 7:30 AM",
      "duration": 90,
      "location": "Centro ACIKY La Habana",
      "instructor_id": 1,
      "instructor_name": "Instructor Name",
      "price": 10.00,
      "icon": "🌅",
      "difficulty_level": "all",
      "active": true,
      "featured": true,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Activity (Public)
```http
GET /api/activities/:id
```

### Create Activity (Admin Only)
```http
POST /api/activities
Content-Type: application/json
Cookie: session_id=...

{
  "name": "New Class",
  "description": "Full description",
  "short_description": "Brief description",
  "schedule": "Lunes 7:00 PM",
  "duration": 60,
  "location": "Centro ACIKY",
  "instructor_id": 1,
  "price": 15.00,
  "icon": "🧘",
  "difficulty_level": "beginner",
  "active": true,
  "featured": false
}
```

### Update Activity (Admin Only)
```http
PUT /api/activities/:id
Content-Type: application/json
Cookie: session_id=...

{
  "price": 12.00,
  "featured": true
}
```

### Delete Activity (Admin Only)
```http
DELETE /api/activities/:id
Cookie: session_id=...
```

---

## Routes (Rutas Doradas) Endpoints

### Get All Routes (Public)
```http
GET /api/routes?status=active
```

**Query Parameters:**
- `status` (optional): active, planning, inactive

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ruta Nueva Gerona",
      "origin": "La Habana",
      "destination": "Isla de la Juventud",
      "description": "Route description",
      "frequency": "Anual",
      "status": "active",
      "participants_count": 50,
      "spaces_established": 1,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Route (Public)
```http
GET /api/routes/:id
```

### Create Route (Admin Only)
```http
POST /api/routes
Content-Type: application/json
Cookie: session_id=...

{
  "name": "Ruta Varadero",
  "origin": "La Habana",
  "destination": "Varadero",
  "description": "Description",
  "frequency": "Mensual",
  "status": "active",
  "participants_count": 30,
  "spaces_established": 2
}
```

### Update Route (Admin Only)
```http
PUT /api/routes/:id
Content-Type: application/json
Cookie: session_id=...

{
  "participants_count": 60,
  "spaces_established": 3
}
```

### Delete Route (Admin Only)
```http
DELETE /api/routes/:id
Cookie: session_id=...
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Testing with Fetch API

### Example: Get all blog posts
```javascript
fetch('http://localhost:3000/api/blog?published=true')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Example: Create blog post (Admin)
```javascript
fetch('http://localhost:3000/api/blog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    title: 'New Post',
    slug: 'new-post',
    content: '<p>Content here</p>',
    published: true
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Next Steps

1. ✅ Database setup complete
2. ✅ API endpoints created
3. ⏳ **Next:** Create admin panel HTML interface
4. ⏳ Connect frontend to API endpoints
5. ⏳ Deploy backend to cloud hosting
6. ⏳ Update frontend to use production API URLs

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Session cookies expire after 24 hours
- CORS is configured for `http://127.0.0.1:5500` (Live Server)
- For production, update CORS origin in `server.js`
