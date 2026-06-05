"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Flower2, Send, Instagram, Facebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { toast } from "sonner";

export function DecorContact() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // Simulate sending (replace with real API call when available)
        await new Promise(r => setTimeout(r, 1200));
        toast.success("¡Mensaje enviado! Te contactaremos a la brevedad ✦");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setIsSending(false);
    };

    return (
        <main className="min-h-screen" style={{ backgroundColor: "#F0E5D8" }}>

            {/* HERO */}
            <section className="relative pt-36 pb-20 px-6 lg:px-12 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 60%, #8B6F5E 100%)" }}>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                <div className="absolute top-0 right-0 w-96 h-64 rounded-b-full border border-[#C4A882]/20 translate-x-32 hidden lg:block" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <p className="text-[#C4A882] text-[10px] tracking-[0.4em] uppercase mb-6 font-sans flex items-center justify-center gap-3">
                        <span className="w-8 h-[1px] bg-[#C4A882] inline-block" /> Contacto <span className="w-8 h-[1px] bg-[#C4A882] inline-block" />
                    </p>
                    <h1 className="font-serif text-6xl md:text-7xl text-[#F0E5D8] leading-tight mb-6">
                        Hablemos de tu <br /><span className="italic text-[#C4A882]">evento</span>
                    </h1>
                    <p className="text-[#D5BBAA] font-sans font-light text-lg max-w-2xl mx-auto">
                        Contanos tu idea y en menos de 24hs te enviamos una propuesta personalizada.
                    </p>
                </div>

                <div className="w-full overflow-hidden leading-[0] mt-16">
                    <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                    </svg>
                </div>
            </section>

            {/* CONTENT */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-16 lg:gap-24">

                {/* Info side */}
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col gap-10">
                    <div>
                        <p className="text-[#8B6F5E] text-[10px] tracking-[0.3em] uppercase mb-4 font-sans flex items-center gap-2">
                            <Flower2 size={12} /> Información de contacto
                        </p>
                        <h2 className="font-serif text-4xl text-[#3A302A] leading-tight mb-8">
                            Estamos para <br /><span className="italic text-[#8B6F5E]">ayudarte</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        {config?.contactPhone && (
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 bg-[#E1CDBF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3A302A] group-hover:text-[#F0E5D8] transition-colors">
                                    <Phone size={16} className="text-[#3A302A] group-hover:text-[#F0E5D8]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8B6F5E] mb-1">Teléfono</p>
                                    <a href={`tel:${config.contactPhone}`} className="font-sans text-[#3A302A] hover:text-[#8B6F5E] transition-colors">{config.contactPhone}</a>
                                </div>
                            </div>
                        )}
                        {config?.contactEmail && (
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 bg-[#E1CDBF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#3A302A] group-hover:text-[#F0E5D8] transition-colors">
                                    <Mail size={16} className="text-[#3A302A] group-hover:text-[#F0E5D8]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8B6F5E] mb-1">Email</p>
                                    <a href={`mailto:${config.contactEmail}`} className="font-sans text-[#3A302A] hover:text-[#8B6F5E] transition-colors">{config.contactEmail}</a>
                                </div>
                            </div>
                        )}
                        {config?.address && (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#E1CDBF] flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} className="text-[#3A302A]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8B6F5E] mb-1">Ubicación</p>
                                    <p className="font-sans text-[#3A302A]">{config.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-4 pt-4 border-t border-[#3A302A]/10">
                        {config?.socialInstagram && (
                            <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#3A302A]/20 flex items-center justify-center hover:bg-[#3A302A] hover:border-[#3A302A] transition-all group">
                                <Instagram size={16} className="text-[#3A302A] group-hover:text-[#F0E5D8]" />
                            </a>
                        )}
                        {config?.socialFacebook && (
                            <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#3A302A]/20 flex items-center justify-center hover:bg-[#3A302A] hover:border-[#3A302A] transition-all group">
                                <Facebook size={16} className="text-[#3A302A] group-hover:text-[#F0E5D8]" />
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Form side */}
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#5C4A3E] mb-2">Nombre</label>
                                <input name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre"
                                    className="w-full px-0 py-3 border-b border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#5C4A3E] mb-2">Teléfono</label>
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="11 1234-5678"
                                    className="w-full px-0 py-3 border-b border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#5C4A3E] mb-2">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="tu@correo.com"
                                className="w-full px-0 py-3 border-b border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#5C4A3E] mb-2">Tipo de evento</label>
                            <select name="subject" value={form.subject} onChange={handleChange}
                                className="w-full px-0 py-3 border-b border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans outline-none focus:border-[#3A302A] transition-colors appearance-none">
                                <option value="">Seleccioná una opción</option>
                                <option>Boda / Casamiento</option>
                                <option>Quinceaños</option>
                                <option>Bautismo / Baby Shower</option>
                                <option>Cumpleaños</option>
                                <option>Evento Corporativo</option>
                                <option>Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-sans tracking-[0.2em] uppercase text-[#5C4A3E] mb-2">Contanos tu idea</label>
                            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="¿Cuántos invitados? ¿Fecha tentativa? ¿Paleta de colores?"
                                className="w-full px-0 py-3 border-b border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors resize-none" />
                        </div>

                        <button type="submit" disabled={isSending}
                            className="self-start flex items-center gap-4 bg-[#3A302A] text-[#F0E5D8] hover:bg-[#5C4A3E] transition-all duration-300 font-sans text-xs tracking-[0.3em] uppercase py-4 px-10 disabled:opacity-50 mt-4">
                            {isSending ? "Enviando..." : <><Send size={12} /> Enviar consulta</>}
                        </button>
                    </form>
                </motion.div>
            </section>
        </main>
    );
}
