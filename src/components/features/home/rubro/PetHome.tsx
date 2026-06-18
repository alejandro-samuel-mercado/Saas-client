"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { Heart, Bone, ShieldCheck, Truck, ArrowRight, PawPrint, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PetHero } from "./PetHero";

const PET_CATEGORIES = [
    { name: "Alimentos", subtitle: "Nutrición Premium", href: "/products?category=alimentos", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800" },
    { name: "Juguetes", subtitle: "Diversión Segura", href: "/products?category=juguetes", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800" },
    { name: "Accesorios", subtitle: "Paseo & Estilo", href: "/products?category=accesorios", image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=800" },
    { name: "Cuidado", subtitle: "Higiene y Salud", href: "/products?category=cuidado", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800" },
];

export function PetHome() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
    });

    const { data: trendingProducts } = useQuery({
        queryKey: ["products", "trending", "mascotas", config?.rubro?.id],
        queryFn: () => productService.getProducts({
            isTrending: "true",
            limit: 4,
            ...(config?.rubro?.id ? { rubroId: config.rubro.id } : {}),
        }),
        enabled: config !== undefined,
    });

    const { data: newProducts } = useQuery({
        queryKey: ["products", "new", "mascotas", config?.rubro?.id],
        queryFn: () => productService.getProducts({
            isNew: "true",
            limit: 4,
            ...(config?.rubro?.id ? { rubroId: config.rubro.id } : {}),
        }),
        enabled: config !== undefined,
    });

    const services = [
        { title: "Amor Animal", icon: <Heart className="w-10 h-10" />, desc: "Productos pensados para el bienestar de tu familia." },
        { title: "Envío Rápido", icon: <Truck className="w-10 h-10" />, desc: "Tu pedido llega sin demoras a la puerta de tu casa." },
        { title: "Calidad Premium", icon: <ShieldCheck className="w-10 h-10" />, desc: "Productos seguros y 100% certificados." },
        { title: "Asesoría Vet", icon: <Bone className="w-10 h-10" />, desc: "Consultoría especializada para dudas." }
    ];

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const yParallax = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div ref={ref} className="bg-[#EDE0CF] text-[#5C3D2E] font-sans selection:bg-[#E8963C] selection:text-[#EDE0CF] pb-20 overflow-x-hidden">

            {/* PREVIOUSLY THE HERO WAS A SIMPLE BANNER. WE NOW DELEGATE TO THE PREMIUM PET HERO COMPONENT */}
            <PetHero />

            {/* SERVICES / FEATURES WITH ASYMMETRICAL OVERLAP */}
            <section className="relative z-30 px-4 lg:px-8 -mt-24 mb-32">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#D4B896]/70 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 border-4 border-[#EDE0CF] shadow-[0_40px_80px_rgba(92,61,46,0.15)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8963C]/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5E3C]/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div>
                                <h2 className="text-[#E8963C] text-sm font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                                    <PawPrint className="h-5 w-5" /> Por qué elegirnos
                                </h2>
                                <p className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#5C3D2E] leading-none">
                                    Calidad <br className="hidden md:block" /> Garantizada
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {services.map((service, idx) => (
                                <motion.div 
                                    key={idx} 
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-[#EDE0CF]/80 backdrop-blur-md p-8 rounded-3xl group hover:bg-gradient-to-br hover:from-[#E8963C] hover:to-[#D4763B] transition-all duration-500 shadow-xl border border-[#D4B896]/50"
                                >
                                    <div className="text-[#8B5E3C] group-hover:text-[#EDE0CF] transition-colors mb-6 drop-shadow-md">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-[#5C3D2E] group-hover:text-[#EDE0CF] mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-[#8B5E3C] font-semibold group-hover:text-[#EDE0CF]/90 transition-colors leading-relaxed">
                                        {service.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CATEGORIES SECTION WITH PARALLAX */}
            <section className="py-24 px-4 lg:px-8 relative z-10 overflow-hidden">
                {/* Organic background shapes */}
                <motion.div style={{ y: yParallax }} className="absolute -right-64 top-0 w-[800px] h-[800px] bg-[#D4B896]/30 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center text-center mb-20"
                    >
                        <h2 className="text-[#E8963C] text-sm font-black tracking-[0.2em] uppercase flex items-center gap-2 mb-4">
                            <PawPrint className="h-5 w-5" /> Explora el Mundo
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-black text-[#5C3D2E] tracking-tighter">Categorías Top</h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {PET_CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border-4 border-[#D4B896]/50 shadow-2xl hover:shadow-[0_30px_60px_rgba(232,150,60,0.3)] hover:-translate-y-2 transition-all duration-500">
                                    <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E] via-[#5C3D2E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-xs font-black tracking-[0.2em] uppercase text-[#E8963C] mb-2 drop-shadow-md">{cat.subtitle}</p>
                                        <h3 className="text-3xl font-black text-[#EDE0CF] drop-shadow-xl">{cat.name}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRENDING PRODUCTS WITH WAVES */}
            {(trendingProducts as any)?.data?.length > 0 && (
                <section className="relative pt-32 pb-40 z-10">
                    {/* Top Wave */}
                    <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                        <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.1,192.51,110.8,236.43,102.13,279.4,78.89,321.39,56.44Z" fill="#D4B896" fillOpacity="0.3"></path>
                        </svg>
                    </div>

                    <div className="absolute inset-0 bg-[#D4B896]/30 -z-10" />

                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                <p className="text-[#E8963C] text-sm font-black tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                                    <Heart className="h-6 w-6" /> Lo Más Elegido
                                </p>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#5C3D2E]">Favoritos</h2>
                            </motion.div>
                            <Link href="/products?isTrending=true" className="group flex items-center gap-3 bg-[#E8963C] text-[#EDE0CF] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#D4763B] shadow-lg transition-all hover:scale-105">
                                Ver Todos <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {((trendingProducts as any)?.data || []).map((product: any, idx: number) => (
                                <motion.div key={product.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="h-full">
                                    <ProductCardRouter product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Wave */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                        <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.1,192.51,110.8,236.43,102.13,279.4,78.89,321.39,56.44Z" fill="#EDE0CF"></path>
                        </svg>
                    </div>
                </section>
            )}

            {/* CTA SECTION */}
            <section className="py-32 px-4 lg:px-8 relative z-10 mt-10">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="max-w-6xl mx-auto bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_40px_80px_rgba(92,61,46,0.4)]"
                >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8963C]/40 blur-[80px]" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#D4B896]/20 blur-[80px]" />
                    
                    <div className="relative z-20 flex flex-col items-center text-center">
                        <motion.div whileHover={{ rotate: 15, scale: 1.2 }} className="bg-[#E8963C] p-6 rounded-3xl shadow-2xl mb-10 rotate-6 border-4 border-[#EDE0CF]/20">
                            <PawPrint className="h-16 w-16 text-[#EDE0CF]" />
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#EDE0CF] mb-8">
                            Amor Incondicional. <br className="hidden md:block"/> Nutrición Perfecta.
                        </h2>
                        <p className="text-[#D4B896] text-xl md:text-2xl font-medium mb-12 max-w-2xl leading-relaxed">
                            Únete a nuestra comunidad de dueños responsables y dales la vida que merecen.
                        </p>
                        <Link href="/products" className="group relative overflow-hidden bg-[#E8963C] text-[#EDE0CF] px-12 py-6 rounded-full font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(232,150,60,0.4)] transition-all hover:scale-110">
                            <span className="relative z-10 flex items-center gap-3">
                                Explorar Tienda <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4763B] to-[#E8963C] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
