# ACIKY Project - AI Coding Agent Instructions

## Project Overview
ACIKY is a dual-repository yoga studio management system for the Cuban Kundalini Yoga Association:
- **yoga-backend**: Node.js/Express REST API with MySQL
- **yoga**: Static HTML/CSS/JS frontend with Live Server development

## Architecture & Data Flow

### Backend Structure (yoga-backend/)
- **server.js**: Express app entry point with session middleware, CORS config for `http://127.0.0.1:5500`
- **config/database.js**: MySQL connection pool (mysql2/promise wrapper)
- **routes/**: Express routers that delegate to controllers
- **controllers/**: Business logic with async/await database queries
- **middleware/auth.js**: Three middleware functions: `requireAuth`, `requireAdmin`, `requireInstructor`

### Frontend Structure (yoga/)
- **index.html**: Main landing page with promotional sliders
- **pages/**: All secondary pages (login, register, dashboard, blog, etc.)
- **js/common.js**: Dynamically injects header/footer on all pages, handles path resolution for subdirectories
- **js/auth.js**: Wrapped in `DOMContentLoaded`, handles login/register forms with `credentials: 'include'`

### Key Integration Points
1. **Session-based auth**: Backend uses `express-session` with httpOnly cookies, `sameSite: 'lax'`
2. **API calls**: Frontend always includes `credentials: 'include'` for cookie transmission
3. **Path resolution**: `common.js` detects directory depth to fix relative links (handles root vs `pages/` vs `pages/cards/`)
4. **CORS**: Backend explicitly allows `http://127.0.0.1:5500` origin with credentials

## Development Workflow

### Start Backend Server
```bash
cd yoga-backend
npm run dev  # Uses nodemon for auto-reload
# Runs on http://localhost:3000
```

### Start Frontend
Open `yoga/index.html` with Live Server (VS Code extension) - must use port 5500 for CORS

### Database Setup
1. Create MySQL database named `yoga_db`
2. Run schema migrations (tables: users, blog_posts, activities, routes, testimonials, etc.)
3. Create admin user: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';`

### Environment Variables
Required in `yoga-backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yoga_db
DB_PORT=3306
PORT=3000
SESSION_SECRET=your_secret_key_here
```

## Critical Patterns & Conventions

### Backend Controller Pattern
```javascript
// All controllers follow this structure:
exports.methodName = async (req, res) => {
    try {
        // 1. Extract and validate inputs
        const { field } = req.body;
        if (!field) {
            return res.status(400).json({ success: false, message: 'Validation error' });
        }
        
        // 2. Database query with parameterized queries (SQL injection prevention)
        const [results] = await db.query('SELECT * FROM table WHERE id = ?', [id]);
        
        // 3. Return consistent response format
        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Method error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
```

### Response Format Convention
All API responses use this structure:
```json
{
  "success": true|false,
  "message": "Optional message",
  "data": {}  // Optional data payload
}
```

### Frontend API Call Pattern
```javascript
// Always include credentials for session cookies
const response = await fetch(`http://127.0.0.1:3000/api/endpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // CRITICAL for sessions
    body: JSON.stringify(data)
});
const result = await response.json();
```

### Auth Middleware Usage in Routes
```javascript
// routes/example.js
router.get('/', controller.publicMethod);              // No middleware
router.post('/', requireAdmin, controller.adminMethod); // Admin only
router.put('/:id', requireInstructor, controller.instructorMethod); // Admin or instructor
```

### Dynamic Header/Footer Injection
`common.js` runs on every page:
1. Detects directory depth by counting slashes in `window.location.pathname`
2. Adjusts all relative paths (`../` prefix) for navigation and images
3. Injects header with logo, nav menu, auth buttons
4. Checks auth status via `/api/auth/check` and shows/hides UI elements

### Path Resolution Logic
```javascript
// Handles GitHub Pages vs local, root vs subdirectories
const pathParts = currentPath.split('/').filter(part => part !== '');
const dirDepth = pathParts.length - (pathParts[pathParts.length - 1]?.includes('.html') ? 1 : 0);
const prefix = '../'.repeat(dirDepth);  // Used for links from subdirectories
```

## Testing & Debugging

### Test Auth Flow
1. Start backend: `npm run dev` in yoga-backend
2. Register user via `pages/register.html`
3. Login via `pages/login.html` (check browser DevTools → Application → Cookies for session cookie)
4. Access `pages/dashboard.html` (should redirect to login if not authenticated)

### Common Issues
- **CORS errors**: Verify Live Server is on port 5500 and backend CORS config matches
- **Session not persisting**: Check `credentials: 'include'` in fetch calls and `sameSite: 'lax'` in session config
- **Paths broken**: `common.js` must load before other scripts; check directory depth calculation
- **Database connection fails**: Verify `.env` file exists and MySQL is running

### Debug Logging
Backend logs database connection status on startup. Frontend logs auth status in console.

## Database Schema Notes
- **users**: `role` enum ('user', 'instructor', 'admin')
- **blog_posts**: `slug` field must be unique; auto-increments `views` on read; `published_at` set when `published = true`
- **activities**: `difficulty_level` enum ('beginner', 'intermediate', 'advanced', 'all')
- All tables use `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

## Deployment Considerations

### Backend (Heroku)
1. Create Heroku app: `heroku create aciky-backend`
2. Add MySQL add-on: `heroku addons:create cleardb:ignite`
3. Get database URL: `heroku config:get CLEARDB_DATABASE_URL`
4. Set environment variables:
   ```bash
   heroku config:set SESSION_SECRET=your_production_secret
   heroku config:set NODE_ENV=production
   ```
5. Update `server.js` CORS origin to GitHub Pages URL: `https://camachoeng.github.io`
6. Update session config: `cookie.secure: true` for HTTPS
7. Deploy: `git push heroku main`

### Frontend (GitHub Pages)
1. Push to GitHub repository
2. Enable GitHub Pages in Settings → Pages → Branch: main
3. Update `API_URL` in `js/auth.js` to Heroku backend URL
4. Update all `fetch()` calls to use production API URL
5. Commit and push changes

### Critical Changes for Production
- **CORS**: `server.js` → `origin: 'https://camachoeng.github.io'`
- **API URLs**: `auth.js` and all pages → `https://aciky-backend.herokuapp.com/api`
- **Cookies**: `server.js` → `cookie: { secure: true, sameSite: 'none' }` (cross-origin)
- **Database**: Use ClearDB MySQL connection from Heroku config

## Code Style Guidelines
- Use `async/await` (not `.then()`) for all async operations
- Destructure request params: `const { field } = req.body;`
- Always use parameterized queries: `db.query('SELECT * FROM users WHERE id = ?', [id])`
- Prefer `const` over `let`; avoid `var`
- Use arrow functions for callbacks: `arr.forEach(item => {})`
- Include error logging: `console.error('Context error:', error);`

## File Naming Conventions
- Backend controllers: `*Controller.js` (camelCase)
- Backend routes: lowercase plural `activities.js`, `routes.js` (note: "routes" is both a feature and Express concept)
- Frontend pages: lowercase with hyphens if needed `schedule.html`, `kundalini-yoga.html`
- Frontend scripts: lowercase `auth.js`, `common.js`
