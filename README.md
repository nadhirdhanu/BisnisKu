Here's how to run your BisnisKu application on your local computer:

Prerequisites
Make sure you have these installed on your computer:

Node.js (version 18 or higher)
npm (comes with Node.js)
Step-by-Step Setup:
1. Download and Extract
```
# After downloading bisnisKu-source.tar.gz
tar -xzf bisnisKu-source.tar.gz
cd bisnisKu-source
```
2. Install Dependencies
npm install
3. Set Up Environment Variables
Create a .env file in the project root:

# Required for AI recommendations
OPENAI_API_KEY=your_openai_api_key_here
# Required for database (you have options below)
DATABASE_URL=your_database_url_here
4. Database Options
Option A: Use Neon Database (Recommended)

Sign up at neon.tech
Create a new database
Copy the connection string to DATABASE_URL
Option B: Use Local PostgreSQL

# Install PostgreSQL locally, then:
DATABASE_URL=postgresql://username:password@localhost:5432/bisnisKu
Option C: Use In-Memory Storage (No database needed)

Comment out the database import in server/storage.ts
Change export const storage = new DatabaseStorage(); to export const storage = new MemStorage();
5. Initialize Database (if using PostgreSQL)
npm run db:push
npx tsx scripts/init-db.ts
6. Start the Application
npm run dev
7. Open in Browser
Visit: http://localhost:5000

What You'll See:
Dashboard with business metrics
Sample data (Toko Budi Makmur)
Transaction management
Inventory tracking
AI-powered recommendations
Development Commands:
npm run dev - Start development server
npm run build - Build for production
npm run start - Run production build
npm run db:push - Update database schema
The application will run exactly like it does here on Replit, with all the Indonesian business management features intact!

# BisnisKu
✓ Added PostgreSQL database support to BisnisKu
✓ Created database schema with proper relations
✓ Migrated from in-memory storage to persistent database
✓ Implemented DatabaseStorage class with full CRUD operations
✓ Database initialized with sample Indonesian business data
✓ All transactions, inventory, and AI recommendations now persist

BisnisKu app now has a persistent PostgreSQL database! All your business data will be saved between sessions. The app includes sample data to help you get started:

Sample user: Budi Santoso from "Toko Budi Makmur"
Inventory items like rice, cooking oil, and sugar
Sample transactions and AI recommendations
Is everything working correctly with the new database? You can now add transactions and inventory items that will persist even after restarting the application.
