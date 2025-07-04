import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatIDR } from "@/lib/currency";
import { useState } from "react";

const transactionFormSchema = z.object({
  type: z.enum(["sale", "purchase", "expense"]),
  amount: z.number().min(1, "Jumlah harus lebih dari 0"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  category: z.string().optional(),
  inventoryItemId: z.number().optional(),
  quantity: z.number().min(1).optional(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "sale" | "purchase" | "expense";
}

interface InventoryItem {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  pricePerUnit: string;
}

const TransactionForm = ({ open, onOpenChange, defaultType = "sale" }: TransactionFormProps) => {
  const { toast } = useToast();
  const [amountInput, setAmountInput] = useState("");

  const { data: inventoryItems = [] } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    enabled: open,
  });

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      description: "",
      category: "",
      quantity: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TransactionFormData) => 
      apiRequest("POST", "/api/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Transaksi berhasil ditambahkan",
        description: "Data transaksi telah disimpan",
      });
      onOpenChange(false);
      form.reset();
      setAmountInput("");
    },
    onError: () => {
      toast({
        title: "Gagal menambahkan transaksi",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    },
  });

  const selectedInventoryItem = form.watch("inventoryItemId");
  const selectedItem = inventoryItems.find(item => item.id === selectedInventoryItem);

  const handleAmountChange = (value: string) => {
    setAmountInput(value);
    // Remove non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d,]/g, '');
    const amount = parseFloat(numericValue.replace(',', '.')) || 0;
    form.setValue("amount", amount);
  };

  const handleInventoryItemChange = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === parseInt(itemId));
    if (item) {
      form.setValue("inventoryItemId", item.id);
      form.setValue("description", item.name);
      if (item.pricePerUnit) {
        const price = parseFloat(item.pricePerUnit);
        const quantity = form.getValues("quantity") || 1;
        form.setValue("amount", price * quantity);
        setAmountInput(formatIDR(price * quantity));
      }
    }
  };

  const handleQuantityChange = (quantity: number) => {
    form.setValue("quantity", quantity);
    if (selectedItem?.pricePerUnit) {
      const price = parseFloat(selectedItem.pricePerUnit);
      const total = price * quantity;
      form.setValue("amount", total);
      setAmountInput(formatIDR(total));
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sale">Penjualan</SelectItem>
                      <SelectItem value="purchase">Pembelian</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") === "sale" && inventoryItems.length > 0 && (
              <FormField
                control={form.control}
                name="inventoryItemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produk (opsional)</FormLabel>
                    <Select onValueChange={handleInventoryItemChange} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name} - Stok: {item.currentStock} {item.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedItem && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={selectedItem.currentStock}
                        {...field}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 1;
                          field.onChange(quantity);
                          handleQuantityChange(quantity);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Rp 0"
                      value={amountInput}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi transaksi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-primary hover:bg-blue-700"
              >
                {createMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
