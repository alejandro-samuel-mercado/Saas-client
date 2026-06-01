"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { Clock, Scissors, User, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";

interface BarberCardProps {
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

export const BarberCard = memo(function BarberCard({ product }: BarberCardProps) {
    const { currency } = useCurrencyStore();
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    // Extract barber-specific attributes
    const duration = getCharValue(product, "duración", "duracion", "tiempo");
    const professional = getCharValue(product, "especialista", "barbero", "profesional", "estilista");

    const isAvailable = (product as any).skus?.some((s: any) => Number(s.stock) > 0) ?? true;

    // Build WhatsApp URL for booking
    const whatsappNumber = config?.contactPhone?.replace(/\D/g, "");
    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, quisiera consultar por un turno para el servicio: ${product.name}`)}`
        : null;

    return (
        <div className="group">
            <div className={`relative bg-[#1e1c18] rounded-md border-2 border-[#8b6b4a]/20 overflow-hidden transition-all duration-300 hover:border-[#8b6b4a] shadow-[4px_4px_0_rgba(139,107,74,0.3)] hover:shadow-[6px_6px_0_rgba(139,107,74,0.5)] hover:-translate-y-1 ${!isAvailable ? "opacity-60" : ""}`}>
                
                {/* ── IMAGE SECTION ── */}
                <Link href={`/products/detail?slug=${(product as any).slug || product.id}`}>
                    <div className="relative h-48 w-full overflow-hidden bg-black/80 grayscale group-hover:grayscale-0 transition-all duration-500">
                        <Image
                            src={product.images?.[0] || "/images/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1c18] to-transparent" />
                        
                        {/* Corner Badge */}
                        <div className="absolute top-0 left-0 bg-[#8b6b4a] text-[#1e1c18] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-br-lg shadow-md">
                            Servicio
                        </div>

                        {!isAvailable && (
                            <div className="absolute top-2 right-2 bg-red-900/90 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 border border-red-500/50">
                                Agotado
                            </div>
                        )}
                    </div>
                </Link>

                {/* ── DETAILS SECTION ── */}
                <div className="p-5 flex flex-col justify-between">
                    <div>
                        {/* Name */}
                        <Link href={`/products/detail?slug=${(product as any).slug || product.id}`}>
                            <h3 className="text-xl font-bold text-[#e6d5b8] mb-2 uppercase tracking-wide flex items-center gap-2 group-hover:text-[#8b6b4a] transition-colors">
                                <Scissors className="h-4 w-4 text-[#8b6b4a]" />
                                {product.name}
                            </h3>
                        </Link>
                        
                        <p className="text-sm text-[#a69b85] line-clamp-2 mb-4 italic">
                            {(product as any).description || "Servicio premium tradicional"}
                        </p>
                        
                        {/* Technical Specs / Tags */}
                        <div className="flex flex-col gap-2 mb-4">
                            {duration && (
                                <div className="flex items-center gap-2 text-sm text-[#e6d5b8]">
                                    <Clock className="h-4 w-4 text-[#8b6b4a]" />
                                    <span><span className="text-[#a69b85] text-xs uppercase tracking-wider mr-1">Tiempo:</span> {duration}</span>
                                </div>
                            )}
                            {professional && (
                                <div className="flex items-center gap-2 text-sm text-[#e6d5b8]">
                                    <User className="h-4 w-4 text-[#8b6b4a]" />
                                    <span><span className="text-[#a69b85] text-xs uppercase tracking-wider mr-1">Staff:</span> {professional}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── PRICE AND CTA ── */}
                    <div className="pt-4 border-t border-[#8b6b4a]/20 mt-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] text-[#a69b85] uppercase tracking-widest font-bold mb-0.5">Precio Base</p>
                                <p className="text-2xl font-black text-[#e6d5b8]">
                                    {formatPrice(Number(price), currencyCode)}
                                </p>
                            </div>
                            {product.basePrice > price && (
                                <div className="bg-[#8b6b4a]/20 px-2 py-1 rounded text-xs text-[#8b6b4a] font-bold">
                                    PROMO
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {whatsappUrl ? (
                                <a 
                                    href={whatsappUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#8b6b4a] hover:bg-[#6b5034] text-[#1e1c18] font-black uppercase tracking-wider py-3 rounded transition-colors"
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    Agendar
                                </a>
                            ) : (
                                <Link 
                                    href={`/products/detail?slug=${(product as any).slug || product.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#8b6b4a] hover:bg-[#6b5034] text-[#1e1c18] font-black uppercase tracking-wider py-3 rounded transition-colors"
                                >
                                    <CalendarDays className="h-4 w-4" />
                                    Ver Detalle
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
