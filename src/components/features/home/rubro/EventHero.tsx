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
    Heart,
    Menu,
    Search,
    ShoppingCart,
    User,
    X,
    Sparkles,
    Leaf
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function EventHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { carousel } = home.hero;
    const { user } = useAuth();
    const { toggleCart, toggleMobileMenu, isMobileMenuOpen } = useUIStore();
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
        if (!config?.bannerImage) return carousel.slides;
        if (Array.isArray(config.bannerImage) && config.bannerImage.length > 0) return config.bannerImage;
        const legacyBanner = config.bannerImage as any;
        if (typeof legacyBanner === "string" && legacyBanner.trim()) {
            return [{
                image: legacyBanner,
                title: config.storeName || "Espacios Únicos",
                subtitle: "Artesanía y calidez para tu hogar.",
            }];
        }
        return carousel.slides;
    };

    const bannerSlides = getBannerSlides();
    const mainImage = bannerSlides[0]?.url || bannerSlides[0]?.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1920";
    const secondaryImage = bannerSlides.length > 1 ? (bannerSlides[1]?.url || bannerSlides[1]?.image) : mainImage;
    const heroTitle = bannerSlides[0]?.title || "Espacios que";
    const heroTitleLine2 = bannerSlides[0]?.titleLine2 || "inspiran.";

    if (isConfigLoading) {
        return <div className="h-screen w-full bg-[#faf9f6] animate-pulse" />;
    }

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-[10vh] bg-[#faf9f6] overflow-hidden text-[#4a453e]">
            
            {/* ── BOHO CHIC NAVBAR ── */}
            <div className={`fixed lg:top-0 z-50 transition-all duration-500 w-full left-0 right-0 ${scrolled ? "bg-[#faf9f6]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(140,133,123,0.05)] py-4" : "bg-transparent py-8"}`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-10 md:h-12 w-auto mix-blend-multiply" />
                            ) : (
                                <span className="font-serif text-2xl tracking-widest text-[#9c7a70] italic">
                                    {config?.storeName || "L'Atelier"}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-12">
                            {[
                                { name: "Colección", href: "/products" },
                                { name: "Artesanal", href: "/products?isNew=true" },
                                { name: "Estilos", href: "/products?isTrending=true" }
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className="text-[#8c857b] hover:text-[#9c7a70] text-xs tracking-[0.2em] uppercase transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-0 after:h-[1px] after:bg-[#9c7a70] after:transition-all hover:after:w-full hover:after:left-0">
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-2">
                            <AnimatePresence>
                                {isMobileSearchExpanded && (
                                    <motion.form initial={{ width: 0, opacity: 0 }} animate={{ width: "200px", opacity: 1 }} exit={{ width: 0, opacity: 0 }} onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative mr-4">
                                        <input type="text" placeholder="Buscar ideas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="w-full bg-transparent border-b border-[#d7c4a8] text-[#4a453e] placeholder:text-[#d7c4a8] px-2 py-1 focus:outline-none focus:border-[#9c7a70] text-sm italic font-serif" />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <Button variant="ghost" size="icon" className="text-[#8c857b] hover:text-[#9c7a70] hover:bg-transparent" onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}>
                                {isMobileSearchExpanded ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </Button>

                            <Button variant="ghost" size="icon" className="hidden sm:flex text-[#8c857b] hover:text-[#9c7a70] hover:bg-transparent" onClick={() => router.push(user ? "/profile" : "/login")}>
                                <User className="h-5 w-5" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-[#8c857b] hover:text-[#9c7a70] hover:bg-transparent" onClick={() => router.push("/favorites")}>
                                <Heart className="h-5 w-5" />
                            </Button>

                            <Button variant="ghost" className="relative text-[#8c857b] hover:text-[#9c7a70] hover:bg-transparent px-2" onClick={toggleCart}>
                                <ShoppingCart className="h-5 w-5" />
                                {mounted && getTotalItems() > 0 && (
                                    <span className="absolute 1 top-0 right-0 bg-[#9c7a70] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Button>

                            <Button variant="ghost" size="icon" className="lg:hidden text-[#8c857b] hover:text-[#9c7a70] hover:bg-transparent" onClick={toggleMobileMenu}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ASYMMETRICAL PINTEREST-STYLE HERO ── */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-[90vh] flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Text Content */}
                        <div className="col-span-1 lg:col-span-5 order-2 lg:order-1 z-10 relative">
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-[1px] w-12 bg-[#d7c4a8]" />
                                    <span className="text-[#8da399] tracking-[0.3em] text-xs uppercase font-medium">
                                        Nueva Colección
                                    </span>
                                </div>

                                <h1 className="text-5xl lg:text-7xl xl:text-8xl text-[#4a453e] leading-[1.1] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                                    {heroTitle} <br className="hidden lg:block" />
                                    <span className="italic text-[#9c7a70]">{heroTitleLine2}</span>
                                </h1>
                                
                                <p className="text-lg text-[#8c857b] mb-10 max-w-md leading-relaxed font-light">
                                    {bannerSlides[0]?.subtitle || "Piezas únicas y artesanales diseñadas para dar calidez y personalidad a cada rincón de tu hogar."}
                                </p>

                                <div className="flex items-center gap-6">
                                    <Button asChild className="bg-[#9c7a70] hover:bg-[#86685f] text-white rounded-none px-8 py-6 text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0_#d7c4a8] hover:shadow-[2px_2px_0_#d7c4a8] hover:translate-x-[2px] hover:translate-y-[2px]">
                                        <Link href="/products">Ver Colección</Link>
                                    </Button>
                                    <Link href="/products?isTrending=true" className="text-[#8c857b] hover:text-[#9c7a70] text-xs tracking-widest uppercase transition-colors underline underline-offset-8 decoration-[#d7c4a8] hover:decoration-[#9c7a70]">
                                        Inspiración
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Image Composition */}
                        <div className="col-span-1 lg:col-span-7 order-1 lg:order-2 relative h-[500px] lg:h-[700px] w-full">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="absolute right-0 top-0 w-full lg:w-[85%] h-[400px] lg:h-[600px] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl z-10">
                                <Image src={mainImage} alt="Decoración principal" fill className="object-cover hover:scale-105 transition-transform duration-1000" priority />
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="absolute left-0 bottom-0 w-[60%] lg:w-[45%] h-[250px] lg:h-[350px] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden shadow-xl border-8 border-[#faf9f6] z-20 hidden md:block">
                                <Image src={secondaryImage} alt="Detalle decorativo" fill className="object-cover" />
                            </motion.div>

                            {/* Floating decorative elements */}
                            <div className="absolute top-1/4 -right-12 w-24 h-24 bg-[#e8e4db] rounded-full mix-blend-multiply blur-xl animate-pulse" />
                            <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-[#d7c4a8]/50 rounded-full mix-blend-multiply blur-xl" />
                        </div>

                    </div>
                </div>
            </div>

            {/* ── BOHO FEATURE BADGES ── */}
            <div className="bg-[#f0eee4] py-12 relative z-20">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-wrap justify-between items-center gap-8">
                        {(config?.customPageTextsSubtitle 
                            ? config.customPageTextsSubtitle.split(',').map((s) => {
                                const parts = s.trim().split('|');
                                return { title: parts[0] || "", sub: parts[1] || "" };
                            })
                            : [
                                { title: "Materiales Naturales", sub: "Sostenibilidad en cada pieza" },
                                { title: "Hecho a Mano", sub: "Artesanía local" },
                                { title: "Diseño Único", sub: "Ediciones limitadas" }
                            ]
                        ).map((badge, idx) => {
                            const icons = [Leaf, Heart, Sparkles];
                            const Icon = icons[idx % icons.length];
                            return (
                                <div key={idx} className="flex items-start gap-4 max-w-xs">
                                    <div className="mt-1">
                                        <Icon className="h-6 w-6 text-[#9c7a70]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#4a453e] font-medium tracking-wide uppercase text-sm mb-1">{badge.title}</h3>
                                        <p className="text-[#8c857b] text-xs italic">{badge.sub}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </section>
    );
}
