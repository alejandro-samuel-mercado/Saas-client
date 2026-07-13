"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    Compass,
    Heart,
    Menu,
    Search,
    ShieldCheck,
    ShoppingCart,
    Timer,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1920",
        title: "Precisión Absoluta",
        titleLine2: "Alta Relojería",
        subtitle: "Diseño e ingeniería en perfecta armonía.",
    }
];

export function WatchHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { user } = useAuth();
    const { toggleCart, toggleMobileMenu, isMobileMenuOpen } = useUIStore();
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
        if (config && Array.isArray(config.bannerImage) && config.bannerImage.length > 0) return config.bannerImage;
        const legacyBanner = config?.bannerImage as any;
        if (typeof legacyBanner === "string" && legacyBanner.trim()) {
            return [{
                url: legacyBanner,
                title: config?.storeName || "Alta Relojería",
                subtitle: "Precisión y Estilo en cada segundo.",
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
        return <div className="h-screen w-full bg-background animate-pulse" />;
    }

    const currentSlideData = bannerSlides[currentSlide];

    return (
        <section className="relative w-full mb-[10vh] bg-background overflow-hidden font-sans">
            
            {/* ── PRECISION NAVBAR ── */}
            <div className={`fixed lg:top-0 z-50 transition-all duration-300 w-full left-0 right-0 border-b ${scrolled ? "bg-white/95 dark:bg-background/95 backdrop-blur-md border-gray-200 dark:border-white/10 py-3 shadow-sm" : "bg-transparent border-white/10 py-5"}`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className={`h-8 md:h-10 w-auto transition-transform duration-300 group-hover:opacity-80 ${scrolled ? "" : "brightness-0 invert"}`} />
                            ) : (
                                <span className={`font-bold text-xl tracking-[0.2em] uppercase ${scrolled ? "text-[#0f172a] dark:text-white" : "text-white"}`}>
                                    {config?.storeName || "TIMEPIECE"}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { name: "Colección", href: "/products" },
                                { name: "Nuevos Modelos", href: "/products?isNew=true" },
                                { name: "Destacados", href: "/products?isTrending=true" }
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors ${scrolled ? "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white" : "text-white/70 hover:text-white"}`}>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-1 md:gap-3">
                            <AnimatePresence>
                                {isMobileSearchExpanded && (
                                    <motion.form initial={{ width: 0, opacity: 0 }} animate={{ width: "180px", opacity: 1 }} exit={{ width: 0, opacity: 0 }} onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative mr-2">
                                        <input type="text" placeholder="Referencia o marca..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className={`w-full bg-transparent border-b text-xs font-mono px-2 py-1 focus:outline-none ${scrolled ? "border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500" : "border-white/30 text-white placeholder:text-white/50 focus:border-white"}`} />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            
                            <Button variant="ghost" size="icon" className={`rounded-none ${scrolled ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}>
                                {isMobileSearchExpanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                            </Button>

                            <Button variant="ghost" size="icon" className={`hidden sm:flex rounded-none ${scrolled ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => router.push(user ? "/profile" : "/login")}>
                                <User className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" className={`hidden sm:flex rounded-none ${scrolled ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => router.push("/favorites")}>
                                <Heart className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" className={`relative px-2 rounded-none ${scrolled ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10" : "text-white hover:bg-white/10"}`} onClick={toggleCart}>
                                <ShoppingCart className="h-4 w-4" />
                                {mounted && getTotalItems() > 0 && (
                                    <span className="absolute 1 top-0 right-0 bg-blue-600 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Button>

                            <Button variant="ghost" size="icon" className={`lg:hidden rounded-none ${scrolled ? "text-gray-700" : "text-white"}`} onClick={toggleMobileMenu}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HERO CONTENT ── */}
            <div className="relative h-[85vh] min-h-[600px] w-full" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
                
                {/* Background Images */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 bg-background">
                        <Image src={currentSlideData?.url || currentSlideData?.image || "/images/placeholder.png"} alt="Watch" fill className="object-cover object-center opacity-70 mix-blend-luminosity" priority />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Grid overlay for industrial feel */}
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-20">
                    <div className="max-w-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentSlide} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px w-8 bg-blue-500" />
                                    <span className="text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                                        Novedad / {new Date().getFullYear()}
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
                                    {currentSlideData?.title || "Precisión Absoluta."}
                                    {currentSlideData?.titleLine2 && (
                                        <>
                                            <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gray-400">
                                                {currentSlideData.titleLine2}
                                            </span>
                                        </>
                                    )}
                                </h1>
                                
                                <p className="text-base md:text-lg text-gray-400 font-light max-w-xl mb-10 leading-relaxed">
                                    {currentSlideData?.subtitle || "Descubre colecciones forjadas con los materiales más resistentes y los movimientos más precisos del mundo."}
                                </p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Button asChild className="bg-white hover:bg-gray-200 text-background rounded-none font-bold tracking-widest uppercase px-8 py-6 text-xs transition-colors">
                                        <Link href="/products">Ver Catálogo</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-none font-bold tracking-widest uppercase px-8 py-6 text-xs backdrop-blur-sm">
                                        <Link href="/products?isTrending=true">Destacados</Link>
                                    </Button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Technical animated overlay details (right side, visible on lg) */}
                <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-8 pointer-events-none z-10">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">Movimiento</p>
                            <p className="text-xs text-white font-bold tracking-wider">Automático / 28.800 vph</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">Material</p>
                            <p className="text-xs text-white font-bold tracking-wider">Acero Inoxidable 316L</p>
                        </div>
                    </motion.div>
                </div>

                {/* Slider Controls - Minimalist bars */}
                <div className="absolute bottom-0 left-0 right-0 flex z-20 h-1 bg-white/5">
                    {bannerSlides.map((_, idx) => (
                        <div key={idx} onClick={() => setCurrentSlide(idx)} className="flex-1 relative cursor-pointer group">
                            <div className={`absolute inset-0 transition-all duration-700 ease-out ${currentSlide === idx ? "bg-blue-500" : "bg-transparent group-hover:bg-white/20"}`} />
                        </div>
                    ))}
                </div>

            </div>

            {/* ── TECHNICAL BADGES ── */}
            <div className="bg-white dark:bg-background border-b border-gray-200 dark:border-white/5 py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center gap-6">
                        {[
                            { icon: ShieldCheck, text: "Garantía Oficial Internacional" },
                            { icon: Timer, text: "Precisión Certificada" },
                            { icon: Compass, text: "Alta Resistencia" },
                            { icon: Activity, text: "Movimientos Probados" }
                        ].map((badge, idx) => {
                            const Icon = badge.icon;
                            return (
                                <div key={idx} className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    <span className="text-xs font-bold tracking-wider text-gray-800 dark:text-gray-300 uppercase">{badge.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </section>
    );
}
