/* eslint-disable @next/next/no-img-element */
"use client";

import { configService } from "@/services/config";
import { branchService } from "@/services/branch";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Watch } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = { facebook: Facebook, instagram: Instagram, twitter: Twitter };

const INFO_LINKS = [
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
    { label: "Mi Cuenta", href: "/profile" },
    { label: "Mis Pedidos", href: "/profile?tab=orders" },
    { label: "Favoritos", href: "/favorites" },
];

export function WatchFooter() {
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

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => import("@/services/products").then(m => m.productService.getCategoriesTree()),
        staleTime: 1000 * 60 * 60,
    });

    const socialLinks = [
        { platform: "instagram", icon: "instagram", href: config?.socialInstagram },
        { platform: "facebook", icon: "facebook", href: config?.socialFacebook },
        { platform: "twitter", icon: "twitter", href: config?.socialTwitter },
    ].filter((s) => s.href);

    const branch = branches?.[0];

    return (
        <footer className="bg-background text-foreground border-t border-primary/10 relative overflow-hidden">
            {/* Decorative grid background */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{ backgroundImage: "linear-gradient(#8a9ab5 1px, transparent 1px), linear-gradient(90deg, #8a9ab5 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

            {/* Main Grid */}
            <div className="relative container mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="mb-8">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-8 w-auto brightness-0 invert opacity-60 mb-6" />
                            ) : (
                                <div className="mb-6 flex items-center gap-2">
                                    <Watch className="h-5 w-5 text-primary" />
                                    <span className="text-foreground font-mono text-lg tracking-[0.3em] uppercase">{config?.storeName || "HORLOGER"}</span>
                                </div>
                            )}
                            <p className="text-primary/50 text-sm font-light leading-relaxed font-mono">
                                Precisión y exclusividad en cada pieza. Relojes y accesorios de las marcas más prestigiosas del mundo.
                            </p>
                        </div>

                        {/* Precision badge */}
                        <div className="border border-primary/15 px-4 py-3 inline-block mb-6">
                            <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-primary/40">Autenticidad Garantizada</p>
                        </div>

                        {/* Social */}
                        {socialLinks.length > 0 && (
                            <div className="flex gap-3 mt-2">
                                {socialLinks.map((social) => {
                                    const Icon = iconMap[social.icon] || Instagram;
                                    return (
                                        <Link key={social.platform} href={social.href || "#"} target="_blank"
                                            className="w-8 h-8 border border-primary/15 flex items-center justify-center text-primary/40 hover:border-primary/60 hover:text-foreground transition-all">
                                            <Icon className="h-3.5 w-3.5" />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Colección */}
                    <div>
                        <h4 className="text-[9px] font-mono font-bold tracking-[0.5em] uppercase text-primary mb-8 border-b border-primary/10 pb-4">Colección</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/products" className="text-primary/50 hover:text-foreground text-sm font-mono tracking-wide transition-colors flex items-center gap-3 group">
                                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                                    Ver Colección
                                </Link>
                            </li>
                            {(categories || [])
                                .filter((c: any) => c._count?.products > 0)
                                .slice(0, 4)
                                .map((cat: any) => (
                                <li key={cat.id}>
                                    <Link href={cat.slug ? `/products?categoria=${cat.slug}` : `/products?category=${cat.slug}`} className="text-primary/50 hover:text-foreground text-sm font-mono tracking-wide transition-colors flex items-center gap-3 group">
                                        <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información */}
                    <div>
                        <h4 className="text-[9px] font-mono font-bold tracking-[0.5em] uppercase text-primary mb-8 border-b border-primary/10 pb-4">Información</h4>
                        <ul className="space-y-4">
                            {INFO_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-primary/50 hover:text-foreground text-sm font-mono tracking-wide transition-colors flex items-center gap-3 group">
                                        <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-[9px] font-mono font-bold tracking-[0.5em] uppercase text-primary mb-8 border-b border-primary/10 pb-4">Contacto</h4>
                        <ul className="space-y-5">
                            {branch?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-primary/50 text-sm font-mono leading-relaxed">{branch.address}{branch.city ? `, ${branch.city}` : ""}</span>
                                </li>
                            )}
                            {(config?.contactPhone || branch?.phone) && (
                                <li className="flex items-center gap-3">
                                    <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <a href={`tel:${config?.contactPhone || branch?.phone}`}
                                        className="text-primary/50 hover:text-foreground text-sm font-mono transition-colors">
                                        {config?.contactPhone || branch?.phone}
                                    </a>
                                </li>
                            )}
                            {config?.contactEmail && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    <a href={`mailto:${config.contactEmail}`}
                                        className="text-primary/50 hover:text-foreground text-sm font-mono transition-colors truncate">
                                        {config.contactEmail}
                                    </a>
                                </li>
                            )}
                            {config?.openingHours && (
                                <li className="flex items-start gap-3">
                                    <Clock className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-primary/50 text-sm font-mono">
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

            {/* Bottom bar */}
            <div className="relative border-t border-primary/8">
                <div className="container mx-auto px-6 lg:px-12 py-5 pb-24 sm:pb-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-primary/25 text-[9px] tracking-[0.4em] uppercase font-mono">
                        © {new Date().getFullYear()} {config?.storeName || "Horloger"}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        {[{ label: "Privacidad", href: "/privacy" }, { label: "Términos", href: "/terms" }].map((l) => (
                            <Link key={l.label} href={l.href}
                                className="text-primary/25 hover:text-primary text-[9px] tracking-[0.3em] uppercase font-mono transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
