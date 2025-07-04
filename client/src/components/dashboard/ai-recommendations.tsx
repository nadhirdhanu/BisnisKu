import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendation {
  id: number;
  type: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

const AIRecommendations = () => {
  const { toast } = useToast();
  
  const { data: recommendations = [], isLoading } = useQuery<AIRecommendation[]>({
    queryKey: ["/api/ai-recommendations"],
  });

  const generateMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/ai-recommendations/generate"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Rekomendasi diperbarui",
        description: "Rekomendasi AI terbaru berhasil dibuat",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui rekomendasi",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    },
  });

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'restock':
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'sales_opportunity':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'optimization':
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <Bot className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'restock':
        return 'bg-blue-50 border-blue-200';
      case 'sales_opportunity':
        return 'bg-green-50 border-green-200';
      case 'optimization':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const latestRecommendations = recommendations.slice(0, 3);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-accent" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Rekomendasi AI
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mt-1" />
              </div>
            ))}
          </div>
        ) : latestRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm">Belum ada rekomendasi AI</p>
            <p className="text-xs text-gray-400 mt-1">
              Klik tombol di bawah untuk menghasilkan rekomendasi
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`border rounded-lg p-4 ${getRecommendationColor(recommendation.type)}`}
              >
                <div className="flex items-start">
                  {getRecommendationIcon(recommendation.type)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {recommendation.title}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="w-full mt-4 bg-accent hover:bg-orange-600"
        >
          {generateMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Perbarui Rekomendasi
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
