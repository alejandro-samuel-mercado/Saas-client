"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { PawPrint, MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PetContact() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise((res) => setTimeout(res, 1000));
        toast.success("¡Mensaje enviado! Te respondemos a la brevedad 🐾");
        setForm({ name: "", email: "", subject: "", message: "" });
        setSending(false);
    };

    const branch = (config as any)?.branches?.[0];

    const CONTACT_INFO = [
        {
            icon: MapPin,
            label: "Dirección",
            value: branch?.address || config?.address || "Av. de los Animales 1234, Buenos Aires",
        },
        {
            icon: Phone,
            value: (config as any)?.whatsappNumber || (config as any)?.contactPhone || branch?.phone || "(011) 1234-5678",
        },
        {
            icon: Mail,
            label: "Email",
            value: config?.contactEmail || "hola@petshop.com",
        },
        {
            icon: Clock,
            label: "Horario",
            value: branch?.openHours || "Lun–Vie 9:00–20:00 · Sáb 9:00–18:00",
        },
    ];

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24">

            {/* ── HERO ── */}
            <section className="bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] py-20 relative overflow-hidden mb-16">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#E8963C]/20 blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#D4B896]/50 backdrop-blur-xl text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Estamos para ayudarte
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Contactanos</h1>
                    <p className="text-white/70 max-w-lg mx-auto text-sm leading-relaxed">
                        ¿Tenés dudas sobre algún producto o pedido? Nuestro equipo de amantes de mascotas está listo para ayudarte.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* ── FORM ── */}
                    <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] shadow-lg p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-2xl bg-[#EDE0CF] flex items-center justify-center">
                                <Send className="h-5 w-5 text-[#8B5E3C]" />
                            </div>
                            <h2 className="text-2xl font-black text-[#5C3D2E]">Envianos un mensaje</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#A0714F] block mb-2">Nombre</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Tu nombre"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-wider text-[#A0714F] block mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="tu@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-[#A0714F] block mb-2">Asunto</label>
                                <input
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    placeholder="¿En qué podemos ayudarte?"
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-wider text-[#A0714F] block mb-2">Mensaje</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Contanos tu consulta en detalle..."
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-2xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-4 rounded-2xl bg-[#8B5E3C] hover:bg-[#5C3D2E] text-white font-black text-base transition-all shadow-lg hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                {sending ? "Enviando..." : "Enviar mensaje"}
                            </button>
                        </form>

                        {/* WhatsApp CTA */}
                        {((config as any)?.whatsappNumber || (config as any)?.contactPhone) && (
                            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                                <MessageCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-green-700">¿Preferís WhatsApp?</p>
                                    <a
                                        href={`https://wa.me/${((config as any)?.whatsappNumber || (config as any)?.contactPhone || "").replace(/\D/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-green-600 font-bold hover:underline"
                                    >
                                        Escribinos directo → {(config as any)?.whatsappNumber || (config as any)?.contactPhone}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── CONTACT INFO ── */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] shadow-lg p-8">
                            <h2 className="text-2xl font-black text-[#5C3D2E] mb-6">Información de contacto</h2>
                            <div className="space-y-5">
                                {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-[#EDE0CF] flex items-center justify-center flex-shrink-0">
                                            <Icon className="h-5 w-5 text-[#8B5E3C]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider text-[#A0714F]">{label}</p>
                                            <p className="text-sm text-[#5C3D2E] font-medium mt-0.5">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mascot promo card */}
                        <div className="bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] rounded-3xl p-8 text-white overflow-hidden relative">
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-[#E8963C]/30 blur-2xl" />
                            <PawPrint className="h-10 w-10 text-[#E8963C] mb-4" />
                            <h3 className="font-black text-xl mb-2">¿Primera compra?</h3>
                            <p className="text-white/70 text-sm mb-5">Usá el código <span className="font-black text-[#E8963C]">BIENVENIDO10</span> y obtenés 10% de descuento.</p>
                            <a href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8963C] text-white font-bold text-sm hover:bg-[#D4763B] transition-colors">
                                Ver productos 🐾
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
