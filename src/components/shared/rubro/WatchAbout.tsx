"use client";

import { motion } from "framer-motion";
import { Watch, Shield, Award, Clock, Target } from "lucide-react";
import Link from "next/link";

const TIMELINE = [
    { year: "2010", title: "El Inicio", desc: "Comenzamos como distribuidores exclusivos de marcas europeas de alta relojería en Argentina." },
    { year: "2014", title: "Expansión", desc: "Incorporamos smartwatches y accesorios premium, ampliando nuestra propuesta a la tecnología wearable." },
    { year: "2018", title: "Certificación", desc: "Nos convertimos en punto de servicio técnico oficial y autorizados para emitir certificados de autenticidad." },
    { year: "2023", title: "Tienda Digital", desc: "Lanzamos nuestra plataforma e-commerce para llevar la experiencia de relojería de lujo a todo el país." },
];

const VALUES = [
    { icon: Shield, title: "Autenticidad", desc: "Cada pieza viene con documentación completa de origen y certificado de autenticidad verificable." },
    { icon: Award, title: "Calidad", desc: "Trabajamos solo con marcas reconocidas y piezas en perfecto estado, seleccionadas por expertos." },
    { icon: Clock, title: "Precisión", desc: "La exactitud no es solo una función del reloj, es nuestra promesa de servicio en cada interacción." },
    { icon: Target, title: "Asesoramiento", desc: "Te acompañamos en la elección de la pieza correcta, considerando tu estilo, presupuesto y uso." },
];

export function WatchAbout({ config }: { config?: any }) {
    const timelineData = config?.customPageChronology && config.customPageChronology.length > 0 
        ? config.customPageChronology 
        : TIMELINE;

    return (
        <main className="min-h-screen bg-[#0a0d11] text-[#c0cfe0] font-sans pb-32 relative overflow-hidden">

            {/* HERO */}
            <section className="relative pt-40 pb-48 flex items-center justify-center overflow-hidden bg-[#080b0f] border-b border-[#8a9ab5]/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(#8a9ab5 1px, transparent 1px), linear-gradient(90deg, #8a9ab5 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-[#8a9ab5]/40" />
                        <Watch className="h-4 w-4 text-[#8a9ab5]" />
                        <div className="h-px w-12 bg-[#8a9ab5]/40" />
                    </div>
                    <span className="text-[#8a9ab5] font-mono text-[10px] tracking-[0.5em] uppercase block mb-6">Nuestra Historia</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 text-[#c0cfe0]">
                        El Arte de<br /><span className="text-[#8a9ab5]">Medir el Tiempo</span>
                    </h1>
                    <p className="text-lg text-[#8a9ab5]/50 max-w-2xl mx-auto font-mono font-light leading-relaxed">
                        Más de una década seleccionando las piezas más exclusivas del mundo relojero para coleccionistas y entusiastas argentinos.
                    </p>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <span className="text-[#8a9ab5] font-mono text-[10px] tracking-[0.5em] uppercase block mb-4">Trayectoria</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#c0cfe0]">Cronología</h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#8a9ab5]/15 md:-ml-px" />
                        {timelineData.map((item: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`flex flex-col md:flex-row gap-10 mb-20 relative ${isEven ? "md:flex-row-reverse" : ""}`}>
                                    <div className={`flex-1 ${isEven ? "md:text-right" : "text-left"}`}>
                                        <div className="bg-[#080b0f] p-10 border border-[#8a9ab5]/10 hover:border-[#8a9ab5]/30 transition-colors group">
                                            <span className="text-5xl font-mono font-bold text-[#8a9ab5]/30 block mb-4 group-hover:text-[#8a9ab5]/60 transition-colors">{item.year}</span>
                                            <h3 className="text-2xl font-serif mb-4 text-[#c0cfe0]">{item.title}</h3>
                                            <p className="text-[#8a9ab5]/50 text-sm font-mono leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-10 w-3 h-3 bg-[#0a0d11] border border-[#8a9ab5]/50 z-10 md:-ml-1.5 transform -translate-x-1/2 md:translate-x-0" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-32 bg-[#080b0f] border-y border-[#8a9ab5]/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <span className="text-[#8a9ab5] font-mono text-[10px] tracking-[0.5em] uppercase block mb-6">Filosofía</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 text-[#c0cfe0]">Nuestros Valores</h2>
                        <p className="text-[#8a9ab5]/50 font-mono font-light leading-relaxed">
                            La relojería no es solo moda, es ingeniería de precisión. Por eso nos tomamos en serio cada aspecto del servicio.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className="bg-[#0a0d11] p-10 border border-[#8a9ab5]/10 hover:border-[#8a9ab5]/30 transition-colors text-center group">
                                <div className="w-14 h-14 mx-auto mb-8 flex items-center justify-center border border-[#8a9ab5]/20 group-hover:bg-[#8a9ab5]/10 transition-colors">
                                    <value.icon className="w-5 h-5 text-[#8a9ab5]" />
                                </div>
                                <h3 className="text-lg font-serif mb-4 text-[#c0cfe0]">{value.title}</h3>
                                <p className="text-[#8a9ab5]/40 text-sm font-mono leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <div className="border border-[#8a9ab5]/10 p-16 max-w-4xl mx-auto bg-[#080b0f]">
                        <h2 className="text-3xl md:text-5xl font-serif mb-6 text-[#c0cfe0]">Encontrá tu Pieza</h2>
                        <p className="text-[#8a9ab5]/50 font-mono font-light mb-12">
                            Explorá nuestra colección o consultanos directamente. Estamos para asesorarte.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products"
                                className="bg-[#8a9ab5] text-[#0a0d11] px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[#c0cfe0] transition-colors">
                                Ver Colección
                            </Link>
                            <Link href="/contact"
                                className="border border-[#8a9ab5]/30 text-[#8a9ab5] px-10 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#8a9ab5]/10 hover:border-[#8a9ab5]/60 transition-colors">
                                Contactar
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
