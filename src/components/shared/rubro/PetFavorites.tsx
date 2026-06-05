"use client";

import { useFavoritesStore } from "@/store/favorites";
import { productService } from "@/services/products";
import { PawPrint, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";

export function PetFavorites() {
    const { favorites } = useFavoritesStore();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (favorites.length === 0) { setIsLoading(false); return; }
        const promises = favorites.slice(0, 24).map((id: number) =>
            productService.getProduct(id).catch(() => null)
        );
        Promise.all(promises).then((results) => {
            setProducts(results.filter(Boolean));
            setIsLoading(false);
        });
    }, [favorites]);

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24">

            {/* ── HEADER ── */}
            <div className="bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] py-14 mb-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#D4B896]/50 backdrop-blur-xl text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-5">
                        <Heart className="h-3.5 w-3.5" />
                        Mis favoritos
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                        Lo que más te gustó 🐾
                    </h1>
                    <p className="text-white/60 text-sm">
                        {favorites.length > 0 ? `${favorites.length} producto${favorites.length > 1 ? "s" : ""} guardado${favorites.length > 1 ? "s" : ""}` : "Todavía no guardaste nada"}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] aspect-square animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map((product) => (
                            <ProductCardRouter key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] shadow-lg">
                        <div className="h-24 w-24 rounded-full bg-[#EDE0CF] flex items-center justify-center mx-auto mb-6">
                            <PawPrint className="h-12 w-12 text-[#A0714F]" />
                        </div>
                        <h2 className="text-2xl font-black text-[#5C3D2E] mb-3">Todavía no tenés favoritos</h2>
                        <p className="text-[#A0714F] text-sm mb-8 max-w-sm mx-auto">
                            Explorá nuestro catálogo y guardá los productos que te interesen haciendo click en el ♥.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#8B5E3C] text-white font-bold text-sm hover:bg-[#5C3D2E] transition-colors shadow-lg"
                        >
                            Explorar catálogo <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
