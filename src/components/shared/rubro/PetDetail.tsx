"use client";

import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { Product, SKU } from "@/types";
import { Heart, ShoppingCart, Shield, ChevronLeft, ChevronRight, PawPrint, Truck, RotateCcw, Star, Package, Bone, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PetDetailProps {
    product: Product;
    config: any;
}

function getCharValue(product: Product, ...keys: string[]): string | null {
    const chars = (product as any).characteristics;
    if (!Array.isArray(chars)) return null;
    for (const key of keys) {
        const found = chars.find((c: any) => c.key?.toLowerCase().includes(key.toLowerCase()));
        if (found?.value) return found.value;
    }
    return null;
}

export function PetDetail({ product, config }: PetDetailProps) {
    const { currency } = useCurrencyStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuth();
    const isFav = isFavorite(product.id);

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<number | null>(null);
    const [addedEffect, setAddedEffect] = useState(false);

    useEffect(() => {
        if (product?.skus?.length > 0 && !selectedSku) {
            const first = product.skus.find((s: SKU) => Number(s.stock) > 0) || product.skus[0];
            setSelectedSku(first.id);
        }
    }, [product, selectedSku]);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    const brand = product.brand || getCharValue(product, "marca");
    const weight = getCharValue(product, "peso", "kg", "kilos");
    const species = getCharValue(product, "especie", "para", "animal");
    const ageStage = getCharValue(product, "etapa", "edad");
    const flavor = getCharValue(product, "sabor", "proteína");
    const size = getCharValue(product, "tamaño", "raza");
    const ingredients = getCharValue(product, "ingredientes");

    const currentSku = product?.skus?.find((sku: SKU) => sku.id === selectedSku);
    const currentPrice = currentSku
        ? typeof currentSku.price === "number" ? currentSku.price : parseFloat(currentSku.price || "0")
        : price;

    const safetyStock = config?.webSafetyStock || 0;
    const rawStock = currentSku ? Number(currentSku.stock || 0) : 0;
    const currentStock = Math.max(0, rawStock - safetyStock);
    const isOutOfStock = currentStock <= 0;
    const isCartEnabled = config?.rubro?.cartEnabled !== false;

    const hasDiscount = product.basePrice > currentPrice;
    const discountPct = hasDiscount ? Math.round((1 - currentPrice / product.basePrice) * 100) : 0;

    const images = product.images?.length > 0 ? product.images : ["/images/placeholder.png"];

    const handleAddToCart = () => {
        if (!currentSku || isOutOfStock) { toast.error("Sin stock disponible"); return; }
        addItem({
            skuId: currentSku?.id.toString() || product.id.toString(),
            productId: product.id,
            productName: product.name,
            productImage: images[0],
            price: currentPrice,
            qty: quantity,
            currencyCode,
            attributes: currentSku?.variantOptions?.reduce((acc: any, o: any) => ({ ...acc, [o.name]: o.value }), {}) || {},
            allowFractional: product.allowFractional ?? false,
            measurementUnit: product.measurementUnit ?? "UNIDAD",
        }, user !== null);
        toast.success("¡Agregado al carrito! 🐾");
        setAddedEffect(true);
        setTimeout(() => setAddedEffect(false), 700);
    };

    const SPECS = [
        { label: "Especie", value: species, icon: PawPrint },
        { label: "Etapa", value: ageStage, icon: Star },
        { label: "Sabor / Proteína", value: flavor, icon: Bone },
        { label: "Peso", value: weight, icon: Package },
        { label: "Tamaño de Raza", value: size, icon: Tag },
    ].filter(s => s.value);

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24">

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <nav className="flex items-center gap-2 text-xs text-[#A0714F] font-medium">
                    <Link href="/" className="hover:text-[#5C3D2E] transition-colors">Inicio</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-[#5C3D2E] transition-colors">Productos</Link>
                    <span>/</span>
                    <span className="text-[#5C3D2E] font-bold line-clamp-1">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    {/* ── IMAGE COLUMN ── */}
                    <div className="flex flex-col gap-4">
                        {/* Main image */}
                        <div className="relative bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] overflow-hidden aspect-square shadow-lg group">
                            <Image
                                src={images[activeImage]}
                                alt={product.name}
                                fill
                                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                            />
                            {hasDiscount && (
                                <div className="absolute top-4 left-4 bg-[#E8963C] text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                                    -{discountPct}%
                                </div>
                            )}
                            <button
                                onClick={() => { toggleFavorite(product.id); }}
                                className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                                    isFav ? "bg-red-50 text-red-500 shadow-red-100" : "bg-[#D4B896]/50 backdrop-blur-xl text-[#A0714F] hover:bg-red-50 hover:text-red-500"
                                }`}
                            >
                                <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                            </button>

                            {/* Arrows if multiple images */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#D4B896]/40 backdrop-blur-xl shadow-lg flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors opacity-0 group-hover:opacity-100">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#D4B896]/40 backdrop-blur-xl shadow-lg flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors opacity-0 group-hover:opacity-100">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                            activeImage === idx ? "border-[#8B5E3C] shadow-lg scale-105" : "border-[#EDE0CF] hover:border-[#C9A882]"
                                        }`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1 bg-[#D4B896]/40 backdrop-blur-xl" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── INFO COLUMN ── */}
                    <div className="flex flex-col">
                        {/* Brand & category */}
                        <div className="flex items-center gap-3 mb-3">
                            {brand && (
                                <span className="text-xs font-bold text-[#E8963C] uppercase tracking-widest">{brand}</span>
                            )}
                            {(product as any).category?.name && (
                                <span className="text-xs font-bold bg-[#EDE0CF] text-[#8B5E3C] px-3 py-1 rounded-full">{(product as any).category.name}</span>
                            )}
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-black text-[#5C3D2E] leading-tight mb-4">{product.name}</h1>

                        {/* Rating (decorative) */}
                        <div className="flex items-center gap-2 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-[#E8963C] text-[#E8963C]" : "text-[#D4B896]"}`} />
                            ))}
                            <span className="text-xs text-[#A0714F] font-medium ml-1">4.0 (28 reseñas)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#EDE0CF]">
                            <div>
                                {hasDiscount && (
                                    <p className="text-sm text-[#A0714F] line-through font-medium">
                                        {formatPrice(product.basePrice, currencyCode)}
                                    </p>
                                )}
                                <p className="text-4xl font-black text-[#5C3D2E]">
                                    {formatPrice(currentPrice, currencyCode)}
                                </p>
                            </div>
                            {hasDiscount && (
                                <span className="mb-1 bg-green-100 text-green-700 text-sm font-black px-3 py-1 rounded-full">
                                    Ahorrás {formatPrice(product.basePrice - currentPrice, currencyCode)}
                                </span>
                            )}
                        </div>

                        {/* SKU variants */}
                        {product?.skus && product.skus.length > 1 && (
                            <div className="mb-6">
                                <p className="text-xs font-black uppercase tracking-widest text-[#A0714F] mb-3">Variantes</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.skus.map((sku: SKU) => {
                                        const skuLabel = sku.variantOptions?.map((o: any) => o.value).join(" / ") || `SKU ${sku.id}`;
                                        const skuStock = Number(sku.stock || 0) - safetyStock;
                                        const isSelected = selectedSku === sku.id;
                                        return (
                                            <button
                                                key={sku.id}
                                                onClick={() => setSelectedSku(sku.id)}
                                                disabled={skuStock <= 0}
                                                className={`px-4 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                                                    isSelected
                                                        ? "border-[#8B5E3C] bg-[#8B5E3C] text-white"
                                                        : skuStock <= 0
                                                            ? "border-[#D4B896] text-[#C9A882] cursor-not-allowed opacity-60"
                                                            : "border-[#D4B896] text-[#5C3D2E] hover:border-[#8B5E3C]"
                                                }`}
                                            >
                                                {skuLabel}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to cart */}
                        {isCartEnabled && (
                            <div className="flex gap-3 mb-6">
                                <div className="flex items-center border-2 border-[#D4B896] rounded-full overflow-hidden bg-[#D4B896]/40 backdrop-blur-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-11 h-11 flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] font-black text-lg transition-colors"
                                    >−</button>
                                    <span className="w-10 text-center font-black text-[#5C3D2E]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-11 h-11 flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] font-black text-lg transition-colors"
                                    >+</button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-black text-sm transition-all duration-300 shadow-lg ${
                                        addedEffect
                                            ? "bg-green-500 text-white scale-95"
                                            : isOutOfStock
                                                ? "bg-[#EDE0CF] text-[#A0714F] cursor-not-allowed"
                                                : "bg-[#8B5E3C] hover:bg-[#5C3D2E] text-white hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300 hover:-translate-y-0.5"
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {isOutOfStock ? "Sin Stock" : addedEffect ? "¡Listo! 🐾" : "Agregar al Carrito"}
                                </button>
                            </div>
                        )}

                        {/* Stock badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? "bg-red-400" : currentStock < 5 ? "bg-amber-400" : "bg-green-400"}`} />
                            <span className="text-xs font-bold text-[#A0714F]">
                                {isOutOfStock ? "Sin stock disponible" : currentStock < 5 ? `¡Últimas ${currentStock} unidades!` : "En stock · Envío rápido"}
                            </span>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-[#D4B896]/40 backdrop-blur-xl rounded-2xl border border-[#EDE0CF]">
                            {[
                                { icon: Truck, text: "Envío a todo el país" },
                                { icon: Shield, text: "Compra 100% segura" },
                                { icon: RotateCcw, text: "Cambios sin costo" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="h-9 w-9 rounded-full bg-[#EDE0CF] flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-[#8B5E3C]" />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#A0714F] leading-tight">{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Specs */}
                        {SPECS.length > 0 && (
                            <div className="mt-6 bg-[#D4B896]/40 backdrop-blur-xl rounded-2xl border border-[#EDE0CF] overflow-hidden">
                                <h3 className="px-5 py-3 font-black text-[#5C3D2E] text-sm uppercase tracking-wider border-b border-[#EDE0CF] bg-[#EDE0CF]">
                                    Especificaciones
                                </h3>
                                <div className="divide-y divide-[#EDE0CF]">
                                    {SPECS.map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="flex items-center gap-4 px-5 py-3">
                                            <Icon className="h-4 w-4 text-[#E8963C] flex-shrink-0" />
                                            <span className="text-xs text-[#A0714F] font-bold uppercase tracking-wider w-28 flex-shrink-0">{label}</span>
                                            <span className="text-sm text-[#5C3D2E] font-medium capitalize">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="mt-6">
                                <h3 className="font-black text-[#5C3D2E] text-sm uppercase tracking-wider mb-3">Descripción</h3>
                                <p className="text-[#8B5E3C] text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Ingredients */}
                        {ingredients && (
                            <div className="mt-4 p-4 bg-[#EDE0CF] rounded-2xl">
                                <p className="text-xs font-black text-[#5C3D2E] uppercase tracking-wider mb-2">Ingredientes</p>
                                <p className="text-xs text-[#8B5E3C] leading-relaxed">{ingredients}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
