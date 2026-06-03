"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { Scissors, Sparkles, Droplet, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BARBER_CATEGORIES = [
    { name: "Máquinas", subtitle: "Corte Preciso", href: "/products?category=maquinas", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800" },
    { name: "Cuidado de Barba", subtitle: "Nutrición & Estilo", href: "/products?category=cuidado-barba", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800" },
    { name: "Pomadas", subtitle: "Fijación Fuerte", href: "/products?category=pomadas", image: "https://images.unsplash.com/photo-1593702295071-553ce11bb5cb?auto=format&fit=crop&q=80&w=800" },
    { name: "Accesorios", subtitle: "Herramientas", href: "/products?category=accesorios", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800" },
];

export function BarberHome() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
    });

    const { data: trendingProducts } = useQuery({
        queryKey: ["products", "trending", "barberias"],
        queryFn: () => productService.getProducts({ isTrending: "true", limit: 4 }),
    });

    const { data: newProducts } = useQuery({
        queryKey: ["products", "new", "barberias"],
        queryFn: () => productService.getProducts({ isNew: "true", limit: 4 }),
    });

    const services = [
        { title: "Corte Clásico", icon: <Scissors className="w-8 h-8" />, desc: "Estilo atemporal y preciso" },
        { title: "Afeitado Premium", icon: <Sparkles className="w-8 h-8" />, desc: "Navaja tradicional y toalla caliente" },
        { title: "Arreglo de Barba", icon: <Star className="w-8 h-8" />, desc: "Perfilado y tratamiento" },
        { title: "Cuidado Capilar", icon: <Droplet className="w-8 h-8" />, desc: "Lavado y masajes revitalizantes" }
    ];

    return (
        <div className="min-h-screen bg-[#111] text-[#f4f4f4] font-sans selection:bg-[#e65c00] selection:text-white">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-4 lg:px-8 overflow-hidden z-10">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent z-10" />
                    <img
                        src={(config as any)?.adImage || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"}
                        alt="Barber"
                        className="w-full h-full object-cover object-right opacity-40 grayscale"
                    />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-[#e65c00]/30 text-[#e65c00] text-xs font-bold tracking-[0.2em] uppercase mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#e65c00] animate-pulse" />

                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-white drop-shadow-xl">
                            {(config as any)?.adTitle || "Tradición &"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e65c00] to-[#ff8c33]">Estilo.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-lg">
                            {(config as any)?.adText || "Elevando el estándar del cuidado masculino con técnicas clásicas y productos de lujo."}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/products" className="group flex items-center gap-3 bg-[#e65c00] text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                                Ver Catálogo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="group flex items-center gap-3 bg-transparent border border-[#333] text-white px-8 py-4 font-bold uppercase tracking-wider hover:border-[#e65c00] hover:text-[#e65c00] transition-all">
                                Consultar
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES / FEATURES */}
            <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase mb-3">Servicios Exclusivos</h2>
                            <p className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                                Grooming <br className="hidden md:block" /> Masculino
                            </p>
                        </div>
                        <Link href="/products?category=servicios" className="text-gray-400 hover:text-[#e65c00] flex items-center gap-2 uppercase tracking-wider text-sm font-bold transition-colors">
                            Ver Menú Completo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-[#1A1A1A] p-8 group hover:bg-[#e65c00] transition-colors duration-500 relative overflow-hidden border border-[#222]">
                                <div className="text-[#e65c00] group-hover:text-white transition-colors mb-6">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-white/80 transition-colors">
                                    {service.desc}
                                </p>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#222] group-hover:bg-white/10 -rotate-45 translate-x-8 -translate-y-8 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section className="py-24 px-4 lg:px-8 relative z-10 border-t border-[#222]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px flex-1 bg-[#333]" />
                        <h2 className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase">Categorías Destacadas</h2>
                        <div className="h-px flex-1 bg-[#333]" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {BARBER_CATEGORIES.map((cat, i) => (
                            <Link key={i} href={cat.href} className="group relative aspect-square overflow-hidden border border-[#333] hover:border-[#e65c00] transition-colors">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#e65c00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#111]/90 backdrop-blur-sm">
                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#e65c00] mb-1">{cat.subtitle}</p>
                                    <h3 className="text-xl font-black text-white uppercase">{cat.name}</h3>
                                </div>
                                {/* Persistent Title when not hovered */}
                                <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity duration-300">
                                    <h3 className="text-xl font-black text-white uppercase">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRENDING PRODUCTS */}
            {(trendingProducts as any)?.products?.length > 0 && (
                <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10 border-t border-[#222]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <p className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase mb-3">Arsenal del Caballero</p>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Más Buscados</h2>
                            </div>
                            <Link href="/products?isTrending=true" className="text-gray-400 hover:text-[#e65c00] flex items-center gap-2 uppercase tracking-wider text-sm font-bold transition-colors">
                                Ver Todos <ArrowRight className="h-4 w-4" />
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

            {/* NEW PRODUCTS */}
            {(newProducts as any)?.products?.length > 0 && (
                <section className="py-24 px-4 lg:px-8 relative z-10 border-t border-[#222]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <p className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase mb-3">Recién Llegados</p>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Novedades</h2>
                            </div>
                            <Link href="/products?isNew=true" className="text-gray-400 hover:text-[#e65c00] flex items-center gap-2 uppercase tracking-wider text-sm font-bold transition-colors">
                                Ver Todos <ArrowRight className="h-4 w-4" />
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

            {/* CTA / GALLERY SECTION */}
            <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10 border-t border-[#222]" id="gallery">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-16 h-1 bg-[#e65c00] mx-auto mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">Encuentra Tu Estilo</h2>
                        <p className="text-gray-400 text-lg mb-10">
                            Equípate con las mejores herramientas y productos del mercado.
                            Garantizamos la máxima calidad para profesionales y entusiastas.
                        </p>
                        <Link href="/products" className="inline-flex items-center gap-3 bg-[#e65c00] text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                            Explorar Tienda <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
