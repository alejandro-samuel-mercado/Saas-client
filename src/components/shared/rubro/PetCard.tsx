"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types";
import { Heart, Maximize2, ShoppingCart, Bone, PawPrint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PetCardProps {
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

export const PetCard = memo(function PetCard({ product }: PetCardProps) {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { currency } = useCurrencyStore();
    const { addItem } = useCartStore();
    const { user } = useAuth();
    const isFav = isFavorite(product.id);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract pet-specific attributes
    const age = getCharValue(product, "edad", "etapa");
    const size = getCharValue(product, "tamaño", "tamano", "raza");
    const weight = getCharValue(product, "peso", "kilos", "kg");

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
        toast.success("¡Agregado al carrito! 🐾");
    };

    return (
        <div className="group h-full">
            <Link
                href={`/products/${(product as any).slug || product.id}`}
                className={`block h-full relative bg-[#D4B896]/40 backdrop-blur-xl rounded-[2rem] border-2 border-[#EDE0CF] shadow-lg hover:shadow-xl hover:border-[#C9A882] overflow-hidden transition-all duration-300 hover:-translate-y-1 ${!isAvailable ? "opacity-60" : ""}`}
            >
                {/* ── IMAGE SECTION ── */}
                <div className="relative aspect-square w-full bg-gradient-to-b from-[#EDE0CF] to-[#D4B896]/40 overflow-hidden p-6 rounded-t-[2rem]">
                    <div className="relative w-full h-full">
                        <Image
                            src={product.images?.[0] || "/images/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {hasDiscount && (
                            <Badge className="bg-[#E8963C] hover:bg-[#D4763B] text-white font-bold px-3 py-1 text-xs rounded-full shadow-lg transform -rotate-6">
                                ¡Oferta!
                            </Badge>
                        )}
                        {!isAvailable && (
                            <Badge className="bg-gray-500 text-white text-xs rounded-full">
                                Sin Stock
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-lg ${isFav ? "bg-red-50 text-red-500" : "bg-[#D4B896]/50 backdrop-blur-xl text-gray-400 hover:bg-red-50 hover:text-red-500"}`}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); if (product?.id) toggleFavorite(product.id); }}
                    >
                        <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    
                    {/* Floating Weight Bubble */}
                    {weight && (
                        <div className="absolute bottom-4 left-4 bg-[#8B5E3C] text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg transform rotate-3">
                            {weight}
                        </div>
                    )}
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {age && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B5E3C] bg-[#EDE0CF] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <PawPrint className="h-3 w-3" />
                                    {age}
                                </span>
                            )}
                            {size && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A0714F] bg-[#EDE0CF] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <Bone className="h-3 w-3" />
                                    {size}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <h3 className="text-base font-bold text-[#5C3D2E] mb-1 group-hover:text-[#8B5E3C] transition-colors line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                        <p className="text-xs text-[#A0714F] line-clamp-1 mb-4">
                            {product.brand || (product as any).category?.name || "Mascotas"}
                        </p>
                    </div>

                    {/* ── PRICE & ADD TO CART ── */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                        <div>
                            {hasDiscount && (
                                <p className="text-[11px] text-gray-400 line-through mb-0.5 font-bold">
                                    {formatPrice(product.basePrice, currencyCode)}
                                </p>
                            )}
                            <p className="text-xl font-black text-[#5C3D2E] tracking-tight">
                                {formatPrice(Number(price), currencyCode)}
                            </p>
                        </div>
                        
                        <Button 
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className={`h-11 w-11 p-0 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${isAvailable ? "bg-[#8B5E3C] hover:bg-[#5C3D2E] text-white" : "bg-gray-200 text-gray-400"}`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
});
