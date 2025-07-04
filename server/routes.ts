import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTransactionSchema, 
  insertInventoryItemSchema,
  type Transaction,
  type InventoryItem 
} from "@shared/schema";
import { generateBusinessRecommendations } from "./services/openai";
import { formatIDR } from "./utils/currency";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const [
        todayTransactions,
        monthlyTransactions,
        inventoryItems,
        lowStockItems,
        aiRecommendations
      ] = await Promise.all([
        storage.getTransactionsByDateRange(userId, startOfDay, endOfDay),
        storage.getTransactionsByDateRange(userId, startOfMonth, endOfMonth),
        storage.getInventoryItems(userId),
        storage.getLowStockItems(userId),
        storage.getAIRecommendations(userId)
      ]);

      const todaySales = todayTransactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const monthlyRevenue = monthlyTransactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const metrics = {
        user: {
          name: user.name,
          businessName: user.businessName,
          firstName: user.name.split(' ')[0]
        },
        todaySales,
        todaySalesFormatted: formatIDR(todaySales),
        totalProducts: inventoryItems.length,
        lowStockCount: lowStockItems.length,
        monthlyTransactionCount: monthlyTransactions.length,
        monthlyRevenue,
        monthlyRevenueFormatted: formatIDR(monthlyRevenue),
        unreadRecommendations: aiRecommendations.filter(r => !r.isRead).length
      };

      res.json(metrics);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId,
        amount: req.body.amount.toString() // Ensure amount is stored as string for decimal precision
      });

      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = { ...req.body };
      
      if (updateData.amount) {
        updateData.amount = updateData.amount.toString();
      }

      const transaction = await storage.updateTransaction(id, updateData);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Update transaction error:", error);
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTransaction(id);
      if (!success) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const items = await storage.getInventoryItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Get inventory error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const items = await storage.getLowStockItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Get low stock items error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const validatedData = insertInventoryItemSchema.parse({
        ...req.body,
        userId,
        pricePerUnit: req.body.pricePerUnit ? req.body.pricePerUnit.toString() : null
      });

      const item = await storage.createInventoryItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Create inventory item error:", error);
      res.status(400).json({ error: "Invalid inventory item data" });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = { ...req.body };
      
      if (updateData.pricePerUnit) {
        updateData.pricePerUnit = updateData.pricePerUnit.toString();
      }

      const item = await storage.updateInventoryItem(id, updateData);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Update inventory item error:", error);
      res.status(400).json({ error: "Invalid inventory item data" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInventoryItem(id);
      if (!success) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete inventory item error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Recommendations
  app.get("/api/ai-recommendations", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const recommendations = await storage.getAIRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Get AI recommendations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-recommendations/generate", async (req, res) => {
    try {
      const userId = 1; // Default user for MVP
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const [transactions, inventoryItems] = await Promise.all([
        storage.getTransactions(userId, 50), // Last 50 transactions
        storage.getInventoryItems(userId)
      ]);

      const aiResponse = await generateBusinessRecommendations(
        transactions,
        inventoryItems,
        {
          businessName: user.businessName || undefined,
          businessType: "Indonesian Small Business"
        }
      );

      // Save recommendations to storage
      const savedRecommendations = await Promise.all(
        aiResponse.recommendations.map(rec => 
          storage.createAIRecommendation({
            userId,
            type: rec.type,
            title: rec.title,
            description: rec.description,
            priority: rec.priority,
            actionable: rec.actionable,
            metadata: rec.metadata || null,
            isRead: false
          })
        )
      );

      res.json({ recommendations: savedRecommendations });
    } catch (error) {
      console.error("Generate AI recommendations error:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.put("/api/ai-recommendations/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markRecommendationAsRead(id);
      if (!success) {
        return res.status(404).json({ error: "Recommendation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Mark recommendation as read error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
