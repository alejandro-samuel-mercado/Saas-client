"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { Heart, Maximize2, Activity, ShieldCheck, Watch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface WatchCardProps {
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

export const WatchCard = memo(function WatchCard({ product }: WatchCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract watch-specific attributes
    const movement = getCharValue(product, "movimiento", "mecanismo");
    const material = getCharValue(product, "material caja", "material", "caja");
    const condition = getCharValue(product, "estado", "condición", "condicion") || product.condition;
    const warranty = getCharValue(product, "garantía", "garantia");

    const isAvailable = (product as any).skus?.some((s: any) => Number(s.stock) > 0) ?? true;

    return (
        <div className="group h-full">
            <Link
                href={`/products/detail?slug=${(product as any).slug || product.id}`}
                className={`block h-full relative bg-gradient-to-br from-[#ffffff] to-[#f8f9fa] dark:from-[#1e2329] dark:to-[#161a1e] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-900/30 dark:hover:border-blue-400/30 ${!isAvailable ? "opacity-60" : ""}`}
            >
                {/* ── IMAGE SECTION ── */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0d1115] p-6 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={product.images?.[0] || "/images/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {condition && condition !== "NEW" && (
                            <Badge className="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-[10px] uppercase tracking-wider border-none rounded-sm">
                                {condition === "USED" ? "Usado" : condition}
                            </Badge>
                        )}
                        {!isAvailable && (
                            <Badge className="bg-red-600 text-white text-[10px] uppercase tracking-wider rounded-sm">
                                Agotado
                            </Badge>
                        )}
                    </div>

                    {/* Warranty Badge */}
                    {warranty && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[#0f172a] dark:text-[#cbd5e1] text-[10px] font-semibold bg-white/80 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm">
                            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            {warranty}
                        </div>
                    )}

                    {/* Favorite Button */}
                    <button
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${isFav ? "bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400" : "bg-white/60 text-gray-400 dark:bg-black/40 dark:text-white/50 hover:bg-white hover:text-gray-900 dark:hover:bg-black/60 dark:hover:text-white"}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                    >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    
                    {/* Image count */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-sm backdrop-blur-md flex items-center gap-1 shadow-sm border border-gray-200 dark:border-white/10">
                            <Maximize2 className="h-3 w-3" />
                            {product.images.length}
                        </div>
                    )}
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="p-4 flex flex-col justify-between flex-1 border-t border-gray-100 dark:border-white/5">
                    <div>
                        {/* Brand */}
                        <p className="text-xs text-[#0f172a] dark:text-[#94a3b8] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                            <Watch className="h-3 w-3" />
                            {product.brand || (product as any).category?.name || "Relojería"}
                        </p>

                        {/* Name / Model */}
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        {product.model && product.model !== "-" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1 font-mono bg-gray-100 dark:bg-[#0d1115] inline-block px-1.5 py-0.5 rounded-sm">
                                REF: {product.model}
                            </p>
                        )}
                        
                        {/* Technical Specs */}
                        <div className="flex flex-wrap gap-2 mb-3 mt-2">
                            {movement && (
                                <span className="text-[10px] flex items-center gap-1 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-sm border border-gray-200 dark:border-white/10">
                                    <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    {movement}
                                </span>
                            )}
                            {material && (
                                <span className="text-[10px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-sm border border-gray-200 dark:border-white/10 truncate max-w-[100px]">
                                    {material}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── PRICE ── */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 mt-auto flex justify-between items-end">
                        <div>
                            {product.basePrice > price && (
                                <p className="text-[10px] text-gray-400 line-through mb-0.5 font-mono">
                                    {formatPrice(product.basePrice, currencyCode)}
                                </p>
                            )}
                            <p className="text-lg font-bold text-[#0f172a] dark:text-white font-mono tracking-tight">
                                {formatPrice(Number(price), currencyCode)}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0" asChild>
                            <span>+</span>
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
});
