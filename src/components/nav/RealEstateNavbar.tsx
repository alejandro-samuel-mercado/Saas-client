/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RealEstateNavbar() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    const { user } = useAuth();
    const { toggleMobileMenu } = useUIStore();
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        // Configurar el color en carga inicial
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 z-[100] transition-all duration-500 w-full left-0 right-0 ${scrolled ? "bg-black/90 backdrop-blur-md py-4 shadow-xl" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-8"}`}>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        {config?.logoUrl ? (
                            <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-10 md:h-12 w-auto brightness-0 invert" />
                        ) : (
                            <span className="text-white font-bold text-2xl tracking-[0.2em] uppercase">
                                {config?.storeName || "REAL ESTATE"}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {pathname !== "/" && (
                            <Link href="/" className="text-white/90 hover:text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:scale-105">
                                INICIO
                            </Link>
                        )}
                        {[
                            { name: "Alquileres", href: "/products?saleMode=ALQUILER" },
                            { name: "Inmuebles", href: "/products" },
                            { name: "Terrenos y Lotes", href: "/products?search=lote" },
                            { name: "Nosotros", href: "/#nosotros" },

                        ].map((item) => (
                            <Link key={item.name} href={item.href} className="text-white/90 hover:text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:scale-105">
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA / Icons */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hidden sm:flex text-white hover:bg-white/10" onClick={() => router.push(user ? "/profile" : "/login")}>
                            <User className="h-5 w-5" />
                        </Button>

                        <a href={`https://wa.me/${config?.contactPhone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center bg-[#f5ab1c] hover:bg-[#d99516] text-black font-bold uppercase tracking-widest text-[10px] px-8 py-3 rounded-full transition-all hover:shadow-[0_0_20px_rgba(245,171,28,0.4)] hover:-translate-y-1">
                            CONTACTAR
                        </a>

                        <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={toggleMobileMenu}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
