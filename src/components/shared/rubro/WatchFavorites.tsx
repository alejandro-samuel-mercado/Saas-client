"use client";

import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { formatPrice } from "@/lib/utils";
import { Watch, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function WatchFavorites() {
    const { favorites, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();

    return (
        <main className="min-h-screen bg-[#0a0d11] text-[#c0cfe0] font-sans pb-32 pt-24">
            {/* Header */}
            <div className="border-b border-[#8a9ab5]/10 bg-[#080b0f]">
                <div className="container mx-auto px-6 lg:px-12 py-12">
                    <div className="flex items-center gap-3 mb-3">
                        <Heart className="h-4 w-4 text-[#8a9ab5]" />
                        <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-[#8a9ab5]">Mis Favoritos</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif text-[#c0cfe0]">Colección Personal</h1>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 py-12">
                {favorites.length === 0 ? (
                    <div className="text-center py-32 border border-[#8a9ab5]/10 bg-[#080b0f]">
                        <div className="w-16 h-16 mx-auto border border-[#8a9ab5]/20 flex items-center justify-center mb-6">
                            <Watch className="h-7 w-7 text-[#8a9ab5]/30" />
                        </div>
                        <p className="text-[#8a9ab5]/40 font-mono text-sm tracking-widest uppercase mb-6">Sin favoritos aún</p>
                        <Link href="/products"
                            className="inline-flex items-center gap-3 border border-[#8a9ab5]/20 text-[#8a9ab5] px-8 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#8a9ab5]/10 hover:border-[#8a9ab5]/50 transition-colors">
                            Explorar Colección
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-[#8a9ab5]/30 text-[10px] font-mono tracking-[0.4em] uppercase mb-8">
                            {favorites.length} {favorites.length === 1 ? "pieza" : "piezas"} guardadas
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((product: any) => {
                                const price = product.discountedPrice || product.basePrice || 0;
                                const currencyCode = product.currencyCode || currency;
                                return (
                                    <div key={product.id} className="group border border-[#8a9ab5]/10 hover:border-[#8a9ab5]/30 transition-colors bg-[#080b0f] relative">
                                        <Link href={`/products/${product.id}`}>
                                            <div className="relative aspect-square overflow-hidden bg-[#0a0d11]">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} fill
                                                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Watch className="h-12 w-12 text-[#8a9ab5]/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 border-t border-[#8a9ab5]/10">
                                                <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#8a9ab5]/40 mb-1">{product.brand || "Relojería"}</p>
                                                <h3 className="text-sm font-serif text-[#c0cfe0] mb-3 line-clamp-2">{product.name}</h3>
                                                <p className="text-lg font-mono font-bold text-[#c0cfe0]">{formatPrice(Number(price), currencyCode)}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => toggleFavorite(product.id)}
                                            className="absolute top-3 right-3 w-8 h-8 border border-[#8a9ab5]/15 bg-[#0a0d11]/80 flex items-center justify-center text-red-400 hover:border-red-400/30 transition-colors">
                                            <Heart className="h-3.5 w-3.5 fill-current" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
