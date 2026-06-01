"use client";

import { getRubroConfig } from "@/hooks/useRubroConfig";
import { configService } from "@/services/config";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/shared/ProductCard";
import { RealEstateCard } from "@/components/shared/rubro/RealEstateCard";
import { PerfumeCard } from "@/components/shared/rubro/PerfumeCard";
import { WatchCard } from "@/components/shared/rubro/WatchCard";
import { BarberCard } from "@/components/shared/rubro/BarberCard";
import { PetCard } from "@/components/shared/rubro/PetCard";
import { EventCard } from "@/components/shared/rubro/EventCard";

interface ProductCardRouterProps {
    product: Product;
}

/**
 * Routes to the appropriate card component based on the current tenant's rubro.
 * Falls back to the generic ProductCard for unknown / default rubros.
 */
export function ProductCardRouter({ product }: ProductCardRouterProps) {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const rubroSlug = config?.rubro?.slug ?? "general";

    switch (rubroSlug) {
        case "inmuebles":
            return <RealEstateCard product={product} />;
        case "perfumes":
            return <PerfumeCard product={product} />;
        case "relojes":
            return <WatchCard product={product} />;
        case "barberias":
            return <BarberCard product={product} />;
        case "mascotas":
            return <PetCard product={product} />;
        case "decoracion":
            return <EventCard product={product} />;
        default:
            return <ProductCard product={product} />;
    }
}
