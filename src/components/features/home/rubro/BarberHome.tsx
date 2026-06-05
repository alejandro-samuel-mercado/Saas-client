"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { Scissors, Sparkles, Droplet, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_SERVICES = [
    { title: "Corte Clásico", icon: <Scissors className="w-8 h-8" />, desc: "Estilo atemporal y preciso" },
    { title: "Afeitado Premium", icon: <Sparkles className="w-8 h-8" />, desc: "Navaja tradicional y toalla caliente" },
    { title: "Arreglo de Barba", icon: <Star className="w-8 h-8" />, desc: "Perfilado y tratamiento" },
    { title: "Cuidado Capilar", icon: <Droplet className="w-8 h-8" />, desc: "Lavado y masajes revitalizantes" }
];

export function BarberHome() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { data: productsData } = useQuery({
        queryKey: ["products", "featured", "barberias"],
        queryFn: () => productService.getProducts({ limit: 8 }),
        staleTime: 1000 * 60 * 5,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories", "barberias"],
        queryFn: () => productService.getCategories(config?.rubro?.slug || "barberias"),
        enabled: !!config?.rubro?.slug,
        staleTime: 1000 * 60 * 5,
    });

    const products = (productsData as any)?.data || [];
    const categories = (categoriesData as any) || [];

    // Services: use customPageTexts from backend or fallback to defaults
    const services = config?.customPageTexts?.length
        ? config.customPageTexts.slice(0, 4).map((text, i) => ({
              title: text,
              icon: DEFAULT_SERVICES[i % DEFAULT_SERVICES.length].icon,
              desc: "",
          }))
        : DEFAULT_SERVICES;

    return (
        <div className="min-h-screen bg-[#111] text-[#f4f4f4] font-sans">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* HERO */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-4 lg:px-8 overflow-hidden z-10">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent z-10" />
                    <img
                        src={config?.adImage || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"}
                        alt={config?.storeName || "Barbería"}
                        className="w-full h-full object-cover object-right opacity-40 grayscale"
                    />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-20">
                    <div className="max-w-2xl">
                        {config?.marqueeText?.length ? (
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-[#e65c00]/30 text-[#e65c00] text-xs font-bold tracking-[0.2em] uppercase mb-8">
                                <span className="w-2 h-2 rounded-full bg-[#e65c00] animate-pulse" />
                                {config.marqueeText[0]}
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-[#e65c00]/30 text-[#e65c00] text-xs font-bold tracking-[0.2em] uppercase mb-8">
                                <span className="w-2 h-2 rounded-full bg-[#e65c00] animate-pulse" />
                                Barbería Profesional
                            </div>
                        )}
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-white drop-shadow-xl">
                            {config?.adText || (
                                <>{config?.storeName || "Tradición &"} <br /></>
                            )}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e65c00] to-[#ff8c33]">Estilo.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-lg">
                            {config?.customPageDescription || "Elevando el estándar del cuidado masculino con técnicas clásicas y productos de lujo."}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/products" className="group flex items-center gap-3 bg-[#e65c00] text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                                Ver Catálogo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {config?.contactPhone && (
                                <Link href="/contact" className="group flex items-center gap-3 bg-transparent border border-[#333] text-white px-8 py-4 font-bold uppercase tracking-wider hover:border-[#e65c00] hover:text-[#e65c00] transition-all">
                                    Consultar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* MARQUEE */}
            {config?.marqueeText?.length ? (
                <div className="w-full bg-[#e65c00] py-3 overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {Array(8).fill(null).map((_, i) => (
                            <span key={i} className="inline-flex items-center gap-6 mx-6 text-black text-xs font-bold tracking-[0.3em] uppercase">
                                {config.marqueeText.map((item, idx) => (
                                    <span key={idx}>{item} <span className="mx-3 opacity-40">◆</span></span>
                                ))}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* SERVICES */}
            <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase mb-3">
                                {config?.customPageTextsSubtitle || "Servicios Exclusivos"}
                            </h2>
                            <p className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                                {config?.customPageTitle || "Grooming Masculino"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-[#1A1A1A] p-8 group hover:bg-[#e65c00] transition-colors duration-500 relative overflow-hidden border border-[#222]">
                                <div className="text-[#e65c00] group-hover:text-white transition-colors mb-6">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-4">{service.title}</h3>
                                {service.desc && <p className="text-gray-400 group-hover:text-white/80 transition-colors">{service.desc}</p>}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#222] group-hover:bg-white/10 -rotate-45 translate-x-8 -translate-y-8 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES — from API */}
            {categories.length > 0 && (
                <section className="py-24 px-4 lg:px-8 relative z-10 border-t border-[#222]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-6 mb-16">
                            <div className="h-px flex-1 bg-[#333]" />
                            <h2 className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase">Categorías</h2>
                            <div className="h-px flex-1 bg-[#333]" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.slice(0, 4).map((cat: any, i: number) => (
                                <Link key={cat.id || i} href={`/products?category=${cat.slug}`}
                                    className="group relative aspect-square overflow-hidden border border-[#333] hover:border-[#e65c00] transition-colors">
                                    {cat.imageUrl ? (
                                        <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#1a1a1a]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-xl font-black text-white uppercase">{cat.name}</h3>
                                        {cat.productsCount && <p className="text-[#e65c00] text-xs mt-1">{cat.productsCount} productos</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PRODUCTS */}
            {products.length > 0 && (
                <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10 border-t border-[#222]">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <p className="text-[#e65c00] text-sm font-bold tracking-[0.2em] uppercase mb-3">Catálogo</p>
                                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Productos Destacados</h2>
                            </div>
                            <Link href="/products" className="text-gray-400 hover:text-[#e65c00] flex items-center gap-2 uppercase tracking-wider text-sm font-bold transition-colors">
                                Ver Todos <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.slice(0, 8).map((product: any) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 px-4 lg:px-8 bg-[#161616] relative z-10 border-t border-[#222]">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-16 h-1 bg-[#e65c00] mx-auto mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                            {config?.storeName || "Tu Barbería de Confianza"}
                        </h2>
                        {config?.customPageDescription && (
                            <p className="text-gray-400 text-lg mb-10">{config.customPageDescription}</p>
                        )}
                        <Link href="/products" className="inline-flex items-center gap-3 bg-[#e65c00] text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                            Explorar Tienda <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
