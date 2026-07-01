"use client";

import { motion } from "framer-motion";
import { Building2, Shield, Target, Award, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_TIMELINE = [
    { year: "2015", title: "Fundación", desc: "Comenzamos operaciones con el objetivo de profesionalizar la comercialización de bienes raíces premium." },
    { year: "2018", title: "Expansión Regional", desc: "Apertura de nuestras divisiones comerciales enfocadas en lotes industriales y desarrollos corporativos." },
    { year: "2021", title: "Alianzas Estratégicas", desc: "Consolidamos acuerdos con las principales desarrolladoras para comercializar proyectos de pozo exclusivos." },
    { year: "2024", title: "Transformación Digital", desc: "Lanzamiento de nuestra plataforma inmersiva para visualización de propiedades y gestión 100% online." },
];

const DEFAULT_VALUES = [
    { icon: Shield, title: "Transparencia", desc: "Aseguramos claridad absoluta en cada etapa de la transacción inmobiliaria y auditoría legal completa." },
    { icon: Target, title: "Precisión", desc: "Evaluaciones de mercado basadas en datos reales para garantizar inversiones seguras y rentables." },
    { icon: Award, title: "Excelencia", desc: "Seleccionamos minuciosamente cada propiedad en nuestro portfolio para mantener un estándar superior." },
    { icon: Home, title: "Asesoramiento", desc: "Acompañamiento integral, desde la búsqueda hasta la escrituración y administración." },
];

export function RealEstateAbout({ config }: { config?: any }) {
    // HERO
    const heroTitle = config?.customPageTitle || "Arquitectura & Legado";
    const heroSubtitle = config?.customPageDescription ||
        "Expertos en inversiones de alto impacto. Transformamos el mercado inmobiliario mediante un enfoque analítico y exclusivo.";

    // CRONOLOGÍA
    const timelineData =
        config?.customPageChronology && config.customPageChronology.length > 0
            ? config.customPageChronology
            : DEFAULT_TIMELINE;

    // SECCIÓN FILOSOFÍA
    const philosophyTitle = config?.customPageTextsSubtitle || "Nuestra Visión";
    const philosophySubtitle = config?.customPageTexts?.[0] ||
        "Creemos que una propiedad no es solo metros cuadrados, sino un activo estratégico. Por eso, operamos con rigurosidad financiera y visión estética.";

    // VALORES
    const valueCards = DEFAULT_VALUES.map((def, i) => {
        const raw = config?.customPageTexts?.[i + 1];
        if (raw && raw.includes("|")) {
            const [title, desc] = raw.split("|");
            return { ...def, title: title.trim(), desc: desc.trim() };
        }
        return def;
    });

    // CTA
    const ctaTitle = config?.customPageImagesSubtitle || "Descubre tu próximo proyecto";

    return (
        <main className="min-h-screen bg-white text-black font-sans pb-32 relative overflow-hidden">

            {/* HERO */}
            <section className="relative pt-40 pb-48 flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-30" style={{ filter: 'grayscale(100%) contrast(1.2)' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-[#f5ab1c]/40" />
                        <Building2 className="h-4 w-4 text-[#f5ab1c]" />
                        <div className="h-px w-12 bg-[#f5ab1c]/40" />
                    </div>
                    <span className="text-[#f5ab1c] font-mono text-xs font-bold tracking-[0.5em] uppercase block mb-6">Sobre Nosotros</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 uppercase tracking-tighter leading-none">
                        {heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                        {heroSubtitle}
                    </p>
                </div>
            </section>

            {/* TIMELINE / CRONOLOGÍA */}
            <section className="py-32 bg-[#f4f4f4]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-24">
                        <span className="text-gray-500 font-bold text-xs tracking-[0.5em] uppercase block mb-4">Trayectoria</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a1a1a]">Nuestra Historia</h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gray-300 md:-ml-px" />
                        {timelineData.map((item: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`flex flex-col md:flex-row gap-10 mb-20 relative ${isEven ? "md:flex-row-reverse" : ""}`}>
                                    <div className={`flex-1 ${isEven ? "md:text-right" : "text-left"}`}>
                                        <div className="bg-white p-10 border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all group rounded-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5ab1c]/5 -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-[#f5ab1c]/10 transition-colors" />
                                            <span className="text-5xl font-black text-gray-200 block mb-4 group-hover:text-[#f5ab1c] transition-colors">{item.year}</span>
                                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#1a1a1a]">{item.title}</h3>
                                            <p className="text-gray-500 font-medium leading-relaxed">{item.desc || item.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-10 w-4 h-4 bg-white border-4 border-[#1a1a1a] z-10 md:-ml-2 transform -translate-x-1/2 md:translate-x-0 rounded-full" />
                                    <div className="hidden md:block flex-1" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FILOSOFÍA Y VALORES */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
                        <div>
                            <span className="text-[#f5ab1c] font-bold text-xs tracking-[0.5em] uppercase block mb-6">{philosophyTitle}</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-[#1a1a1a] leading-tight">
                                Más que <br/>
                                <span className="text-gray-400">Propiedades.</span>
                            </h2>
                            <p className="text-gray-600 text-lg font-medium leading-relaxed mb-10 border-l-4 border-[#f5ab1c] pl-6">
                                {philosophySubtitle}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {valueCards.map((val: any, idx: number) => {
                                const Icon = val.icon || Award;
                                return (
                                    <div key={idx} className="bg-[#f9f9f9] p-8 hover:bg-[#1a1a1a] group transition-colors duration-500 rounded-sm">
                                        <Icon className="h-10 w-10 text-[#1a1a1a] group-hover:text-[#f5ab1c] mb-6 transition-colors" />
                                        <h4 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a] group-hover:text-white mb-3 transition-colors">{val.title}</h4>
                                        <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors font-medium leading-relaxed">{val.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-[#1a1a1a] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#f5ab1c 1px, transparent 1px), linear-gradient(90deg, #f5ab1c 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 max-w-4xl mx-auto">
                        {ctaTitle}
                    </h2>
                    <Link href="/products" className="inline-flex items-center gap-3 bg-[#f5ab1c] text-black px-12 py-5 font-bold tracking-widest uppercase text-sm hover:bg-white transition-colors rounded-sm shadow-xl hover:shadow-[#f5ab1c]/20">
                        Ingresar al Catálogo <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
