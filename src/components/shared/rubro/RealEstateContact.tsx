"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export function RealEstateContact() {
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: z.infer<typeof contactSchema>) => {
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Mensaje enviado correctamente. Nos pondremos en contacto a la brevedad.");
            reset();
        } catch (error) {
            toast.error("Error al enviar el mensaje. Por favor intente nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pt-28 pb-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="mb-16 border-l-8 border-black pl-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">Contacto</h1>
                    <p className="text-xl md:text-2xl mt-4 text-black/70 max-w-2xl font-medium tracking-tight">
                        Póngase en contacto con nuestros agentes para asesoramiento exclusivo sobre propiedades premium.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Formulario */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Envíenos un mensaje</h2>
                            
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider">Nombre Completo</label>
                                        <input
                                            {...register("name")}
                                            className={`w-full h-14 border-2 p-4 text-lg font-medium outline-none transition-all focus:border-black focus:ring-0 ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}
                                            placeholder="Su nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider">Email</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className={`w-full h-14 border-2 p-4 text-lg font-medium outline-none transition-all focus:border-black focus:ring-0 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider">Teléfono</label>
                                        <input
                                            {...register("phone")}
                                            className="w-full h-14 border-2 border-gray-300 bg-gray-50 p-4 text-lg font-medium outline-none transition-all focus:border-black focus:ring-0"
                                            placeholder="+54 ..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider">Asunto</label>
                                        <input
                                            {...register("subject")}
                                            className={`w-full h-14 border-2 p-4 text-lg font-medium outline-none transition-all focus:border-black focus:ring-0 ${errors.subject ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}
                                            placeholder="Ej. Interés en propiedad"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider">Mensaje</label>
                                    <textarea
                                        {...register("message")}
                                        rows={5}
                                        className={`w-full border-2 p-4 text-lg font-medium outline-none transition-all focus:border-black focus:ring-0 resize-none ${errors.message ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}
                                        placeholder="Detalles de su consulta..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 bg-black text-white text-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Información de Contacto / Oficinas */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-black text-white p-10 shadow-[12px_12px_0px_0px_rgba(200,200,200,1)] border-4 border-black">
                            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">Nuestras Oficinas</h2>
                            
                            <div className="space-y-8">
                                {branches?.slice(0, 3).map((branch) => (
                                    <div key={branch.id} className="border-l-4 border-[#f5ab1c] pl-6 py-2">
                                        <h3 className="text-xl font-bold uppercase tracking-wider mb-3">{branch.name}</h3>
                                        <div className="space-y-3 text-white/80 font-medium">
                                            <p className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 shrink-0 text-[#f5ab1c]" />
                                                {branch.address}
                                                {branch.city && `, ${branch.city}`}
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 shrink-0 text-[#f5ab1c]" />
                                                {branch.phone || config?.contactPhone || "No disponible"}
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 shrink-0 text-[#f5ab1c]" />
                                                {branch.email || config?.contactEmail || "No disponible"}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!branches || branches.length === 0) && (
                                    <div className="border-l-4 border-[#f5ab1c] pl-6 py-2">
                                        <h3 className="text-xl font-bold uppercase tracking-wider mb-3">Casa Central</h3>
                                        <div className="space-y-3 text-white/80 font-medium">
                                            <p className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 shrink-0 text-[#f5ab1c]" />
                                                {config?.contactPhone || "No configurado"}
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 shrink-0 text-[#f5ab1c]" />
                                                {config?.contactEmail || "No configurado"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp Directo */}
                        <a 
                            href={`https://wa.me/${config?.contactPhone?.replace(/\D/g, "")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full border-4 border-black bg-[#f5ab1c] p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform group"
                        >
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-2">Asesoramiento Inmediato</h3>
                            <p className="text-black/80 font-bold tracking-widest text-sm mb-4">VÍA WHATSAPP</p>
                            <span className="inline-block border-b-2 border-black font-bold uppercase tracking-widest group-hover:px-4 transition-all">Iniciar Chat</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
