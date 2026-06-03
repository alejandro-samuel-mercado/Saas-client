"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { Heart, Maximize2, Zap, Settings, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface BarberCardProps {
    product: Product;
}

function getCharValue(product: Product, ...keys: string[]): string | null {
    const chars = (product as any).characteristics;
    if (!Array.isArray(chars)) return null;
    for (const key of keys) {
        const found = chars.find((c: any) => c.key?.toLowerCase() === key.toLowerCase());
        if (found?.value) return found.value;
    }
    return null;
}

export const BarberCard = memo(function BarberCard({ product }: BarberCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract barber-specific attributes
    const isService = (product as any).type?.toLowerCase() === "servicio";
    const usage = getCharValue(product, "uso", "categoría");
    const voltage = getCharValue(product, "voltaje/potencia", "voltaje");
    const content = getCharValue(product, "contenido (ml/gr)", "contenido");

    const isAvailable = (product as any).skus?.some((s: any) => Number(s.stock) > 0) ?? true;

    return (
        <div className="group h-full">
            <Link
                href={`/products/detail?slug=${(product as any).slug || product.id}`}
                className={`block h-full relative bg-stone-800 rounded-sm border border-stone-700 hover:border-[#e65c00] overflow-hidden transition-all duration-300 ${!isAvailable ? "opacity-60" : ""}`}
            >
                {/* ── IMAGE SECTION ── */}
                <div className="relative aspect-square w-full overflow-hidden bg-stone-900 p-4 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={product.images?.[0] || "/images/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Orange overlay effect */}
                        <div className="absolute inset-0 bg-[#e65c00]/0 group-hover:bg-[#e65c00]/10 transition-colors duration-500 pointer-events-none" />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {!isAvailable && (
                            <Badge className="bg-red-600 text-stone-100 text-[10px] uppercase tracking-wider rounded-sm font-bold shadow-sm">
                                Agotado
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        className={`absolute top-3 right-3 p-2 rounded-sm transition-all duration-300 z-10 ${isFav ? "bg-[#e65c00] text-stone-100" : "bg-stone-900/40 text-stone-400 hover:bg-[#e65c00] hover:text-stone-100"}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                    >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    
                    {/* Image count */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-stone-900/60 text-stone-300 text-xs px-2 py-1 rounded-sm flex items-center gap-1 border border-stone-600/50 backdrop-blur-sm">
                            <Maximize2 className="h-3 w-3" />
                            {product.images.length}
                        </div>
                    )}
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="p-5 flex flex-col justify-between flex-1 border-t border-stone-700 group-hover:border-[#e65c00]/50 transition-colors">
                    <div>
                        {/* Brand */}
                        <p className="text-[10px] text-[#e65c00] font-bold tracking-[0.2em] uppercase mb-2">
                            {product.brand && product.brand !== "-" ? product.brand : ((product as any).category?.name || "Barbería")}
                        </p>

                        {/* Name / Model */}
                        <h3 className="text-lg font-black text-stone-100 uppercase tracking-tight mb-2 group-hover:text-[#e65c00] transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        {product.model && product.model !== "-" && (
                            <p className="text-xs text-stone-400 mb-3 line-clamp-1 font-mono bg-stone-900 inline-block px-2 py-1 border border-stone-700 rounded-sm">
                                MOD: {product.model}
                            </p>
                        )}
                        
                        {/* Technical Specs */}
                        <div className="flex flex-wrap gap-2 mb-4 mt-2">
                            {usage && (
                                <span className="text-[10px] flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2 py-1 border border-stone-700 uppercase font-bold tracking-wider rounded-sm">
                                    <Settings className="h-3 w-3 text-[#e65c00]" />
                                    {usage}
                                </span>
                            )}
                            {voltage && (
                                <span className="text-[10px] flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2 py-1 border border-stone-700 uppercase font-bold tracking-wider rounded-sm">
                                    <Zap className="h-3 w-3 text-[#e65c00]" />
                                    {voltage}
                                </span>
                            )}
                            {content && (
                                <span className="text-[10px] flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2 py-1 border border-stone-700 uppercase font-bold tracking-wider rounded-sm">
                                    <Package className="h-3 w-3 text-[#e65c00]" />
                                    {content}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── PRICE ── */}
                    <div className="pt-4 border-t border-stone-700 mt-auto flex justify-between items-end group-hover:border-[#e65c00]/50 transition-colors">
                        <div>
                            {product.basePrice > price && (
                                <p className="text-xs text-stone-500 line-through mb-1">
                                    {formatPrice(product.basePrice, currencyCode)}
                                </p>
                            )}
                            <p className="text-xl font-black text-stone-100 tracking-tight">
                                {formatPrice(Number(price), currencyCode)}
                            </p>
                        </div>
                        <div className="h-10 w-10 bg-transparent border border-stone-700 group-hover:border-[#e65c00] group-hover:bg-[#e65c00] text-[#e65c00] group-hover:text-stone-100 flex items-center justify-center transition-all cursor-pointer rounded-sm shadow-sm">
                            <span className="text-xl font-light leading-none">+</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
});
