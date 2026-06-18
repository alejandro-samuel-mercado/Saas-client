"use client";

import { Benefits } from "@/components/features/home/Benefits";
import CartAnimation from "@/components/features/home/CartAnimation";
import { Categories } from "@/components/features/home/Categories";
import { HeroRouter } from "@/components/features/home/HeroRouter";
import { Marquee } from "@/components/features/home/Marquee";
import { NewProducts } from "@/components/features/home/NewProducts";
import { SecondaryAds } from "@/components/features/home/SecondaryAds";
import { Testimonials } from "@/components/features/home/Testimonials";
import { TrendingProducts } from "@/components/features/home/TrendingProducts";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import dynamic from "next/dynamic";
import { RealEstateHome } from "@/components/features/home/rubro/RealEstateHome";
import { PerfumeHome } from "@/components/features/home/rubro/PerfumeHome";
import { WatchHome } from "@/components/features/home/rubro/WatchHome";
import { BarberHome } from "@/components/features/home/rubro/BarberHome";
import { PetHome } from "@/components/features/home/rubro/PetHome";
import { DecorHome } from "@/components/features/home/rubro/decor/DecorHome";
import { GeneralHome } from "@/components/features/home/rubro/general/GeneralHome";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";

const InstitutionalVideo = dynamic(
    () => import("@/components/features/home/InstitutionalVideo").then((mod) => mod.InstitutionalVideo),
    { ssr: false }
);

export default function HomePage() {
    const rubroConfig = useRubroConfig();
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    if (config?.rubro?.slug === "inmuebles") {
        return <RealEstateHome />;
    }

    if (config?.rubro?.slug === "perfumes") {
        return <PerfumeHome />;
    }

    if (config?.rubro?.slug === "relojes") {
        return <WatchHome />;
    }

    if (config?.rubro?.slug === "barberias") {
        return <BarberHome />;
    }

    if (config?.rubro?.slug === "mascotas") {
        return <PetHome />;
    }

    if (config?.rubro?.slug === "decoracion") {
        return <DecorHome />;
    }

    if (config?.rubro?.slug === "general") {
        return <GeneralHome />;
    }

    return (
        <main className="min-h-screen relative  md:px-10">
            <HeroRouter />

            <Marquee />

            <Benefits />
            <InstitutionalVideo />
            {rubroConfig.showCartAnimation && <CartAnimation />}
            <TrendingProducts />
            <NewProducts />
            <SecondaryAds />
            <Categories />
            {rubroConfig.showCartAnimation && <CartAnimation invert={true} />}
            <Testimonials />
        </main>
    );
}
