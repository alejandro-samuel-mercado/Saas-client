"use client";

import { home } from "@/../content/home";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarDays,
    Coffee,
    Menu,
    Scissors,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function BarberHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { carousel } = home.hero;
    const { user } = useAuth();
    const { toggleCart, toggleMobileMenu, isMobileMenuOpen } = useUIStore();
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bannerImage = config?.bannerImage && Array.isArray(config.bannerImage) && config.bannerImage.length > 0 
        ? config.bannerImage[0].url || config.bannerImage[0].image
        : (typeof config?.bannerImage === "string" ? config.bannerImage : "/images/placeholder.png");

    const whatsappNumber = config?.contactPhone?.replace(/\D/g, "");
    const bookingUrl = whatsappNumber 
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, quisiera agendar un turno.")}` 
        : "/products";

    if (isConfigLoading) {
        return <div className="h-screen w-full bg-[#1e1c18] animate-pulse" />;
    }

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-[10vh] bg-[#1e1c18] overflow-hidden font-sans border-b-[10px] border-[#8b6b4a]">
            
            {/* ── OLD SCHOOL NAVBAR ── */}
            <div className={`fixed lg:top-0 z-50 transition-all duration-300 w-full left-0 right-0 ${scrolled ? "bg-[#1e1c18] border-b-2 border-[#8b6b4a] py-4 shadow-xl" : "bg-transparent py-6"}`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center justify-center gap-3">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-12 md:h-16 w-auto sepia contrast-125" />
                            ) : (
                                <div className="text-center">
                                    <span className="block font-black text-2xl md:text-3xl tracking-tighter uppercase text-[#e6d5b8]">
                                        {config?.storeName || "TRADITIONAL"}
                                    </span>
                                    <span className="block text-[8px] md:text-[10px] text-[#8b6b4a] font-bold tracking-[0.3em] uppercase">
                                        Barber Shop
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {[
                                { name: "Servicios", href: "/products" },
                                { name: "Productos", href: "/products?isNew=true" },
                                { name: "Nosotros", href: "#" }
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className="text-[#a69b85] hover:text-[#e6d5b8] font-bold tracking-widest uppercase transition-colors text-sm hover:scale-105 transform">
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Icons & Booking */}
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-[#8b6b4a] hover:text-[#e6d5b8] hover:bg-transparent" onClick={() => router.push(user ? "/profile" : "/login")}>
                                <User className="h-6 w-6" />
                            </Button>
                            
                            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 bg-[#8b6b4a] hover:bg-[#6b5034] text-[#1e1c18] font-black uppercase tracking-wider px-6 py-2 border-2 border-[#8b6b4a] transition-all">
                                <CalendarDays className="h-4 w-4" />
                                Agendar
                            </a>

                            <Button variant="ghost" size="icon" className="lg:hidden text-[#8b6b4a]" onClick={toggleMobileMenu}>
                                <Menu className="h-8 w-8" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HERO POSTER CONTENT ── */}
            <div className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center">
                
                {/* Background Image (Grayscale + Tint) */}
                <div className="absolute inset-0 bg-[#1e1c18]">
                    <Image src={bannerImage} alt="Barbershop Background" fill className="object-cover object-center opacity-40 mix-blend-luminosity grayscale contrast-125" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1e1c18]/80 via-transparent to-[#1e1c18]" />
                    <div className="absolute inset-0 bg-[#8b6b4a]/10 mix-blend-overlay" />
                    
                    {/* Grunge/Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="border-4 border-[#8b6b4a] p-2 md:p-4 mb-8">
                        <div className="border-2 border-[#8b6b4a] p-8 md:p-16 bg-[#1e1c18]/80 backdrop-blur-sm">
                            <Scissors className="h-12 w-12 text-[#8b6b4a] mx-auto mb-6" />
                            
                            <h2 className="text-[#8b6b4a] font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-4">
                                Premium Grooming
                            </h2>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-[#e6d5b8] uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-lg">
                                Estilo <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#8b6b4a] to-[#5a422a] stroke-2 stroke-[#e6d5b8]">
                                    Clásico
                                </span>
                            </h1>
                            
                            <div className="flex items-center justify-center gap-4 text-[#a69b85] font-bold tracking-widest uppercase text-xs md:text-sm mb-10">
                                <span>Cortes</span>
                                <span className="text-[#8b6b4a]">•</span>
                                <span>Afeitados</span>
                                <span className="text-[#8b6b4a]">•</span>
                                <span>Tratamientos</span>
                            </div>

                            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#e6d5b8] hover:bg-white text-[#1e1c18] font-black uppercase tracking-widest px-10 py-5 text-lg md:text-xl border-4 border-[#8b6b4a] shadow-[8px_8px_0_rgba(139,107,74,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                                <CalendarDays className="h-6 w-6" />
                                Agendar Turno
                            </a>
                        </div>
                    </motion.div>

                </div>

            </div>

            {/* ── OLD SCHOOL BADGES ── */}
            <div className="bg-[#151310] border-t-2 border-b-2 border-[#8b6b4a]/50 py-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
                        {[
                            { icon: Scissors, text: "Cortes Precisos" },
                            { icon: Coffee, text: "Bebida de Cortesía" },
                            { icon: CalendarDays, text: "Turnos Exactos" }
                        ].map((badge, idx) => {
                            const Icon = badge.icon;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 text-center">
                                    <div className="bg-[#8b6b4a]/10 p-4 rounded-full border border-[#8b6b4a]/30">
                                        <Icon className="h-8 w-8 text-[#8b6b4a]" />
                                    </div>
                                    <span className="text-sm font-bold tracking-widest text-[#e6d5b8] uppercase">{badge.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </section>
    );
}
