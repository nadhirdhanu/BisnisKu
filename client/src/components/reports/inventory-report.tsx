import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { formatIDR } from "@/lib/currency";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  pricePerUnit: string;
  totalValue: number;
  stockStatus: 'normal' | 'low' | 'critical' | 'out';
  stockPercentage: number;
}

interface InventoryReportProps {
  items: InventoryItem[];
  totalValue: number;
  lowStockCount: number;
  criticalStockCount: number;
}

const InventoryReport = ({ items, totalValue, lowStockCount, criticalStockCount }: InventoryReportProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'destructive';
      case 'low':
        return 'secondary';
      case 'normal':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Kritis';
      case 'low':
        return 'Rendah';
      case 'normal':
        return 'Normal';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Nilai Inventori</p>
                <p className="text-2xl font-bold text-gray-900">{formatIDR(totalValue)}</p>
              </div>
              <Package className="h-8 w-8 text-primary bg-blue-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stok Rendah</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600 bg-yellow-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stok Kritis</p>
                <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600 bg-red-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Detail Inventori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.stockStatus)}
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.currentStock} / {item.minStockLevel} {item.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatIDR(item.totalValue)}
                    </p>
                  </div>
                  
                  <div className="w-24">
                    <Progress 
                      value={item.stockPercentage} 
                      className="h-2"
                    />
                  </div>
                  
                  <Badge variant={getStatusColor(item.stockStatus) as any}>
                    {getStatusLabel(item.stockStatus)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReport;
