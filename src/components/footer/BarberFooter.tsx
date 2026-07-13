"use client";

import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Scissors } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = { facebook: Facebook, instagram: Instagram, twitter: Twitter };

const COLLECTION_LINKS = [
    { label: "Catálogo Completo", href: "/products" },
    { label: "Máquinas", href: "/products?category=maquinas" },
    { label: "Cuidado de Barba", href: "/products?category=cuidado-barba" },
    { label: "Pomadas", href: "/products?category=pomadas" },
    { label: "Accesorios", href: "/products?category=accesorios" },
];

const INFO_LINKS = [
    { label: "Nuestra Historia", href: "/about" },
    { label: "Contacto", href: "/contact" },
    { label: "Mi Cuenta", href: "/profile" },
    { label: "Mis Pedidos", href: "/profile?tab=orders" },
];

export function BarberFooter() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 0,
    });

    const { data: branches } = useQuery({
        queryKey: ["branches"],
        queryFn: branchService.getAll,
        staleTime: 1000 * 60 * 60,
    });

    const socialLinks = [
        { platform: "instagram", icon: "instagram", href: config?.socialInstagram },
        { platform: "facebook", icon: "facebook", href: config?.socialFacebook },
        { platform: "twitter", icon: "twitter", href: config?.socialTwitter },
    ].filter((s) => s.href);

    const branch = branches?.[0];

    return (
        <footer className="bg-[#111] text-[#f4f4f4] border-t-4 border-[#e65c00] relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* Main Grid */}
            <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="mb-8">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-10 w-auto mb-6" />
                            ) : (
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="bg-[#e65c00] p-2">
                                        <Scissors className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-white font-black text-2xl uppercase tracking-tighter">{config?.storeName || "BARBERÍA"}</span>
                                </div>
                            )}
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                Tradición, precisión y estilo en cada detalle. Tu aliado en el grooming masculino profesional.
                            </p>
                        </div>

                        {/* Social */}
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3 mt-2">
                                {socialLinks.map((social) => {
                                    const Icon = iconMap[social.icon] || Instagram;
                                    return (
                                        <Link key={social.platform} href={social.href || "#"} target="_blank"
                                            className="w-10 h-10 bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-gray-400 hover:bg-[#e65c00] hover:text-white hover:border-[#e65c00] transition-all">
                                            <Icon className="h-4 w-4" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Colección */}
                    <div>
                        <h4 className="text-sm font-black tracking-widest uppercase text-white mb-8 border-b border-[#333] pb-4">Productos</h4>
                        <ul className="space-y-4">
                            {COLLECTION_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-[#e65c00] text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-3 group">
                                        <span className="w-1.5 h-1.5 bg-[#333] group-hover:bg-[#e65c00] transition-colors" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información */}
                    <div>
                        <h4 className="text-sm font-black tracking-widest uppercase text-white mb-8 border-b border-[#333] pb-4">Navegación</h4>
                        <ul className="space-y-4">
                            {INFO_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-[#e65c00] text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-3 group">
                                        <span className="w-1.5 h-1.5 bg-[#333] group-hover:bg-[#e65c00] transition-colors" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-sm font-black tracking-widest uppercase text-white mb-8 border-b border-[#333] pb-4">Sede Central</h4>
                        <ul className="space-y-5">
                            {branch?.address && (
                                <li className="flex items-start gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] text-[#e65c00] shrink-0">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-400 text-sm font-medium leading-relaxed pt-1">{branch.address}{branch.city ? `, ${branch.city}` : ""}</span>
                                </li>
                            )}
                            {(config?.contactPhone || branch?.phone) && (
                                <li className="flex items-center gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] text-[#e65c00] shrink-0">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <a href={`tel:${config?.contactPhone || branch?.phone}`}
                                        className="text-gray-400 hover:text-white text-sm font-bold tracking-wider transition-colors pt-1">
                                        {config?.contactPhone || branch?.phone}
                                    </a>
                                </li>
                            )}
                            {config?.contactEmail && (
                                <li className="flex items-center gap-4">
                                    <div className="bg-[#1A1A1A] p-2 border border-[#333] text-[#e65c00] shrink-0">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <a href={`mailto:${config.contactEmail}`}
                                        className="text-gray-400 hover:text-white text-sm font-bold tracking-wider transition-colors pt-1 truncate">
                                        {config.contactEmail}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative border-t border-[#333] bg-[#0a0a0a]">
                <div className="container mx-auto px-6 lg:px-12 py-6 pb-24 sm:pb-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs font-bold tracking-widest uppercase">
                        © {new Date().getFullYear()} {config?.storeName || "Barbería"}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        {[{ label: "Privacidad", href: "/privacy" }, { label: "Términos", href: "/terms" }].map((l) => (
                            <Link key={l.label} href={l.href}
                                className="text-gray-600 hover:text-[#e65c00] text-xs font-bold tracking-widest uppercase transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
