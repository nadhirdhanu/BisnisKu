import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { Link } from "wouter";

interface InventoryItem {
  id: number;
  name: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
}

const InventoryAlerts = () => {
  const { data: lowStockItems = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  const getStockStatus = (current: number, min: number) => {
    const ratio = current / min;
    if (ratio === 0) return { label: "Habis", color: "destructive" };
    if (ratio <= 0.5) return { label: "Kritis", color: "destructive" };
    if (ratio <= 1) return { label: "Rendah", color: "warning" };
    return { label: "Normal", color: "success" };
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Peringatan Inventori
          </CardTitle>
          {lowStockItems.length > 0 && (
            <Badge variant="destructive" className="bg-red-50 text-red-700">
              {lowStockItems.length} peringatan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg animate-pulse">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded mr-3" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
                <div className="w-12 h-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : lowStockItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm">Semua stok dalam kondisi baik</p>
            <p className="text-xs text-gray-400 mt-1">
              Tidak ada peringatan stok saat ini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => {
              const status = getStockStatus(item.currentStock, item.minStockLevel);
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    status.color === 'destructive' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-3 ${
                      status.color === 'destructive' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Sisa {item.currentStock} {item.unit}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={status.color === 'destructive' ? 'destructive' : 'secondary'}
                    className={status.color === 'destructive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {status.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
        
        <Link href="/inventory">
          <Button className="w-full mt-4 bg-primary hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            Kelola Inventori
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
