"use client";

import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = { facebook: Facebook, instagram: Instagram, twitter: Twitter };

const NAV_LINKS = [
    { label: "Colección",     href: "/products" },
    { label: "Novedades",     href: "/products?isNew=true" },
    { label: "Más Buscadas",  href: "/products?isTrending=true" },
    { label: "Mis Favoritos", href: "/favorites" },
];

const INFO_LINKS = [
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Contacto",       href: "/contact" },
    { label: "Mi Cuenta",      href: "/profile" },
    { label: "Mis Pedidos",    href: "/profile?tab=orders" },
];

export function PerfumeFooter() {
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
        { platform: "facebook",  icon: "facebook",  href: config?.socialFacebook },
        { platform: "twitter",   icon: "twitter",   href: config?.socialTwitter },
    ].filter((s) => s.href);

    const branch = branches?.[0];

    return (
        <footer className="bg-background text-foreground border-t border-primary/10">

            {/* ── NEWSLETTER STRIP ── */}
            <div className="bg-primary">
                <div className="container mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-black/50 text-[10px] tracking-[0.4em] uppercase font-bold mb-1">Exclusivo</p>
                        <h3 className="text-2xl font-serif text-black">Recibe nuestras novedades</h3>
                    </div>
                    <form className="flex w-full md:w-auto gap-0" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Tu email"
                            className="flex-1 md:w-72 px-6 py-4 bg-black/10 border border-black/20 text-black placeholder:text-black/40 text-sm focus:outline-none focus:bg-black/20 transition-colors"
                        />
                        <button type="submit" className="bg-black text-primary px-6 py-4 font-bold text-xs tracking-widest uppercase hover:bg-black/80 transition-colors flex items-center gap-2">
                            Suscribir <ArrowRight className="h-3 w-3" />
                        </button>
                    </form>
                </div>
            </div>

            {/* ── MAIN FOOTER GRID ── */}
            <div className="container mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="mb-8">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-10 w-auto brightness-0 invert mb-4" />
                            ) : (
                                <div className="mb-4">
                                    <span className="text-primary font-serif text-2xl tracking-[0.3em] uppercase block">{config?.storeName || "MAISON"}</span>
                                    <span className="text-foreground/20 text-[8px] tracking-[0.5em] uppercase">Parfum</span>
                                </div>
                            )}
                            <p className="text-foreground/40 text-sm font-light leading-relaxed">
                                Fragancias auténticas de las maisons más exclusivas del mundo. Tu firma olfativa, nuestra pasión.
                            </p>
                        </div>

                        {/* Social */}
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = iconMap[social.icon] || Instagram;
                                    return (
                                        <Link key={social.platform} href={social.href || "#"} target="_blank"
                                            className="w-10 h-10 border border-foreground/10 flex items-center justify-center text-foreground/40 hover:border-primary/50 hover:text-primary transition-all">
                                            <Icon className="h-4 w-4" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Colección */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-8">Colección</h4>
                        <ul className="space-y-4">
                            {NAV_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-foreground/50 hover:text-primary text-sm tracking-wide transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-8">Información</h4>
                        <ul className="space-y-4">
                            {INFO_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-foreground/50 hover:text-primary text-sm tracking-wide transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-8">Contacto</h4>
                        <ul className="space-y-5">
                            {branch?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground/50 text-sm leading-relaxed">{branch.address}{branch.city ? `, ${branch.city}` : ""}</span>
                                </li>
                            )}
                            {(config?.contactPhone || branch?.phone) && (
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                    <a href={`tel:${config?.contactPhone || branch?.phone}`}
                                        className="text-foreground/50 hover:text-primary text-sm transition-colors">
                                        {config?.contactPhone || branch?.phone}
                                    </a>
                                </li>
                            )}
                            {config?.contactEmail && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                    <a href={`mailto:${config.contactEmail}`}
                                        className="text-foreground/50 hover:text-primary text-sm transition-colors truncate">
                                        {config.contactEmail}
                                    </a>
                                </li>
                            )}
                            {config?.openingHours && (
                                <li className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground/50 text-sm">
                                        {typeof config.openingHours === "string"
                                            ? config.openingHours.split("\n")[0]
                                            : "Ver horarios"}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="border-t border-foreground/5">
                <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-foreground/20 text-[10px] tracking-[0.3em] uppercase">
                        © {new Date().getFullYear()} {config?.storeName || "Maison Parfum"}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        {[
                            { label: "Privacidad", href: "/privacy" },
                            { label: "Términos",   href: "/terms" },
                        ].map((l) => (
                            <Link key={l.label} href={l.href}
                                className="text-foreground/20 hover:text-primary text-[10px] tracking-widest uppercase transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
