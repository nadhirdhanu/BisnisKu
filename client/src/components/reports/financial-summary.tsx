import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { formatIDR } from "@/lib/currency";

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  previousRevenue: number;
  previousExpenses: number;
}

interface FinancialSummaryProps {
  data: FinancialData;
  period: string;
}

const FinancialSummary = ({ data, period }: FinancialSummaryProps) => {
  const revenueGrowth = data.previousRevenue > 0 
    ? ((data.totalRevenue - data.previousRevenue) / data.previousRevenue) * 100 
    : 0;

  const expenseGrowth = data.previousExpenses > 0 
    ? ((data.totalExpenses - data.previousExpenses) / data.previousExpenses) * 100 
    : 0;

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "today": return "Hari Ini";
      case "week": return "Minggu Ini";
      case "month": return "Bulan Ini";
      case "year": return "Tahun Ini";
      default: return "Periode Ini";
    }
  };

  const metrics = [
    {
      title: "Total Pendapatan",
      value: formatIDR(data.totalRevenue),
      change: revenueGrowth,
      icon: TrendingUp,
      color: "success",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Pengeluaran",
      value: formatIDR(data.totalExpenses),
      change: expenseGrowth,
      icon: CreditCard,
      color: "error",
      bgColor: "bg-red-50",
    },
    {
      title: "Keuntungan Bersih",
      value: formatIDR(data.netProfit),
      change: null,
      icon: DollarSign,
      color: data.netProfit >= 0 ? "success" : "error",
      bgColor: data.netProfit >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Margin Keuntungan",
      value: `${data.profitMargin.toFixed(1)}%`,
      change: null,
      icon: TrendingUp,
      color: data.profitMargin >= 20 ? "success" : data.profitMargin >= 10 ? "warning" : "error",
      bgColor: data.profitMargin >= 20 ? "bg-green-50" : data.profitMargin >= 10 ? "bg-yellow-50" : "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Ringkasan Keuangan - {getPeriodLabel(period)}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  {metric.change !== null && (
                    <p className={`text-sm flex items-center ${
                      metric.change >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {metric.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(metric.change).toFixed(1)}% dari periode sebelumnya
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialSummary;
