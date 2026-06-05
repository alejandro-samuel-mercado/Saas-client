"use client";

import { useCartStore } from "@/store/cart";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface DecorProductDetailProps {
    product: Product;
    config: any;
}

export function DecorProductDetail({ product, config }: DecorProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const isRent = product.saleMode === 'ALQUILER';
    const displayPrice = product.basePrice ? Number(product.basePrice) : 0;
    const formattedPrice = formatPrice(displayPrice);

    const handleAddToCart = () => {
        addItem({
            productId: Number(product.id),
            skuId: String(product.id),
            productName: product.name,
            price: displayPrice,
            productImage: product.images[0] || "",
            qty: quantity,
            attributes: {},
        });
        toast.success("Añadido al carrito", {
            description: `${quantity}x ${product.name} ha sido añadido a tu carrito.`,
            style: { backgroundColor: "#F0E5D8", color: "#3A302A", border: "1px solid #E1CDBF" }
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-32">
            {/* Header spacer since Navbar is transparent/fixed */}
            <div className="w-full bg-[#F0E5D8] pt-32 pb-16 px-6 lg:px-12 text-center">
                <p className="text-xs tracking-[0.2em] text-[#3A302A]/60 uppercase mb-4">
                    {product.category?.name || "Colección"}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-[#3A302A]">
                    {product.name}
                </h1>
            </div>

            <div className="container mx-auto px-6 lg:px-12 mt-16 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    {/* Image Gallery */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Main Image in Arch */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative w-full aspect-[4/5] bg-[#E1CDBF]/20 rounded-t-full overflow-hidden"
                        >
                            <Image 
                                src={product.images[selectedImage] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {product.saleMode && (
                                <div className="absolute top-6 right-6 bg-[#F0E5D8]/90 backdrop-blur-sm px-4 py-2 text-[10px] uppercase tracking-widest text-[#3A302A]">
                                    {product.saleMode}
                                </div>
                            )}
                        </motion.div>
                        
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-24 flex-shrink-0 transition-all ${selectedImage === idx ? "opacity-100 border border-[#3A302A]" : "opacity-50 hover:opacity-100"}`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                        
                        <div className="mb-10">
                            <h2 className="text-3xl font-serif text-[#3A302A] mb-4">{product.name}</h2>
                            <p className="text-[#3A302A]/80 font-sans text-sm leading-relaxed mb-6">
                                {product.description || "Sin descripción disponible para este artículo."}
                            </p>
                            
                            <div className="text-2xl text-[#3A302A] font-light font-sans flex items-baseline gap-2">
                                {formattedPrice} 
                                {isRent && <span className="text-sm text-[#3A302A]/60">/ día</span>}
                            </div>
                        </div>

                        {/* Specifications Grid */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mb-12 border-t border-b border-[#3A302A]/10 py-6">
                                <h3 className="text-[#3A302A] font-serif text-lg mb-4">Especificaciones</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-[#3A302A]/50">{key}</span>
                                            <span className="text-sm text-[#3A302A]">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-6 mb-12">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between border border-[#3A302A]/20 px-4 py-4 w-full sm:w-32 bg-transparent">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-[#3A302A]/60 hover:text-[#3A302A] transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-sans text-[#3A302A]">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-[#3A302A]/60 hover:text-[#3A302A] transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add Button */}
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#E1CDBF] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#E1CDBF] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-8 flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={16} />
                                {isRent ? "Alquilar" : "Añadir al Carrito"}
                            </button>
                        </div>

                        {/* Meta Actions */}
                        <div className="flex items-center gap-8 border-t border-[#3A302A]/10 pt-6 mt-auto">
                            <button className="flex items-center gap-2 text-[#3A302A]/60 hover:text-[#3A302A] transition-colors group">
                                <Heart size={16} className="group-hover:fill-[#3A302A]/20 transition-all" />
                                <span className="text-xs uppercase tracking-widest">Guardar en favoritos</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#3A302A]/60 hover:text-[#3A302A] transition-colors">
                                <Share2 size={16} />
                                <span className="text-xs uppercase tracking-widest">Compartir</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
