"use client";

import { home } from "@/../content/home";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
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
    X,
    Home,
    Sparkles,
    Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";

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

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, bannerSlides.length]);

    if (isConfigLoading) {
        return <div className="h-screen w-full bg-[#EDE0CF] animate-pulse" />;
    }

    const currentSlideData = bannerSlides[currentSlide];

    return (
        <section ref={containerRef} className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden min-h-screen bg-[#EDE0CF]">


            {/* ── HERO CONTENT WITH PARALLAX ── */}
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="relative min-h-[90vh] w-full flex items-center" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>

                {/* Background Images */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
                        <Image src={currentSlideData?.url || currentSlideData?.image || "/images/placeholder.png"} alt="Pet" fill className="object-cover object-center mix-blend-multiply opacity-60" priority />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#EDE0CF] via-[#EDE0CF]/80 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Abstract Organic Shapes */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-[#E8963C]/20 to-[#8B5E3C]/20 rounded-full blur-3xl pointer-events-none" />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] left-[10%] w-[600px] h-[600px] bg-[#D4B896]/30 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl pointer-events-none" />

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10 pt-32 pb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl relative z-30">
                            {/* Floating elements */}
                            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-12 -left-12 hidden md:flex h-24 w-24 bg-[#D4B896]/50 backdrop-blur-2xl rounded-[2rem] rotate-12 items-center justify-center shadow-2xl border border-[#D4B896]/40 z-30">
                                <Star className="h-10 w-10 text-[#E8963C] fill-[#E8963C]" />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div key={currentSlide} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative z-10">

                                    <div className="flex items-center gap-3 mb-6 bg-[#D4B896]/40 backdrop-blur-xl w-max px-5 py-2.5 rounded-full border border-[#D4B896]/30 shadow-lg">
                                        <Sparkles className="h-5 w-5 text-[#E8963C]" />
                                        <span className="text-[#5C3D2E] font-black text-xs uppercase tracking-[0.2em]">
                                            ¡Lo mejor para ellos!
                                        </span>
                                    </div>

                                    <h1 className="text-6xl md:text-8xl font-black text-[#5C3D2E] leading-[0.9] mb-8 tracking-tighter drop-shadow-xl">
                                        {currentSlideData?.title || "Amor Incondicional."}
                                        {currentSlideData?.titleLine2 && (
                                            <>
                                                <br />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8963C] to-[#8B5E3C] inline-block mt-2">
                                                    {currentSlideData.titleLine2}
                                                </span>
                                            </>
                                        )}
                                    </h1>

                                    <p className="text-lg md:text-2xl text-[#8B5E3C] font-medium max-w-xl mb-10 leading-relaxed backdrop-blur-sm bg-[#EDE0CF]/30 p-4 rounded-3xl border border-[#D4B896]/20">
                                        {currentSlideData?.subtitle || "Encuentra alimentos premium, juguetes divertidos y accesorios súper cómodos."}
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center gap-5">
                                        <Link href="/products" className="group relative overflow-hidden bg-[#E8963C] text-[#EDE0CF] rounded-full font-black text-lg px-10 py-5 shadow-[0_20px_50px_rgba(232,150,60,0.3)] transition-all hover:scale-105 w-full sm:w-auto text-center">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Explorar Tienda <PawPrintIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4763B] to-[#E8963C] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                        <Link href="/products?isTrending=true" className="group bg-[#D4B896]/40 backdrop-blur-xl border-2 border-[#D4B896] text-[#5C3D2E] hover:bg-[#D4B896]/60 rounded-full font-black text-lg px-10 py-4.5 shadow-xl transition-all hover:scale-105 w-full sm:w-auto text-center flex items-center justify-center">
                                            Destacados
                                        </Link>
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Interactive Hero Image/Card Side */}
                        <div className="hidden lg:block relative h-[600px] w-full z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
                                    transition={{ duration: 0.8, type: "spring" }}
                                    className="absolute inset-0 rounded-[4rem] overflow-hidden border-8 border-[#D4B896]/30 shadow-[0_40px_80px_rgba(92,61,46,0.2)] rotate-3"
                                >
                                    <Image src={currentSlideData?.url || currentSlideData?.image || "/images/placeholder.png"} alt="Featured" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E]/80 to-transparent flex items-end p-10 mb-20">
                                        <div className="bg-[#D4B896]/40 backdrop-blur-xl border border-[#D4B896]/50 p-6 rounded-3xl text-[#EDE0CF] w-full">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Smile className="text-[#E8963C] w-6 h-6" />
                                                <span className="font-bold text-sm uppercase tracking-widest text-[#E8963C]">Elección Experta</span>
                                            </div>
                                            <h3 className="text-2xl font-black">{currentSlideData?.title || "Colección Premium"}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Friendly Slider Controls (Paws) */}
                <div className="absolute bottom-[20%] lg:bottom-[15%] left-0 right-0 flex justify-center gap-4 z-40">
                    {bannerSlides.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentSlide(idx)} className={`transition-all duration-500 flex items-center justify-center rounded-full p-2 ${currentSlide === idx ? "bg-[#E8963C] text-[#EDE0CF] scale-125 shadow-lg" : "bg-[#D4B896]/40 backdrop-blur-md text-[#8B5E3C] hover:bg-[#D4B896]/60 hover:scale-110"}`}>
                            <PawPrintIcon className="h-5 w-5" />
                        </button>
                    ))}
                </div>

            </motion.div>

            {/* PREMIUM SVG WAVE SEPARATOR */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 transform translate-y-[2px] pointer-events-none">
                <svg className="relative block w-full h-[120px] md:h-[200px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.1,192.51,110.8,236.43,102.13,279.4,78.89,321.39,56.44Z" fill="#EDE0CF"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#D4B896" fillOpacity="0.3"></path>
                </svg>
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
