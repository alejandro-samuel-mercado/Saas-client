"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function DecorHero() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <section className="relative min-h-[95vh] w-full bg-[#F0E5D8] overflow-hidden flex items-center justify-center pt-24 pb-12">
            
            {/* Background Minimalist Arch (Left Side) */}
            <div className="absolute left-[10%] top-[15%] w-[400px] h-[500px] bg-[#E1CDBF]/30 rounded-t-full rounded-b-lg hidden lg:block" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left mt-10 lg:mt-0">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#3A302A] leading-[1.1] tracking-tight mb-6"
                    >
                        Custom Dried Flower Bouquets
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="text-lg md:text-xl text-[#3A302A]/80 font-sans tracking-wide mb-10 max-w-xl mx-auto lg:mx-0"
                    >
                        {config?.adText || "Free delivery on orders over $79"}
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link 
                            href="/products" 
                            className="inline-block bg-[#F0E5D8] border border-[#3A302A] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-10"
                        >
                            Shop Now
                        </Link>
                    </motion.div>
                </div>

                {/* Arch Image Container */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center lg:justify-end">
                    <motion.div 
                        style={{ y: y1 }}
                        className="relative w-full max-w-[450px] aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden shadow-sm"
                    >
                        <Image 
                            src={config?.adImage || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"} 
                            alt="Hero Image" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                    
                    {/* Small accent text near image */}
                    <div className="absolute bottom-10 right-0 hidden lg:flex items-center gap-4 text-[#3A302A] tracking-[0.2em] text-xs font-sans uppercase rotate-90 origin-bottom-right">
                        <span>DRIED PAMPAS COLLECTION</span>
                        <div className="w-10 h-[1px] bg-[#3A302A]"></div>
                    </div>
                </div>

            </div>

        </section>
    );
}
