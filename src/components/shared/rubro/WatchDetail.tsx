"use client";

import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { Product, SKU } from "@/types";
import { Heart, ShoppingCart, Shield, Award, ChevronLeft, ChevronRight, Watch, Activity, Droplets, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface WatchDetailProps {
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

export function WatchDetail({ product, config }: WatchDetailProps) {
    const { currency } = useCurrencyStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const addItem = useCartStore((state) => state.addItem);
    const { user } = useAuth();
    const isFav = isFavorite(product.id);

    const [activeImage, setActiveImage] = useState(0);
    const [quantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState<number | null>(null);

    useEffect(() => {
        if (product?.skus?.length > 0 && !selectedSku) {
            const first = product.skus.find((s: SKU) => Number(s.stock) > 0) || product.skus[0];
            setSelectedSku(first.id);
        }
    }, [product, selectedSku]);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Watch-specific fields
    const brand = product.brand || getCharValue(product, "marca");
    const reference = product.model || getCharValue(product, "referencia", "número de serie", "ref");
    const movement = getCharValue(product, "movimiento", "mecanismo", "calibre");
    const caseMaterial = getCharValue(product, "material caja", "caja");
    const strapMaterial = getCharValue(product, "correa", "material correa", "brazalete");
    const crystal = getCharValue(product, "cristal", "vidrio");
    const waterResistance = getCharValue(product, "resistencia agua", "resistencia al agua", "atm");
    const functions = getCharValue(product, "funciones", "complicaciones");
    const color = getCharValue(product, "color", "color esfera", "dial");
    const weight = getCharValue(product, "peso", "gramaje");
    const warranty = getCharValue(product, "garantía", "garantia");
    const condition = getCharValue(product, "estado", "condición") || product.condition;
    const useCase = getCharValue(product, "uso", "tipo de uso");

    // Authenticity
    const includesBox = getSpecValue(product, "incluye caja", "caja original");
    const includesManual = getSpecValue(product, "manual", "incluye manual");
    const includesCertificate = getSpecValue(product, "certificado", "incluye certificado");
    const certificatePdf = getSpecValue(product, "pdf", "archivo certificado", "url certificado");

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
        if (!currentSku || isOutOfStock) { toast.error("Sin stock disponible"); return; }
        addItem({
            skuId: currentSku.id.toString(),
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
        { label: "Referencia / Modelo", value: reference },
        { label: "Movimiento", value: movement },
        { label: "Material Caja", value: caseMaterial },
        { label: "Correa / Brazalete", value: strapMaterial },
        { label: "Cristal", value: crystal },
        { label: "Resistencia al Agua", value: waterResistance },
        { label: "Funciones", value: functions },
        { label: "Color / Esfera", value: color },
        { label: "Peso", value: weight },
        { label: "Garantía", value: warranty },
        { label: "Estado", value: condition },
        { label: "Uso", value: useCase },
    ].filter(r => r.value);

    const AUTH_ROWS = [
        { label: "Incluye Caja Original", value: includesBox },
        { label: "Incluye Manual", value: includesManual },
        { label: "Incluye Certificado", value: includesCertificate },
    ].filter(r => r.value);

    return (
        <main className="min-h-screen bg-[#030712] text-slate-300 font-sans pb-32">
            {/* Top Navigation Bar overlay (simulated) */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none" />

            <div className="relative pt-32 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase mb-12 text-slate-500">
                    <Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/products" className="hover:text-amber-500 transition-colors">Colección</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
                    {/* LEFT STICKY COLUMN (GALLERY) */}
                    <div className="lg:w-1/2 lg:sticky lg:top-32 h-fit">
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-tr from-slate-900 to-slate-950 border border-white/5 shadow-2xl group">
                            {/* Decorative gradient orb */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                            {product?.images?.[activeImage] && (
                                <Image src={product.images[activeImage]} alt={product.name} fill
                                    className="object-contain p-12 group-hover:scale-[1.03] transition-transform duration-1000 ease-out z-10" />
                            )}
                            
                            {condition && (
                                <div className="absolute top-8 left-8 z-20">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-md">
                                        {condition}
                                    </span>
                                </div>
                            )}

                            {/* Nav arrows */}
                            {product.images?.length > 1 && (
                                <div className="absolute bottom-8 right-8 z-20 flex gap-2">
                                    <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-white hover:scale-110">
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => setActiveImage(i => Math.min((product.images?.length || 1) - 1, i + 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-white hover:scale-110">
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
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ease-out bg-slate-900 border border-white/5 ${activeImage === idx ? "ring-2 ring-amber-500 ring-offset-4 ring-offset-[#030712] opacity-100" : "opacity-40 hover:opacity-100"}`}>
                                        <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover p-3" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SCROLLING COLUMN (INFO) */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="max-w-xl">
                            {/* Brand & Name */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Watch className="h-5 w-5 text-amber-500" />
                                    <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-500">{brand || "Relojería"}</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-6">
                                    {product.name}
                                </h1>
                                {reference && (
                                    <p className="text-sm font-mono text-slate-500 tracking-wider">REF: {reference}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-12 flex items-end justify-between">
                                <div>
                                    <p className="text-5xl font-light text-white tracking-tight">
                                        {formatPrice(Number(currentPrice), currencyCode)}
                                    </p>
                                    {product.basePrice > currentPrice && (
                                        <p className="text-base font-medium text-slate-600 line-through mt-2">
                                            {formatPrice(product.basePrice, currencyCode)}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => { if (product?.id) toggleFavorite(product.id); }}
                                    className={`w-14 h-14 flex items-center justify-center rounded-full border transition-all duration-500 hover:scale-110 ${isFav ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}>
                                    <Heart className={`h-6 w-6 ${isFav ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            {/* Stock & SKU */}
                            <div className="space-y-8 mb-12">
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                        {!isOutOfStock && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOutOfStock ? "bg-red-500" : "bg-emerald-500"}`}></span>
                                    </span>
                                    <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                                        {isOutOfStock ? "Agotado temporalmente" : "Disponible para entrega"}
                                    </span>
                                </div>

                                {product.skus && product.skus.length > 1 && (
                                    <div>
                                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Seleccionar Variante</p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.skus.map((sku: SKU) => {
                                                const skuStock = Number(sku.stock || 0);
                                                return (
                                                    <button key={sku.id} onClick={() => setSelectedSku(sku.id)} disabled={skuStock === 0}
                                                        className={`px-6 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${selectedSku === sku.id ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-white/10 bg-transparent text-slate-400 hover:border-white/30 hover:text-white"} ${skuStock === 0 ? "opacity-30 cursor-not-allowed" : ""}`}>
                                                        {sku.variantOptions?.map((o: any) => o.value).join(" · ")}
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
                                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-sm tracking-[0.2em] uppercase font-bold transition-all duration-500 ${isOutOfStock ? "bg-white/5 text-slate-600 cursor-not-allowed" : "bg-white text-black hover:bg-slate-200 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)]"}`}>
                                        <ShoppingCart className="h-5 w-5" />
                                        {isOutOfStock ? "Sin Stock" : "Añadir a la Cesta"}
                                    </button>
                                )}
                                {config?.contactPhone && (
                                    <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, me interesa el: ${product.name} (REF: ${reference || "N/A"})`)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-sm tracking-[0.2em] uppercase font-bold border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:scale-[1.02]">
                                        Conserjería
                                    </a>
                                )}
                            </div>

                            <hr className="border-white/5 mb-12" />

                            {/* Minimal Specs */}
                            {SPEC_ROWS.length > 0 && (
                                <div className="mb-16">
                                    <h3 className="text-xl font-light text-white mb-8 flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-amber-500" /> Detalle Técnico
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        {SPEC_ROWS.map((row, i) => (
                                            <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{row.label}</span>
                                                <span className="text-sm font-medium text-slate-200">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Minimal Auth */}
                            {AUTH_ROWS.length > 0 && (
                                <div className="mb-16 bg-slate-900/50 rounded-[2rem] p-8 border border-white/5">
                                    <h3 className="text-xl font-light text-white mb-8 flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-amber-500" /> Autenticidad
                                    </h3>
                                    <div className="space-y-4">
                                        {AUTH_ROWS.map((row, i) => (
                                            <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                <span className="text-sm font-medium text-slate-400">{row.label}</span>
                                                <span className="text-sm font-semibold text-white">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {certificatePdf && (
                                        <div className="mt-8 pt-8 border-t border-white/5">
                                            <a href={certificatePdf} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-amber-500 hover:text-amber-400 transition-colors">
                                                <Award className="h-5 w-5" />
                                                Descargar Certificado
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Minimal Description */}
                            {product.description && (
                                <div className="mb-16">
                                    <h3 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                                        <Info className="h-5 w-5 text-amber-500" /> Historia del Modelo
                                    </h3>
                                    <p className="text-base text-slate-400 leading-relaxed font-light">{product.description}</p>
                                </div>
                            )}

                            {/* YouTube */}
                            {(product as any).youtubeVideo && (
                                <div className="mt-8">
                                    <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/5">
                                        <iframe
                                            src={(product as any).youtubeVideo.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                            title="Video del reloj"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
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
