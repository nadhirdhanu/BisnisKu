import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarDays, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const PeriodSelector = ({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) => {
  const periods = [
    { id: "today", label: "Hari Ini", icon: Calendar },
    { id: "week", label: "Minggu Ini", icon: CalendarDays },
    { id: "month", label: "Bulan Ini", icon: TrendingUp },
    { id: "year", label: "Tahun Ini", icon: TrendingUp },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              onClick={() => onPeriodChange(period.id)}
              className={cn(
                "flex items-center space-x-2",
                selectedPeriod === period.id && "bg-primary text-white"
              )}
            >
              <period.icon className="h-4 w-4" />
              <span>{period.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodSelector;
