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
    Bone,
    Cat,
    Dog,
    Heart,
    Menu,
    Search,
    ShoppingCart,
    Smile,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function PetHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { carousel } = home.hero;
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
        if (!config?.bannerImage) return carousel.slides;
        if (Array.isArray(config.bannerImage) && config.bannerImage.length > 0) return config.bannerImage;
        const legacyBanner = config.bannerImage as any;
        if (typeof legacyBanner === "string" && legacyBanner.trim()) {
            return [{
                image: legacyBanner,
                title: config.storeName || "Todo para tu Mascota",
                subtitle: "Nutrición, juegos y amor infinito.",
            }];
        }
        return carousel.slides;
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
        return <div className="h-screen w-full bg-orange-50 animate-pulse" />;
    }

    const currentSlideData = bannerSlides[currentSlide];

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-[10vh] overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem]">
            
            {/* ── FRIENDLY NAVBAR ── */}
            <div className={`fixed lg:top-4 z-50 transition-all duration-300 w-full lg:w-[90%] left-1/2 -translate-x-1/2 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2 rounded-full border-4 border-orange-100" : "bg-white/80 py-4 lg:rounded-full border-b-4 lg:border-4 border-orange-500 shadow-sm"}`}>
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-10 md:h-12 w-auto transition-transform group-hover:rotate-12" />
                            ) : (
                                <span className="font-black text-2xl tracking-tight text-orange-500 drop-shadow-sm flex items-center gap-2">
                                    <PawPrintIcon className="h-6 w-6 text-orange-400 -rotate-12" />
                                    {config?.storeName || "PetShop"}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { name: "Alimentos", href: "/products", icon: Bone },
                                { name: "Perros", href: "/products?categoria=perros", icon: Dog },
                                { name: "Gatos", href: "/products?categoria=gatos", icon: Cat }
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.name} href={item.href} className="flex items-center gap-1.5 text-gray-700 hover:text-orange-500 font-bold text-sm transition-colors">
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Icons */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <AnimatePresence>
                                {isMobileSearchExpanded && (
                                    <motion.form initial={{ width: 0, opacity: 0 }} animate={{ width: "200px", opacity: 1 }} exit={{ width: 0, opacity: 0 }} onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative mr-2">
                                        <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="w-full bg-orange-50 border-2 border-orange-200 text-gray-700 placeholder:text-gray-400 px-4 py-1.5 rounded-full focus:outline-none focus:border-orange-400 font-bold text-sm" />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-500 hover:bg-orange-100 rounded-full" onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}>
                                {isMobileSearchExpanded ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </Button>

                            <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-600 hover:text-orange-500 hover:bg-orange-100 rounded-full" onClick={() => router.push(user ? "/profile" : "/login")}>
                                <User className="h-5 w-5" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-600 hover:text-orange-500 hover:bg-orange-100 rounded-full" onClick={() => router.push("/favorites")}>
                                <Heart className="h-5 w-5" />
                            </Button>

                            <Button variant="ghost" className="relative px-3 py-2 text-white bg-orange-500 hover:bg-orange-600 hover:text-white rounded-full shadow-md hover:shadow-lg transition-all" onClick={toggleCart}>
                                <ShoppingCart className="h-5 w-5 mr-1" />
                                <span className="font-black">
                                    {mounted ? getTotalItems() : 0}
                                </span>
                            </Button>

                            <Button variant="ghost" size="icon" className="lg:hidden text-gray-600 hover:bg-orange-100 rounded-full" onClick={toggleMobileMenu}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HERO CONTENT ── */}
            <div className="relative h-[80vh] min-h-[600px] w-full bg-orange-50" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
                
                {/* Background Images */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                        <Image src={currentSlideData?.url || currentSlideData?.image || "/images/placeholder.png"} alt="Pet" fill className="object-cover object-center mix-blend-multiply opacity-80" priority />
                    </motion.div>
                </AnimatePresence>

                {/* Friendly Organic Blobs overlay */}
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-orange-100/80 to-transparent pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-20">
                    <div className="max-w-2xl bg-white/60 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-xl">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentSlide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                                
                                <div className="flex items-center gap-2 mb-4 bg-orange-100 w-max px-4 py-1.5 rounded-full border-2 border-orange-200">
                                    <Smile className="h-4 w-4 text-orange-500" />
                                    <span className="text-orange-600 font-bold text-xs uppercase tracking-wider">
                                        ¡Lo mejor para ellos!
                                    </span>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-black text-gray-800 leading-tight mb-4 tracking-tight drop-shadow-sm">
                                    {currentSlideData?.title || "Amor y Cuidados."}
                                    {currentSlideData?.titleLine2 && (
                                        <>
                                            <br />
                                            <span className="text-orange-500">
                                                {currentSlideData.titleLine2}
                                            </span>
                                        </>
                                    )}
                                </h1>
                                
                                <p className="text-base md:text-lg text-gray-600 font-bold max-w-xl mb-8 leading-relaxed">
                                    {currentSlideData?.subtitle || "Encuentra alimentos premium, juguetes divertidos y accesorios súper cómodos."}
                                </p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-lg px-8 py-6 shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1">
                                        <Link href="/products">Ver Productos 🐶</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-4 border-white bg-white/50 text-orange-600 hover:bg-white rounded-full font-black text-base px-8 py-6 backdrop-blur-sm shadow-sm transition-all hover:-translate-y-1">
                                        <Link href="/products?isTrending=true">Destacados</Link>
                                    </Button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Friendly Slider Controls (Paws) */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                    {bannerSlides.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentSlide(idx)} className={`transition-all duration-300 flex items-center justify-center ${currentSlide === idx ? "text-orange-500 scale-125" : "text-gray-400 hover:text-orange-300"}`}>
                            <PawPrintIcon className="h-6 w-6" />
                        </button>
                    ))}
                </div>

            </div>
        </section>
    );
}

// Custom simple paw print icon for buttons
function PawPrintIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 21c-2.3 0-5.7-1.1-7.1-3.2-1.3-1.9-1.8-4-.5-5.9 1-1.4 3-2 5.2-1.6 1.4.3 3.4.3 4.8 0 2.2-.4 4.2.2 5.2 1.6 1.3 1.9.8 4-.5 5.9C17.7 19.9 14.3 21 12 21Z" />
            <path d="M7 10.5C5 10.5 3 9 3 6.5S5 2.5 7 2.5s4 2.5 4 5-2 4-4 4Z" />
            <path d="M17 10.5C15 10.5 13 9 13 6.5s2-4 4-4 4 2.5 4 5-2 4-4 4Z" />
        </svg>
    )
}
