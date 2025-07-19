import express from 'express';
import serverless from 'serverless-http';

// Import storage directly for Netlify functions
import { DatabaseStorage, MemStorage } from '../../server/storage.js';

const app = express();

// Initialize storage
const storage = new DatabaseStorage();

// Use JSON parsing middleware
app.use(express.json());

// Add CORS headers for Netlify deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const transactions = await storage.getTransactions(1, 5);
    const inventoryItems = await storage.getInventoryItems(1);
    
    // Calculate totals
    const totalSales = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense' || t.type === 'purchase')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    res.json({
      user: {
        name: user.name,
        businessName: user.businessName,
      },
      totalSales,
      totalExpenses,
      totalProfit: totalSales - totalExpenses,
      totalProducts: inventoryItems.length,
      recentTransactions: transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transactions endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await storage.getTransactions(1);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = await storage.createTransaction({
      ...req.body,
      userId: 1,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inventory endpoints
app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await storage.getInventoryItems(1);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/inventory/low-stock', async (req, res) => {
  try {
    const lowStock = await storage.getLowStockItems(1);
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const item = await storage.createInventoryItem({
      ...req.body,
      userId: 1,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Recommendations endpoint
app.get('/api/ai-recommendations', async (req, res) => {
  try {
    const recommendations = await storage.getAIRecommendations(1);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the serverless function
export const handler = serverless(app);