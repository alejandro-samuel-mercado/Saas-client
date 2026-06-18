"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { productService } from "@/services/products";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Droplets, Wind, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PerfumeHero } from "./PerfumeHero";

const FRAGRANCE_FAMILIES = [
    {
        name: "Clásicos",
        subtitle: "Atemporales",
        href: "/products?category=clasicos-perfumes",
        bg: "bg-[#1a1410]",
        accent: "border-[#d4af37]",
        textAccent: "text-[#d4af37]",
        icon: Star,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Orientales",
        subtitle: "Amaderados",
        href: "/products?category=orientales-amaderados",
        bg: "bg-[#0d0d0d]",
        accent: "border-[#8b6914]",
        textAccent: "text-[#c4933f]",
        icon: Sparkles,
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Florales",
        subtitle: "y Frescos",
        href: "/products?category=florales-frescos",
        bg: "bg-[#0f0a0a]",
        accent: "border-[#c4716e]",
        textAccent: "text-[#e8a0a0]",
        icon: Droplets,
        image: "https://images.unsplash.com/photo-1590156206657-aec4e6b68588?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Oud & Árabes",
        subtitle: "Intensos",
        href: "/products?category=arabes-oud",
        bg: "bg-[#0d0a05]",
        accent: "border-[#8b4513]",
        textAccent: "text-[#d2691e]",
        icon: Wind,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    },
];

export function PerfumeHome() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
    });

    const { data: trendingProducts, isLoading: isLoadingTrending } = useQuery({
        queryKey: ["products", "trending", "perfumes"],
        queryFn: () => productService.getProducts({ limit: 4, isTrending: "true" }),
    });

    const { data: newProducts, isLoading: isLoadingNew } = useQuery({
        queryKey: ["products", "new", "perfumes"],
        queryFn: () => productService.getProducts({ limit: 4, isNew: "true" }),
    });

    return (
        <main className="min-h-screen bg-[#171310] font-sans">

            {/* ── HERO ── */}
            <PerfumeHero />

            {/* ── MARQUEE ── */}
            <div className="bg-[#d4af37] py-4 overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex items-center mx-8">
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-black">Fragancias</span>
                            <span className="mx-6 text-black/30">◆</span>
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-black">Perfumes</span>
                            <span className="mx-6 text-black/30">◆</span>
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-black">100% Originales</span>
                            <span className="mx-6 text-black/30">◆</span>
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-black">Lujo Exclusivo</span>
                            <span className="mx-6 text-black/30">◆</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FAMILIAS OLFATIVAS ── */}
            <section className="py-24 bg-[#1e1a14]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="mb-16">
                        <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Explorar por Familia</span>
                        <h2 className="text-5xl md:text-6xl font-serif text-[#f9f1d8] leading-[1.0]">
                            Universos<br />
                            <span className="text-transparent" style={{ WebkitTextStroke: "1px #d4af37" }}>Olfativos</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {FRAGRANCE_FAMILIES.map((family) => {
                            const Icon = family.icon;
                            return (
                                <Link key={family.name} href={family.href}
                                    className={`group relative overflow-hidden border ${family.accent} aspect-[3/4] flex flex-col justify-end p-6 transition-all duration-700 hover:scale-[1.01]`}>
                                    <Image src={family.image} alt={family.name} fill className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="relative z-10">
                                        <Icon className={`h-6 w-6 ${family.textAccent} mb-3`} />
                                        <h3 className={`text-2xl font-serif ${family.textAccent} leading-tight`}>{family.name}</h3>
                                        <p className="text-white/50 text-xs tracking-widest uppercase">{family.subtitle}</p>
                                        <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40 group-hover:text-[#d4af37] transition-colors">
                                            Explorar <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FRAGANCIAS DESTACADAS ── */}
            <section className="py-24 bg-[#1a1614]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Alta Demanda</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#f9f1d8]">Más Buscadas</h2>
                        </div>
                        <Link href="/products?isTrending=true"
                            className="hidden md:flex items-center gap-2 border border-[#d4af37]/30 px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all">
                            Ver Todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingTrending
                            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-96 bg-[#2a2420] animate-pulse" />)
                            : trendingProducts?.data?.map((product) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))}
                    </div>
                </div>
            </section>

            {/* ── EDITORIAL SECTION ── */}
            <section className="py-32 bg-[#241d14] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-5" />
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Nuestra Filosofía</span>
                            <h2 className="text-6xl md:text-8xl font-serif text-[#f9f1d8] leading-[0.9] mb-10">
                                El Arte<br />
                                <span className="text-transparent" style={{ WebkitTextStroke: "1px #d4af37" }}>del Aroma</span>
                            </h2>
                            <p className="text-white/50 text-lg font-light leading-relaxed mb-10 max-w-lg">
                                Cada fragancia en nuestra colección ha sido cuidadosamente seleccionada de las maisons más reconocidas del mundo. Garantizamos autenticidad, calidad y la experiencia de portar una obra maestra olfativa.
                            </p>
                            <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
                                {[
                                    { num: "100%", label: "Original" },
                                    { num: "50+", label: "Marcas" },
                                    { num: "500+", label: "Referencias" },
                                ].map(({ num, label }) => (
                                    <div key={label}>
                                        <p className="text-3xl font-serif text-[#d4af37] mb-1">{num}</p>
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collage asimétrico */}
                        <div className="relative h-[600px] w-full hidden lg:block">
                            <div className="absolute top-0 right-0 w-3/4 h-[380px] border border-[#d4af37]/20 overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=900" alt="Fragancia" fill className="object-cover opacity-80" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-2/3 h-[300px] border-4 border-[#241d14] overflow-hidden z-10">
                                <Image src="https://images.unsplash.com/photo-1590156206657-aec4e6b68588?auto=format&fit=crop&q=80&w=900" alt="Perfume" fill className="object-cover opacity-80" />
                            </div>
                            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-20 w-36 h-36 bg-[#d4af37] flex items-center justify-center rounded-full">
                                <div className="text-center text-black">
                                    <Sparkles className="h-6 w-6 mx-auto mb-1" />
                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase block">Premium</span>
                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase block">Quality</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NOVEDADES ── */}
            <section className="py-24 bg-[#1a1614]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Recién Llegadas</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#f9f1d8]">Últimas Novedades</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingNew
                            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-96 bg-[#2a2420] animate-pulse" />)
                            : newProducts?.data?.map((product) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))}
                    </div>

                    <div className="mt-14 text-center">
                        <Link href="/products?isNew=true"
                            className="inline-flex items-center gap-3 border border-[#d4af37]/40 px-12 py-5 text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300">
                            Ver Todas las Novedades <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CONCENTRACIONES GUIDE ── */}
            <section className="py-24 bg-[#1e1a14] border-t border-[#d4af37]/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Guía del Experto</span>
                        <h2 className="text-4xl font-serif text-[#f9f1d8]">¿Qué concentración elegir?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { type: "EDT", full: "Eau de Toilette", duration: "4-6 hs", strength: "30%", desc: "Ligero y fresco, ideal para uso diario y clima cálido." },
                            { type: "EDP", full: "Eau de Parfum", duration: "8-10 hs", strength: "60%", desc: "Balance perfecto entre persistencia y sutileza. El más popular." },
                            { type: "PARFUM", full: "Extrait de Parfum", duration: "12+ hs", strength: "90%", desc: "La concentración más intensa. Una sola aplicación dura todo el día." },
                            { type: "EDC", full: "Eau de Cologne", duration: "2-3 hs", strength: "15%", desc: "Muy ligero y refrescante. Perfecto para el deporte y la cotidianidad." },
                        ].map((c) => (
                            <div key={c.type} className="border border-[#d4af37]/20 bg-[#2a2218] p-8 hover:border-[#d4af37]/50 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-serif text-[#d4af37]">{c.type}</span>
                                    <div className="h-12 w-px bg-[#d4af37]/20" />
                                    <span className="text-xs text-[#d4af37] text-right font-bold">{c.strength}<br />
                                        <span className="text-white/30 font-normal">persistencia</span>
                                    </span>
                                </div>
                                <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-3">{c.full}</p>
                                <p className="text-white/60 text-sm font-light leading-relaxed mb-4">{c.desc}</p>
                                <p className="text-[10px] text-[#d4af37] tracking-widest uppercase font-bold">Duración: {c.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section className="py-32 bg-[#d4af37]">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-black/50 font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Tu Firma Personal</span>
                    <h2 className="text-5xl md:text-7xl font-serif text-black leading-[0.9] mb-10">
                        Encuentra<br />tu Fragancia
                    </h2>
                    <p className="text-black/60 text-lg font-light mb-12 max-w-xl mx-auto">
                        Descubre la fragancia que te define. Nuestra colección está curada para cada personalidad y momento.
                    </p>
                    <Link href="/products"
                        className="inline-flex items-center gap-3 bg-black text-[#d4af37] px-16 py-6 font-bold tracking-[0.3em] uppercase text-xs hover:bg-[#1a1a1a] transition-colors">
                        Explorar Colección <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
