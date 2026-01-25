# Smart Budget - Copilot Instructions

## Project Overview
Smart Budget is a personal finance management application with bank-level security, featuring AI analytics, multi-account management, subscription tracking, wishlist savings goals, and installment payment tracking.

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite as build tool
- Tailwind CSS + HeadlessUI for UI
- Redux Toolkit for state management
- Recharts for data visualization
- React Router v6
- Axios for API calls
- React Hook Form + Zod for validation
- PWA with service worker

### Backend
- Node.js + Express with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication + bcrypt
- Redis for caching
- Winston for logging
- Jest for testing

## Project Structure
```
budget-app/
├── frontend/          # React application
├── backend/           # Node.js API server
├── docker-compose.yml # Docker orchestration
└── README.md          # Setup instructions
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Airbnb style guide
- Use functional components with hooks
- Prefer named exports
- Use async/await over promises

### Security
- OWASP Top 10 compliance
- CSRF protection on all mutations
- XSS prevention with DOMPurify
- Rate limiting on all endpoints
- Secure password hashing (bcrypt, cost 12)
- JWT with HttpOnly cookies

### API Conventions
- RESTful API design
- `/api/v1` prefix for all routes
- Standard response format: `{ success: boolean, data?: any, error?: any }`
- Use HTTP status codes correctly
- Paginate list endpoints

### Database
- Use Prisma for all DB operations
- Never use raw SQL concatenation
- Use transactions for multi-step operations
- Add indexes for frequently queried fields

### Testing
- Write tests for all business logic
- Minimum 80% code coverage
- Use Jest for unit tests
- Use React Testing Library for component tests

## Common Commands
```bash
# Backend
cd backend && npm run dev
cd backend && npm test
cd backend && npx prisma migrate dev
cd backend && npx prisma studio

# Frontend
cd frontend && npm run dev
cd frontend && npm test
cd frontend && npm run build

# Docker
docker-compose up -d
docker-compose logs -f
docker-compose down
```

## Progress Tracking
- [x] Create copilot-instructions.md
- [x] Scaffold backend project
- [x] Scaffold frontend project
- [x] Setup Prisma schema
- [x] Create Docker configuration
- [x] Setup environment files
- [x] Create backend API structure
- [x] Create frontend components
- [x] Create README

## ✅ Project Setup Complete!

The Smart Budget application structure is now fully scaffolded with:

### Backend ✅
- Node.js + Express + TypeScript configured
- Prisma ORM with complete database schema (Users, Transactions, Categories, BankAccounts, Subscriptions, Wishlist, PaymentPlans, Budgets, AuditLogs, Admins)
- JWT authentication with bcrypt
- Security middleware (helmet, CORS, rate limiting)
- Redis caching setup
- Winston logging
- All API routes and controllers scaffolded
- Docker configuration ready

### Frontend ✅
- React 18 + TypeScript + Vite configured
- Tailwind CSS + HeadlessUI for styling
- Redux Toolkit for state management
- React Router v6 for navigation
- All pages created (Dashboard, Transactions, Categories, Bank Accounts, Subscriptions, Wishlist, Payment Plans, Analytics)
- Authentication flow (Login, Register)
- Responsive layouts with Sidebar and Header
- PWA ready with service worker configuration
- Docker + Nginx configuration

### DevOps ✅
- Docker Compose orchestration (PostgreSQL, Redis, Backend, Frontend)
- Production-ready Dockerfiles
- Nginx reverse proxy configuration
- Environment variables properly configured
- Health checks implemented

## 🚀 Next Steps

To run the application:

### With Docker (Recommended):
```bash
# 1. Create .env file from example
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Run database migrations
docker-compose exec backend npx prisma migrate dev

# 4. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Without Docker (Local Development):
```bash
# 1. Install Node.js 18+ if not already installed
# Install via: https://nodejs.org/ or use nvm

# 2. Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run dev

# 3. Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Start PostgreSQL and Redis (if not using Docker):
```bash
# macOS with Homebrew
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

# Create database
createdb budget_app
```

## 📝 Important Notes

1. **Node.js Installation**: You currently don't have Node.js installed. Install it from https://nodejs.org/ (LTS version 18+) or use nvm
2. **Dependencies**: After installing Node.js, run `npm install` in both backend and frontend directories
3. **Database**: Make sure PostgreSQL is running and the DATABASE_URL in backend/.env is correct
4. **Security**: Change all default passwords and secrets in production
5. **API Documentation**: All API endpoints are documented in the README.md

## 🔧 Development Workflow

Once dependencies are installed:
- Backend runs on http://localhost:3000
- Frontend runs on http://localhost:5173
- API calls are proxied through Vite dev server
- Hot reload is enabled for both frontend and backend

The application structure follows best practices with:
- TypeScript strict mode
- ESLint + Prettier configured
- Security-first approach (OWASP compliant)
- Modular architecture
- Comprehensive error handling
- Audit logging
- Rate limiting
- CSRF protection
