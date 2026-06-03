"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { productService } from "@/services/products";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Watch, Shield, Cpu, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WATCH_CATEGORIES = [
    { name: "Lujo", subtitle: "Alta Relojería", href: "/products?category=relojes-lujo", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800" },
    { name: "Sport", subtitle: "Performance", href: "/products?category=relojes-sport", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800" },
    { name: "Smartwatch", subtitle: "Tecnología", href: "/products?category=smartwatch", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=800" },
    { name: "Accesorios", subtitle: "Mallas & Más", href: "/products?category=accesorios-reloj", image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800" },
];

const FEATURES = [
    { icon: Shield, label: "Autenticidad", desc: "Certificados originales" },
    { icon: Watch, label: "Movimientos", desc: "Mecánico, automático, cuarzo" },
    { icon: Cpu, label: "Smartwatch", desc: "Última tecnología" },
    { icon: Zap, label: "Garantía", desc: "Respaldo total" },
];

export function WatchHome() {
    const { data: trendingProducts } = useQuery({
        queryKey: ["products", "trending", "relojes"],
        queryFn: () => productService.getProducts({ limit: 4, isTrending: "true" }),
    });

    const { data: newProducts } = useQuery({
        queryKey: ["products", "new", "relojes"],
        queryFn: () => productService.getProducts({ limit: 4, isNew: "true" }),
    });

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
    });

    return (
        <main className="min-h-screen bg-[#0a0d11] text-[#c0cfe0] font-sans overflow-hidden">
            {/* HERO */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d11] via-[#0a0d11]/80 to-[#0a0d11]" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(#8a9ab5 1px, transparent 1px), linear-gradient(90deg, #8a9ab5 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#8a9ab5]/8 rounded-full hidden lg:block" />
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#8a9ab5]/6 rounded-full hidden lg:block" />

                <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-12 bg-[#8a9ab5]/50" />
                            <span className="text-[#8a9ab5] font-mono text-[10px] tracking-[0.4em] uppercase">{config?.storeName || "Alta Relojería"}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-light text-[#c0cfe0] leading-none mb-8">
                            El Tiempo<br /><span className="text-[#8a9ab5]">es Arte.</span>
                        </h1>
                        <p className="text-[#8a9ab5]/60 text-lg font-mono font-light leading-relaxed max-w-xl mb-12">
                            Colección curada de relojes y accesorios de las maisons más prestigiosas del mundo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/products" className="flex items-center gap-3 bg-[#8a9ab5] text-[#0a0d11] px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[#c0cfe0] transition-colors group">
                                Ver Colección <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="flex items-center gap-3 border border-[#8a9ab5]/30 text-[#8a9ab5] px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#8a9ab5]/10 hover:border-[#8a9ab5]/60 transition-colors">
                                Consultar
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-px h-16 bg-gradient-to-b from-[#8a9ab5]/40 to-transparent" />
                    <span className="text-[#8a9ab5]/30 text-[8px] tracking-[0.4em] uppercase font-mono">Scroll</span>
                </div>
            </section>

            {/* FEATURES */}
            <section className="border-y border-[#8a9ab5]/10 bg-[#080b0f]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#8a9ab5]/10">
                        {FEATURES.map((feat, i) => (
                            <div key={i} className="flex flex-col items-center py-10 px-6 text-center gap-3">
                                <feat.icon className="h-5 w-5 text-[#8a9ab5]" />
                                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#c0cfe0]">{feat.label}</p>
                                <p className="text-[11px] text-[#8a9ab5]/50">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px flex-1 bg-[#8a9ab5]/10" />
                        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#8a9ab5]">Categorías</h2>
                        <div className="h-px flex-1 bg-[#8a9ab5]/10" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {WATCH_CATEGORIES.map((cat, i) => (
                            <Link key={i} href={cat.href} className="group relative aspect-[3/4] overflow-hidden border border-[#8a9ab5]/10 hover:border-[#8a9ab5]/40 transition-colors">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d11] via-[#0a0d11]/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#8a9ab5] mb-1">{cat.subtitle}</p>
                                    <h3 className="text-xl font-serif text-[#c0cfe0] group-hover:text-white transition-colors">{cat.name}</h3>
                                    <div className="mt-3 h-px w-0 group-hover:w-full bg-[#8a9ab5] transition-all duration-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRENDING */}
            {(trendingProducts as any)?.products?.length > 0 && (
                <section className="py-24 bg-[#080b0f] border-t border-[#8a9ab5]/10">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[9px] font-mono tracking-[0.5em] uppercase text-[#8a9ab5] mb-3">Más Buscados</p>
                                <h2 className="text-3xl md:text-4xl font-serif text-[#c0cfe0]">Trending</h2>
                            </div>
                            <Link href="/products?isTrending=true" className="flex items-center gap-2 text-[#8a9ab5] hover:text-[#c0cfe0] text-[10px] font-mono tracking-[0.3em] uppercase transition-colors group">
                                Ver todos <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {((trendingProducts as any)?.products || []).map((product: any) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* NEW */}
            {(newProducts as any)?.products?.length > 0 && (
                <section className="py-24 border-t border-[#8a9ab5]/10">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[9px] font-mono tracking-[0.5em] uppercase text-[#8a9ab5] mb-3">Recién Llegados</p>
                                <h2 className="text-3xl md:text-4xl font-serif text-[#c0cfe0]">Novedades</h2>
                            </div>
                            <Link href="/products?isNew=true" className="flex items-center gap-2 text-[#8a9ab5] hover:text-[#c0cfe0] text-[10px] font-mono tracking-[0.3em] uppercase transition-colors group">
                                Ver todos <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {((newProducts as any)?.products || []).map((product: any) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 bg-[#080b0f] border-t border-[#8a9ab5]/10">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <div className="h-px w-16 bg-[#8a9ab5]/40 mx-auto mb-12" />
                    <h2 className="text-4xl md:text-5xl font-serif text-[#c0cfe0] mb-6">Encontrá tu pieza</h2>
                    <p className="text-[#8a9ab5]/50 font-mono text-sm mb-12 leading-relaxed">
                        Cada reloj cuenta una historia. Dejanos ayudarte a encontrar la que será tuya.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-3 border border-[#8a9ab5]/40 text-[#8a9ab5] px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#8a9ab5]/10 hover:border-[#8a9ab5]/70 transition-colors">
                        Consultar Ahora <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
