"use client";

import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { Product, SKU } from "@/types";
import {
    Droplets, Sparkles, Wind, Heart, ShoppingCart, Share2,
    Package, Star, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PerfumeDetailProps {
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

function getSpecValue(product: Product, ...keys: string[]): string | null {
    const specs = (product as any).specifications;
    if (!Array.isArray(specs)) return null;
    for (const key of keys) {
        const found = specs.find((c: any) => c.key?.toLowerCase().includes(key.toLowerCase()));
        if (found?.value) return found.value;
    }
    return null;
}

export function PerfumeDetail({ product, config }: PerfumeDetailProps) {
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

    // Chars
    const brand = product.brand || getCharValue(product, "marca");
    const line = product.model || getCharValue(product, "línea", "linea", "colección");
    const gender = getCharValue(product, "género", "genero", "para");
    const origin = getCharValue(product, "origen", "procedencia");
    const status = getCharValue(product, "estado", "original/alternativo");
    const isOriginal = status?.toLowerCase().includes("original");

    // Specs
    const concentration = getSpecValue(product, "concentración", "concentracion", "tipo") ||
        getCharValue(product, "concentración", "concentracion");
    const volume = getSpecValue(product, "volumen", "ml", "tamaño") ||
        getCharValue(product, "volumen", "ml");
    const duration = getSpecValue(product, "duración", "duracion", "permanencia");
    const lot = getSpecValue(product, "lote", "batch");
    const expiry = getSpecValue(product, "vencimiento", "caducidad", "fecha");

    const images = product.images || [];
    const mainImage = images[activeImage] || "/images/placeholder.png";
    const secondaryImages = images.filter((_: any, i: number) => i !== activeImage);

    const currentSku = product?.skus?.find((sku: SKU) => sku.id === selectedSku);
    const currentStock = currentSku ? Math.max(0, Number(currentSku.stock || 0)) : 0;
    const isOutOfStock = currentStock <= 0;

    const whatsappMessage = encodeURIComponent(
        `Hola, me interesa la fragancia "${product.name}"${concentration ? ` (${concentration})` : ""}${volume ? ` de ${volume}` : ""}. ¿Podrían darme más información?`
    );
    const whatsappUrl = `https://wa.me/${config?.contactPhone?.replace(/\D/g, "")}?text=${whatsappMessage}`;

    const allSpecs = [
        ...((product as any).characteristics || []).map((c: any) => ({ ...c, _source: "char" })),
        ...((product as any).specifications || []).map((s: any) => ({ ...s, _source: "spec" })),
    ].filter(c => c.value);

    const getSpecGroup = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes("marca") || k.includes("línea") || k.includes("linea") || k.includes("género") || k.includes("genero") || k.includes("origen") || k.includes("estado")) return "Datos Generales";
        if (k.includes("concentra") || k.includes("volumen") || k.includes("ml") || k.includes("duración") || k.includes("duracion") || k.includes("vencimiento") || k.includes("lote") || k.includes("familia")) return "Especificaciones Técnicas";
        if (k.includes("precio") || k.includes("costo") || k.includes("ganancia") || k.includes("stock") || k.includes("proveedor") || k.includes("ubicación") || k.includes("ubicacion")) return "Comercial";
        return "Otros";
    };

    const groupedSpecs: Record<string, any[]> = {};
    const skipInGroups = ["marca", "línea", "linea", "género", "genero", "origen", "estado", "concentra", "volumen", " ml", "duración", "duracion"];
    allSpecs.forEach(item => {
        if (!item.value) return;
        const group = getSpecGroup(item.key);
        if (!groupedSpecs[group]) groupedSpecs[group] = [];
        groupedSpecs[group].push(item);
    });

    const specOrder = ["Datos Generales", "Especificaciones Técnicas", "Comercial", "Otros"];
    const specGroups = specOrder
        .filter(g => groupedSpecs[g]?.length > 0)
        .map(title => ({ title, items: groupedSpecs[title] }));

    const handleAddToCart = () => {
        if (!currentSku || isOutOfStock) {
            toast.error("Fragancia sin stock disponible");
            return;
        }
        addItem(
            {
                skuId: currentSku.id.toString(),
                productId: product.id,
                productName: product.name,
                productImage: images[0] || "/placeholder.jpg",
                price: typeof currentSku.price === "number" ? currentSku.price : parseFloat(currentSku.price || "0"),
                qty: quantity,
                currencyCode: currencyCode,
                attributes: {},
                allowFractional: false,
                measurementUnit: "UNIDAD",
            },
            user !== null,
        );
        toast.success("Agregado al carrito");
    };

    return (
        <div className="min-h-screen bg-[#171310] text-[#f9f1d8] font-sans pt-32">

            {/* ── HERO SECTION ── */}
            <div className="relative w-full min-h-[85vh] flex flex-col lg:flex-row">

                {/* Left: Image Gallery */}
                <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-[85vh] overflow-hidden bg-[#111]">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-all duration-700"
                        priority
                    />
                    {/* Gold vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 lg:block hidden" />

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {images.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === i ? "bg-[#d4af37] w-6 shadow-[0_0_8px_#d4af37]" : "bg-white/30 hover:bg-white/60"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Nav arrows */}
                    {images.length > 1 && (
                        <>
                            <button onClick={() => setActiveImage(p => (p - 1 + images.length) % images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button onClick={() => setActiveImage(p => (p + 1) % images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Status badge */}
                    {status && (
                        <div className={`absolute top-6 left-6 z-20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border ${isOriginal ? "bg-[#d4af37]/20 border-[#d4af37]/60 text-[#00000]" : "bg-white/10 border-white/20 text-white/70"}`}>
                            {status}
                        </div>
                    )}

                    {/* Favorite */}
                    <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all ${isFav ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-black/40 border-white/10 text-white/60 hover:text-white"}`}
                    >
                        <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* Right: Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20 relative">

                    {/* Brand & line */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-[#d4af37]" />
                        <span className="text-[#d4af37] font-serif tracking-[0.3em] text-xs uppercase">
                            {brand || "Fragancia"}
                            {line && <span className="text-[#d4af37]/60"> · {line}</span>}
                        </span>
                    </div>

                    {/* Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f9f1d8] leading-[1.05] mb-6">
                        {product.name}
                    </h1>

                    {/* Key attrs row */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {concentration && (
                            <span className="flex items-center gap-1.5 px-4 py-2 border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                                <Sparkles className="h-3 w-3" />{concentration}
                            </span>
                        )}
                        {volume && (
                            <span className="flex items-center gap-1.5 px-4 py-2 border border-white/20 bg-white/5 text-white/80 text-xs font-bold uppercase tracking-widest">
                                <Droplets className="h-3 w-3" />{volume}
                            </span>
                        )}
                        {gender && (
                            <span className="px-4 py-2 border border-white/10 bg-white/5 text-white/60 text-xs uppercase tracking-widest">
                                {gender}
                            </span>
                        )}
                        {duration && (
                            <span className="flex items-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 text-white/60 text-xs uppercase tracking-widest">
                                <Wind className="h-3 w-3" />{duration}
                            </span>
                        )}
                    </div>

                    {/* Origin */}
                    {origin && (
                        <p className="text-sm text-white/40 tracking-widest uppercase mb-8 font-light">
                            Origen: {origin}
                        </p>
                    )}

                    {/* Separator */}
                    <div className="h-px w-full bg-gradient-to-r from-[#d4af37]/40 via-[#d4af37]/10 to-transparent mb-8" />

                    {/* Price */}
                    <div className="mb-8">
                        <p className="text-5xl font-serif text-[#d4af37] tracking-wide">
                            {formatPrice(Number(price), currencyCode)}
                        </p>
                        {isOutOfStock ? (
                            <span className="mt-2 inline-block text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-3 py-1 uppercase tracking-widest">
                                Sin Stock
                            </span>
                        ) : (
                            <span className="mt-2 inline-block text-xs text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 uppercase tracking-widest">
                                Disponible
                            </span>
                        )}
                    </div>

                    {/* SKU selector */}
                    {product.skus && product.skus.length > 1 && (
                        <div className="mb-8">
                            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Variante</p>
                            <div className="flex flex-wrap gap-2">
                                {product.skus.map((sku: SKU) => (
                                    <button
                                        key={sku.id}
                                        onClick={() => setSelectedSku(sku.id)}
                                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${selectedSku === sku.id
                                            ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                            : "border-white/10 text-white/50 hover:border-white/30"
                                            }`}
                                    >
                                        {sku.variantOptions?.map((o: any) => o.value).join(" / ") || sku.code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity + Cart */}
                    {config?.rubro?.cartEnabled !== false && (
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 border border-white/10">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-white/50 hover:text-[#d4af37] transition-colors">−</button>
                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(currentStock || 99, q + 1))} className="px-3 py-3 text-white/50 hover:text-[#d4af37] transition-colors">+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Agregar al Carrito
                                </button>
                            </div>

                            {config?.contactPhone && (
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-4 border border-white/10 text-white/70 hover:border-[#d4af37]/40 hover:text-[#d4af37] font-bold uppercase tracking-widest text-xs transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    Consultar por WhatsApp
                                </a>
                            )}
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="flex gap-6 text-white/30 text-[10px] uppercase tracking-widest">
                        {[
                            { icon: Sparkles, text: "100% Auténtico" },
                            { icon: Package, text: "Envío Premium" },
                            { icon: Star, text: "Garantía" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-1.5">
                                <Icon className="h-3 w-3 text-[#d4af37]/50" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── GALLERY STRIP ── */}
            {images.length > 1 && (
                <div className="bg-[#111] border-t border-white/5 py-8">
                    <div className="container mx-auto px-6">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6">Galería</p>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`relative flex-shrink-0 w-28 h-28 overflow-hidden border-2 transition-all ${activeImage === i ? "border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"}`}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── DESCRIPTION ── */}
            {product.description && (
                <div className="py-20 border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
                            <h2 className="font-serif text-2xl text-[#f9f1d8] tracking-widest uppercase">La Fragancia</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-[#d4af37]/40 to-transparent" />
                        </div>
                        <p className="text-[#f9f1d8]/60 leading-relaxed text-lg font-light italic text-center max-w-2xl mx-auto">
                            {product.description}
                        </p>
                    </div>
                </div>
            )}

            {/* ── SPECIFICATIONS ── */}
            {specGroups.length > 0 && (
                <div className="py-20 border-t border-white/5 bg-[#0d0d0d]">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-4 mb-14">
                            <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
                            <h2 className="font-serif text-2xl text-[#f9f1d8] tracking-widest uppercase">Especificaciones</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-[#d4af37]/40 to-transparent" />
                        </div>

                        <div className={`grid gap-12 ${specGroups.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "max-w-xl mx-auto"}`}>
                            {specGroups.map(({ title, items }) => (
                                <div key={title}>
                                    <h3 className="text-[#d4af37] text-xs uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-3">
                                        <span className="h-px w-6 bg-[#d4af37]/40" />
                                        {title}
                                    </h3>
                                    <div className="space-y-3">
                                        {items.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between items-start py-3 border-b border-white/5">
                                                <span className="text-white/40 text-xs uppercase tracking-wider">{item.key}</span>
                                                <span className="text-[#f9f1d8]/90 text-sm font-medium text-right max-w-[60%]">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── YOUTUBE VIDEO ── */}
            {(product as any).youtubeVideo && (
                <div className="py-20 border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
                            <h2 className="font-serif text-2xl text-[#f9f1d8] tracking-widest uppercase flex items-center gap-3">
                                <Play className="h-5 w-5 text-[#d4af37]" /> Video
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-[#d4af37]/40 to-transparent" />
                        </div>
                        <div className="relative aspect-video border border-white/5">
                            <iframe
                                src={(product as any).youtubeVideo.includes("watch?v=")
                                    ? (product as any).youtubeVideo.replace("watch?v=", "embed/")
                                    : (product as any).youtubeVideo.includes("youtu.be/")
                                        ? (product as any).youtubeVideo.replace("youtu.be/", "youtube.com/embed/")
                                        : (product as any).youtubeVideo}
                                title="Video de la fragancia"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── FOOTER CTA ── */}
            <div className="py-20 border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-[#d4af37]/60 text-xs uppercase tracking-[0.4em] mb-4">Colección Exclusiva</p>
                    <h2 className="font-serif text-4xl text-[#f9f1d8] mb-6">
                        {config?.storeName || "Maison Parfum"}
                    </h2>
                    <Link href="/products"
                        className="inline-flex items-center gap-3 px-12 py-4 border border-[#d4af37]/40 text-[#d4af37] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d4af37] hover:text-black transition-all duration-300">
                        Ver Toda la Colección
                    </Link>
                </div>
            </div>
        </div>
    );
}
