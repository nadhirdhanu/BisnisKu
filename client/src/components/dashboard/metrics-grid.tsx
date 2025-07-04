import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Package, Receipt, DollarSign } from "lucide-react";

interface MetricsGridProps {
  data?: {
    todaySalesFormatted: string;
    totalProducts: number;
    lowStockCount: number;
    monthlyTransactionCount: number;
    monthlyRevenueFormatted: string;
  };
}

const MetricsGrid = ({ data }: MetricsGridProps) => {
  const metrics = [
    {
      title: "Penjualan Hari Ini",
      value: data?.todaySalesFormatted || "Rp 0",
      change: "+12% dari kemarin",
      icon: TrendingUp,
      color: "success",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Produk",
      value: data?.totalProducts?.toString() || "0",
      change: `${data?.lowStockCount || 0} stok menipis`,
      icon: Package,
      color: "primary",
      bgColor: "bg-blue-50",
    },
    {
      title: "Transaksi Bulan Ini",
      value: data?.monthlyTransactionCount?.toString() || "0",
      change: "+8% dari bulan lalu",
      icon: Receipt,
      color: "accent",
      bgColor: "bg-orange-50",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: data?.monthlyRevenueFormatted || "Rp 0",
      change: "+15% dari bulan lalu",
      icon: DollarSign,
      color: "success",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-success">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  {metric.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGrid;
