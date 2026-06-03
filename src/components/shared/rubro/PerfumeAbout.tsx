"use client";

import { about } from "@/../content/about";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, CheckCircle, Leaf, Lightbulb, Linkedin, Lock, ShieldCheck, Twitter, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconMap: Record<string, any> = {
    award: Award,
    users: Users,
    lightbulb: Lightbulb,
    leaf: Leaf,
    "shield-check": ShieldCheck,
    lock: Lock,
    "check-circle": CheckCircle,
};

export function PerfumeAbout({ config }: { config?: any }) {
    const timelineData = config?.customPageChronology && config.customPageChronology.length > 0 
        ? config.customPageChronology 
        : about.story.timeline;

    return (
        <main className="min-h-screen bg-[#171310] text-[#f9f1d8] font-sans pb-40 relative overflow-hidden">
            {/* ── HERO ── */}
            <section className="relative pt-40 pb-48 flex items-center justify-center overflow-hidden bg-[#1e1a14] border-b border-[#d4af37]/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-5" />
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Nuestra Historia</span>
                    <h1 className="text-6xl md:text-8xl font-serif mb-8 text-[#f9f1d8]">
                        {about.hero.title}
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                        {about.hero.subtitle}
                    </p>
                </div>
            </section>

            {/* ── HISTORIA / TIMELINE ── */}
            <section className="py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#d4af37]">El Legado</h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#d4af37]/20 md:-ml-px" />
                        {timelineData.map((item: any, idx: number) => {
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
                                        <div className="bg-[#1e1a14] p-10 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors relative overflow-hidden group">
                                            <span className="text-5xl font-serif text-[#d4af37] block mb-4 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {item.year}
                                            </span>
                                            <h3 className="text-2xl font-bold mb-4 text-[#f9f1d8] relative z-10">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/50 text-sm leading-relaxed relative z-10 font-light">
                                                {item.desc || item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute left-[20px] md:left-1/2 top-10 w-4 h-4 rounded-full bg-[#171310] border-2 border-[#d4af37] z-10 md:-ml-2 transform -translate-x-1/2 md:translate-x-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── VALORES ── */}
            <section className="py-32 bg-[#1e1a14] border-y border-[#d4af37]/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Filosofía</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 text-[#f9f1d8]">
                            {about.mission.title}
                        </h2>
                        <p className="text-white/50 font-light leading-relaxed">
                            {about.mission.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {about.values.map((value: any, idx: number) => {
                            const Icon = iconMap[value.icon];
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                    className="bg-[#171310] p-10 border border-[#d4af37]/10 hover:border-[#d4af37]/40 transition-colors text-center group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center border border-[#d4af37]/30 rounded-full group-hover:bg-[#d4af37]/10 transition-colors">
                                        <Icon className="w-6 h-6 text-[#d4af37]" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4 text-[#f9f1d8]">
                                        {value.title}
                                    </h3>
                                    <p className="text-white/40 text-sm font-light leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── EQUIPO ── */}
            <section className="py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-24">
                        <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Artesanos</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#f9f1d8]">
                            {about.team.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {about.team.members.map((member: any, idx: number) => (
                            <div key={idx} className="group relative">
                                <div className="relative aspect-[3/4] overflow-hidden border border-[#d4af37]/20 bg-[#1e1a14]">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10">
                                            <span className="text-6xl font-serif">M</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="text-xl font-bold mb-1 text-[#f9f1d8]">{member.name}</h3>
                                        <p className="text-[#d4af37] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
                                            {member.role}
                                        </p>
                                        <div className="flex gap-4">
                                            {member.social.linkedin && (
                                                <Linkedin onClick={() => window.open(member.social.linkedin, "_blank")}
                                                    className="w-4 h-4 text-white/50 hover:text-[#d4af37] cursor-pointer transition-colors" />
                                            )}
                                            {member.social.twitter && (
                                                <Twitter onClick={() => window.open(member.social.twitter, "_blank")}
                                                    className="w-4 h-4 text-white/50 hover:text-[#d4af37] cursor-pointer transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24">
                <div className="container mx-auto px-6 text-center">
                    <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-16 max-w-4xl mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=900')] bg-cover bg-center opacity-5" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-[#f9f1d8]">
                                {about.cta.title}
                            </h2>
                            <p className="text-white/50 font-light mb-12">
                                {about.cta.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button size="lg" className="bg-[#d4af37] hover:bg-white text-black font-bold tracking-widest uppercase text-[10px] h-14 px-10 transition-colors rounded-none" asChild>
                                    <Link href="/products">{about.cta.primaryButton}</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 font-bold tracking-widest uppercase text-[10px] h-14 px-10 transition-colors rounded-none bg-transparent" asChild>
                                    <Link href="/contact">{about.cta.secondaryButton}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
