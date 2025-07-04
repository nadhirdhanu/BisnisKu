import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PeriodSelector from "@/components/reports/period-selector";
import FinancialSummary from "@/components/reports/financial-summary";
import SalesChart from "@/components/reports/sales-chart";
import InventoryReport from "@/components/reports/inventory-report";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  date: string;
  category?: string;
}

interface InventoryItem {
  id: number;
  name: string;
  category?: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  pricePerUnit?: string;
}

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const isLoading = transactionsLoading || inventoryLoading;

  // Process financial data
  const processFinancialData = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case "today":
        filterDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const currentTransactions = transactions.filter(t => 
      new Date(t.date) >= filterDate
    );

    const totalRevenue = currentTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = currentTransactions
      .filter(t => t.type === 'purchase' || t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Previous period for comparison
    const previousFilterDate = new Date(filterDate);
    const periodDiff = now.getTime() - filterDate.getTime();
    previousFilterDate.setTime(previousFilterDate.getTime() - periodDiff);

    const previousTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= previousFilterDate && date < filterDate;
    });

    const previousRevenue = previousTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const previousExpenses = previousTransactions
      .filter(t => t.type === 'purchase' || t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      previousRevenue,
      previousExpenses,
    };
  };

  // Process sales chart data
  const processSalesData = () => {
    const now = new Date();
    const data = [];

    if (selectedPeriod === "month") {
      // Group by weeks
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekTransactions = transactions.filter(t => {
          const date = new Date(t.date);
          return date >= weekStart && date <= weekEnd;
        });

        const sales = weekTransactions
          .filter(t => t.type === 'sale')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const purchases = weekTransactions
          .filter(t => t.type === 'purchase')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expenses = weekTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        data.unshift({
          period: (i + 1).toString(),
          sales,
          purchases,
          expenses,
        });
      }
    } else {
      // Default grouping for other periods
      const sales = transactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const purchases = transactions
        .filter(t => t.type === 'purchase')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      data.push({
        period: "Total",
        sales,
        purchases,
        expenses,
      });
    }

    return data;
  };

  // Process category data
  const processCategoryData = () => {
    const salesByCategory = transactions
      .filter(t => t.type === 'sale')
      .reduce((acc, t) => {
        const category = t.category || 'Lainnya';
        acc[category] = (acc[category] || 0) + parseFloat(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    return Object.entries(salesByCategory).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  // Process inventory data
  const processInventoryData = () => {
    const processedItems = inventory.map(item => {
      const stockPercentage = item.minStockLevel > 0 
        ? (item.currentStock / item.minStockLevel) * 100 
        : 100;

      let stockStatus: 'normal' | 'low' | 'critical' | 'out' = 'normal';
      if (item.currentStock === 0) stockStatus = 'out';
      else if (stockPercentage <= 25) stockStatus = 'critical';
      else if (stockPercentage <= 50) stockStatus = 'low';

      const pricePerUnit = parseFloat(item.pricePerUnit || '0');
      const totalValue = pricePerUnit * item.currentStock;

      return {
        ...item,
        category: item.category || 'Lainnya',
        stockStatus,
        stockPercentage: Math.min(stockPercentage, 100),
        totalValue,
      };
    });

    const totalValue = processedItems.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockCount = processedItems.filter(item => item.stockStatus === 'low').length;
    const criticalStockCount = processedItems.filter(item => item.stockStatus === 'critical').length;

    return {
      items: processedItems,
      totalValue,
      lowStockCount,
      criticalStockCount,
    };
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const financialData = processFinancialData();
  const salesData = processSalesData();
  const categoryData = processCategoryData();
  const inventoryData = processInventoryData();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Laporan Bisnis</h1>
        <p className="text-gray-600">Analisis kinerja dan ringkasan bisnis Anda</p>
      </div>

      <PeriodSelector 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <div className="space-y-8">
        <FinancialSummary 
          data={financialData}
          period={selectedPeriod}
        />

        <SalesChart 
          salesData={salesData}
          categoryData={categoryData}
          period={selectedPeriod}
        />

        <InventoryReport 
          items={inventoryData.items}
          totalValue={inventoryData.totalValue}
          lowStockCount={inventoryData.lowStockCount}
          criticalStockCount={inventoryData.criticalStockCount}
        />
      </div>
    </main>
  );
};

export default Reports;
