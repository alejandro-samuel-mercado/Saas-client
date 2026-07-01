"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { productService } from "@/services/products";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Droplets, Wind, Star, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PerfumeHero } from "./PerfumeHero";
import { useMemo } from "react";

const CATEGORY_ICONS = [Star, Sparkles, Droplets, Wind];
const BADGE_ICONS: Record<string, any> = {
    sparkles: Sparkles, wind: Wind, droplets: Droplets, package: Package,
};

// ── Defaults (se muestran cuando el panel no tiene configuración) ──────────────
const DEFAULT_BADGES = [
    { icon: "sparkles", title: "100% Originales", sub: "Garantía de autenticidad" },
    { icon: "wind",     title: "Larga Duración",  sub: "Esencias persistentes" },
    { icon: "droplets", title: "Muestras Gratis", sub: "En todas las compras" },
    { icon: "package",  title: "Envío Premium",   sub: "Packaging de lujo" },
];
const DEFAULT_GUIDE = [
    { type: "EDT",    full: "Eau de Toilette",   duration: "4-6 hs",   strength: "30%", desc: "Ligero y fresco, ideal para uso diario y clima cálido." },
    { type: "EDP",    full: "Eau de Parfum",     duration: "8-10 hs",  strength: "60%", desc: "Balance perfecto entre persistencia y sutileza. El más popular." },
    { type: "PARFUM", full: "Extrait de Parfum", duration: "12+ hs",   strength: "90%", desc: "La concentración más intensa. Una sola aplicación dura todo el día." },
    { type: "EDC",    full: "Eau de Cologne",    duration: "2-3 hs",   strength: "15%", desc: "Muy ligero y refrescante. Perfecto para el deporte y la cotidianidad." },
];
const DEFAULT_STATS = [
    { num: "100%", label: "Original" },
    { num: "50+",  label: "Marcas" },
    { num: "500+", label: "Referencias" },
];
const DEFAULT_MARQUEE = ["Fragancias", "100% Originales", "Envío Premium", "Lujo Exclusivo"];

export function PerfumeHome() {
    // ── DATA FETCHING ─────────────────────────────────────────────────────────
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    const { data: apiCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => productService.getCategoriesTree(),
        staleTime: 1000 * 60 * 60,
    });

    const { data: trendingProducts, isLoading: isLoadingTrending } = useQuery({
        queryKey: ["products", "trending", "perfumes"],
        queryFn: () => productService.getProducts({ limit: 4, isTrending: "true" }),
    });

    const { data: newProducts, isLoading: isLoadingNew } = useQuery({
        queryKey: ["products", "new", "perfumes"],
        queryFn: () => productService.getProducts({ limit: 4, isNew: "true" }),
    });

    // ── DERIVED DATA (todos los campos del PublicConfig ya tienen tipos correctos) ──

    // Categorías → reales del tenant desde la API
    const fragranceFamilies = useMemo(() => {
        return ((apiCategories as any[]) || [])
            .filter((c) => c._count?.products > 0)
            .slice(0, 4)
            .map((cat, i) => ({
                name: cat.name,
                subtitle: cat.description || "",
                href: cat.slug ? `/products?categoria=${cat.slug}` : "/products",
                icon: CATEGORY_ICONS[i % CATEGORY_ICONS.length],
                image: cat.image || "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=800",
            }));
    }, [apiCategories]);

    // Marquee → Panel: Identidad Visual → Marquee Text
    // PublicConfig.marqueeText es string[] — directo, sin split
    const marqueeItems: string[] = (config?.marqueeText ?? []).filter(Boolean).length > 0
        ? (config!.marqueeText as string[]).filter(Boolean)
        : DEFAULT_MARQUEE;

    // Filosofía (editorial) → Panel: Página (Menú) → Textos Extra (string[])
    // Primer ítem = título de la sección; el resto = párrafos del cuerpo
    const customTexts: string[] = (config?.customPageTexts ?? []).filter(Boolean);
    const philosophyTitle = customTexts[0] ?? null;
    const philosophyBody  = customTexts.slice(1).join(" ") || null;

    // Stats → Panel: Página (Menú) → Título de sección de Textos (campo customPageTextsSubtitle)
    // Formato esperado: "100%|Original,50+|Marcas,500+|Referencias"
    const statsRaw: string = config?.customPageTextsSubtitle ?? "";
    const stats = statsRaw
        ? statsRaw.split(",").map((s) => {
            const [num, label] = s.split("|");
            return { num: num?.trim() ?? "", label: label?.trim() ?? "" };
        }).filter((s) => s.num && s.label)
        : DEFAULT_STATS;

    // Imágenes del collage editorial → Panel: Página (Menú) → Imágenes Adicionales (string[])
    const editorialImages: string[] = (config?.customPageImages ?? []).filter(Boolean);

    // Imagen de fondo filosofía → Panel: Página (Menú) → Imagen Principal
    const philosophyBg = config?.customPageImage ?? null;

    // Título y descripción del CTA final → Panel: Página (Menú) → Título Principal / Descripción
    const ctaTitle = config?.customPageTitle ?? null;
    const ctaDesc  = config?.customPageDescription ?? null;

    // Feature badges y Guía del Experto: sin campo panel dedicado → siempre defaults
    const featureBadges = DEFAULT_BADGES;
    const guideItems    = DEFAULT_GUIDE;

    // ── RENDER ────────────────────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-background font-sans">

            {/* ── HERO ── */}
            {/* Imagen, Título y Subtítulo: Panel → Hero Carousel */}
            <PerfumeHero />

            {/* ── FEATURE BADGES ── */}
            {/* Contenido fijo (estructura compleja sin campo panel dedicado) */}
            <div className="bg-background border-t border-b border-primary/10 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {featureBadges.map((badge, idx) => {
                            const Icon = BADGE_ICONS[badge.icon] ?? Sparkles;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 mb-4 rounded-full border border-primary/30 flex items-center justify-center bg-card transition-transform duration-500 group-hover:rotate-180 group-hover:bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary transition-transform duration-500 group-hover:-rotate-180" />
                                    </div>
                                    <h3 className="font-serif text-foreground text-sm tracking-widest uppercase mb-1">{badge.title}</h3>
                                    <p className="text-xs text-foreground/40 italic">{badge.sub}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── MARQUEE ── */}
            {/* Editable: Panel → Identidad Visual → Marquee Text */}
            <div className="bg-primary py-4 overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center mx-8">
                            {marqueeItems.map((text, j) => (
                                <span key={j} className="flex items-center">
                                    <span className="text-sm font-black tracking-[0.3em] uppercase text-black">{text}</span>
                                    <span className="mx-6 text-black/30">◆</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CATEGORÍAS / FAMILIAS ── */}
            {/* 100% reales — se crean desde Panel → Catálogo → Categorías */}
            {fragranceFamilies.length > 0 && (
                <section className="py-24 bg-card">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {fragranceFamilies.map((family) => {
                                const Icon = family.icon;
                                return (
                                    <Link
                                        key={family.name}
                                        href={family.href}
                                        className="group relative overflow-hidden border border-primary/30 aspect-[3/4] flex flex-col justify-end p-6 transition-all duration-700 hover:scale-[1.01] hover:border-primary/60"
                                    >
                                        <Image src={family.image} alt={family.name} fill className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                        <div className="relative z-10">
                                            <Icon className="h-6 w-6 text-primary mb-3" />
                                            <h3 className="text-2xl font-serif text-primary leading-tight">{family.name}</h3>
                                            {family.subtitle && <p className="text-white/50 text-xs tracking-widest uppercase">{family.subtitle}</p>}
                                            <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40 group-hover:text-primary transition-colors">
                                                Explorar <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── MÁS BUSCADAS ── */}
            {/* Filtro REAL: se activa marcando "Destacado" en cada producto del panel */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Alta Demanda</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-foreground">Más Buscadas</h2>
                        </div>
                        <Link href="/products?isTrending=true"
                            className="hidden md:flex items-center gap-2 border border-primary/30 px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-black transition-all">
                            Ver Todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingTrending
                            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-96 bg-card animate-pulse" />)
                            : trendingProducts?.data?.length
                                ? trendingProducts.data.map((product) => (
                                    <ProductCardRouter key={product.id} product={product} />
                                ))
                                : <p className="col-span-4 text-center text-foreground/40 py-16 italic">Marcá productos como "Destacados" desde el panel para mostrarlos aquí.</p>
                        }
                    </div>
                </div>
            </section>

            {/* ── FILOSOFÍA / EDITORIAL ── */}
            {/* Editable: Panel → Página (Menú): */}
            {/*   Textos Extra → ítems (1er ítem = título, resto = cuerpo) */}
            {/*   Título de sección Textos → stats en formato "100%|Original,50+|Marcas" */}
            {/*   Imagen Principal → fondo */}
            {/*   Imágenes Adicionales → fotos del collage */}
            <section className="py-32 bg-card relative overflow-hidden">
                {philosophyBg && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-5"
                        style={{ backgroundImage: `url(${philosophyBg})` }}
                    />
                )}
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Nuestra Filosofía</span>
                            <h2 className="text-6xl md:text-8xl font-serif text-foreground leading-[0.9] mb-10">
                                {philosophyTitle
                                    ? philosophyTitle
                                    : <><span>El Arte</span><br /><span className="text-transparent" style={{ WebkitTextStroke: "1px hsl(var(--primary))" }}>del Aroma</span></>
                                }
                            </h2>
                            <p className="text-foreground/50 text-lg font-light leading-relaxed mb-10 max-w-lg">
                                {philosophyBody ?? "Cada fragancia en nuestra colección ha sido cuidadosamente seleccionada de las maisons más reconocidas del mundo. Garantizamos autenticidad, calidad y la experiencia de portar una obra maestra olfativa."}
                            </p>
                            <div className="grid grid-cols-3 gap-8 border-t border-foreground/10 pt-10">
                                {stats.map(({ num, label }) => (
                                    <div key={label}>
                                        <p className="text-3xl font-serif text-primary mb-1">{num}</p>
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative h-[600px] w-full hidden lg:block">
                            <div className="absolute top-0 right-0 w-3/4 h-[380px] border border-primary/20 overflow-hidden">
                                <Image
                                    src={editorialImages[0] ?? "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=900"}
                                    alt="Fragancia"
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-2/3 h-[300px] border-4 border-card overflow-hidden z-10">
                                <Image
                                    src={editorialImages[1] ?? "https://images.unsplash.com/photo-1590156206657-aec4e6b68588?auto=format&fit=crop&q=80&w=900"}
                                    alt="Perfume"
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-20 w-36 h-36 bg-primary flex items-center justify-center rounded-full">
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

            {/* ── ÚLTIMAS NOVEDADES ── */}
            {/* Filtro REAL: se activa marcando "Novedad" en cada producto del panel */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Recién Llegadas</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground">Últimas Novedades</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingNew
                            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-96 bg-card animate-pulse" />)
                            : newProducts?.data?.length
                                ? newProducts.data.map((product) => (
                                    <ProductCardRouter key={product.id} product={product} />
                                ))
                                : <p className="col-span-4 text-center text-foreground/40 py-16 italic">Marcá productos como "Novedad" desde el panel para mostrarlos aquí.</p>
                        }
                    </div>
                    <div className="mt-14 text-center">
                        <Link href="/products?isNew=true"
                            className="inline-flex items-center gap-3 border border-primary/40 px-12 py-5 text-[10px] font-bold tracking-[0.3em] uppercase text-primary hover:bg-primary hover:text-black transition-all duration-300">
                            Ver Todas las Novedades <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── GUÍA DEL EXPERTO ── */}
            {/* Contenido fijo educativo — no requiere edición frecuente */}
            <section className="py-24 bg-card border-t border-primary/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Guía del Experto</span>
                        <h2 className="text-4xl font-serif text-foreground">¿Qué concentración elegir?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {guideItems.map((c, i) => (
                            <div key={i} className="border border-primary/20 bg-background p-8 hover:border-primary/50 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-serif text-primary">{c.type}</span>
                                    <div className="h-12 w-px bg-primary/20" />
                                    <span className="text-xs text-primary text-right font-bold">
                                        {c.strength}<br />
                                        <span className="text-foreground/30 font-normal">persistencia</span>
                                    </span>
                                </div>
                                <p className="text-foreground/30 text-[10px] tracking-[0.2em] uppercase mb-3">{c.full}</p>
                                <p className="text-foreground/60 text-sm font-light leading-relaxed mb-4">{c.desc}</p>
                                <p className="text-[10px] text-primary tracking-widest uppercase font-bold">Duración: {c.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            {/* Editable: Panel → Página (Menú) → Título Principal y Descripción */}
            <section className="py-32 bg-primary">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-black/50 font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Tu Firma Personal</span>
                    <h2 className="text-5xl md:text-7xl font-serif text-black leading-[0.9] mb-10">
                        {ctaTitle ?? <><span>Encuentra</span><br /><span>tu Fragancia</span></>}
                    </h2>
                    <p className="text-black/60 text-lg font-light mb-12 max-w-xl mx-auto">
                        {ctaDesc ?? "Descubre la fragancia que te define. Nuestra colección está curada para cada personalidad y momento."}
                    </p>
                    <Link href="/products"
                        className="inline-flex items-center gap-3 bg-black text-primary px-16 py-6 font-bold tracking-[0.3em] uppercase text-xs hover:bg-black/80 transition-colors">
                        Explorar Colección <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

        </main>
    );
}
