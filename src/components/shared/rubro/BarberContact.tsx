"use client";

import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Scissors } from "lucide-react";
import { toast } from "sonner";

export function BarberContact() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { data: branches } = useQuery({
        queryKey: ["branches"],
        queryFn: branchService.getAll,
        staleTime: 1000 * 60 * 60,
    });

    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));
        toast.success("Mensaje enviado. Te responderemos a la brevedad.");
        setForm({ name: "", email: "", phone: "", message: "" });
        setIsSubmitting(false);
    };

    const branch = branches?.[0];

    return (
        <main className="min-h-screen bg-[#111] text-[#f4f4f4] font-sans pb-32 pt-24">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* HERO */}
            <section className="pt-20 pb-16 relative z-10 border-b border-[#333] bg-[#161616]">
                <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-12 bg-[#e65c00]" />
                        <Scissors className="h-6 w-6 text-[#e65c00]" />
                    </div>
                    <span className="text-[#e65c00] text-xs font-bold tracking-[0.3em] uppercase block mb-4">Atención al Cliente</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">Reserva & <br className="hidden md:block" /> Consultas</h1>
                </div>
            </section>

            <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* FORM */}
                    <div className="bg-[#161616] p-10 border border-[#333] relative group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#e65c00] opacity-0 group-hover:opacity-10 -rotate-45 translate-x-8 -translate-y-8 transition-all duration-500" />
                        
                        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#e65c00] mb-8 border-b border-[#333] pb-4">Envíanos un Mensaje</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" placeholder="Nombre" value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    required className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm px-6 py-4 outline-none focus:border-[#e65c00] transition-colors placeholder:text-gray-600" />
                                <input type="email" placeholder="Email" value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    required className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm px-6 py-4 outline-none focus:border-[#e65c00] transition-colors placeholder:text-gray-600" />
                            </div>
                            <input type="tel" placeholder="Teléfono (opcional)" value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm px-6 py-4 outline-none focus:border-[#e65c00] transition-colors placeholder:text-gray-600" />
                            <textarea placeholder="Motivo de consulta. ¿Reserva, producto, dudas?"
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                required rows={6} className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm px-6 py-4 outline-none focus:border-[#e65c00] transition-colors placeholder:text-gray-600 resize-none" />
                            <button type="submit" disabled={isSubmitting}
                                className="w-full bg-[#e65c00] text-white py-4 font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                            </button>
                        </form>

                        {/* WhatsApp */}
                        {config?.contactPhone && (
                            <div className="mt-8 border border-[#e65c00]/30 p-6 bg-[#1A1A1A]">
                                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#e65c00] mb-3">Contacto Rápido</p>
                                <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, quisiera hacer una consulta.")}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm font-bold uppercase text-white hover:text-[#e65c00] transition-colors">
                                    <span className="text-[#25D366]">WhatsApp</span>
                                    <span className="text-gray-400">→ {config.contactPhone}</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="space-y-8 bg-[#161616] p-10 border border-[#333] h-fit">
                        <div>
                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#e65c00] mb-8 border-b border-[#333] pb-4">Información del Salón</h2>
                            <ul className="space-y-8">
                                {(branch?.address || (config as any)?.storeAddress) && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-5 w-5 text-[#e65c00]" />
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Ubicación</p>
                                            <p className="text-sm font-bold text-white uppercase">{branch?.address || (config as any)?.storeAddress}{branch?.city ? `, ${branch.city}` : ""}</p>
                                        </div>
                                    </li>
                                )}
                                {(config?.contactPhone || branch?.phone) && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-5 w-5 text-[#e65c00]" />
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Línea Directa</p>
                                            <a href={`tel:${config?.contactPhone || branch?.phone}`}
                                                className="text-sm font-bold text-white hover:text-[#e65c00] transition-colors">
                                                {config?.contactPhone || branch?.phone}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {config?.contactEmail && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-5 w-5 text-[#e65c00]" />
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Correo Electrónico</p>
                                            <a href={`mailto:${config.contactEmail}`}
                                                className="text-sm font-bold text-white hover:text-[#e65c00] transition-colors">
                                                {config.contactEmail}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {config?.openingHours && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#1A1A1A] border border-[#333] flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-5 w-5 text-[#e65c00]" />
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Disponibilidad</p>
                                            <p className="text-sm font-bold text-white">
                                                {typeof config.openingHours === "string"
                                                    ? config.openingHours
                                                    : "Ver disponibilidad en reserva"}
                                            </p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Map */}
                        {(branch as any)?.coordinates && (
                            <div className="border border-[#333] overflow-hidden mt-8 bg-[#1A1A1A] p-2">
                                <iframe
                                    src={`https://maps.google.com/maps?q=${(branch as any).coordinates.lat},${(branch as any).coordinates.lng}&output=embed`}
                                    className="w-full h-64 border border-[#333]" loading="lazy" title="Ubicación"
                                    style={{ filter: "grayscale(100%) invert(100%) contrast(150%) sepia(20%) hue-rotate(15deg)" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
