"use client";

import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Watch } from "lucide-react";
import { toast } from "sonner";

export function WatchContact() {
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
        toast.success("Consulta enviada. Te contactamos en breve.");
        setForm({ name: "", email: "", phone: "", message: "" });
        setIsSubmitting(false);
    };

    const branch = branches?.[0];

    const inputClass = "w-full bg-background border border-primary/15 text-foreground font-mono text-sm px-4 py-3 outline-none focus:border-primary/50 transition-colors placeholder:text-primary/25";

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pb-32">
            {/* HERO */}
            <section className="pt-40 pb-20 border-b border-primary/20 bg-card">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-primary/40" />
                        <Watch className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-primary font-mono text-[10px] tracking-[0.5em] uppercase block mb-4">Contacto</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-light text-white">Hablemos de Relojes</h1>
                </div>
            </section>

            <div className="container mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* FORM */}
                    <div className="bg-card p-10 rounded-[2rem] border border-primary/20">
                        <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-primary mb-8 border-b border-primary/20 pb-4">Envianos tu Consulta</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Nombre" value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    required className="w-full bg-background border border-primary/20 text-foreground font-mono text-sm px-6 py-4 rounded-full outline-none focus:border-primary/60 transition-colors placeholder:text-foreground/30" />
                                <input type="email" placeholder="Email" value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    required className="w-full bg-background border border-primary/20 text-foreground font-mono text-sm px-6 py-4 rounded-full outline-none focus:border-primary/60 transition-colors placeholder:text-foreground/30" />
                            </div>
                            <input type="tel" placeholder="Teléfono (opcional)" value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className="w-full bg-background border border-primary/20 text-foreground font-mono text-sm px-6 py-4 rounded-full outline-none focus:border-primary/60 transition-colors placeholder:text-foreground/30" />
                            <textarea placeholder="Contanos qué buscás. Marca, referencia, presupuesto..."
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                required rows={6} className="w-full bg-background border border-primary/20 text-foreground font-mono text-sm px-6 py-4 rounded-3xl outline-none focus:border-primary/60 transition-colors placeholder:text-foreground/30 resize-none" />
                            <button type="submit" disabled={isSubmitting}
                                className="w-full bg-primary text-background py-4 rounded-full font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? "Enviando..." : "Enviar Consulta"}
                            </button>
                        </form>

                        {/* WhatsApp */}
                        {config?.contactPhone && (
                            <div className="mt-8 border border-primary/20 p-6 rounded-[2rem] bg-background">
                                <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-primary mb-3">Respuesta Rápida</p>
                                <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, quisiera consultar sobre relojes y accesorios.")}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm font-mono text-foreground hover:text-white transition-colors group">
                                    <span className="text-[#25D366] font-bold">WhatsApp</span>
                                    <span className="text-foreground/50 group-hover:text-primary transition-colors">→ {config.contactPhone}</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="space-y-8 bg-card p-10 rounded-[2rem] border border-primary/20 h-fit">
                        <div>
                            <h2 className="text-[10px] font-mono tracking-[0.5em] uppercase text-primary mb-8 border-b border-primary/20 pb-4">Información de Contacto</h2>
                            <ul className="space-y-6">
                                {(branch?.address || (config as any)?.storeAddress) && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full border border-primary/30 bg-background flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/50 mb-1">Dirección</p>
                                            <p className="text-sm font-mono text-foreground">{branch?.address || (config as any)?.storeAddress}{branch?.city ? `, ${branch.city}` : ""}</p>
                                        </div>
                                    </li>
                                )}
                                {(config?.contactPhone || branch?.phone) && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full border border-primary/30 bg-background flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/50 mb-1">Teléfono</p>
                                            <a href={`tel:${config?.contactPhone || branch?.phone}`}
                                                className="text-sm font-mono text-foreground hover:text-primary transition-colors">
                                                {config?.contactPhone || branch?.phone}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {config?.contactEmail && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full border border-primary/30 bg-background flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/50 mb-1">Email</p>
                                            <a href={`mailto:${config.contactEmail}`}
                                                className="text-sm font-mono text-foreground hover:text-primary transition-colors">
                                                {config.contactEmail}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {config?.openingHours && (
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full border border-primary/30 bg-background flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/50 mb-1">Horarios</p>
                                            <p className="text-sm font-mono text-foreground">
                                                {typeof config.openingHours === "string"
                                                    ? config.openingHours
                                                    : "Ver horarios en tienda"}
                                            </p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Map */}
                        {(branch as any)?.coordinates && (
                            <div className="rounded-[1.5rem] border border-primary/20 overflow-hidden mt-8">
                                <div className="bg-background border-b border-primary/20 px-6 py-4">
                                    <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-primary">Ubicación</p>
                                </div>
                                <iframe
                                    src={`https://maps.google.com/maps?q=${(branch as any).coordinates.lat},${(branch as any).coordinates.lng}&output=embed`}
                                    className="w-full h-64" loading="lazy" title="Ubicación"
                                    style={{ filter: "grayscale(100%) invert(90%) contrast(80%) sepia(30%) hue-rotate(10deg)" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
