"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { productService } from "@/services/products";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Watch, Shield, Cpu, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Fallback estático si el negocio aún no creó categorías
const FALLBACK_CATEGORIES = [
    { name: "Lujo", slug: "relojes-lujo-watch", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800" },
    { name: "Sport", slug: "relojes-sport-watch", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800" },
    { name: "Smartwatch", slug: "smartwatch-watch", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=800" },
    { name: "Accesorios", slug: "accesorios-reloj-watch", image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800" },
];

const FEATURES = [
    { icon: Shield, label: "Autenticidad", desc: "Certificados originales" },
    { icon: Watch, label: "Movimientos", desc: "Mecánico, automático, cuarzo" },
    { icon: Cpu, label: "Smartwatch", desc: "Última tecnología" },
    { icon: Zap, label: "Garantía", desc: "Respaldo total" },
];

export function WatchHome() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
    });

    const { data: trendingProducts } = useQuery({
        queryKey: ["products", "trending", "relojes"],
        queryFn: () => productService.getProducts({ limit: 4, isTrending: "true" }),
    });

    const { data: newProducts } = useQuery({
        queryKey: ["products", "new", "relojes"],
        queryFn: () => productService.getProducts({ limit: 4, isNew: "true" }),
    });

    // Categorías reales del panel admin
    const [apiCategories, setApiCategories] = useState<any[]>([]);
    useEffect(() => {
        productService.getCategoriesTree().then((data: any[]) => {
            const filtered = data
                .filter((c: any) => c._count?.products > 0)
                .sort((a: any, b: any) => (b._count?.products || 0) - (a._count?.products || 0))
                .slice(0, 8);
            setApiCategories(filtered);
        }).catch(() => {});
    }, []);

    // Usa categorías reales si existen, sino el fallback visual
    const categories = apiCategories.length > 0 ? apiCategories : FALLBACK_CATEGORIES;

    // Hero — datos del panel: Contenido → Hero Carousel (primer slide)
    const getBannerSlides = () => {
        if (!config?.bannerImage) return [];
        if (Array.isArray(config.bannerImage) && config.bannerImage.length > 0) return config.bannerImage;
        if (typeof config.bannerImage === "string" && (config.bannerImage as string).trim())
            return [{ url: config.bannerImage, title: "", subtitle: "" }];
        return [];
    };
    const bannerSlides = getBannerSlides();
    const firstSlide = bannerSlides[0];
    const heroBgImage = firstSlide?.url || firstSlide?.image ||
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1920";
    const heroTitle = firstSlide?.title || "El Tiempo";
    const heroTitleLine2 = firstSlide?.titleLine2 || "es Arte.";
    const heroSubtitle = firstSlide?.subtitle ||
        "Colección curada de relojes y accesorios de las maisons más prestigiosas del mundo.";

    return (
        <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
            {/* HERO — imagen, título y texto editables desde panel → Contenido → Hero Carousel */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url('${heroBgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(#8a9ab5 1px, transparent 1px), linear-gradient(90deg, #8a9ab5 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/8 rounded-full hidden lg:block" />
                <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-primary/6 rounded-full hidden lg:block" />

                <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-12 bg-primary/50" />
                            <span className="text-primary font-mono text-[10px] tracking-[0.4em] uppercase">{config?.storeName || "Alta Relojería"}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-light text-foreground leading-none mb-8">
                            {heroTitle}<br /><span className="text-primary">{heroTitleLine2}</span>
                        </h1>
                        <p className="text-primary/60 text-lg font-mono font-light leading-relaxed max-w-xl mb-12">
                            {heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/products" className="flex items-center gap-3 bg-primary text-background px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-foreground transition-colors group">
                                Ver Colección <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="flex items-center gap-3 border border-primary/30 text-primary px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-primary/10 hover:border-primary/60 transition-colors">
                                Consultar
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent" />
                    <span className="text-primary/30 text-[8px] tracking-[0.4em] uppercase font-mono">Scroll</span>
                </div>
            </section>

            {/* FEATURES */}
            <section className="border-y border-primary/10 bg-background">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary/10">
                        {FEATURES.map((feat, i) => (
                            <div key={i} className="flex flex-col items-center py-10 px-6 text-center gap-3">
                                <feat.icon className="h-5 w-5 text-primary" />
                                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground">{feat.label}</p>
                                <p className="text-[11px] text-primary/50">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px flex-1 bg-primary/10" />
                        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-primary">Categorías</h2>
                        <div className="h-px flex-1 bg-primary/10" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat: any, i: number) => {
                            const href = cat.slug ? `/products?categoria=${cat.slug}` : `/products?category=${cat.slug}`;
                            const imgSrc = cat.image ||
                                `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800&sig=${i}`;
                            return (
                                <Link key={cat.id || i} href={href} className="group relative aspect-[3/4] overflow-hidden border border-primary/10 hover:border-primary/40 transition-colors">
                                    <Image src={imgSrc} alt={cat.name} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        {cat._count?.products && (
                                            <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-primary mb-1">{cat._count.products} productos</p>
                                        )}
                                        <h3 className="text-xl font-serif text-foreground group-hover:text-white transition-colors">{cat.name}</h3>
                                        <div className="mt-3 h-px w-0 group-hover:w-full bg-primary transition-all duration-500" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TRENDING */}
            {(trendingProducts as any)?.products?.length > 0 && (
                <section className="py-24 bg-background border-t border-primary/10">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[9px] font-mono tracking-[0.5em] uppercase text-primary mb-3">Más Buscados</p>
                                <h2 className="text-3xl md:text-4xl font-serif text-foreground">Trending</h2>
                            </div>
                            <Link href="/products?isTrending=true" className="flex items-center gap-2 text-primary hover:text-foreground text-[10px] font-mono tracking-[0.3em] uppercase transition-colors group">
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
                <section className="py-24 border-t border-primary/10">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <p className="text-[9px] font-mono tracking-[0.5em] uppercase text-primary mb-3">Recién Llegados</p>
                                <h2 className="text-3xl md:text-4xl font-serif text-foreground">Novedades</h2>
                            </div>
                            <Link href="/products?isNew=true" className="flex items-center gap-2 text-primary hover:text-foreground text-[10px] font-mono tracking-[0.3em] uppercase transition-colors group">
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
        </main>
    );
}
