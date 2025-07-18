import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { users, transactions, inventoryItems, aiRecommendations } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

async function main() {
  try {
    console.log("Initializing database...");
    
    // Check if user already exists
    const existingUser = await db.select().from(users).limit(1);
    if (existingUser.length > 0) {
      console.log("Database already has users, skipping initialization");
      return;
    }

    // Create default user
    const [user] = await db.insert(users).values({
      username: "admin",
      password: "admin123",
      name: "Budi Santoso",
      businessName: "Toko Budi Makmur",
    }).returning();

    console.log("Created user:", user.name);

    // Create sample inventory items
    const inventoryData = [
      {
        userId: user.id,
        name: "Beras Premium",
        category: "Makanan Pokok",
        currentStock: 50,
        minStockLevel: 10,
        unit: "kg",
        pricePerUnit: "15000",
        supplier: "CV Beras Jaya",
      },
      {
        userId: user.id,
        name: "Minyak Goreng",
        category: "Makanan Pokok",
        currentStock: 25,
        minStockLevel: 5,
        unit: "liter",
        pricePerUnit: "18000",
        supplier: "PT Minyak Sejahtera",
      },
      {
        userId: user.id,
        name: "Gula Pasir",
        category: "Makanan Pokok",
        currentStock: 8,
        minStockLevel: 10,
        unit: "kg",
        pricePerUnit: "12000",
        supplier: "Toko Gula Manis",
      },
    ];

    for (const item of inventoryData) {
      await db.insert(inventoryItems).values(item);
    }

    console.log("Created inventory items");

    // Create sample transactions
    const transactionData = [
      {
        userId: user.id,
        type: "sale",
        amount: "45000",
        description: "Penjualan Beras 3kg",
        category: "Makanan Pokok",
        quantity: 3,
      },
      {
        userId: user.id,
        type: "purchase",
        amount: "750000",
        description: "Pembelian Stok Beras 50kg",
        category: "Makanan Pokok",
        quantity: 50,
      },
    ];

    for (const transaction of transactionData) {
      await db.insert(transactions).values(transaction);
    }

    console.log("Created transactions");

    // Create sample AI recommendation
    await db.insert(aiRecommendations).values({
      userId: user.id,
      type: "restock",
      title: "Stok Gula Pasir Menipis",
      description: "Stok gula pasir Anda sudah di bawah level minimum. Segera lakukan pemesanan untuk menghindari kehabisan stok.",
      priority: "high",
      actionable: true,
      metadata: {
        item: "Gula Pasir",
        currentStock: 8,
        minStock: 10,
        recommendedOrder: 25
      },
      isRead: false,
    });

    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();