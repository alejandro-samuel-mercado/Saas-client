"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { BedDouble, Bath, Maximize, Heart, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface RealEstateCardProps {
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

export const RealEstateCard = memo(function RealEstateCard({ product }: RealEstateCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    const squareMeters = getCharValue(product, "m2", "metros cuadrados", "superficie", "metros");
    const rooms = getCharValue(product, "habitaciones", "ambientes", "dormitorios", "cuartos");
    const bathrooms = getCharValue(product, "baños", "banos", "toilettes");
    
    const operationType = (product as any).saleMode || "Venta";

    return (
        <div className="group bg-white border border-[#1a1a1a]/20 hover:border-[#1a1a1a] overflow-hidden shadow-none transition-all duration-500 flex flex-col h-full">
            {/* ── IMAGE SECTION ── */}
            <Link href={`/products/detail?slug=${(product as any).slug || product.id}`} className="relative h-64 w-full overflow-hidden block">
                <Image
                    src={product.images?.[0] || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-[#f5ab1c] text-black hover:bg-[#d99516] font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-sm border-none">
                        {operationType}
                    </Badge>
                </div>

                {/* Favorite Button */}
                <button
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 backdrop-blur-md ${isFav ? "bg-red-50 text-red-500" : "bg-black/30 text-white hover:bg-[#f5ab1c] hover:text-black"}`}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                </button>

                {/* Bottom dark band for quick stats (Giromini style) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-end justify-between translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-4 text-white">
                        {squareMeters && (
                            <div className="flex items-center gap-1.5" title="Superficie">
                                <Maximize className="h-4 w-4 text-[#f5ab1c]" />
                                <span className="text-xs font-bold">{squareMeters} m²</span>
                            </div>
                        )}
                        {rooms && (
                            <div className="flex items-center gap-1.5" title="Habitaciones">
                                <BedDouble className="h-4 w-4 text-[#f5ab1c]" />
                                <span className="text-xs font-bold">{rooms} Dorm.</span>
                            </div>
                        )}
                        {bathrooms && (
                            <div className="flex items-center gap-1.5" title="Baños">
                                <Bath className="h-4 w-4 text-[#f5ab1c]" />
                                <span className="text-xs font-bold">{bathrooms} Baños</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* ── DETAILS SECTION ── */}
            <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                        {product.brand && product.brand !== "-" ? product.brand : "Ubicación Premium"}
                    </div>
                    <Link href={`/products/detail?slug=${(product as any).slug || product.id}`}>
                        <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight group-hover:text-[#7c5a43] transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-light">
                        {(product as any).description || "Excelente oportunidad de inversión."}
                    </p>
                </div>

                {/* ── PRICE & ACTION ── */}
                <div className="pt-4 border-t border-[#1a1a1a]/10 mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Precio</p>
                        <p className="text-2xl font-black text-[#1a1a1a]">
                            {formatPrice(Number(price), currencyCode)}
                        </p>
                    </div>
                    
                    <Link 
                        href={`/products/detail?slug=${(product as any).slug || product.id}`}
                        className="flex items-center justify-center w-10 h-10 bg-[#f4f4f4] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-white rounded-none transition-colors"
                    >
                        <ArrowUpRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
});
