"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function DecorBanner() {
    return (
        <section className="w-full bg-white py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative">
                
                <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Text Side */}
                    <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                        <p className="text-xs tracking-[0.2em] text-[#3A302A]/60 uppercase mb-6 font-sans">
                            Remember your loved ones
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#3A302A] mb-8 leading-tight">
                            Gift Ideas That Last Longer
                        </h2>
                        <p className="text-[#3A302A]/80 font-sans text-sm md:text-base leading-relaxed mb-10">
                            Who doesn&apos;t love flowers? Whether you&apos;re giving or receiving flowers, the only downside is how short-lived the happiness with a fresh bouquet of cut bouquets. We are passionate about creating bouquets that not only look beautiful, but last longer. Our premium dried flower bouquets can last up to years. Ask our staff for more information for your perfect bouquet.
                        </p>
                        
                        <Link 
                            href="/products?category=gifts" 
                            className="inline-block bg-[#E1CDBF] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#E1CDBF] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-10"
                        >
                            Let&apos;s Go
                        </Link>
                    </div>

                    {/* Circle Image Side */}
                    <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            className="relative w-[300px] md:w-[400px] lg:w-[500px] aspect-square rounded-full overflow-hidden bg-[#E1CDBF]/40"
                        >
                            {/* Inner circle color block like the image */}
                            <div className="absolute top-0 right-0 w-full h-full bg-[#D5BBAA]" />
                            <Image 
                                src="https://images.unsplash.com/photo-1544923555-52055627db8a?auto=format&fit=crop&q=80&w=800" 
                                alt="Gift Ideas" 
                                fill
                                className="object-cover relative z-10 p-4 lg:p-8 rounded-full"
                            />
                        </motion.div>
                    </div>

                </div>
                
            </div>
        </section>
    );
}
