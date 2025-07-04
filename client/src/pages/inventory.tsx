import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { formatIDR } from "@/lib/currency";
import { formatDateOnly } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import InventoryForm from "@/components/forms/inventory-form";

interface InventoryItem {
  id: number;
  name: string;
  category?: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  pricePerUnit?: string;
  supplier?: string;
  lastRestocked?: string;
}

const Inventory = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: lowStockItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory/low-stock"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Produk berhasil dihapus",
        description: "Data produk telah dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Gagal menghapus produk",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    },
  });

  const getStockStatus = (current: number, min: number) => {
    const ratio = current / min;
    if (ratio === 0) return { label: "Habis", variant: "destructive" };
    if (ratio <= 0.5) return { label: "Kritis", variant: "destructive" };
    if (ratio <= 1) return { label: "Rendah", variant: "secondary" };
    return { label: "Normal", variant: "default" };
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => {
    const price = parseFloat(item.pricePerUnit || '0');
    return sum + (price * item.currentStock);
  }, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventori</h1>
        <p className="text-gray-600">Kelola stok dan produk bisnis Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-primary bg-blue-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nilai Inventori</p>
                <p className="text-2xl font-bold text-success">{formatIDR(totalValue)}</p>
              </div>
              <Package className="h-8 w-8 text-success bg-green-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stok Rendah</p>
                <p className="text-2xl font-bold text-error">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-error bg-red-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Peringatan Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Sisa: {item.currentStock} {item.unit} / Min: {item.minStockLevel} {item.unit}
                  </p>
                  <Badge variant="destructive" className="mt-2">
                    {getStockStatus(item.currentStock, item.minStockLevel).label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Daftar Produk</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Tidak ada produk yang ditemukan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item.currentStock, item.minStockLevel);
                  const itemValue = (parseFloat(item.pricePerUnit || '0') * item.currentStock);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.supplier && (
                            <div className="text-sm text-gray-500">{item.supplier}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.currentStock} {item.unit}</div>
                          <div className="text-sm text-gray-500">Min: {item.minStockLevel} {item.unit}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.pricePerUnit ? formatIDR(parseFloat(item.pricePerUnit)) : '-'}
                      </TableCell>
                      <TableCell>
                        {item.pricePerUnit ? formatIDR(itemValue) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant as any}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InventoryForm 
        open={showForm}
        onOpenChange={setShowForm}
      />
    </main>
  );
};

export default Inventory;
