import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, ArrowRight } from "lucide-react";
import { formatIDR } from "@/lib/currency";
import { getRelativeTime } from "@/lib/utils";
import { Link } from "wouter";
import TransactionForm from "@/components/forms/transaction-form";
import { useState } from "react";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  date: string;
  quantity?: number;
}

const RecentTransactions = () => {
  const [showForm, setShowForm] = useState(false);
  
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", { limit: 10 }],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ArrowUp className="h-5 w-5 text-success" />;
      case 'purchase':
      case 'expense':
        return <ArrowDown className="h-5 w-5 text-error" />;
      default:
        return <ArrowUp className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-success';
      case 'purchase':
      case 'expense':
        return 'text-error';
      default:
        return 'text-gray-600';
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

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Transaksi Terbaru
            </CardTitle>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada transaksi. Tambahkan transaksi pertama Anda!
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${
                      transaction.type === 'sale' ? 'bg-green-50' : 'bg-red-50'
                    } rounded-lg flex items-center justify-center`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getTransactionLabel(transaction.type)} - {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getRelativeTime(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'sale' ? '+' : '-'}{formatIDR(parseFloat(transaction.amount))}
                    </p>
                    {transaction.quantity && (
                      <p className="text-sm text-gray-600">
                        {transaction.quantity} unit
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/transactions">
              <Button variant="ghost" className="text-primary hover:text-blue-700">
                Lihat Semua Transaksi
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <TransactionForm 
        open={showForm}
        onOpenChange={setShowForm}
      />
    </>
  );
};

export default RecentTransactions;
