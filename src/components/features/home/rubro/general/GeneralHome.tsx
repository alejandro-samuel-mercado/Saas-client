"use client";

import { Benefits } from "@/components/features/home/Benefits";
import CartAnimation from "@/components/features/home/CartAnimation";
import { Categories } from "@/components/features/home/Categories";
import { Marquee } from "@/components/features/home/Marquee";
import { NewProducts } from "@/components/features/home/NewProducts";
import { SecondaryAds } from "@/components/features/home/SecondaryAds";
import { Testimonials } from "@/components/features/home/Testimonials";
import { TrendingProducts } from "@/components/features/home/TrendingProducts";
import { GeneralHero } from "./GeneralHero";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import dynamic from "next/dynamic";

const InstitutionalVideo = dynamic(
    () => import("@/components/features/home/InstitutionalVideo").then((mod) => mod.InstitutionalVideo),
    { ssr: false }
);

export function GeneralHome() {
    const rubroConfig = useRubroConfig();

    return (
        <main className="min-h-screen relative md:px-10 overflow-x-hidden">
            <GeneralHero />
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
