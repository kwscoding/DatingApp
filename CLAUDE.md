# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JejuMatch is a dating web application for Jeju National University students. It's a full-stack application with React frontend and Express/MongoDB backend featuring JWT authentication, Socket.io real-time chat, and an AI-based profile photo scoring system.

## Development Commands

### Server (Backend)
```bash
cd jejumatch/server
npm install              # Install dependencies
npm run dev             # Start development server with nodemon (auto-reload)
npm start               # Start production server
```
Server runs on http://localhost:5000

### Client (Frontend)
```bash
cd jejumatch/client
npm install              # Install dependencies
npm start               # Start development server (opens browser)
npm run build           # Build for production
npm test                # Run tests
```
Client runs on http://localhost:3000

### Database
MongoDB must be running before starting the server:
```bash
mongod                  # Start MongoDB service
mongosh                 # Connect to MongoDB shell for debugging
```

## Architecture

### Backend Architecture (jejumatch/server/src/)

**Entry Points:**
- `server.js` - HTTP server creation, Socket.io initialization, MongoDB connection
- `app.js` - Express app configuration, middleware setup, route registration

**Data Flow:**
1. Request → Middleware (`middlewares/auth.js`) → Route handler (`routes/*.routes.js`)
2. Route handler calls business logic in route files directly (no separate service layer)
3. Models (`models/`) define MongoDB schemas with Mongoose
4. Response sent back to client

**Key Models:**
- `User.js` - User authentication & profile data with embedded like tracking (likedUsers, likedByUsers arrays)
- `Match.js` - Bidirectional matches between user pairs with unique compound index
- `Message.js` - Chat messages linked to matches

**Authentication Flow:**
- JWT tokens generated in auth routes
- `middlewares/auth.js` verifies Bearer tokens for protected routes
- Socket.io uses custom `authenticate` event with token verification (`sockets/chatHandler.js:11-20`)

**Real-time Chat Architecture:**
- Socket.io server initialized in `server.js:17-22`
- Chat logic in `sockets/chatHandler.js`:
  - Clients must authenticate first with JWT token
  - Join match-specific rooms with `join-match` event
  - Messages broadcast to room participants only
  - Access control validates user is part of match before joining room or sending messages

### Frontend Architecture (jejumatch/client/src/)

**Routing Structure (`App.jsx`):**
- Public routes: `/login`, `/register`
- Protected routes: `/` (Discovery), `/my-profile`, `/matches`, `/chat/:matchId`
- All protected routes wrapped in `<ProtectedRoute>` component

**State Management:**
- `AuthContext` provides global auth state (user, token, login/logout functions)
- Token stored in localStorage
- API client (`services/api.js`) automatically attaches token to requests via interceptor

**API Client Pattern (`services/api.js`):**
- Centralized axios instance with base URL from `REACT_APP_API_URL`
- Request interceptor adds Bearer token from localStorage
- Response interceptor handles 401 errors (redirects to login)
- Organized API functions by domain (authAPI, profileAPI, usersAPI, etc.)

**Page Components:**
- `DiscoveryPage` - Browse users with filtering/sorting
- `MatchesPage` - View all matches
- `ChatRoomPage` - Real-time chat using Socket.io client
- `ProfileCreationPage` - Profile editing with photo upload

### Data Relationships

**Like System:**
- Likes stored as ObjectId arrays in User model (`likedUsers`, `likedByUsers`)
- Mutual likes trigger Match creation
- No separate Like model/collection

**Match Creation:**
- Created when User A likes User B AND User B already liked User A
- Match document stores both user IDs with unique compound index to prevent duplicates
- All messages reference the match ID, not individual users

**Chat Messages:**
- Each message links to a Match (not directly to users)
- Sender/receiver fields stored for display purposes
- Socket.io rooms named by matchId for message broadcasting

## Environment Variables

### server/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jejumatch
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

### client/.env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## File Upload Handling

- Multer configured for profile photo uploads
- Files stored in `server/uploads/` directory
- Static file serving enabled at `/uploads` endpoint (`app.js:24`)
- Frontend references images via `http://localhost:5000/uploads/filename`

## Common Development Patterns

### Adding a New API Endpoint
1. Define route in `server/src/routes/*.routes.js`
2. Add auth middleware if route should be protected: `router.post('/endpoint', auth, handler)`
3. Implement handler function in the same route file
4. Access authenticated user via `req.userId` (set by auth middleware)
5. Add corresponding API function in `client/src/services/api.js`

### Adding a New Page
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Wrap in `<ProtectedRoute>` if authentication required
4. Access auth context via `useContext(AuthContext)`

### Working with Socket.io
- Server: Extend `server/src/sockets/chatHandler.js` with new event handlers
- Client: Components managing sockets should connect/disconnect in useEffect hooks
- Always authenticate socket connections before allowing other events
- Use room-based broadcasting for match-specific events

## Known Patterns

- No separate service layer - business logic in route handlers
- Password hashing handled by Mongoose pre-save hook in User model
- API responses follow pattern: `res.json({ message, data, user, token })`
- Error handling centralized in `middlewares/errorHandler.js`
- CORS enabled for CLIENT_URL in server configuration
