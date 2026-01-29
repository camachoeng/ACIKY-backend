# Backend Architecture Documentation

## Overview

This backend follows a **Layered Architecture** pattern with clear separation of concerns:

```
Routes → Controllers → Services → Repositories → Database
```

Each layer has a specific responsibility and only communicates with adjacent layers.

---

## Architecture Layers

### 1. Routes Layer (`routes/`)
**Purpose**: Define HTTP endpoints and apply middleware

**Responsibilities**:
- Map HTTP methods and paths to controller functions
- Apply middleware (authentication, rate limiting, etc.)
- Group related endpoints together

**Example**:
```javascript
// routes/spaces.js
const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', spaceController.getAllSpaces);          // Public
router.get('/:id', spaceController.getSpaceById);       // Public
router.post('/', requireAdmin, spaceController.createSpace);  // Admin only

module.exports = router;
```

---

### 2. Controllers Layer (`controllers/`)
**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Extract data from `req` (query params, body, params)
- Call appropriate service methods
- Handle HTTP status codes (200, 201, 400, 404, 500)
- Format responses as JSON
- Catch errors and return appropriate error responses

**Rules**:
- ❌ NO business logic
- ❌ NO database queries
- ❌ NO validation (delegate to service)
- ✅ Only HTTP handling

**Example**:
```javascript
// controllers/spaceController.js
const spaceService = require('../services/spaceService');

exports.getAllSpaces = async (req, res) => {
    try {
        const filters = {
            active: req.query.active,
            limit: req.query.limit,
            offset: req.query.offset
        };

        const spaces = await spaceService.getAllSpaces(filters);

        res.json({
            success: true,
            data: spaces
        });

    } catch (error) {
        console.error('Get all spaces error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving spaces'
        });
    }
};
```

---

### 3. Services Layer (`services/`)
**Purpose**: Implement business logic and orchestrate data flow

**Responsibilities**:
- Input validation (using validation utilities)
- Business rule enforcement
- Data sanitization (XSS protection)
- Orchestrate multiple repository calls
- Transform data between layers
- Throw meaningful errors with status codes

**Rules**:
- ❌ NO direct database queries (use repositories)
- ❌ NO HTTP handling (status codes, res.json)
- ✅ All business logic goes here
- ✅ Throw errors with `error.statusCode` for controllers to use

**Example**:
```javascript
// services/spaceService.js
const spaceRepository = require('../repositories/spaceRepository');

class SpaceService {
    async getAllSpaces(filters) {
        const spaces = await spaceRepository.findAll(filters);

        if (spaces.length === 0) {
            return [];
        }

        // Batch load related data (N+1 optimization)
        const spaceIds = spaces.map(s => s.id);
        const [instructorsData, disciplinesData] = await Promise.all([
            spaceRepository.findInstructorsBySpaceIds(spaceIds),
            spaceRepository.findDisciplinesBySpaceIds(spaceIds)
        ]);

        // Transform and attach related data
        spaces.forEach(space => {
            space.instructors = this._filterInstructors(instructorsData, space.id);
            space.disciplines = this._filterDisciplines(disciplinesData, space.id);
        });

        return spaces;
    }

    async createSpace(data) {
        const { name } = data;

        // Validation
        if (!name) {
            throw new Error('Space name is required');
        }

        // Create and return complete space
        const spaceId = await spaceRepository.create(data);
        return await this.getSpaceById(spaceId);
    }
}

module.exports = new SpaceService();
```

---

### 4. Repositories Layer (`repositories/`)
**Purpose**: Encapsulate all database access

**Responsibilities**:
- Execute SQL queries
- Map database results to JavaScript objects
- Provide CRUD operations
- Batch loading for performance (avoid N+1 queries)

**Rules**:
- ❌ NO business logic
- ❌ NO validation
- ✅ Only database operations
- ✅ Return raw data

**Example**:
```javascript
// repositories/spaceRepository.js
const db = require('../config/database');

class SpaceRepository {
    async findAll({ active = true, limit = 20, offset = 0 }) {
        let query = 'SELECT s.* FROM spaces s WHERE 1=1';
        const params = [];

        if (active) {
            query += ' AND s.active = true';
        }

        query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [spaces] = await db.query(query, params);
        return spaces;
    }

    async findById(id) {
        const [spaces] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        return spaces[0] || null;
    }

    async create({ name, image, address, phone, email, location }) {
        const [result] = await db.query(
            `INSERT INTO spaces (name, image, address, phone, email, location)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, image, address, phone, email, location]
        );
        return result.insertId;
    }

    async update(id, fields) {
        const updateFields = [];
        const updateValues = [];

        ['name', 'image', 'address', 'phone', 'email', 'location', 'active'].forEach(field => {
            if (fields[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(fields[field]);
            }
        });

        if (updateFields.length === 0) return;

        updateValues.push(id);
        await db.query(
            `UPDATE spaces SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
    }

    async delete(id) {
        await db.query('DELETE FROM spaces WHERE id = ?', [id]);
    }
}

module.exports = new SpaceRepository();
```

---

## Supporting Layers

### Middleware (`middleware/`)
- **Authentication** ([auth.js](middleware/auth.js)): `requireAuth`, `requireAdmin`, `requireInstructor`
- **Rate Limiting** ([rateLimiter.js](middleware/rateLimiter.js)): Protects against abuse
- **Error Handling** ([errorHandler.js](middleware/errorHandler.js)): Global error handler

### Utilities (`utils/`)
- **Validation** ([validation.js](utils/validation.js)): Email, password, username validation
- **Sanitization** ([sanitize.js](utils/sanitize.js)): XSS protection
- **Auth Tokens** ([authToken.js](utils/authToken.js)): Token parsing helpers

---

## Data Flow Example

Here's how a request flows through the system:

### Example: Create a new space

```
1. Client Request
   POST /api/spaces
   Body: { name: "Yoga Studio", address: "123 Main St", ... }

2. Route Layer (routes/spaces.js)
   → Checks authentication middleware
   → Forwards to spaceController.createSpace()

3. Controller Layer (controllers/spaceController.js)
   → Extracts req.body
   → Calls spaceService.createSpace(req.body)
   → Returns 201 with created space data

4. Service Layer (services/spaceService.js)
   → Validates input (name required, email format, etc.)
   → Sanitizes text fields (XSS protection)
   → Calls spaceRepository.create()
   → Calls spaceRepository.findById() to get complete data
   → Returns space object

5. Repository Layer (repositories/spaceRepository.js)
   → Executes INSERT query
   → Returns insertId
   → Executes SELECT query with joins
   → Returns space with related data

6. Database
   → Stores data
   → Returns results
```

---

## Benefits of This Architecture

### 1. **Separation of Concerns**
Each layer has ONE job. Easy to understand what each file does.

### 2. **Testability**
- Test repositories with database mocks
- Test services with repository mocks
- Test controllers with service mocks

### 3. **Maintainability**
- Need to change validation? → Edit service
- Need to optimize queries? → Edit repository
- Need to change API response format? → Edit controller

### 4. **Reusability**
- Services can be called from multiple controllers
- Repositories can be called from multiple services
- No code duplication

### 5. **Team Collaboration**
- Frontend devs: Work with controllers (API contracts)
- Backend devs: Work with services (business logic)
- Database devs: Work with repositories (queries)

### 6. **Easy to Scale**
- Add caching layer between service and repository
- Replace repository with API calls (microservices)
- Add message queues for async operations

---

## Design Patterns Used

### 1. **Repository Pattern**
Encapsulates database access. Makes it easy to:
- Switch databases (MySQL → PostgreSQL)
- Add caching
- Mock for testing

### 2. **Service Layer Pattern**
Centralizes business logic. Prevents:
- Logic duplication across controllers
- "Fat controllers" anti-pattern
- Business rules in database layer

### 3. **Dependency Injection**
Services depend on repositories (not database directly). Controllers depend on services (not repositories).

### 4. **Singleton Pattern**
Each repository and service is exported as a singleton instance:
```javascript
module.exports = new SpaceService();
```

---

## Common Scenarios

### Adding a New Feature

1. **Create repository** (`repositories/featureRepository.js`)
   - Add database queries

2. **Create service** (`services/featureService.js`)
   - Import repository
   - Add business logic
   - Add validation

3. **Create controller** (`controllers/featureController.js`)
   - Import service
   - Handle HTTP requests

4. **Create routes** (`routes/feature.js`)
   - Map endpoints to controller
   - Add middleware

5. **Register in server.js**
   ```javascript
   const featureRoutes = require('./routes/feature');
   app.use('/api/feature', featureRoutes);
   ```

### Optimizing Database Queries

**Only edit the repository!**

```javascript
// Before (N+1 query problem)
async getAllWithRelations() {
    const items = await this.findAll();
    for (let item of items) {
        item.relations = await this.findRelations(item.id); // N queries
    }
    return items;
}

// After (batch loading)
async getAllWithRelations() {
    const items = await this.findAll();
    const ids = items.map(i => i.id);
    const relationsData = await this.findRelationsByIds(ids); // 1 query

    items.forEach(item => {
        item.relations = relationsData.filter(r => r.item_id === item.id);
    });
    return items;
}
```

### Adding Validation

**Only edit the service!**

```javascript
async createItem(data) {
    // Add validation
    if (!data.required_field) {
        const error = new Error('Required field is missing');
        error.statusCode = 400;
        throw error;
    }

    // Existing logic continues...
    return await itemRepository.create(data);
}
```

---

## File Structure

```
yoga-backend/
├── controllers/          # HTTP handling (thin)
│   ├── authController.js
│   ├── spaceController.js
│   ├── userController.js
│   ├── galleryController.js
│   ├── testimonialController.js
│   ├── blogController.js
│   ├── activityController.js
│   ├── routeController.js
│   ├── bookingController.js
│   ├── contactController.js
│   └── statsController.js
│
├── services/             # Business logic (orchestration)
│   ├── authService.js
│   ├── spaceService.js
│   ├── userService.js
│   ├── galleryService.js
│   ├── testimonialService.js
│   ├── blogService.js
│   ├── activityService.js
│   ├── routeService.js
│   ├── bookingService.js
│   ├── contactService.js
│   └── statsService.js
│
├── repositories/         # Database access (SQL only)
│   ├── spaceRepository.js
│   ├── userRepository.js
│   ├── galleryRepository.js
│   ├── testimonialRepository.js
│   ├── blogRepository.js
│   ├── activityRepository.js
│   ├── routeRepository.js
│   └── statsRepository.js
│
├── routes/               # API endpoints
├── middleware/           # Authentication, rate limiting, errors
├── utils/                # Validation, sanitization, helpers
├── config/               # Database, environment
└── tests/                # Automated tests
```

---

## Testing Strategy

### Unit Tests
Test each layer independently:

```javascript
// Test service with mocked repository
describe('SpaceService', () => {
    it('should validate space name', async () => {
        await expect(spaceService.createSpace({}))
            .rejects.toThrow('Space name is required');
    });
});

// Test repository with test database
describe('SpaceRepository', () => {
    it('should insert space and return ID', async () => {
        const id = await spaceRepository.create({ name: 'Test Space' });
        expect(id).toBeGreaterThan(0);
    });
});
```

### Integration Tests
Test full request flow:

```javascript
describe('POST /api/spaces', () => {
    it('should create space with 201 status', async () => {
        const response = await request(app)
            .post('/api/spaces')
            .send({ name: 'New Space', address: '123 Main St' });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });
});
```

---

## Performance Considerations

### N+1 Query Prevention
Always use batch loading in repositories:

```javascript
// ❌ BAD: N+1 queries
for (let space of spaces) {
    space.instructors = await repo.findInstructors(space.id);
}

// ✅ GOOD: Batch loading (2 queries total)
const spaceIds = spaces.map(s => s.id);
const instructors = await repo.findInstructorsBySpaceIds(spaceIds);
```

### Caching Strategy
Add caching in service layer:

```javascript
async getAllSpaces(filters) {
    const cacheKey = `spaces:${JSON.stringify(filters)}`;
    const cached = await cache.get(cacheKey);

    if (cached) return cached;

    const spaces = await spaceRepository.findAll(filters);
    await cache.set(cacheKey, spaces, 60); // Cache for 60 seconds

    return spaces;
}
```

---

## Security Best Practices

All implemented in the appropriate layers:

1. **Input Validation** (Service Layer)
   - Email format checking
   - Password strength requirements
   - Username format rules

2. **Sanitization** (Service Layer)
   - XSS protection with DOMPurify
   - HTML tag stripping
   - URL validation

3. **Rate Limiting** (Middleware)
   - Auth endpoints: 5 req/15min
   - Contact form: 3 req/hour
   - General API: 100 req/15min

4. **Authentication** (Middleware)
   - Session-based auth
   - Role-based access control
   - Secure cookie settings

---

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable and performant
- ✅ Industry-standard patterns
- ✅ Ready for team collaboration

When in doubt: **Ask yourself which layer's responsibility it is, and put it there.**
