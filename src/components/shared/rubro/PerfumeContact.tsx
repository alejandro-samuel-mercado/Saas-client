"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Branch, branchService } from "@/services/branch";
import { configService } from "@/services/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function PerfumeContact() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { data: branches, isLoading: isLoadingBranches } = useQuery({
        queryKey: ["branches"],
        queryFn: branchService.getAll,
        staleTime: 1000 * 60 * 60,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactForm) => {
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Mensaje enviado con éxito. Nos pondremos en contacto a la brevedad.");
            reset();
        } catch (error) {
            toast.error("Ocurrió un error al enviar el mensaje. Por favor, intente nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-sans pt-32 pb-40">
            {/* ── HEADER ── */}
            <div className="container mx-auto px-6 lg:px-12 mb-20 text-center">
                <span className="text-[hsl(var(--primary))] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Contáctenos</span>
                <h1 className="text-5xl md:text-7xl font-serif mb-6 text-[hsl(var(--foreground))]">
                    Contáctenos
                </h1>
                <p className="text-white/50 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                    Estamos aquí para asesorarte en la búsqueda de tu fragancia perfecta.
                </p>
            </div>

            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* ── LEFT: FORM ── */}
                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--primary))]/20 p-10 md:p-16">
                        <h2 className="text-3xl font-serif text-[hsl(var(--foreground))] mb-10">Envíenos un Mensaje</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Nombre Completo</Label>
                                    <Input
                                        {...register("name")}
                                        placeholder="Su nombre"
                                        className="bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-white/20 text-base"
                                    />
                                    {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Email</Label>
                                    <Input
                                        {...register("email")}
                                        placeholder="correo@ejemplo.com"
                                        className="bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-white/20 text-base"
                                    />
                                    {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Teléfono (Opcional)</Label>
                                    <Input
                                        {...register("phone")}
                                        placeholder="+54 9 11 1234 5678"
                                        className="bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-white/20 text-base"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Asunto</Label>
                                    <Input
                                        {...register("subject")}
                                        placeholder="Motivo de su consulta"
                                        className="bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-white/20 text-base"
                                    />
                                    {errors.subject && <span className="text-red-400 text-xs">{errors.subject.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Mensaje</Label>
                                <textarea
                                    {...register("message")}
                                    placeholder="¿En qué podemos ayudarle?"
                                    rows={4}
                                    className="w-full bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] placeholder:text-white/20 text-base resize-none focus:outline-none"
                                />
                                {errors.message && <span className="text-red-400 text-xs">{errors.message.message}</span>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[hsl(var(--primary))] hover:bg-white text-[hsl(var(--background))] font-bold tracking-[0.2em] uppercase text-xs h-14 rounded-none transition-colors"
                            >
                                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                            </Button>
                        </form>
                    </div>

                    {/* ── RIGHT: CONTACT INFO & BRANCHES ── */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif text-[hsl(var(--foreground))] mb-8">Información de Contacto</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">Email</h4>
                                        <p className="text-foreground/70 font-light">{config?.contactEmail || "Sin email configurado"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">Teléfono</h4>
                                        <p className="text-foreground/70 font-light">{config?.contactPhone || "Sin teléfono configurado"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-[hsl(var(--primary))]/10">
                            <h2 className="text-3xl font-serif text-[hsl(var(--foreground))] mb-8">Nuestras Boutiques</h2>
                            
                            {isLoadingBranches ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-32 w-full bg-[hsl(var(--card))]" />
                                    <Skeleton className="h-32 w-full bg-[hsl(var(--card))]" />
                                </div>
                            ) : branches && branches.length > 0 ? (
                                <div className="grid gap-6">
                                    {branches.filter(b => b.active || (b as any).isActive).map((branch) => (
                                        <div key={branch.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--primary))]/20 p-6 flex flex-col sm:flex-row gap-6 items-start group hover:border-[hsl(var(--primary))]/50 transition-colors">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-serif text-[hsl(var(--primary))]">{branch.name}</h3>
                                                    {(branch as any).isMain && (
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-none">
                                                            Flagship
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-white/50 text-sm font-light">
                                                        <MapPin className="w-4 h-4 text-[hsl(var(--primary))]" />
                                                        <span>{branch.address}, {branch.city}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-white/50 text-sm font-light">
                                                        <Clock className="w-4 h-4 text-[hsl(var(--primary))]" />
                                                        <span>{(branch as any).businessHours || "Lunes a Sábado, 10:00 a 20:00"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/40 italic">No hay boutiques disponibles por el momento.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
