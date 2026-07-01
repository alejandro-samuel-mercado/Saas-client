"use client";

import { motion } from "framer-motion";
import { PawPrint, Heart, Shield, Leaf, Truck, Users, Award, Clock } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";

const ICON_MAP: Record<string, React.ElementType> = {
    heart: Heart, shield: Shield, leaf: Leaf, truck: Truck,
    users: Users, award: Award, clock: Clock, pawprint: PawPrint,
};

const DEFAULT_VALUES = [
    { icon: "heart", title: "Amor por los Animales", desc: "Todos en el equipo somos dueños de mascotas. Entendemos lo que necesitan porque lo vivimos." },
    { icon: "shield", title: "Calidad Garantizada", desc: "Todos nuestros productos pasan por un riguroso control de calidad antes de llegar a tus manos." },
    { icon: "leaf", title: "Nutrición Natural", desc: "Priorizamos alimentos naturales, sin conservantes artificiales, para una vida más larga y saludable." },
    { icon: "truck", title: "Envío Express", desc: "Sabemos que no puede esperar. Por eso despachamos en 24 horas a todo el país." },
];

const DEFAULT_TIMELINE = [
    { year: "Inicio", title: "El Comienzo", desc: "Abrimos nuestras puertas con una simple misión: darle a cada mascota lo mejor del mundo." },
    { year: "Crecimiento", title: "Más Productos", desc: "Sumamos cientos de productos premium seleccionados por veterinarios y amantes de los animales." },
    { year: "Comunidad", title: "Familias Unidas", desc: "Construimos una comunidad de familias que confían en nosotros para el bienestar de sus mascotas." },
    { year: "Hoy", title: "Tienda Online", desc: "Lanzamos nuestra tienda online para llegar a todas partes con envíos rápidos y seguros." },
];

const DEFAULT_STATS = [
    { value: "10.000+", label: "Familias", icon: "users" },
    { value: "500+", label: "Productos", icon: "award" },
    { value: "100%", label: "Calidad", icon: "shield" },
    { value: "4.9★", label: "Calificación", icon: "heart" },
];

export function PetAbout({ config: propConfig }: { config?: any }) {
    const { data: fetchedConfig } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    const config = propConfig || fetchedConfig;

    // Parse timeline from customPageChronology (JSON array: [{year, title, desc}])
    const rawChronology: any[] = (() => {
        try {
            const raw = (config as any)?.customPageChronology;
            if (!raw) return [];
            return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch { return []; }
    })();
    const timeline = rawChronology.length > 0 ? rawChronology : DEFAULT_TIMELINE;

    // Parse values from customPageTexts (format: "Título|Descripción")
    const rawTexts: string[] = (config as any)?.customPageTexts || [];
    const values = rawTexts.length >= 4
        ? rawTexts.slice(0, 4).map((t, i) => {
            const [title, desc] = t.split("|");
            return { icon: DEFAULT_VALUES[i]?.icon || "heart", title: title || DEFAULT_VALUES[i].title, desc: desc || DEFAULT_VALUES[i].desc };
        })
        : DEFAULT_VALUES;

    // Parse stats from customPageTextsSubtitle (format: "Valor|Label, Valor|Label, ...")
    const rawStats = (config as any)?.customPageTextsSubtitle;
    const stats = rawStats
        ? rawStats.split(",").map((s: string, i: number) => {
            const [value, label] = s.trim().split("|");
            return { value: value || DEFAULT_STATS[i]?.value, label: label || DEFAULT_STATS[i]?.label, icon: DEFAULT_STATS[i]?.icon || "heart" };
        }).slice(0, 4)
        : DEFAULT_STATS;

    const heroTitle = (config as any)?.customPageTitle || "Porque tu mascota";
    const heroHighlight = (config as any)?.customPageImagesSubtitle || "merece lo mejor";
    const heroDesc = (config as any)?.customPageDescription?.split("|")[0]
        || "Somos apasionados de los animales que decidieron transformar ese amor en un negocio. Creemos que cada mascota merece nutrición de calidad, juguetes seguros y dueños felices.";

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24 overflow-hidden">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#8B5E3C] via-[#A0714F] to-[#5C3D2E] py-24 md:py-36">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E8963C]/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#EDE0CF]/10 blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#D4B896]/50 backdrop-blur-xl text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-6">
                        <PawPrint className="h-3.5 w-3.5" />
                        Nuestra Historia
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                        {heroTitle}<br />
                        <span className="text-[#E8963C]">{heroHighlight}</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                        {heroDesc}
                    </p>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="bg-[#D4B896]/40 backdrop-blur-xl border-b border-[#EDE0CF] shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map(({ value, label, icon }: any, i: number) => {
                            const Icon = ICON_MAP[icon] || Heart;
                            return (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-[#EDE0CF] flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-6 w-6 text-[#8B5E3C]" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-[#5C3D2E]">{value}</p>
                                        <p className="text-xs font-bold text-[#A0714F] uppercase tracking-wider">{label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-20 bg-[#EDE0CF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-black uppercase tracking-widest text-[#E8963C]">Lo que nos mueve</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#5C3D2E] mt-3 tracking-tight">Nuestros valores</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map(({ icon, title, desc }: any, i: number) => {
                            const Icon = ICON_MAP[icon] || Heart;
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl p-7 border border-[#EDE0CF] hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] transition-all duration-300"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#EDE0CF] to-[#D4B896] flex items-center justify-center mb-5">
                                        <Icon className="h-6 w-6 text-[#8B5E3C]" />
                                    </div>
                                    <h3 className="font-black text-[#5C3D2E] text-lg mb-2">{title}</h3>
                                    <p className="text-[#A0714F] text-sm leading-relaxed">{desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ── */}
            <section className="py-20 bg-[#EDE0CF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-black uppercase tracking-widest text-[#E8963C]">Trayectoria</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#5C3D2E] mt-3 tracking-tight">Cómo llegamos hasta acá</h2>
                    </div>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#D4B896] md:-ml-px" />
                        <div className="space-y-10">
                            {timeline.map((item: any, idx: number) => (
                                <div key={idx} className={`relative flex gap-6 md:gap-0 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 z-10">
                                        <div className="h-10 w-16 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-black text-xs shadow-lg px-2 text-center leading-tight">
                                            {item.year}
                                        </div>
                                    </div>
                                    <div className={`ml-14 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                                        <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl p-6 border border-[#EDE0CF] shadow-lg">
                                            <h3 className="font-black text-[#5C3D2E] text-lg mb-2">{item.title}</h3>
                                            <p className="text-[#A0714F] text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[#5C3D2E] py-16 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#E8963C]/20 blur-3xl" />
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <PawPrint className="h-12 w-12 text-[#E8963C] mx-auto mb-5" />
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">¿Listo para consentir a tu peludo?</h2>
                    <p className="text-[#C9A882] mb-8">Explorá nuestro catálogo y encontrá todo lo que tu mascota necesita.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#E8963C] text-white font-black text-lg hover:bg-[#D4763B] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        Ver Catálogo 🐾
                    </Link>
                </div>
            </section>
        </main>
    );
}
