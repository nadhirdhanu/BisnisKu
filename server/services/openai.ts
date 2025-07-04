import OpenAI from "openai";
import type { Transaction, InventoryItem } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

export interface AIRecommendationResponse {
  recommendations: {
    type: "restock" | "sales_opportunity" | "optimization";
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    actionable: boolean;
    metadata?: any;
  }[];
}

export async function generateBusinessRecommendations(
  transactions: Transaction[],
  inventoryItems: InventoryItem[],
  businessContext: {
    businessName?: string;
    businessType?: string;
  }
): Promise<AIRecommendationResponse> {
  try {
    const prompt = `
You are an AI business advisor specializing in Indonesian small businesses. Analyze the following business data and provide actionable recommendations.

Business Context:
- Business Name: ${businessContext.businessName || "Small Business"}
- Business Type: ${businessContext.businessType || "General Retail"}
- Location: Indonesia
- Currency: Indonesian Rupiah (IDR)

Recent Transactions (last 30 days):
${transactions.slice(0, 20).map(t => `
- Type: ${t.type}
- Amount: IDR ${t.amount}
- Description: ${t.description}
- Date: ${t.date}
- Quantity: ${t.quantity || 'N/A'}
`).join('\n')}

Current Inventory:
${inventoryItems.map(item => `
- Name: ${item.name}
- Category: ${item.category || 'Uncategorized'}
- Current Stock: ${item.currentStock} ${item.unit}
- Min Stock Level: ${item.minStockLevel} ${item.unit}
- Price per Unit: IDR ${item.pricePerUnit || 'N/A'}
- Supplier: ${item.supplier || 'N/A'}
`).join('\n')}

Please provide specific, actionable recommendations for this Indonesian small business. Focus on:
1. Inventory restocking needs (critical and urgent items)
2. Sales opportunities based on transaction patterns
3. Business optimization suggestions
4. Cost-saving measures
5. Market trends specific to Indonesian market

Consider Indonesian business practices, local market conditions, and seasonal patterns. Provide recommendations in this JSON format:

{
  "recommendations": [
    {
      "type": "restock|sales_opportunity|optimization",
      "title": "Brief recommendation title",
      "description": "Detailed explanation with specific actions",
      "priority": "low|medium|high|critical",
      "actionable": true|false,
      "metadata": {
        "estimatedCost": "IDR amount if applicable",
        "timeframe": "when to implement",
        "expectedBenefit": "expected outcome"
      }
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert business advisor for Indonesian small businesses. Provide practical, actionable advice tailored to the Indonesian market. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result;
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Return fallback recommendations
    return {
      recommendations: [
        {
          type: "optimization",
          title: "Tinjau Kembali Strategi Inventori",
          description: "Sistem AI sedang dalam pemeliharaan. Silakan tinjau kembali level stok minimum dan pola penjualan Anda secara manual.",
          priority: "medium",
          actionable: true,
          metadata: {
            timeframe: "Minggu ini",
            expectedBenefit: "Optimalisasi modal kerja"
          }
        }
      ]
    };
  }
}
