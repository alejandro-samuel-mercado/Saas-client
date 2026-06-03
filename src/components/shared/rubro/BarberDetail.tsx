"use client";

import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { Product, SKU } from "@/types";
import { Heart, ShoppingCart, Shield, ChevronLeft, ChevronRight, Settings, Info, Package, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface BarberDetailProps {
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

export function BarberDetail({ product, config }: BarberDetailProps) {
    const { currency } = useCurrencyStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuth();
    const isFav = isFavorite(product.id);

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<number | null>(null);

    useEffect(() => {
        if (product?.skus?.length > 0 && !selectedSku) {
            const first = product.skus.find((s: SKU) => Number(s.stock) > 0) || product.skus[0];
            setSelectedSku(first.id);
        }
    }, [product, selectedSku]);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Barber-specific fields
    const brand = product.brand || getCharValue(product, "marca");
    const model = product.model || getCharValue(product, "modelo");
    const usage = getCharValue(product, "uso", "tipo de uso");
    const itemType = getCharValue(product, "tipo artículo", "tipo de artículo", "tipo");
    const material = getCharValue(product, "material");
    const voltage = getCharValue(product, "voltaje", "potencia", "voltaje/potencia");
    const content = getCharValue(product, "contenido", "contenido (ml/gr)");
    const color = getCharValue(product, "color");
    const sanitaryRegister = getCharValue(product, "registro sanitario");
    const expDate = getCharValue(product, "vencimiento", "fecha vencimiento");
    const instructions = getCharValue(product, "instrucciones", "instrucciones de uso");

    const currentSku = product?.skus?.find((sku: SKU) => sku.id === selectedSku);
    const currentPrice = currentSku
        ? typeof currentSku.price === "number" ? currentSku.price : parseFloat(currentSku.price || "0")
        : price;

    const safetyStock = config?.webSafetyStock || 0;
    const rawStock = currentSku ? Number(currentSku.stock || 0) : 0;
    const currentStock = Math.max(0, rawStock - safetyStock);
    const isOutOfStock = currentStock <= 0;
    const isCartEnabled = config?.rubro?.cartEnabled !== false;

    const handleAddToCart = () => {
        if ((!currentSku || isOutOfStock)) { toast.error("Sin stock disponible"); return; }
        addItem({
            skuId: currentSku?.id.toString() || product.id.toString(),
            productId: product.id,
            productName: product.name,
            productImage: product?.images?.[0] || "/placeholder.jpg",
            price: currentPrice,
            qty: quantity,
            currencyCode: (product as any)?.currencyCode || currency || undefined,
            attributes: currentSku?.variantOptions?.reduce((acc: Record<string, string>, opt: any) => ({ ...acc, [opt.name]: opt.value }), {}) || {},
            allowFractional: false,
            measurementUnit: "UNIDAD",
        }, user !== null);
        toast.success("Agregado al carrito");
    };

    const SPEC_ROWS = [
        { label: "Modelo", value: model },
        { label: "Tipo", value: itemType },
        { label: "Uso Ideal", value: usage },
        { label: "Material", value: material },
        { label: "Voltaje / Potencia", value: voltage },
        { label: "Contenido", value: content },
        { label: "Color", value: color },
        { label: "Reg. Sanitario", value: sanitaryRegister },
        { label: "Vencimiento", value: expDate },
    ].filter(r => r.value);

    return (
        <main className="min-h-screen bg-stone-900 text-stone-200 font-sans pb-32">
            {/* Top Navigation Bar overlay (simulated) */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-stone-900 to-transparent z-20 pointer-events-none" />

            <div className="relative pt-32 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-12 text-stone-500">
                    <Link href="/" className="hover:text-[#e65c00] transition-colors">Inicio</Link>
                    <span className="text-stone-700">/</span>
                    <Link href="/products" className="hover:text-[#e65c00] transition-colors">Catálogo</Link>
                    <span className="text-stone-700">/</span>
                    <span className="text-stone-400 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
                    {/* LEFT STICKY COLUMN (GALLERY) */}
                    <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
                        <div className="relative aspect-square overflow-hidden bg-stone-800 border border-stone-700 group">
                            {product?.images?.[activeImage] && (
                                <Image src={product.images[activeImage]} alt={product.name} fill
                                    className="object-contain p-8 group-hover:scale-[1.05] transition-transform duration-1000 ease-out z-10" />
                            )}

                            {/* Nav arrows */}
                            {product.images?.length > 1 && (
                                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                                    <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-stone-900/50 border border-stone-600 hover:border-[#e65c00] hover:text-[#e65c00] transition-all text-stone-200 backdrop-blur-sm">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setActiveImage(i => Math.min((product.images?.length || 1) - 1, i + 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-stone-900/50 border border-stone-600 hover:border-[#e65c00] hover:text-[#e65c00] transition-all text-stone-200 backdrop-blur-sm">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
                                {product.images.map((img: string, idx: number) => (
                                    <button key={idx} onClick={() => setActiveImage(idx)}
                                        className={`relative w-24 h-24 flex-shrink-0 overflow-hidden transition-all duration-300 ease-out bg-stone-800 border ${activeImage === idx ? "border-[#e65c00] opacity-100" : "border-stone-700 opacity-50 hover:opacity-100"}`}>
                                        <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SCROLLING COLUMN (INFO) */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="max-w-xl">
                            {/* Brand & Name */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#e65c00] bg-stone-800 border border-[#e65c00]/30 px-3 py-1">
                                        {brand || ((product as any).category?.name || "Barbería")}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-100 uppercase tracking-tighter leading-[1] mb-4">
                                    {product.name}
                                </h1>
                                {model && (
                                    <p className="text-sm font-mono text-stone-500 tracking-wider">MOD: {model}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-10 flex items-end justify-between border-b border-stone-700 pb-8">
                                <div>
                                    <p className="text-4xl font-black text-stone-100 tracking-tight">
                                        {formatPrice(Number(currentPrice), currencyCode)}
                                    </p>
                                    {product.basePrice > currentPrice && (
                                        <p className="text-sm font-medium text-stone-500 line-through mt-1">
                                            {formatPrice(product.basePrice, currencyCode)}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => { if (product?.id) toggleFavorite(product.id); }}
                                    className={`w-14 h-14 flex items-center justify-center border transition-all duration-300 ${isFav ? "border-[#e65c00] bg-[#e65c00] text-stone-100" : "border-stone-700 bg-transparent text-stone-400 hover:border-[#e65c00] hover:text-[#e65c00]"}`}>
                                    <Heart className={`h-6 w-6 ${isFav ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            {/* Stock & SKU */}
                            <div className="space-y-8 mb-10">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        {!isOutOfStock && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e65c00] opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOutOfStock ? "bg-red-500" : "bg-[#e65c00]"}`}></span>
                                    </span>
                                    <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                                        {isOutOfStock ? "Agotado temporalmente" : "Stock Disponible"}
                                    </span>
                                </div>

                                {product.skus && product.skus.length > 1 && (
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 mb-4">Seleccionar Variante</p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.skus.map((sku: SKU) => {
                                                const skuStock = Number(sku.stock || 0);
                                                return (
                                                    <button key={sku.id} onClick={() => setSelectedSku(sku.id)} disabled={skuStock === 0}
                                                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border transition-all duration-300 ${selectedSku === sku.id ? "border-[#e65c00] bg-[#e65c00] text-stone-100" : "border-stone-700 bg-stone-800 text-stone-400 hover:border-[#e65c00] hover:text-[#e65c00]"} ${skuStock === 0 ? "opacity-30 cursor-not-allowed" : ""}`}>
                                                        {sku.variantOptions?.map((o: any) => o.value).join(" - ")}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions CTA */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                                {isCartEnabled && (
                                    <button onClick={handleAddToCart} disabled={isOutOfStock}
                                        className={`w-full flex items-center justify-center gap-3 py-5 text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 ${isOutOfStock ? "bg-stone-800 text-stone-500 cursor-not-allowed" : "bg-stone-100 text-stone-900 hover:bg-[#e65c00] hover:text-stone-100"}`}>
                                        <ShoppingCart className="h-5 w-5" />
                                        {isOutOfStock ? "Sin Stock" : "Agregar"}
                                    </button>
                                )}
                                {config?.contactPhone && (
                                    <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, me interesa: ${product.name}`)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 py-5 text-sm tracking-[0.2em] uppercase font-bold border border-stone-700 text-stone-200 hover:bg-stone-800 hover:border-[#e65c00] transition-all duration-300">
                                        Consultar
                                    </a>
                                )}
                            </div>

                            {/* Technical Specs */}
                            {SPEC_ROWS.length > 0 && (
                                <div className="mb-12">
                                    <h3 className="text-xl font-black uppercase text-stone-100 mb-6 flex items-center gap-3">
                                        <Settings className="h-5 w-5 text-[#e65c00]" /> Especificaciones
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border border-stone-700 bg-stone-800 p-6">
                                        {SPEC_ROWS.map((row, i) => (
                                            <div key={i} className="flex flex-col border-b border-stone-700/50 pb-2 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                                                <span className="text-[10px] font-bold tracking-widest text-stone-500 uppercase mb-1">{row.label}</span>
                                                <span className="text-sm font-medium text-stone-200">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && product.description !== "-" && (
                                <div className="mb-12">
                                    <h3 className="text-xl font-black uppercase text-stone-100 mb-6 flex items-center gap-3">
                                        <Info className="h-5 w-5 text-[#e65c00]" /> Descripción
                                    </h3>
                                    <div className="prose prose-invert prose-stone max-w-none">
                                        <p className="text-stone-400 leading-relaxed whitespace-pre-wrap font-medium">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {instructions && (
                                <p className="text-sm text-gray-400 leading-relaxed">{instructions}</p>

                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mb-12">
                                    <h3 className="text-xl font-black uppercase text-white mb-4">Detalles</h3>
                                    <div className="text-base text-gray-400 leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </div>
                                </div>
                            )}

                            {/* YouTube */}
                            {(product as any).youtubeVideo && (
                                <div className="mt-8 border border-[#333] p-2 bg-[#161616]">
                                    <div className="aspect-video relative overflow-hidden">
                                        <iframe
                                            src={(product as any).youtubeVideo.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                            title="Video del producto"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full absolute inset-0"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
