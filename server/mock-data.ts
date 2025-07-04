import { storage } from "./storage";

// Initialize the storage with sample Indonesian business data
export async function initializeMockData() {
  const userId = 1;

  // Add sample inventory items
  const inventoryItems = [
    {
      userId,
      name: "Kopi Arabica",
      category: "Minuman",
      currentStock: 25,
      minStockLevel: 10,
      unit: "kg",
      pricePerUnit: "25000",
      supplier: "CV Kopi Nusantara",
    },
    {
      userId,
      name: "Tepung Terigu",
      category: "Bahan Baku",
      currentStock: 2,
      minStockLevel: 5,
      unit: "kg",
      pricePerUnit: "12000",
      supplier: "Toko Bahan Kue",
    },
    {
      userId,
      name: "Gula Pasir",
      category: "Bahan Baku",
      currentStock: 8,
      minStockLevel: 10,
      unit: "kg",
      pricePerUnit: "15000",
      supplier: "Toko Serba Ada",
    },
    {
      userId,
      name: "Susu Cair",
      category: "Bahan Baku",
      currentStock: 15,
      minStockLevel: 20,
      unit: "liter",
      pricePerUnit: "8000",
      supplier: "Distributor Susu",
    },
    {
      userId,
      name: "Pastry Mix",
      category: "Kue",
      currentStock: 50,
      minStockLevel: 15,
      unit: "pcs",
      pricePerUnit: "30000",
      supplier: "Supplier Kue",
    },
    {
      userId,
      name: "Roti Bakar",
      category: "Makanan",
      currentStock: 30,
      minStockLevel: 10,
      unit: "pcs",
      pricePerUnit: "15000",
      supplier: "Pabrik Roti",
    },
  ];

  // Create inventory items
  const createdItems = await Promise.all(
    inventoryItems.map(item => storage.createInventoryItem(item))
  );

  // Add sample transactions for the past 30 days
  const transactions = [
    // Sales transactions
    {
      userId,
      type: "sale" as const,
      amount: "125000",
      description: "Penjualan Kopi Arabica",
      category: "Minuman",
      inventoryItemId: createdItems[0].id,
      quantity: 5,
    },
    {
      userId,
      type: "sale" as const,
      amount: "350000",
      description: "Penjualan Pastry Mix",
      category: "Kue",
      inventoryItemId: createdItems[4].id,
      quantity: 12,
    },
    {
      userId,
      type: "sale" as const,
      amount: "450000",
      description: "Penjualan Roti Bakar",
      category: "Makanan",
      inventoryItemId: createdItems[5].id,
      quantity: 30,
    },
    {
      userId,
      type: "sale" as const,
      amount: "200000",
      description: "Penjualan Kopi Arabica",
      category: "Minuman",
      inventoryItemId: createdItems[0].id,
      quantity: 8,
    },
    {
      userId,
      type: "sale" as const,
      amount: "180000",
      description: "Penjualan Pastry Mix",
      category: "Kue",
      inventoryItemId: createdItems[4].id,
      quantity: 6,
    },
    // Purchase transactions
    {
      userId,
      type: "purchase" as const,
      amount: "850000",
      description: "Pembelian Bahan Baku",
      category: "Bahan Baku",
      inventoryItemId: createdItems[1].id,
      quantity: 50,
    },
    {
      userId,
      type: "purchase" as const,
      amount: "300000",
      description: "Pembelian Gula Pasir",
      category: "Bahan Baku",
      inventoryItemId: createdItems[2].id,
      quantity: 20,
    },
    {
      userId,
      type: "purchase" as const,
      amount: "500000",
      description: "Pembelian Kopi Arabica",
      category: "Minuman",
      inventoryItemId: createdItems[0].id,
      quantity: 20,
    },
    // Expense transactions
    {
      userId,
      type: "expense" as const,
      amount: "150000",
      description: "Listrik dan Air",
      category: "Utilitas",
    },
    {
      userId,
      type: "expense" as const,
      amount: "200000",
      description: "Transport dan Pengiriman",
      category: "Operasional",
    },
    {
      userId,
      type: "expense" as const,
      amount: "100000",
      description: "Alat Tulis dan Kemasan",
      category: "Operasional",
    },
  ];

  // Create transactions
  await Promise.all(
    transactions.map(transaction => storage.createTransaction(transaction))
  );

  // Add some AI recommendations
  const recommendations = [
    {
      userId,
      type: "restock" as const,
      title: "Stok Ulang Tepung Terigu",
      description: "Berdasarkan pola penjualan, Anda perlu menambah stok tepung terigu dalam 3 hari. Stok saat ini sangat rendah.",
      priority: "critical" as const,
      actionable: true,
      metadata: {
        estimatedCost: "IDR 240,000",
        timeframe: "3 hari",
        expectedBenefit: "Menghindari kehabisan stok"
      },
    },
    {
      userId,
      type: "sales_opportunity" as const,
      title: "Peluang Penjualan Pastry Mix",
      description: "Pastry mix memiliki tren penjualan naik 25% bulan ini. Pertimbangkan promosi khusus untuk meningkatkan penjualan.",
      priority: "high" as const,
      actionable: true,
      metadata: {
        expectedBenefit: "Peningkatan penjualan 15-20%",
        timeframe: "2 minggu",
      },
    },
    {
      userId,
      type: "optimization" as const,
      title: "Optimasi Waktu Penjualan",
      description: "Penjualan tertinggi terjadi pada pukul 14:00-16:00. Siapkan stok lebih pada jam tersebut untuk memaksimalkan keuntungan.",
      priority: "medium" as const,
      actionable: true,
      metadata: {
        expectedBenefit: "Optimalisasi penjualan harian",
        timeframe: "Implementasi segera",
      },
    },
  ];

  // Create AI recommendations
  await Promise.all(
    recommendations.map(rec => storage.createAIRecommendation(rec))
  );

  console.log("Mock data initialized successfully");
}

// Call this function when the server starts
initializeMockData().catch(console.error);
