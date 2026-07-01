"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ArrowRight, Flower, Star, Sparkles } from "lucide-react";
import { useRef } from "react";

const FEATURES = [
    { icon: "✦", title: "Alquiler & Venta", desc: "Elegí la modalidad que mejor se adapta a tu presupuesto y evento." },
    { icon: "✦", title: "Personalización Total", desc: "Cada pieza puede adaptarse a tu paleta de colores y temática." },
    { icon: "✦", title: "Montaje Incluido", desc: "Nuestro equipo se encarga de armar y desarmar todo el día del evento." },
    { icon: "✦", title: "Garantía de Calidad", desc: "Materiales premium y detalles que marcan la diferencia." },
];

const FALLBACK_CATEGORY_IMAGES = [
    "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1589139316629-87a41951f215?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600",
];

export function DecorHome() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { data: productsData } = useQuery({
        queryKey: ["products", "featured", "decoracion"],
        queryFn: () => productService.getProducts({ page: 1, limit: 20 }),
        staleTime: 1000 * 60 * 5,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories", "tenant"],
        queryFn: () => productService.getCategories(),
        staleTime: 1000 * 60 * 5,
    });

    const products = (productsData as any)?.data || [];
    const dbCategories = categoriesData || [];

    return (
        <div className="w-full overflow-x-hidden" style={{ backgroundColor: "#F0E5D8" }}>

            {/* ═══════════════════════════════════════════
                HERO — Full screen editorial with arch
            ═══════════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-end overflow-hidden"
                style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 40%, #8B6F5E 70%, #C4A882 100%)" }}
            >
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                {/* Parallax Hero Image */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
                    <Image
                        src={config?.adImage || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1600"}
                        alt="Hero"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                </motion.div>

                {/* Decorative large arch shape top right */}
                <div className="absolute top-0 right-0 w-[500px] h-[600px] rounded-b-full bg-[#E1CDBF]/10 border border-[#E1CDBF]/20 translate-x-1/3 -translate-y-0 hidden lg:block" />
                <div className="absolute top-0 right-32 w-[300px] h-[400px] rounded-b-full bg-[#D5BBAA]/8 border border-[#D5BBAA]/15 hidden lg:block" />

                {/* Floating accent dots */}
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 left-16 w-3 h-3 rounded-full bg-[#E1CDBF]/60 hidden lg:block" />
                <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-64 left-32 w-2 h-2 rounded-full bg-[#C4A882]/80 hidden lg:block" />
                <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-80 right-80 w-4 h-4 rounded-full bg-[#F0E5D8]/30 hidden lg:block" />

                {/* Hero Content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-24 lg:pb-32"
                >


                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="font-serif text-6xl md:text-8xl lg:text-[7rem] xl:text-[9rem] text-[#F0E5D8] leading-[0.95] tracking-tight mb-10 max-w-5xl"
                    >
                        {config?.adText ? (
                            <span dangerouslySetInnerHTML={{ __html: config.adText }} />
                        ) : (
                            <>
                                Momentos <br />
                                <span className="italic text-[#C4A882]">que</span>{" "}
                                duran <br />
                                para siempre.
                            </>
                        )}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-4 bg-[#E1CDBF] text-[#3A302A] hover:bg-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-5 px-10"
                        >
                            Ver Colección <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-4 border border-[#E1CDBF]/50 text-[#E1CDBF] hover:border-[#E1CDBF] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-5 px-10"
                        >
                            Consultar Evento
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Wave transition at bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                    <svg className="relative block w-full h-[80px] lg:h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                    </svg>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                MARQUEE STRIP
            ═══════════════════════════════════════════ */}
            <div className="w-full bg-[#3A302A] py-4 overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap"
                >
                    {Array(10).fill(null).map((_, i) => (
                        <span key={i} className="inline-flex items-center gap-6 text-[#C4A882] font-sans text-xs tracking-[0.3em] uppercase mx-6">
                            {(config?.marqueeText?.length ? config.marqueeText : ["Arcos Florales", "Centros de Mesa", "Sillas Tiffany", "Pampas Grass", "Alquiler & Venta"]).map((item, idx) => (
                                <span key={idx}>
                                    {item} <span className="text-[#E1CDBF] mx-6">✦</span>
                                </span>
                            ))}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════
                CATEGORIES — Arch cards grid
            ═══════════════════════════════════════════ */}
            {dbCategories.length > 0 && (
                <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <p className="text-[#8B6F5E] text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                                <Flower size={14} /> Explorá por categoría
                            </p>
                            <h2 className="font-serif text-5xl md:text-6xl text-[#3A302A] leading-tight">
                                Todo para tu <br /><span className="italic text-[#8B6F5E]">evento soñado</span>
                            </h2>
                        </motion.div>
                        <Link href="/products" className="group flex items-center gap-3 text-[#3A302A] font-sans text-xs tracking-[0.2em] uppercase hover:text-[#8B6F5E] transition-colors">
                            Ver todo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {dbCategories.slice(0, 4).map((cat: any, i: number) => (
                            <motion.div
                                key={cat.id || i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.7 }}
                            >
                                <Link
                                    href={`/products?category=${cat.slug}`}
                                    className="group block relative overflow-hidden rounded-t-full rounded-b-2xl aspect-[3/4] shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                                >
                                    <Image src={cat.imageUrl || FALLBACK_CATEGORY_IMAGES[i % 4]} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A302A] via-[#3A302A]/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <p className="text-[#C4A882] text-[10px] tracking-[0.3em] uppercase mb-1 font-sans">{cat.productsCount ? `${cat.productsCount} items` : 'Colección'}</p>
                                        <h3 className="font-serif text-2xl md:text-3xl text-[#F0E5D8] leading-tight">{cat.name}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════
                PRODUCTS — with wave background
            ═══════════════════════════════════════════ */}
            {products.length > 0 && (
                <section className="relative pt-24 pb-32">
                    {/* Top wave */}
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                        <svg className="relative block w-full h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#E1CDBF" fillOpacity="0.5" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 bg-[#E1CDBF]/30 -z-10" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <p className="text-[#8B6F5E] text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                                    <Star size={14} /> Colección destacada
                                </p>
                                <h2 className="font-serif text-5xl md:text-6xl text-[#3A302A]">Lo más elegido</h2>
                            </motion.div>
                            <Link href="/products" className="group flex items-center gap-3 bg-[#3A302A] text-[#F0E5D8] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#5C4A3E] transition-colors">
                                Ver todos <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                            {products.slice(0, 20).map((product: any, idx: number) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08, duration: 0.6 }}
                                >
                                    <ProductCardRouter product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom wave */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                        <svg className="relative block w-full h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                        </svg>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════
                EDITORIAL SPLIT — Image + Text
            ═══════════════════════════════════════════ */}
            <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Image block with arch */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        className="relative"
                    >
                        <div className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={config?.customPageImage || "https://images.unsplash.com/photo-1544923555-52055627db8a?auto=format&fit=crop&q=80&w=800"}
                                alt={config?.customPageTitle || "Evento decorado"}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3A302A]/60 to-transparent" />
                        </div>
                        {/* Floating card — only if chronology data exists */}
                        {config?.customPageChronology?.[0] && (
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -right-6 lg:right-0 bg-[#3A302A] text-[#F0E5D8] p-6 w-48 shadow-2xl"
                            >
                                <p className="font-serif text-4xl font-bold">{config.customPageChronology[0].year}</p>
                                <p className="font-sans text-xs text-[#C4A882] tracking-widest uppercase mt-1">{config.customPageChronology[0].title}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="flex flex-col gap-8"
                    >
                        <div>
                            <p className="text-[#8B6F5E] text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                                <Sparkles size={14} /> {config?.customPageTitle ? "Sobre Nosotros" : "Nuestra historia"}
                            </p>
                            <h2 className="font-serif text-4xl md:text-5xl text-[#3A302A] leading-tight mb-6">
                                {config?.customPageTitle ? (
                                    <span dangerouslySetInnerHTML={{ __html: config.customPageTitle }} />
                                ) : (
                                    <>Creamos ambientes que <span className="italic text-[#8B6F5E]">emocionan</span></>
                                )}
                            </h2>
                            <p className="text-[#5C4A3E] font-sans text-base leading-relaxed whitespace-pre-line">
                                {config?.customPageDescription || "Somos especialistas en decoración de eventos. Cada pieza que diseñamos está pensada para crear ese momento único que querés recordar para siempre. Bodas, cumpleaños, bautismos, eventos corporativos — transformamos cualquier espacio en algo extraordinario."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {config?.customPageTexts?.length ? (
                                config.customPageTexts.map((text, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.4 }}
                                        className="flex flex-col gap-2"
                                    >
                                        <span className="text-[#8B6F5E] text-lg">✦</span>
                                        <p className="text-[#5C4A3E] font-sans text-xs leading-relaxed">{text}</p>
                                    </motion.div>
                                ))
                            ) : (
                                FEATURES.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.4 }}
                                        className="flex flex-col gap-2"
                                    >
                                        <span className="text-[#8B6F5E] text-lg">{f.icon}</span>
                                        <h4 className="font-serif text-lg text-[#3A302A]">{f.title}</h4>
                                        <p className="text-[#5C4A3E] font-sans text-xs leading-relaxed">{f.desc}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <Link
                            href="/about"
                            className="group self-start flex items-center gap-3 border border-[#3A302A] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-8"
                        >
                            Conocernos <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                CTA FINAL — Full width dark section with arch
            ═══════════════════════════════════════════ */}
            <section className="relative py-32 overflow-hidden" style={{ background: "linear-gradient(135deg, #3A302A 0%, #5C4A3E 50%, #8B6F5E 100%)" }}>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                {/* Decorative arches in background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#E1CDBF]/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#E1CDBF]/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#E1CDBF]/15" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-8"
                >
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        className="bg-[#C4A882] p-6 rounded-full shadow-2xl"
                    >
                        <Flower size={40} className="text-[#3A302A]" />
                    </motion.div>

                    <h2 className="font-serif text-5xl md:text-7xl text-[#F0E5D8] leading-tight">
                        ¿Tenés un evento <br /><span className="italic text-[#C4A882]">en mente?</span>
                    </h2>

                    <p className="text-[#D5BBAA] font-sans text-lg leading-relaxed max-w-2xl">
                        Contanos tu idea y juntos creamos la decoración perfecta. Cada detalle importa, y nosotros nos encargamos de todo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-4 bg-[#E1CDBF] text-[#3A302A] hover:bg-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-5 px-12 shadow-xl"
                        >
                            Hablar con nosotros <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-4 border border-[#E1CDBF]/50 text-[#E1CDBF] hover:border-[#E1CDBF] hover:bg-[#E1CDBF]/10 transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-5 px-12"
                        >
                            Ver catálogo
                        </Link>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}
