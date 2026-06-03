"use client";

import { motion } from "framer-motion";
import { Scissors, Shield, Award, Clock, Star } from "lucide-react";
import Link from "next/link";

const TIMELINE = [
    { year: "2015", title: "El Comienzo", desc: "Abrimos nuestro primer salón con la visión de revolucionar el grooming clásico masculino." },
    { year: "2018", title: "Línea Propia", desc: "Lanzamos nuestra primera colección de productos para el cuidado de la barba y el cabello." },
    { year: "2020", title: "Expansión", desc: "Inauguramos nuestra academia para formar a la próxima generación de barberos." },
    { year: "2023", title: "Tienda Digital", desc: "Llevamos nuestros productos premium y herramientas a todo el país mediante e-commerce." },
];

const VALUES = [
    { icon: Shield, title: "Calidad", desc: "Utilizamos y vendemos exclusivamente productos testados y aprobados por nuestros profesionales." },
    { icon: Award, title: "Excelencia", desc: "Buscamos la perfección en nuestros productos y en la preparación de cada pedido." },
    { icon: Clock, title: "Tradición", desc: "Respetamos las técnicas clásicas mientras incorporamos las últimas tendencias globales." },
    { icon: Star, title: "Estilo", desc: "No solo vendemos productos, asesoramos a cada cliente para encontrar su mejor versión." },
];

export function BarberAbout({ config }: { config?: any }) {
    const timelineData = config?.customPageChronology && config.customPageChronology.length > 0 
        ? config.customPageChronology 
        : TIMELINE;

    return (
        <main className="min-h-screen bg-[#111] text-[#f4f4f4] font-sans pb-32 relative overflow-hidden pt-24">

            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* HERO */}
            <section className="relative pt-32 pb-40 flex items-center justify-center overflow-hidden bg-[#161616] border-b border-[#333] z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-1 w-12 bg-[#e65c00]" />
                        <Scissors className="h-6 w-6 text-[#e65c00]" />
                        <div className="h-1 w-12 bg-[#e65c00]" />
                    </div>
                    <span className="text-[#e65c00] font-bold text-[10px] tracking-[0.3em] uppercase block mb-6">Nuestra Historia</span>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 text-white">
                        Tradición &<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e65c00] to-[#ff8c33]">Vanguardia</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Redefiniendo el cuidado masculino a través de la excelencia, la técnica impecable y productos de la más alta calidad.
                    </p>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="py-32 relative z-10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <span className="text-[#e65c00] font-bold text-[10px] tracking-[0.3em] uppercase block mb-4">Trayectoria</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">Cronología</h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#333] md:-ml-px" />
                        {timelineData.map((item: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`flex flex-col md:flex-row gap-10 mb-20 relative ${isEven ? "md:flex-row-reverse" : ""}`}>
                                    <div className={`flex-1 ${isEven ? "md:text-right" : "text-left"}`}>
                                        <div className="bg-[#1A1A1A] p-10 border border-[#333] hover:border-[#e65c00] transition-colors group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#333] group-hover:bg-[#e65c00] -rotate-45 translate-x-8 -translate-y-8 transition-colors" />
                                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#e65c00] to-[#ff8c33] block mb-4">{item.year}</span>
                                            <h3 className="text-2xl font-bold uppercase mb-4 text-white tracking-tight">{item.title}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-10 w-4 h-4 bg-[#111] border-2 border-[#e65c00] z-10 md:-ml-2 transform -translate-x-1/2 md:translate-x-0" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-32 bg-[#161616] border-y border-[#333] relative z-10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <span className="text-[#e65c00] font-bold text-[10px] tracking-[0.3em] uppercase block mb-6">Filosofía</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 text-white">Nuestros Valores</h2>
                        <p className="text-gray-400 leading-relaxed">
                            No somos solo una tienda, somos un estándar. Creemos que la imagen personal es la mejor carta de presentación.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((value, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className="bg-[#1A1A1A] p-10 border border-[#333] hover:border-[#e65c00] transition-colors text-center group">
                                <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border border-[#333] bg-[#111] group-hover:border-[#e65c00] transition-colors">
                                    <value.icon className="w-6 h-6 text-[#e65c00]" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-4 text-white">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="border border-[#333] p-16 max-w-4xl mx-auto bg-[#1A1A1A] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#333] group-hover:bg-[#e65c00] opacity-10 -rotate-45 translate-x-16 -translate-y-16 transition-all duration-700" />
                        
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 text-white">Mejora Tu Estilo</h2>
                        <p className="text-gray-400 font-light mb-12">
                            Explorá nuestro catálogo de herramientas y productos premium, o visitá el salón.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
                            <Link href="/products"
                                className="bg-[#e65c00] text-white px-10 py-4 font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors">
                                Ver Catálogo
                            </Link>
                            <Link href="/contact"
                                className="bg-transparent border border-[#333] text-white px-10 py-4 font-bold tracking-[0.2em] uppercase hover:border-[#e65c00] hover:text-[#e65c00] transition-colors">
                                Contactar
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
