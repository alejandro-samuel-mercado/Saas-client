"use client";

import { http } from "@/adapters/http";
import { useQuery } from "@tanstack/react-query";

interface PointsData {
  balance: number;
  earned: number;
  used: number;
  expired: number;
  history: Array<{
    id: string;
    type: "EARNED" | "USED" | "EXPIRED";
    amount: number;
    reason: string;
    date: string;
  }>;
}

export function PointsTab() {
  const { data: pointsData, isLoading } = useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      const response = await http<{ success: boolean; data: PointsData }>(
        "/api/users/points",
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
        <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!pointsData) return null;

  return (
    <div className="space-y-6">
     
    </div>
  );
}
