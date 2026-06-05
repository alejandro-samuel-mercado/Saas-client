"use client";

import { motion } from "framer-motion";
import { PawPrint, Heart, Award, Truck, Shield, Leaf, Users, Clock } from "lucide-react";
import Link from "next/link";

const TIMELINE = [
    { year: "2015", title: "El Comienzo", desc: "Abrimos nuestras puertas con una simple misión: darle a cada mascota lo mejor del mundo." },
    { year: "2018", title: "Crecimiento", desc: "Sumamos más de 500 productos premium seleccionados por veterinarios y amantes de los animales." },
    { year: "2021", title: "Comunidad", desc: "Construimos una comunidad de más de 10.000 familias que confían en nosotros." },
    { year: "2024", title: "Innovación Digital", desc: "Lanzamos nuestra tienda online para llegar a toda Argentina con envíos rápidos." },
];

const VALUES = [
    { icon: Heart, title: "Amor por los Animales", desc: "Todos en el equipo somos dueños de mascotas. Entendemos lo que necesitan porque lo vivimos cada día." },
    { icon: Shield, title: "Calidad Garantizada", desc: "Todos nuestros productos pasan por un riguroso control de calidad antes de llegar a tus manos." },
    { icon: Leaf, title: "Nutrición Natural", desc: "Priorizamos alimentos naturales, sin conservantes artificiales, para una vida más larga y saludable." },
    { icon: Truck, title: "Envío Express", desc: "Sabemos que no puede esperar. Por eso despachamos en 24 horas a todo el país." },
];

const STATS = [
    { value: "15.000+", label: "Familias", icon: Users },
    { value: "500+", label: "Productos", icon: Award },
    { value: "9 años", label: "De experiencia", icon: Clock },
    { value: "4.9★", label: "Calificación", icon: Heart },
];

export function PetAbout({ config }: { config?: any }) {
    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24 overflow-hidden">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#8B5E3C] via-[#A0714F] to-[#5C3D2E] py-24 md:py-36">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E8963C]/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#EDE0CF]/10 blur-3xl" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paw-print.png")` }} />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#D4B896]/50 backdrop-blur-xl backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-6">
                        <PawPrint className="h-3.5 w-3.5" />
                        Nuestra Historia
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                        Porque tu mascota<br />
                        <span className="text-[#E8963C]">merece lo mejor</span>
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                        Somos apasionados de los animales que decidieron transformar ese amor en un negocio. 
                        Creemos que cada mascota merece nutrición de calidad, juguetes seguros y dueños felices.
                    </p>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="bg-[#D4B896]/40 backdrop-blur-xl border-b border-[#EDE0CF] shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STATS.map(({ value, label, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#EDE0CF] flex items-center justify-center flex-shrink-0">
                                    <Icon className="h-6 w-6 text-[#8B5E3C]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-[#5C3D2E]">{value}</p>
                                    <p className="text-xs font-bold text-[#A0714F] uppercase tracking-wider">{label}</p>
                                </div>
                            </div>
                        ))}
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
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl p-7 border border-[#EDE0CF] hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300 hover:-translate-y-1 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#EDE0CF] to-[#D4B896] flex items-center justify-center mb-5">
                                    <Icon className="h-6 w-6 text-[#8B5E3C]" />
                                </div>
                                <h3 className="font-black text-[#5C3D2E] text-lg mb-2">{title}</h3>
                                <p className="text-[#A0714F] text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
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
                            {TIMELINE.map((item, idx) => (
                                <div key={item.year} className={`relative flex gap-6 md:gap-0 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    {/* Year pill (center) */}
                                    <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 z-10">
                                        <div className="h-10 w-16 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-black text-sm shadow-lg">
                                            {item.year}
                                        </div>
                                    </div>

                                    {/* Content */}
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
