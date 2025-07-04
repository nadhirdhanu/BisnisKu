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
import { Plus, Search, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { formatIDR } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TransactionForm from "@/components/forms/transaction-form";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  date: string;
  category?: string;
  quantity?: number;
}

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Transaksi berhasil dihapus",
        description: "Data transaksi telah dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Gagal menghapus transaksi",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    },
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ArrowUp className="h-4 w-4 text-success" />;
      case 'purchase':
      case 'expense':
        return <ArrowDown className="h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'sale':
        return 'Penjualan';
      case 'purchase':
        return 'Pembelian';
      case 'expense':
        return 'Pengeluaran';
      default:
        return 'Transaksi';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'success';
      case 'purchase':
        return 'secondary';
      case 'expense':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaksi</h1>
        <p className="text-gray-600">Kelola semua transaksi bisnis Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Penjualan</p>
                <p className="text-2xl font-bold text-success">{formatIDR(totalSales)}</p>
              </div>
              <ArrowUp className="h-8 w-8 text-success bg-green-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pembelian</p>
                <p className="text-2xl font-bold text-primary">{formatIDR(totalPurchases)}</p>
              </div>
              <ArrowDown className="h-8 w-8 text-primary bg-blue-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-error">{formatIDR(totalExpenses)}</p>
              </div>
              <ArrowDown className="h-8 w-8 text-error bg-red-50 rounded-lg p-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Daftar Transaksi</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Transaksi
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
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Tidak ada transaksi yang ditemukan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.type)}
                        <Badge variant={getTransactionColor(transaction.type) as any}>
                          {getTransactionLabel(transaction.type)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                      {transaction.quantity && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({transaction.quantity} unit)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{transaction.category || '-'}</TableCell>
                    <TableCell className={transaction.type === 'sale' ? 'text-success font-semibold' : 'text-error font-semibold'}>
                      {transaction.type === 'sale' ? '+' : '-'}{formatIDR(parseFloat(transaction.amount))}
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(transaction.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionForm 
        open={showForm}
        onOpenChange={setShowForm}
      />
    </main>
  );
};

export default Transactions;
