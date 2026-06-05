"use client";

import { useFavoritesStore } from "@/store/favorites";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Flower2, ArrowRight, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function DecorFavorites() {
    const { favorites, removeFavorite } = useFavoritesStore();
    const { user } = useAuth();

    return (
        <main className="min-h-screen pt-20 pb-24" style={{ backgroundColor: "#F0E5D8" }}>

            {/* Header */}
            <div className="w-full" style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 60%, #8B6F5E 100%)" }}>
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                    <div className="absolute top-0 right-0 w-80 h-48 rounded-b-full border border-[#C4A882]/20 translate-x-20 hidden lg:block" />
                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
                        <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 6, repeat: Infinity }}
                            className="h-14 w-14 rounded-full bg-[#C4A882] flex items-center justify-center mx-auto mb-6">
                            <Heart size={24} className="text-[#3A302A]" />
                        </motion.div>
                        <p className="text-[#C4A882] text-[10px] tracking-[0.4em] uppercase mb-4 font-sans">Tu selección</p>
                        <h1 className="font-serif text-5xl md:text-6xl text-[#F0E5D8]">Favoritos</h1>
                        {favorites.length > 0 && (
                            <p className="text-[#C4A882]/60 font-sans text-sm mt-3">{favorites.length} {favorites.length === 1 ? "producto guardado" : "productos guardados"}</p>
                        )}
                    </div>
                </div>
                <div className="w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                        <Flower2 size={48} className="text-[#C4A882]" />
                        <h2 className="font-serif text-3xl text-[#3A302A]">Aún no tenés favoritos</h2>
                        <p className="text-[#5C4A3E] font-sans text-base max-w-sm">Guardá los productos que más te gustan para encontrarlos fácilmente cuando estés lista.</p>
                        <Link href="/products" className="group flex items-center gap-3 bg-[#3A302A] text-[#F0E5D8] hover:bg-[#5C4A3E] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-8 mt-4">
                            Explorar catálogo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {favorites.map((fav: any, idx: number) => (
                            <motion.div
                                key={fav.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col group"
                            >
                                <Link href={`/products/${fav.id}`} className="relative w-full aspect-[4/5] bg-[#E1CDBF]/20 overflow-hidden mb-4">
                                    {fav.images?.[0] && (
                                        <Image src={fav.images[0]} alt={fav.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    )}
                                    {fav.saleMode && (
                                        <div className="absolute top-3 right-3 bg-[#F0E5D8]/90 px-2 py-1 text-[9px] uppercase tracking-widest text-[#3A302A]">
                                            {fav.saleMode}
                                        </div>
                                    )}
                                </Link>
                                <Link href={`/products/${fav.id}`} className="font-serif text-lg text-[#3A302A] hover:text-[#8B6F5E] transition-colors truncate">
                                    {fav.name}
                                </Link>
                                <p className="font-sans text-sm text-[#5C4A3E] mt-1">{formatPrice(Number(fav.basePrice))}</p>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#3A302A]/10">
                                    <Link href={`/products/${fav.id}`}
                                        className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#3A302A] hover:text-[#8B6F5E] transition-colors border-b border-transparent hover:border-[#8B6F5E]">
                                        Ver producto
                                    </Link>
                                    <button
                                        onClick={() => removeFavorite(fav.id)}
                                        className="ml-auto text-[#3A302A]/30 hover:text-red-400 transition-colors"
                                        title="Quitar de favoritos"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
