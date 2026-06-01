"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/products";
import { useFavoritesStore } from "@/store/favorites";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function PerfumeFavorites() {
    const { favorites } = useFavoritesStore();

    const { data: products, isLoading } = useQuery({
        queryKey: ["favorites", favorites],
        queryFn: async () => {
            if (favorites.length === 0) return [];

            const productPromises = favorites.map((id) =>
                productService.getProduct(id).catch(() => null),
            );
            const results = await Promise.all(productPromises);
            return results.filter((p) => p !== null);
        },
        enabled: favorites.length > 0,
    });

    useEffect(() => {
        if (!isLoading && products) {
            const validIds = products.map((p) => p?.id);

            if (validIds.length < favorites.length) {
                // Some favorites are no longer available
            }
        }
    }, [isLoading, products, favorites]);

    return (
        <main className="min-h-screen bg-[#171310] text-[#f9f1d8] font-sans pt-32 pb-40">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16 border-b border-[#d4af37]/20 pb-8 text-center md:text-left">
                    <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Colección Personal</span>
                    <h1 className="text-4xl md:text-5xl font-serif flex items-center justify-center md:justify-start gap-4 text-[#f9f1d8]">
                        <Heart className="h-8 w-8 text-[#d4af37] fill-[#d4af37]" />
                        Sus Favoritos
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : favorites.length === 0 || (products && products.length === 0) ? (
                    <div className="text-center py-32 bg-[#1e1a14] border border-[#d4af37]/10">
                        <Heart className="h-16 w-16 mx-auto mb-8 text-[#d4af37]/30" />
                        <h2 className="text-2xl font-serif mb-4 text-[#f9f1d8]">
                            Su colección está vacía
                        </h2>
                        <p className="text-white/40 mb-10 font-light max-w-md mx-auto">
                            Descubra nuestra exclusiva selección de fragancias y guarde sus obras maestras olfativas favoritas aquí.
                        </p>
                        <Button asChild className="bg-[#d4af37] hover:bg-white text-[#171310] font-bold tracking-widest uppercase text-[10px] rounded-none h-12 px-8">
                            <Link href="/products">Explorar Catálogo</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products?.map(
                            (product, idx) =>
                                product && (
                                    <ProductCardRouter key={product.id || idx} product={product} />
                                ),
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
