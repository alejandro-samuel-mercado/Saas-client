"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
    {
        title: "Custom Bouquets",
        description: "Do you have an acquired taste? From your favourite flowers to the rarest hidden secrets, we have what you need.",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800",
        link: "/products?category=custom"
    },
    {
        title: "Occasion Flowers",
        description: "Favourite flowers for your special day or the perfect decoration for your next business event.",
        image: "https://images.unsplash.com/photo-1507646875883-731bfbb1e58a?auto=format&fit=crop&q=80&w=800",
        link: "/products?category=occasion"
    },
    {
        title: "Premade Bouquets",
        description: "Our florists are passionate about creating the most beautiful combinations of selected dried flowers.",
        image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&q=80&w=800",
        link: "/products?category=premade"
    }
];

export function DecorServices() {
    return (
        <section className="w-full bg-[#F0E5D8] py-24">
            <div className="container mx-auto px-6 lg:px-12">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs tracking-[0.2em] text-[#3A302A]/60 uppercase mb-4 font-sans">
                        This is what we do
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#3A302A]">
                        Our Services
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {SERVICES.map((service, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="flex flex-col group"
                        >
                            {/* Image inside Arch */}
                            <div className="relative w-full aspect-square rounded-t-full overflow-hidden mb-[-1px]">
                                <Image 
                                    src={service.image} 
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            
                            {/* Card Content */}
                            <div className="bg-[#E1CDBF] p-8 md:p-10 text-center flex-1 flex flex-col items-center">
                                <h3 className="text-2xl font-serif text-[#3A302A] mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-[#3A302A]/80 font-sans text-sm leading-relaxed mb-8 flex-1">
                                    {service.description}
                                </p>
                                <Link 
                                    href={service.link}
                                    className="text-[#3A302A] font-sans text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity border-b border-[#3A302A] pb-1 inline-block"
                                >
                                    Read More
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
