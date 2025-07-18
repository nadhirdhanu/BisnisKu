import { db } from "./db";
import { users, transactions, inventoryItems, aiRecommendations } from "@shared/schema";

export async function initializeDatabase() {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).limit(1);
    if (existingUser.length > 0) {
      console.log("Database already initialized");
      return;
    }

    // Create default user
    const [user] = await db.insert(users).values({
      username: "admin",
      password: "admin123",
      name: "Budi Santoso",
      businessName: "Toko Budi Makmur",
    }).returning();

    // Create sample inventory items
    const sampleInventory = [
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
      {
        userId: user.id,
        name: "Kopi Bubuk",
        category: "Minuman",
        currentStock: 15,
        minStockLevel: 5,
        unit: "pack",
        pricePerUnit: "25000",
        supplier: "Kopi Nusantara",
      },
      {
        userId: user.id,
        name: "Sabun Mandi",
        category: "Kebersihan",
        currentStock: 30,
        minStockLevel: 8,
        unit: "pcs",
        pricePerUnit: "8000",
        supplier: "Distributor Kebersihan",
      },
    ];

    for (const item of sampleInventory) {
      await db.insert(inventoryItems).values(item);
    }

    // Create sample transactions
    const sampleTransactions = [
      {
        userId: user.id,
        type: "sale",
        amount: "45000",
        description: "Penjualan Beras 3kg",
        category: "Makanan Pokok",
        quantity: 3,
        date: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        userId: user.id,
        type: "sale",
        amount: "36000",
        description: "Penjualan Minyak Goreng 2L",
        category: "Makanan Pokok",
        quantity: 2,
        date: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        userId: user.id,
        type: "purchase",
        amount: "750000",
        description: "Pembelian Stok Beras 50kg",
        category: "Makanan Pokok",
        quantity: 50,
        date: new Date(Date.now() - 259200000), // 3 days ago
      },
      {
        userId: user.id,
        type: "expense",
        amount: "50000",
        description: "Biaya Listrik Bulan Ini",
        category: "Operasional",
        date: new Date(Date.now() - 345600000), // 4 days ago
      },
      {
        userId: user.id,
        type: "sale",
        amount: "50000",
        description: "Penjualan Kopi Bubuk 2 pack",
        category: "Minuman",
        quantity: 2,
        date: new Date(Date.now() - 432000000), // 5 days ago
      },
    ];

    for (const transaction of sampleTransactions) {
      await db.insert(transactions).values(transaction);
    }

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

    console.log("Database initialized successfully with sample data");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}