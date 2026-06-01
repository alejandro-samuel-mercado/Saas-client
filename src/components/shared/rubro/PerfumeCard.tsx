"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { Heart, Maximize2, Droplets, Sparkles, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface PerfumeCardProps {
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

export const PerfumeCard = memo(function PerfumeCard({ product }: PerfumeCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract perfume-specific attributes
    const concentration = getCharValue(product, "concentración", "concentracion", "tipo", "intensidad");
    const volume = getCharValue(product, "volumen", "ml", "tamaño", "tamano", "cantidad");
    const gender = getCharValue(product, "género", "genero", "para");
    const status = getCharValue(product, "estado", "tipo de fragancia", "original/alternativo");

    // "Original" or "Alternativo" badge
    const isOriginal = status?.toLowerCase().includes("original");

    const isAvailable = (product as any).skus?.some((s: any) => Number(s.stock) > 0) ?? true;

    return (
        <div className="group h-full">
            <Link
                href={`/products/detail?slug=${(product as any).slug || product.id}`}
                className={`block h-full relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl border border-white/10 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] ${!isAvailable ? "opacity-60" : ""}`}
            >
                {/* ── IMAGE SECTION ── */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/50">
                    <Image
                        src={product.images?.[0] || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />

                    {/* Luxurious Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {concentration && (
                            <Badge className="bg-white/10 text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-md px-2.5 py-0.5 font-serif tracking-widest text-[10px] uppercase">
                                {concentration}
                            </Badge>
                        )}
                        {status && (
                            <Badge className={`backdrop-blur-md px-2 py-0.5 text-[9px] uppercase tracking-wider border ${isOriginal ? "bg-[#d4af37]/20 text-[#f9f1d8] border-[#d4af37]/40" : "bg-white/10 text-white/70 border-white/20"}`}>
                                {status}
                            </Badge>
                        )}
                        {!isAvailable && (
                            <Badge className="bg-red-900/80 text-white text-[10px] uppercase tracking-wider backdrop-blur-md border border-red-500/30">
                                Agotado
                            </Badge>
                        )}
                    </div>

                    {/* Volume Badge (Bottom Right of Image) */}
                    {volume && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[#d4af37] text-xs font-semibold bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/5">
                            <Droplets className="h-3 w-3" />
                            {volume}
                        </div>
                    )}

                    {/* Favorite Button */}
                    <button
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${isFav ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-black/40 text-white/70 border border-white/10 hover:bg-black/60 hover:text-white"}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                    >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            {/* Brand / Line */}
                            <p className="text-[10px] text-[#d4af37]/80 font-serif tracking-[0.2em] uppercase line-clamp-1">
                                {product.brand || (product as any).category?.name || "Fragancia"}
                            </p>
                            {/* Gender */}
                            {gender && (
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                                    {gender}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-serif text-[#f9f1d8] mb-1 group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug">
                            {product.name}
                        </h3>

                        {/* Aromatic notes placeholder or sub-line if available */}
                        {product.model && product.model !== "-" && (
                            <p className="text-xs text-white/50 font-light mb-4 line-clamp-1 italic">
                                {product.model}
                            </p>
                        )}
                    </div>

                    {/* ── PRICE & ACTION ── */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/10 mt-2">
                        <div>
                            {product.basePrice > price && (
                                <p className="text-[10px] text-white/40 line-through mb-0.5">
                                    {formatPrice(product.basePrice, currencyCode)}
                                </p>
                            )}
                            <p className="text-xl font-serif text-[#d4af37] tracking-wide">
                                {formatPrice(Number(price), currencyCode)}
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37] group-hover:text-black text-white transition-all duration-300">
                            <Wind className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
});
