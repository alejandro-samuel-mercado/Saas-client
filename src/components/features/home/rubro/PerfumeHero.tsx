"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    User,
    X,
    Sparkles,
    Wind,
    Droplets,
    Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=1920",
        title: "L'Élixir",
        titleLine2: "Parfum",
        subtitle: "Descubre la esencia que define tu aura.",
    },
];

export function PerfumeHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { user } = useAuth();
    const { toggleCart, toggleMobileMenu } = useUIStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { getTotalItems } = useCartStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    };

    const getBannerSlides = () => {
        if (Array.isArray(config?.bannerImage) && config.bannerImage.length > 0) return config.bannerImage;
        const legacyBanner = config?.bannerImage as any;
        if (typeof legacyBanner === "string" && legacyBanner.trim()) {
            return [{
                url: legacyBanner,
                title: config?.storeName || "Maison des Parfums",
                subtitle: "L'essence de l'élégance",
            }];
        }
        return DEFAULT_SLIDES;
    };

    const bannerSlides = getBannerSlides();

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, [bannerSlides.length]);

    useEffect(() => {
        if (!isAutoPlaying || bannerSlides.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, bannerSlides.length]);

    if (isConfigLoading) {
        return <div className="h-screen w-full bg-[#0a0a0a] animate-pulse" />;
    }

    const currentSlideData = bannerSlides[currentSlide];

    return (
        <section className="relative w-full mb-[15vh] bg-[#0a0a0a] overflow-hidden">

            {/* ── HERO CONTENT ── */}
            <div className="relative h-screen min-h-[600px] w-full" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
                
                {/* Background Images */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0">
                        <Image src={currentSlideData?.url || currentSlideData?.image || "/images/placeholder.png"} alt="Perfume" fill className="object-cover" priority />
                    </motion.div>
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
                
                {/* Decorative Particles (Simulated with simple radial gradients) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-20">
                    <div className="max-w-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentSlide} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-[1px] w-12 bg-[#d4af37]" />
                                    <span className="text-[#d4af37] font-serif tracking-[0.3em] text-xs uppercase">
                                        Nouveau Collection
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#f9f1d8] leading-[1.1] mb-6 drop-shadow-2xl">
                                    {currentSlideData?.title || "L'Élixir"}
                                    {currentSlideData?.titleLine2 && (
                                        <>
                                            <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f9f1d8]">
                                                {currentSlideData.titleLine2}
                                            </span>
                                        </>
                                    )}
                                </h1>
                                
                                <p className="text-lg md:text-xl text-white/60 font-light max-w-xl mb-12 italic">
                                    {currentSlideData?.subtitle || "Descubre la esencia que define tu aura."}
                                </p>

                                <div className="flex flex-wrap items-center gap-6">
                                    <Button asChild className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-serif tracking-widest uppercase rounded-none px-8 py-6 text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                        <Link href="/products">Descubrir</Link>
                                    </Button>
                                    <Link href="/products?isTrending=true" className="text-[#f9f1d8]/80 hover:text-[#d4af37] font-serif tracking-[0.1em] text-sm uppercase transition-colors flex items-center gap-2">
                                        <Droplets className="h-4 w-4" /> Esencias únicas
                                    </Link>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Slider Controls */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 z-20">
                    {bannerSlides.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 transition-all duration-500 ${currentSlide === idx ? "w-12 bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "w-4 bg-white/20 hover:bg-white/40"}`} />
                    ))}
                </div>

            </div>

            {/* ── LUXURY FEATURE BADGES ── */}
            <div className="bg-[#0a0a0a] border-t border-b border-white/5 py-12 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Sparkles, title: "100% Originales", sub: "Garantía de autenticidad" },
                            { icon: Wind, title: "Larga Duración", sub: "Esencias persistentes" },
                            { icon: Droplets, title: "Muestras Gratis", sub: "En todas las compras" },
                            { icon: Package, title: "Envío Premium", sub: "Packaging de lujo" }
                        ].map((badge, idx) => {
                            const Icon = badge.icon;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 mb-4 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-[#1a1a1a] transition-transform duration-500 group-hover:rotate-180 group-hover:bg-[#d4af37]/10">
                                        <Icon className="h-5 w-5 text-[#d4af37] transition-transform duration-500 group-hover:-rotate-180" />
                                    </div>
                                    <h3 className="font-serif text-[#f9f1d8] text-sm tracking-widest uppercase mb-1">{badge.title}</h3>
                                    <p className="text-xs text-white/40 italic">{badge.sub}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </section>
    );
}
