"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Flower2, ArrowRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";

const STATS = [
    { value: "200+", label: "Eventos realizados" },
    { value: "8", label: "Años de experiencia" },
    { value: "500+", label: "Clientes felices" },
    { value: "15+", label: "Proveedores exclusivos" },
];

const VALUES = [
    { title: "Creatividad", desc: "Cada evento es único. Nunca repetimos una propuesta sin darle nuestra firma personal." },
    { title: "Calidad", desc: "Trabajamos solo con materiales premium y flores de primera selección." },
    { title: "Compromiso", desc: "Estamos presentes en cada etapa: desde la consulta hasta el desmontaje." },
    { title: "Emoción", desc: "Creemos que la decoración debe conmover. Ese es nuestro norte." },
];

export function DecorAbout() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    return (
        <main className="min-h-screen" style={{ backgroundColor: "#F0E5D8" }}>

            {/* HERO */}
            <section className="relative min-h-[70vh] flex items-end overflow-hidden"
                style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 50%, #8B6F5E 100%)" }}>
                <div className="absolute inset-0 opacity-15 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                <Image
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1600"
                    alt="About us"
                    fill
                    className="object-cover opacity-20"
                />

                {/* Arch decoration */}
                <div className="absolute top-0 right-0 w-96 h-[500px] rounded-b-full border border-[#C4A882]/20 translate-x-20 hidden lg:block" />
                <div className="absolute top-0 right-32 w-56 h-80 rounded-b-full border border-[#C4A882]/15 hidden lg:block" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-24">
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                        className="text-[#C4A882] text-[10px] tracking-[0.4em] uppercase mb-6 font-sans flex items-center gap-3">
                        <span className="w-10 h-[1px] bg-[#C4A882] inline-block" /> Nuestra historia
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
                        className="font-serif text-6xl md:text-8xl text-[#F0E5D8] leading-[0.95] tracking-tight max-w-4xl">
                        {config?.customPageTitle ? (
                            <span dangerouslySetInnerHTML={{ __html: config.customPageTitle }} />
                        ) : (
                            <>Transformamos <br /><span className="italic text-[#C4A882]">espacios</span> en <br />experiencias</>
                        )}
                    </motion.h1>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                    <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                    </svg>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-y border-[#3A302A]/10 py-12">
                    {STATS.map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <p className="font-serif text-5xl md:text-6xl text-[#3A302A] mb-2">{stat.value}</p>
                            <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8B6F5E]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* STORY */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
                    <div className="relative w-full max-w-lg mx-auto">
                        <div className="relative aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl">
                            <Image src={config?.customPageImages?.[0] || "https://images.unsplash.com/photo-1507646875883-731bfbb1e58a?auto=format&fit=crop&q=80&w=800"} alt="Nuestra historia" fill className="object-cover" />
                        </div>
                        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -right-6 bg-[#C4A882] text-[#3A302A] p-6 w-44 shadow-xl">
                            <p className="font-serif text-4xl font-bold">{config?.customPageChronology?.[0]?.year || "2016"}</p>
                            <p className="font-sans text-[10px] tracking-widest uppercase mt-1">{config?.customPageChronology?.[0]?.title || "Fundación"}</p>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }} className="flex flex-col gap-8">
                    <div>
                        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8B6F5E] mb-4 flex items-center gap-2"><Flower2 size={12} /> {config?.customPageTextsSubtitle || "Quiénes somos"}</p>
                        <h2 className="font-serif text-4xl md:text-5xl text-[#3A302A] leading-tight mb-6">
                            {config?.customPageDescription ? (
                                <span dangerouslySetInnerHTML={{ __html: config.customPageDescription }} />
                            ) : (
                                <>Una pasión que <span className="italic text-[#8B6F5E]">nació natural</span></>
                            )}
                        </h2>
                        {config?.customPageTexts?.length ? (
                            config.customPageTexts.map((text, i) => (
                                <p key={i} className="text-[#5C4A3E] font-sans text-base leading-relaxed mb-4">
                                    {text}
                                </p>
                            ))
                        ) : (
                            <>
                                <p className="text-[#5C4A3E] font-sans text-base leading-relaxed mb-4">
                                    {config?.storeName || "Fleur Events"} nació en 2016 de la mano de un grupo de apasionadas por el diseño floral y la decoración de eventos. Lo que comenzó como un pequeño taller en casa hoy se convirtió en uno de los estudios de decoración más reconocidos de la región.
                                </p>
                                <p className="text-[#5C4A3E] font-sans text-base leading-relaxed">
                                    Cada evento que decoramos lleva nuestra firma: atención obsesiva al detalle, materiales de primera calidad y la calidez de un equipo que realmente disfruta lo que hace.
                                </p>
                            </>
                        )}
                    </div>
                    <Link href="/contact" className="group self-start flex items-center gap-4 bg-[#3A302A] text-[#F0E5D8] hover:bg-[#5C4A3E] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-8">
                        Consultá tu evento <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* VALUES */}
            <section className="relative py-24" style={{ backgroundColor: "#E1CDBF" }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#8B6F5E] mb-4 flex items-center justify-center gap-2"><Star size={12} /> Nuestros valores</p>
                        <h2 className="font-serif text-5xl text-[#3A302A]">Lo que nos guía</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {VALUES.map((val, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                className="flex flex-col gap-4 p-8 bg-[#F0E5D8]/60 hover:bg-[#F0E5D8] transition-colors">
                                <span className="text-[#8B6F5E] text-2xl font-serif">✦</span>
                                <h3 className="font-serif text-2xl text-[#3A302A]">{val.title}</h3>
                                <p className="text-[#5C4A3E] font-sans text-sm leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
