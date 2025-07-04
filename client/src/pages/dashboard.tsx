import { useQuery } from "@tanstack/react-query";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AIRecommendations from "@/components/dashboard/ai-recommendations";
import InventoryAlerts from "@/components/dashboard/inventory-alerts";
import QuickActions from "@/components/dashboard/quick-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  user: {
    name: string;
    businessName: string;
    firstName: string;
  };
  todaySales: number;
  todaySalesFormatted: string;
  totalProducts: number;
  lowStockCount: number;
  monthlyTransactionCount: number;
  monthlyRevenue: number;
  monthlyRevenueFormatted: string;
  unreadRecommendations: number;
}

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selamat Datang, {dashboardData?.user.firstName}!
        </h2>
        <p className="text-gray-600">Berikut adalah ringkasan bisnis Anda hari ini</p>
      </div>

      <MetricsGrid data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="space-y-6">
          <AIRecommendations />
          <InventoryAlerts />
        </div>
      </div>

      <QuickActions />
    </main>
  );
};

export default Dashboard;
