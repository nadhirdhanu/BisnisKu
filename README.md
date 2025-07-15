# BisnisKu - Indonesian Small Business Management System

## Overview

BisnisKu is a comprehensive business management application designed specifically for Indonesian small businesses. The system provides tools for inventory management, transaction tracking, financial reporting, and AI-powered business recommendations. Built with modern web technologies, it offers both desktop and mobile-responsive interfaces with Indonesian language support.

### Here's how to run your BisnisKu application on your local computer:

## Prerequisites
Make sure you have these installed on your computer:

- Node.js (version 18 or higher)
- npm (comes with Node.js)
### Step-by-Step Setup:
1. Download and Extract
'
# After downloading bisnisKu-source.tar.gz
tar -xzf bisnisKu-source.tar.gz
cd bisnisKu-source
'
2. Install Dependencies
'npm install'
3. Set Up Environment Variables
Create a .env file in the project root:
'
# Required for AI recommendations
OPENAI_API_KEY=your_openai_api_key_here
# Required for database (you have options below)
DATABASE_URL=your_database_url_here
'
4. Database Options
Option A: Use Neon Database (Recommended)

Sign up at neon.tech
Create a new database
Copy the connection string to DATABASE_URL
Option B: Use Local PostgreSQL
'
# Install PostgreSQL locally, then:
DATABASE_URL=postgresql://username:password@localhost:5432/bisnisKu
'
Option C: Use In-Memory Storage (No database needed)

Comment out the database import in ==server/storage.ts==
Change ==export const storage = new DatabaseStorage(); to export const storage = new MemStorage();==
5. Initialize Database (if using PostgreSQL)
'npm run db:push
npx tsx scripts/init-db.ts'
6. Start the Application
'npm run dev'
7. Open in Browser
Visit: ==http://localhost:5000==

What You'll See:
- Dashboard with business metrics
- Sample data (Toko Budi Makmur)
- Transaction management
- Inventory tracking
- AI-powered recommendations
Development Commands:
'npm run dev - Start development server
npm run build - Build for production
npm run start - Run production build
npm run db:push - Update database schema
'
## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessible, customizable components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store
- **Data Storage**: DatabaseStorage class with full CRUD operations

### Full-Stack Integration
- **Monorepo Structure**: Shared TypeScript schemas between client and server
- **Development**: Vite development server with Express API proxy
- **Production**: Static file serving with Express backend

## Key Components

### Database Schema
- **Users**: User accounts with business information
- **Transactions**: Financial transactions (sales, purchases, expenses)
- **Inventory Items**: Product catalog with stock management
- **AI Recommendations**: Business insights and suggestions

### API Endpoints
- `/api/dashboard` - Business metrics and overview
- `/api/transactions` - CRUD operations for transactions
- `/api/inventory` - Inventory management and stock tracking
- `/api/ai-recommendations` - AI-powered business insights

### Frontend Pages
- **Dashboard**: Overview with key metrics and quick actions
- **Transactions**: Transaction history and management
- **Inventory**: Product catalog and stock monitoring
- **Reports**: Financial analysis and reporting

## Data Flow

1. **User Interaction**: Users interact with React components
2. **API Communication**: TanStack Query handles API calls and caching
3. **Server Processing**: Express routes process requests and interact with database
4. **Database Operations**: Drizzle ORM manages PostgreSQL operations
5. **AI Integration**: OpenAI API provides business recommendations
6. **Response Handling**: Data flows back through the stack with proper error handling

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL)
- **ORM**: Drizzle ORM for type-safe database operations
- **AI Service**: OpenAI API for business recommendations
- **UI Framework**: Radix UI for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form with Zod validation

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Fast development and build tooling
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reloading
- **Database**: Neon Database with connection pooling
- **Environment Variables**: Managed through `.env` files
- **API Integration**: Development server proxies API requests

### Production Deployment
- **Build Process**: Vite builds optimized static assets
- **Server Bundle**: esbuild creates optimized server bundle
- **Static Serving**: Express serves built React application
- **Database**: Production PostgreSQL through Neon Database
- **Environment**: Production environment variables for API keys

### Performance Optimizations
- **Code Splitting**: Vite handles automatic code splitting
- **Asset Optimization**: Optimized images and static assets
- **Caching**: TanStack Query provides intelligent caching
- **Database**: Connection pooling and query optimization

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Migrated from in-memory storage to PostgreSQL database
  - Added Drizzle ORM with database relations
  - Created DatabaseStorage class replacing MemStorage
  - Implemented database initialization with sample data
  - All data now persists across server restarts
