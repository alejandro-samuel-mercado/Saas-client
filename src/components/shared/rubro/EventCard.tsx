"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types";
import { Heart, Maximize2, ShoppingCart, Leaf, HandHeart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface EventCardProps {
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

export const EventCard = memo(function EventCard({ product }: EventCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const { addItem } = useCartStore();
    const { user } = useAuth();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract decor/event attributes
    const material = getCharValue(product, "material", "materiales");
    const style = getCharValue(product, "estilo", "diseño");
    const handmadeRaw = getCharValue(product, "hecho a mano", "artesanal");
    const isHandmade = handmadeRaw?.toLowerCase() === "sí" || handmadeRaw?.toLowerCase() === "si" || handmadeRaw?.toLowerCase() === "true";

    const isAvailable = (product as any).skus?.some((s: any) => Number(s.stock) > 0) ?? true;
    const hasDiscount = product.basePrice > price;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAvailable) return;
        
        const skuToUse = (product as any).skus?.find((s: any) => Number(s.stock) > 0) || (product as any).skus?.[0];
        const priceToUse = typeof skuToUse?.price === "number" ? skuToUse.price : parseFloat(skuToUse?.price || "0");

        addItem(
            {
                skuId: skuToUse?.id?.toString() || `${product?.id}-unknown`,
                productId: product?.id || 0,
                productName: product?.name || "Producto",
                productImage: product?.images?.[0] || "/placeholder.jpg",
                price: priceToUse || product?.price || product?.basePrice || 0,
                qty: 1,
                currencyCode: product?.currencyCode,
                attributes:
                    skuToUse?.variantOptions?.reduce(
                        (acc: any, opt: any) => ({ ...acc, [opt.name]: opt.value }),
                        {},
                    ) || {},
                allowFractional: product?.allowFractional ?? false,
                measurementUnit: product?.measurementUnit ?? "UNIDAD",
            },
            user !== null
        );
        toast.success("Agregado a tu espacio ✨");
    };

    return (
        <div className="group h-full">
            <Link
                href={`/products/${product.id}`}
                className={`block h-full relative bg-[#faf9f6] rounded-[2px] p-3 pb-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:rotate-1 transition-all duration-500 ease-out border border-[#e8e4db] ${!isAvailable ? "opacity-60" : ""}`}
            >
                {/* ── IMAGE SECTION (Polaroid Style) ── */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0eee4] mb-4">
                    <Image
                        src={product.images?.[0] || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />

                    {/* Handmade overlay */}
                    {isHandmade && (
                        <div className="absolute top-2 right-2 bg-[#d7c4a8]/90 text-white backdrop-blur-sm px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
                            <HandHeart className="h-3 w-3" />
                            <span className="text-[9px] uppercase tracking-widest font-medium">Artesanal</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    {!isAvailable && (
                        <div className="absolute top-2 left-2 bg-[#9c7a70]/90 text-white px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm">
                            Agotado
                        </div>
                    )}
                    {hasDiscount && isAvailable && (
                        <div className="absolute top-2 left-2 bg-[#8da399]/90 text-white px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm">
                            Sale
                        </div>
                    )}

                    {/* Favorite Button */}
                    <button
                        className={`absolute bottom-2 right-2 p-2 rounded-full transition-all duration-300 z-10 ${isFav ? "bg-[#d7c4a8] text-white" : "bg-white/50 text-[#8c857b] hover:bg-white hover:text-[#d7c4a8]"}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                    >
                        <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="px-1 flex flex-col justify-between flex-1">
                    <div>
                        {/* Style / Tag */}
                        <div className="flex items-center gap-2 mb-2">
                            {style && (
                                <span className="text-[10px] text-[#8da399] uppercase tracking-[0.2em] font-medium">
                                    {style}
                                </span>
                            )}
                            {style && material && <span className="text-[#d7c4a8]">•</span>}
                            {material && (
                                <span className="text-[10px] text-[#8c857b] uppercase tracking-[0.2em] font-medium">
                                    {material}
                                </span>
                            )}
                        </div>

                        {/* Name - handwritten/elegant serif vibe */}
                        <h3 className="text-lg text-[#4a453e] mb-1 group-hover:text-[#9c7a70] transition-colors line-clamp-2 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                            {product.name}
                        </h3>
                    </div>

                    {/* ── PRICE & ACTION ── */}
                    <div className="flex items-end justify-between mt-4">
                        <div>
                            {hasDiscount && (
                                <p className="text-[11px] text-[#8c857b] line-through mb-1">
                                    {formatPrice(product.basePrice, currencyCode)}
                                </p>
                            )}
                            <p className="text-base text-[#4a453e]">
                                {formatPrice(Number(price), currencyCode)}
                            </p>
                        </div>
                        
                        <Button 
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            variant="ghost"
                            className={`h-9 w-9 p-0 rounded-full transition-all ${isAvailable ? "bg-[#f0eee4] text-[#8c857b] hover:bg-[#d7c4a8] hover:text-white" : "bg-gray-100 text-gray-300"}`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
});
