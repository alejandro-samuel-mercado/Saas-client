"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
    Building2,
    Home,
    MapPin,
    Menu,
    Search,
    User,
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function RealEstateHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    
    const { user } = useAuth();
    const { toggleMobileMenu } = useUIStore();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    // Form state
    const [operation, setOperation] = useState("");
    const [zone, setZone] = useState("");
    const [propertyType, setPropertyType] = useState("");

    const { scrollYProgress } = useScroll();
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 500]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        
        let searchString = "";
        if (operation) searchString += operation + " ";
        if (propertyType) searchString += propertyType + " ";
        searchString = searchString.trim();
        
        if (searchString) params.append("search", searchString);
        if (zone) params.append("ubicacion", zone.trim());
        
        router.push(`/products?${params.toString()}`);
    };

    if (isConfigLoading) {
        return <div className="h-screen w-full bg-black animate-pulse" />;
    }

    // A fallback background video/image if config doesn't have one
    const heroMediaUrl = config?.bannerImage && Array.isArray(config.bannerImage) && config.bannerImage.length > 0 
        ? config.bannerImage[0].url || config.bannerImage[0].image
        : (typeof config?.bannerImage === "string" ? config.bannerImage : "https://videos.pexels.com/video-files/3245464/3245464-uhd_2560_1440_25fps.mp4");

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] font-sans overflow-x-hidden">
            
            {/* ── 100VH IMMERSIVE HERO ── */}
            <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
                
                {/* Background Media */}
                <div className="absolute inset-0">
                    {heroMediaUrl.endsWith('.mp4') || heroMediaUrl.endsWith('.webm') ? (
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" style={{ filter: 'contrast(1.1) brightness(0.8)' }}>
                            <source src={heroMediaUrl} type="video/mp4" />
                        </video>
                    ) : (
                        <Image src={heroMediaUrl} alt="Real Estate" fill className="object-cover opacity-80" style={{ filter: 'contrast(1.1) brightness(0.8)' }} priority />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Massive Typography Centered */}
                <motion.div 
                    style={{ y: titleY, opacity: opacityHero }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-white text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9]"
                    >
                        Inversión de <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Alto Impacto</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-white/80 mt-6 text-sm md:text-lg font-light tracking-[0.2em] uppercase max-w-2xl"
                    >
                        Un legado de rapidez y rentabilidad.
                    </motion.p>
                </motion.div>

                {/* ── GIROMINI STYLE GLASSMORPHIC SEARCH BAR ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-20"
                >
                    <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-4">
                        <form onSubmit={handleSearch} className="flex-1 w-full flex flex-col md:flex-row items-center gap-4">
                            
                            <div className="flex-1 w-full relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                                <select 
                                    className="w-full bg-transparent text-white border-b border-white/30 px-10 py-3 focus:outline-none focus:border-[#f5ab1c] appearance-none uppercase tracking-wider text-xs font-bold cursor-pointer"
                                    value={operation}
                                    onChange={(e) => setOperation(e.target.value)}
                                >
                                    <option value="" className="bg-black text-white">Operación</option>
                                    <option value="venta" className="bg-black text-white">Venta</option>
                                    <option value="alquiler" className="bg-black text-white">Alquiler</option>
                                </select>
                            </div>

                            <div className="flex-1 w-full relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                                <input 
                                    type="text"
                                    placeholder="¿En qué zona buscás?"
                                    className="w-full bg-transparent text-white border-b border-white/30 px-10 py-3 focus:outline-none focus:border-[#f5ab1c] placeholder:text-white/50 uppercase tracking-wider text-xs font-bold"
                                    value={zone}
                                    onChange={(e) => setZone(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 w-full relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                                <select 
                                    className="w-full bg-transparent text-white border-b border-white/30 px-10 py-3 focus:outline-none focus:border-[#f5ab1c] appearance-none uppercase tracking-wider text-xs font-bold cursor-pointer"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <option value="" className="bg-black text-white">Tipo de Inmueble</option>
                                    <option value="departamento" className="bg-black text-white">Departamento</option>
                                    <option value="casa" className="bg-black text-white">Casa</option>
                                    <option value="terreno" className="bg-black text-white">Terreno/Lote</option>
                                    <option value="oficina" className="bg-black text-white">Oficina</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full md:w-auto bg-[#00A896] hover:bg-[#008c7d] text-white rounded-none px-12 py-6 font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">
                                <Search className="h-4 w-4 mr-2" />
                                Buscar
                            </Button>
                        </form>
                    </div>
                </motion.div>

            </div>

            {/* ── ROCKHAUS SOLID CLAY SECTION ── */}
            <div className="bg-[#7c5a43] text-white py-20 lg:py-32 relative z-10 border-t border-white/10">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
                    >
                        <div>
                            <h3 className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-[#f5ab1c]">10+</h3>
                            <p className="text-sm font-bold tracking-widest uppercase opacity-80">Años de Experiencia</p>
                        </div>
                        <div>
                            <h3 className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-[#f5ab1c]">250</h3>
                            <p className="text-sm font-bold tracking-widest uppercase opacity-80">Propiedades Entregadas</p>
                        </div>
                        <div>
                            <h3 className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-[#f5ab1c]">100%</h3>
                            <p className="text-sm font-bold tracking-widest uppercase opacity-80">Rentabilidad Comprobada</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── ROCKHAUS 50/50 SPLIT BANNERS ── */}
            <div className="flex flex-col lg:flex-row w-full h-[600px] lg:h-[800px]">
                
                <Link href="/products?search=departamentos" className="relative flex-1 group overflow-hidden block">
                    <div className="absolute inset-0 bg-black z-0">
                        <Image 
                            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
                            alt="Departamentos" 
                            fill 
                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out" 
                        />
                    </div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Departamentos</h2>
                        <span className="flex items-center gap-2 border border-white/50 rounded-full px-6 py-2 text-xs font-bold tracking-widest uppercase backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors">
                            Ver Proyectos <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </Link>

                <Link href="/products?search=casas" className="relative flex-1 group overflow-hidden block">
                    <div className="absolute inset-0 bg-black z-0">
                        <Image 
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" 
                            alt="Casas" 
                            fill 
                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out" 
                        />
                    </div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Residencias</h2>
                        <span className="flex items-center gap-2 border border-white/50 rounded-full px-6 py-2 text-xs font-bold tracking-widest uppercase backdrop-blur-sm group-hover:bg-[#f5ab1c] group-hover:border-[#f5ab1c] group-hover:text-black transition-colors">
                            Ver Casas <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </Link>

            </div>

        </section>
    );
}
