"use client";

import { formatPrice } from "@/lib/utils";
import { configService } from "@/services/config";
import { useCurrencyStore } from "@/store/currency";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import { useQuery } from "@tanstack/react-query";
import {
  Truck, ShieldCheck, RefreshCw, Headphones,
  Sparkles, User, CreditCard, Heart, Scissors,
  Calculator,
} from "lucide-react";

const iconMap: Record<string, any> = {
  truck: Truck,
  "shield-check": ShieldCheck,
  "refresh-cw": RefreshCw,
  headphones: Headphones,
  sparkles: Sparkles,
  user: User,
  "credit-card": CreditCard,
  calculator: Calculator,
  heart: Heart,
  scissors: Scissors,
  shirt: ShieldCheck,
  "party-popper": Sparkles,
};

export function Benefits() {
  const { currency } = useCurrencyStore();
  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
    staleTime: 1000 * 60 * 60,
  });
  const rubroConfig = useRubroConfig();

  const benefits = rubroConfig.benefitItems.map((b) => ({
    ...b,
    description: b.description.replace(
      "{0}",
      formatPrice(config?.freeShippingThreshold || 0, currency),
    ),
  }));

  return (
    <section className="py-16 relative z-10 ">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="group relative bg-card/40 backdrop-blur-xl rounded-3xl p-6 soft-shadow border-2 border-gray-300 dark:border-zinc-700 cursor-pointer overflow-hidden
                  hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/50
                  transition-all duration-300 ease-out"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center
                    group-hover:bg-primary/20 group-hover:scale-110 group-hover:-rotate-3
                    transition-all duration-300"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-0 bg-primary rounded-full
                  group-hover:w-2/3 transition-all duration-400 ease-out"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
