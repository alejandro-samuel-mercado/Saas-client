"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function DecorFooter() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    return (
        <footer className="w-full bg-[#3A302A] text-[#F0E5D8] py-16 px-6 lg:px-12 font-sans border-t border-[#C4A882]/20">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="font-serif text-4xl tracking-tighter text-[#E1CDBF]">
                            {config?.storeName ? (
                                <span className="uppercase">{config.storeName}</span>
                            ) : (
                                "FLEUR"
                            )}
                        </Link>
                        <p className="text-[#C4A882] text-sm leading-relaxed max-w-xs">
                            {config?.customPageDescription || "Transformamos espacios en experiencias inolvidables. Especialistas en decoración y ambientación de eventos."}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[#F0E5D8] text-xs font-bold tracking-[0.2em] uppercase mb-2">Explorar</h4>
                        <Link href="/" className="text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">Inicio</Link>
                        <Link href="/products" className="text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">Colecciones</Link>
                        <Link href="/about" className="text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">Nosotros</Link>
                        <Link href="/contact" className="text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">Contacto</Link>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[#F0E5D8] text-xs font-bold tracking-[0.2em] uppercase mb-2">Contacto</h4>
                        {config?.contactEmail && (
                            <a href={`mailto:${config.contactEmail}`} className="flex items-center gap-3 text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">
                                <Mail size={16} />
                                {config.contactEmail}
                            </a>
                        )}
                        {config?.contactPhone && (
                            <a href={`tel:${config.contactPhone}`} className="flex items-center gap-3 text-[#C4A882] hover:text-[#E1CDBF] transition-colors text-sm w-fit">
                                <Phone size={16} />
                                {config.contactPhone}
                            </a>
                        )}
                        {config?.address && (
                            <div className="flex items-center gap-3 text-[#C4A882] text-sm">
                                <MapPin size={16} className="flex-shrink-0" />
                                <span>{config.address}</span>
                            </div>
                        )}
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[#F0E5D8] text-xs font-bold tracking-[0.2em] uppercase mb-2">Seguinos</h4>
                        <div className="flex items-center gap-4">
                            {config?.socialInstagram && (
                                <a href={config.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#C4A882]/30 flex items-center justify-center text-[#C4A882] hover:bg-[#C4A882] hover:text-[#3A302A] transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {config?.socialFacebook && (
                                <a href={config.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#C4A882]/30 flex items-center justify-center text-[#C4A882] hover:bg-[#C4A882] hover:text-[#3A302A] transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#C4A882]/10 text-xs text-[#C4A882]/60">
                    <p>© {new Date().getFullYear()} {config?.storeName || "Fleur"}. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <Link href="/legal/terms" className="hover:text-[#C4A882] transition-colors">Términos y Condiciones</Link>
                        <Link href="/legal/privacy" className="hover:text-[#C4A882] transition-colors">Política de Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
