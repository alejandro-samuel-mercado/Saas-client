"use client";

import { Product } from "@/types";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface DecorProductCardProps {
    product: Product;
}

export function DecorProductCard({ product }: DecorProductCardProps) {
    const formattedPrice = formatPrice(Number(product.basePrice));

    return (
        <div className="flex flex-col group w-full">
            
            {/* Flat Image Container */}
            <Link href={`/products/${product.id}`} className="relative w-full aspect-[4/5] bg-[#E1CDBF]/20 overflow-hidden mb-4 border border-[#3A302A]/5">
                <Image 
                    src={product.images[0] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Venta / Alquiler Tag overlay */}
                {product.saleMode && (
                    <div className="absolute top-4 right-4 bg-[#F0E5D8]/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-[#3A302A]">
                        {product.saleMode}
                    </div>
                )}
            </Link>

            {/* Product Info Minimalist */}
            <div className="flex flex-col gap-1 px-1">
                <Link href={`/products/${product.id}`} className="font-serif text-lg text-[#3A302A] hover:text-[#3A302A]/70 transition-colors truncate">
                    {product.name}
                </Link>
                <div className="text-[#3A302A]/60 font-sans text-sm font-light">
                    {formattedPrice} {product.saleMode === 'ALQUILER' ? '/ día' : ''}
                </div>
            </div>

            {/* Interaction Bar (Like in image) */}
            <div className="flex items-center gap-6 mt-4 border-t border-[#3A302A]/10 pt-3 px-1">
                <button className="flex items-center gap-2 text-[#3A302A]/60 hover:text-[#3A302A] transition-colors group/btn">
                    <Heart size={14} className="group-hover/btn:fill-[#3A302A]/20 transition-all" />
                    <span className="text-[10px] tracking-widest">120</span>
                </button>
                <button className="flex items-center gap-2 text-[#3A302A]/60 hover:text-[#3A302A] transition-colors">
                    <Share2 size={14} />
                    <span className="text-[10px] uppercase tracking-widest">Share</span>
                </button>
            </div>

        </div>
    );
}
