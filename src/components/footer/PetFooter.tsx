"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { PawPrint, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function PetFooter() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const LINKS = {
        tienda: [
            { label: "Alimentos", href: "/products?category=alimentos-perros" },
            { label: "Juguetes", href: "/products?category=juguetes-mascotas" },
            { label: "Accesorios", href: "/products?category=accesorios-mascotas" },
            { label: "Higiene & Cuidado", href: "/products?category=higiene-mascotas" },
            { label: "Novedades", href: "/products?isNew=true" },
        ],
        info: [
            { label: "Sobre Nosotros", href: "/about" },
            { label: "Contacto", href: "/contact" },
            { label: "Preguntas Frecuentes", href: "/faq" },


        ],
    };

    return (
        <footer className="bg-[#5C3D2E] text-[#F0E8DA] mt-auto">
            {/* Wave top */}
            <div className="overflow-hidden -mb-1">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 -mb-px" preserveAspectRatio="none">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#5C3D2E" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-2 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="h-10 w-10 rounded-full bg-[#E8963C] flex items-center justify-center">
                                <PawPrint className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-black text-xl text-[#EDE0CF]">{config?.storeName || "PetShop"}</span>
                        </div>
                        <p className="text-[#C9A882] text-sm leading-relaxed mb-6">
                            {(config as any)?.aboutText || (config as any)?.description || "Todo lo que tu mascota necesita para ser feliz. Alimentos premium, juguetes y accesorios con amor."}
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: (config as any)?.facebookUrl || config?.socialFacebook || "#" },
                                { icon: Instagram, href: (config as any)?.instagramUrl || config?.socialInstagram || "#" },
                                { icon: Twitter, href: "#" },
                            ].map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                                    className="h-9 w-9 rounded-full bg-[#8B5E3C] flex items-center justify-center text-[#EDE0CF] hover:bg-[#E8963C] hover:text-white transition-all duration-200">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Tienda */}
                    <div>
                        <h3 className="font-black text-[#EDE0CF] uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-[#E8963C] rounded-full" />
                            Tienda
                        </h3>
                        <ul className="space-y-2.5">
                            {LINKS.tienda.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-[#C9A882] hover:text-[#E8963C] text-sm font-medium transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información */}
                    <div>
                        <h3 className="font-black text-[#EDE0CF] uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-[#E8963C] rounded-full" />
                            Información
                        </h3>
                        <ul className="space-y-2.5">
                            {LINKS.info.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-[#C9A882] hover:text-[#E8963C] text-sm font-medium transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="font-black text-[#EDE0CF] uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
                            <span className="h-0.5 w-4 bg-[#E8963C] rounded-full" />
                            Contacto
                        </h3>
                        <ul className="space-y-3.5">
                            {((config as any)?.whatsappNumber || (config as any)?.contactPhone) && (
                                <li className="flex items-start gap-3 text-[#C9A882] text-sm">
                                    <Phone className="h-4 w-4 text-[#E8963C] flex-shrink-0 mt-0.5" />
                                    <span>{(config as any)?.whatsappNumber || (config as any)?.contactPhone || ""}</span>
                                </li>
                            )}
                            {config?.contactEmail && (
                                <li className="flex items-start gap-3 text-[#C9A882] text-sm">
                                    <Mail className="h-4 w-4 text-[#E8963C] flex-shrink-0 mt-0.5" />
                                    <span>{config.contactEmail}</span>
                                </li>
                            )}
                            {((config as any)?.branches?.[0]?.address || (config as any)?.address) && (
                                <li className="flex items-start gap-3 text-[#C9A882] text-sm">
                                    <MapPin className="h-4 w-4 text-[#E8963C] flex-shrink-0 mt-0.5" />
                                    <span>{(config as any)?.branches?.[0]?.address || (config as any)?.address}</span>
                                </li>
                            )}
                        </ul>

                        {/* Newsletter mini */}
                        <div className="mt-6">
                            <p className="text-[#EDE0CF] font-bold text-xs mb-3 uppercase tracking-wider">Suscribite a novedades</p>
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#3D2314] border border-[#8B5E3C] text-[#EDE0CF] placeholder:text-[#8B5E3C] outline-none focus:border-[#E8963C] min-w-0"
                                />
                                <button className="px-3 py-2 rounded-xl bg-[#E8963C] text-white text-xs font-black hover:bg-[#D4763B] transition-colors flex-shrink-0">
                                    OK
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 pb-24 sm:pb-6 border-t border-[#8B5E3C]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[#8B5E3C] text-xs">
                        © {new Date().getFullYear()} {config?.storeName || "PetShop"}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-5">
                        {["Privacidad", "Términos"].map((t) => (
                            <Link key={t} href="#" className="text-[#8B5E3C] hover:text-[#E8963C] text-xs font-medium transition-colors">
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
