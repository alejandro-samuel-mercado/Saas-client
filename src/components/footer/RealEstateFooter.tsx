"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
};

export function RealEstateFooter() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    const socialLinks = [
        { platform: "instagram", icon: "instagram", href: config?.socialInstagram },
        { platform: "facebook", icon: "facebook", href: config?.socialFacebook },
        { platform: "twitter", icon: "twitter", href: config?.socialTwitter },
    ].filter((s) => s.href);

    return (
        <footer className="relative bg-[#0a0a0a] text-white pt-32 pb-12 overflow-hidden border-t border-white/10">
            {/* Background Big Text (Gym style) */}
            <h2 className="absolute top-[-2rem] left-[-2rem] text-[10rem] md:text-[15rem] font-black text-[#1a1a1a] whitespace-nowrap pointer-events-none uppercase tracking-tighter select-none z-0">
                {config?.storeName || "REAL ESTATE"} {config?.storeName || "REAL ESTATE"}
            </h2>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    
                    {/* Branding */}
                    <div className="lg:col-span-2">
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">
                            LIDERANDO EL<br /> <span className="text-[#f5ab1c]">FUTURO.</span>
                        </h3>
                        <p className="text-white/60 text-lg max-w-md mb-8 font-light">
                            {(config as any)?.description || "Desarrollos excepcionales. Inversiones seguras. El estándar más alto del mercado inmobiliario."}
                        </p>
                        
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => {
                                const Icon = iconMap[social.icon] || Facebook;
                                return (
                                    <Link
                                        key={idx}
                                        href={social.href || "#"}
                                        className="text-white hover:text-[#f5ab1c] transition-colors"
                                        target="_blank"
                                    >
                                        <Icon className="h-6 w-6" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6">Navegación</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-lg font-bold hover:text-[#f5ab1c] transition-colors uppercase tracking-wider">Inicio</Link></li>
                            <li><Link href="/products" className="text-lg font-bold hover:text-[#f5ab1c] transition-colors uppercase tracking-wider">Desarrollos</Link></li>
                            <li><Link href="/products?isTrending=true" className="text-lg font-bold hover:text-[#f5ab1c] transition-colors uppercase tracking-wider">Propiedades</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            {config?.contactPhone && (
                                <li>
                                    <a href={`tel:${config.contactPhone}`} className="text-lg font-bold hover:text-[#f5ab1c] transition-colors tracking-widest">
                                        {config.contactPhone}
                                    </a>
                                </li>
                            )}
                            {config?.contactEmail && (
                                <li>
                                    <a href={`mailto:${config.contactEmail}`} className="text-lg font-bold hover:text-[#f5ab1c] transition-colors tracking-widest">
                                        {config.contactEmail}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 pb-24 sm:pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                    <p>&copy; {new Date().getFullYear()} {config?.storeName || "REAL ESTATE"}. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="flex gap-6">
                        <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
                        <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
