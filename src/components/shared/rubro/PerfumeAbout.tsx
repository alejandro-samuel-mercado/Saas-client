"use client";

import { Button } from "@/components/ui/button";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, CheckCircle, Leaf, Lightbulb, Lock, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
    award: Award,
    users: Users,
    lightbulb: Lightbulb,
    leaf: Leaf,
    "shield-check": ShieldCheck,
    lock: Lock,
    "check-circle": CheckCircle,
};

export function PerfumeAbout() {
    const { data: config, isLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    // ── CRONOLOGÍA ──
    // Editable desde panel → Contenido → Página (Menú) → Cronología
    const timeline = config?.customPageChronology?.length
        ? config.customPageChronology
        : [
            { year: "1920", title: "Los Orígenes", desc: "Las primeras maisons de perfumería fundan los estándares del lujo olfativo." },
            { year: "1980", title: "La Revolución", desc: "Nuevas técnicas de síntesis permiten capturar aromas hasta entonces imposibles." },
            { year: "2000", title: "La Globalización", desc: "Las fragancias de nicho llegan al mundo entero gracias a la era digital." },
            { year: "2024", title: "Nuestra Tienda", desc: "Selección curada de las mejores fragancias del mundo, accesibles para vos." },
        ];

    // ── HERO ──
    // Título desde config.bannerImage[0].title o customPageTitle
    const heroTitle = config?.customPageTitle || "Maison des Parfums";
    const heroSubtitle = config?.customPageDescription || "La historia de nuestra pasión por el arte olfativo.";

    // ── FILOSOFÍA / VALORES ──
    // Editable desde panel → Contenido → Página (Menú) → Textos Extras
    // Formato esperado: línea 0 = título sección, líneas 1+ = "Título|Descripción" para cada valor
    // Textos de filosofía/valores: Panel → Página (Menú) → Textos Extra
    // customPageTexts es string[] — cada ítem es un textarea en el panel
    // Formato: ítem 0 = título sección, ítems 1+ = "TítuloValor|Descripción"
    const rawTexts: string[] = (config?.customPageTexts ?? []).filter(Boolean);
    const philosophyTitle = rawTexts[0] ?? "Nuestra Filosofía";
    const values = rawTexts.slice(1).map((line, i) => {
        const pipeIdx = line.indexOf("|");
        const title = pipeIdx >= 0 ? line.slice(0, pipeIdx).trim() : line.trim();
        const description = pipeIdx >= 0 ? line.slice(pipeIdx + 1).trim() : "";
        const iconKeys = Object.keys(ICON_MAP);
        return { title: title || `Valor ${i + 1}`, description, icon: iconKeys[i % iconKeys.length] };
    });

    const defaultValues = [
        { title: "Autenticidad", description: "Cada fragancia es 100% original, directamente importada de las maisons de origen.", icon: "shield-check" },
        { title: "Experiencia", description: "Asesores expertos para guiarte hacia la fragancia que mejor expresa tu personalidad.", icon: "users" },
        { title: "Exclusividad", description: "Acceso a ediciones limitadas y colecciones que no se encuentran en cualquier lugar.", icon: "award" },
        { title: "Sustentabilidad", description: "Comprometidos con prácticas de comercio justo y packaging responsable.", icon: "leaf" },
    ];

    const displayValues = values.length > 0 ? values : defaultValues;

    // ── IMAGEN ABOUT ──
    const aboutImage = config?.customPageImage || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=1920";

    if (isLoading) return <div className="min-h-screen bg-background animate-pulse" />;

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pb-40 relative overflow-hidden">

            {/* ── HERO ── */}
            {/* Título desde panel → Contenido → Página (Menú) → Título Principal */}
            {/* Subtítulo desde panel → Contenido → Página (Menú) → Descripción */}
            <section className="relative pt-40 pb-48 flex items-center justify-center overflow-hidden bg-card border-b border-primary/10">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-5"
                    style={{ backgroundImage: `url(${aboutImage})` }}
                />
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">
                        {config?.navItemName || "Nuestra Historia"}
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif mb-8 text-foreground">
                        {heroTitle}
                    </h1>
                    <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-light leading-relaxed">
                        {heroSubtitle}
                    </p>
                </div>
            </section>

            {/* ── CRONOLOGÍA ── */}
            {/* Editable desde panel → Contenido → Página (Menú) → Cronología */}
            <section className="py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-serif text-primary">El Legado</h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-primary/20 md:-ml-px" />
                        {timeline.map((item: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5 }}
                                    className={`flex flex-col md:flex-row gap-10 mb-20 relative ${isEven ? "md:flex-row-reverse" : ""}`}
                                >
                                    <div className={`flex-1 ${isEven ? "md:text-right" : "text-left"}`}>
                                        <div className="bg-card p-10 border border-primary/20 hover:border-primary/50 transition-colors relative overflow-hidden group">
                                            <span className="text-5xl font-serif text-primary block mb-4 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {item.year}
                                            </span>
                                            <h3 className="text-2xl font-bold mb-4 text-foreground relative z-10">
                                                {item.title}
                                            </h3>
                                            <p className="text-foreground/50 text-sm leading-relaxed relative z-10 font-light">
                                                {item.desc || item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-10 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 md:-ml-2 transform -translate-x-1/2 md:translate-x-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FILOSOFÍA Y VALORES ── */}
            {/* Editable desde panel → Contenido → Página (Menú) → Textos Extras */}
            {/* Formato: línea 1 = Título sección, líneas 2+ = "TítuloValor|Descripción" */}
            <section className="py-32 bg-card border-y border-primary/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Filosofía</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 text-foreground">
                            {philosophyTitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayValues.map((value: any, idx: number) => {
                            const Icon = ICON_MAP[value.icon] || Award;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                    className="bg-background p-10 border border-primary/10 hover:border-primary/40 transition-colors text-center group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border border-primary/30 rounded-full group-hover:bg-primary/10 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4 text-foreground">
                                        {value.title}
                                    </h3>
                                    <p className="text-foreground/40 text-sm font-light leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <div className="bg-card border border-primary/20 p-16 max-w-4xl mx-auto relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-5"
                            style={{ backgroundImage: `url(${aboutImage})` }}
                        />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-foreground">
                                Descubrí nuestra colección
                            </h2>
                            <p className="text-foreground/50 font-light mb-12">
                                Fragancias únicas para momentos únicos. Cada aroma cuenta una historia.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button size="lg" className="bg-primary hover:bg-foreground text-black font-bold tracking-widest uppercase text-[10px] h-14 px-10 transition-colors rounded-none" asChild>
                                    <Link href="/products">Ver Colección</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-bold tracking-widest uppercase text-[10px] h-14 px-10 transition-colors rounded-none bg-transparent" asChild>
                                    <Link href="/contact">Contactarnos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
