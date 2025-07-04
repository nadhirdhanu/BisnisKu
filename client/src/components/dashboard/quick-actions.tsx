import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanBarcode, Plus, BarChart3, Download } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import TransactionForm from "@/components/forms/transaction-form";
import InventoryForm from "@/components/forms/inventory-form";

const QuickActions = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const quickActions = [
    {
      icon: ScanBarcode,
      label: "Penjualan Cepat",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      action: () => setShowTransactionForm(true),
    },
    {
      icon: Plus,
      label: "Tambah Produk",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      action: () => setShowInventoryForm(true),
    },
    {
      icon: BarChart3,
      label: "Laporan",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      href: "/reports",
    },
    {
      icon: Download,
      label: "Backup Data",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      action: () => {
        // Implement backup functionality
        alert("Fitur backup akan segera tersedia");
      },
    },
  ];

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const ActionButton = (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={action.action}
                  className="flex flex-col items-center p-4 h-auto bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {action.label}
                  </span>
                </Button>
              );

              return action.href ? (
                <Link key={index} href={action.href}>
                  {ActionButton}
                </Link>
              ) : (
                ActionButton
              );
            })}
          </div>
        </CardContent>
      </Card>

      <TransactionForm 
        open={showTransactionForm}
        onOpenChange={setShowTransactionForm}
        defaultType="sale"
      />
      
      <InventoryForm 
        open={showInventoryForm}
        onOpenChange={setShowInventoryForm}
      />
    </>
  );
};

export default QuickActions;
