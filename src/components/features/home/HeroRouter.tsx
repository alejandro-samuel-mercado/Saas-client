"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { Hero } from "@/components/features/home/Hero";
import { RealEstateHero } from "@/components/features/home/rubro/RealEstateHero";
import { PerfumeHero } from "@/components/features/home/rubro/PerfumeHero";
import { WatchHero } from "@/components/features/home/rubro/WatchHero";
import { BarberHero } from "@/components/features/home/rubro/BarberHero";
import { PetHero } from "@/components/features/home/rubro/PetHero";
import { EventHero } from "@/components/features/home/rubro/EventHero";

/**
 * Routes to the appropriate Hero section based on the tenant's rubro.
 * Falls back to the generic Hero for unknown / default rubros.
 */
export function HeroRouter() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const rubroSlug = config?.rubro?.slug ?? "general";

    switch (rubroSlug) {
        case "inmuebles":
            return <RealEstateHero />;
        case "perfumes":
            return <PerfumeHero />;
        case "relojes":
            return <WatchHero />;
        case "barberias":
            return <BarberHero />;
        case "mascotas":
            return <PetHero />;
        case "decoracion":
            return <EventHero />;
        default:
            return <Hero />;
    }
}
