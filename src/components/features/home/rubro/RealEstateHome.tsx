"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { productService } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Building, Home, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RealEstateHero } from "./RealEstateHero";
import { Button } from "@/components/ui/button";

export function RealEstateHome() {
    const { data: trendingProducts, isLoading: isLoadingTrending } = useQuery({
        queryKey: ["products", "trending", "inmuebles"],
        queryFn: async () => {
            const result = await productService.getProducts({
                limit: 4,
                isTrending: "true",
            });
            return result;
        },
    });

    const { data: newProducts, isLoading: isLoadingNew } = useQuery({
        queryKey: ["products", "new", "inmuebles"],
        queryFn: async () => {
            const result = await productService.getProducts({
                limit: 4,
                isNew: "true",
            });
            return result;
        },
    });

    return (
        <main className="min-h-screen bg-white font-sans text-black pb-20">
            {/* 100vh Hero with Search */}
            <RealEstateHero />

            {/* Custom Real Estate Marquee */}
            <div className="bg-[#0a0a0a] text-white py-6 overflow-hidden border-y border-white/10">
                <div className="flex whitespace-nowrap animate-marquee">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center mx-8">
                            <span className="text-xl font-black tracking-widest uppercase opacity-80">Alquileres</span>
                            <span className="mx-8 text-[#f5ab1c] opacity-50">✦</span>
                            <span className="text-xl font-black tracking-widest uppercase opacity-80">Inmuebles</span>
                            <span className="mx-8 text-[#f5ab1c] opacity-50">✦</span>
                            <span className="text-xl font-black tracking-widest uppercase opacity-80">Terrenos & Lotes</span>
                            <span className="mx-8 text-[#f5ab1c] opacity-50">✦</span>
                            <span className="text-xl font-black tracking-widest uppercase opacity-80">Desarrollos Premium</span>
                            <span className="mx-8 text-[#f5ab1c] opacity-50">✦</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inmuebles Categorías Exclusivas */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#1a1a1a]">Nuestros Pilares</h2>
                            <p className="text-gray-500 font-medium tracking-wide max-w-2xl">
                                Seleccionamos estratégicamente cada segmento para ofrecer rentabilidad y exclusividad. Explora nuestras principales líneas de negocio inmobiliario.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href="/products?saleMode=ALQUILER" className="group block bg-[#f4f4f4] p-12 hover:bg-[#1a1a1a] transition-colors duration-500 rounded-sm">
                            <Home className="h-12 w-12 text-[#1a1a1a] group-hover:text-white mb-8 transition-colors" />
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] group-hover:text-white mb-4 transition-colors">Alquileres Selectos</h3>
                            <p className="text-gray-500 group-hover:text-gray-400 mb-8 transition-colors">Residencias y departamentos listos para habitar con las mejores condiciones del mercado.</p>
                            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-[#1a1a1a] group-hover:text-[#f5ab1c] transition-colors">
                                Ver Catálogo <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Link>

                        <Link href="/products" className="group block bg-[#7c5a43] p-12 hover:bg-[#1a1a1a] transition-colors duration-500 rounded-sm">
                            <Building className="h-12 w-12 text-white mb-8 transition-colors" />
                            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 transition-colors">Inmuebles Premium</h3>
                            <p className="text-white/70 mb-8 transition-colors">Propiedades de lujo y desarrollos urbanos diseñados para un estilo de vida superior.</p>
                            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-white transition-colors">
                                Explorar Proyectos <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Link>

                        <Link href="/products?search=lote" className="group block bg-[#f4f4f4] p-12 hover:bg-[#1a1a1a] transition-colors duration-500 rounded-sm">
                            <Map className="h-12 w-12 text-[#1a1a1a] group-hover:text-white mb-8 transition-colors" />
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] group-hover:text-white mb-4 transition-colors">Terrenos y Lotes</h3>
                            <p className="text-gray-500 group-hover:text-gray-400 mb-8 transition-colors">La base sólida para tu próxima gran inversión. Lotes en zonas de alta plusvalía.</p>
                            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-[#1a1a1a] group-hover:text-[#f5ab1c] transition-colors">
                                Ver Oportunidades <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Propiedades Destacadas (Trending) */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-[#f5ab1c] font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Alta Demanda</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1a1a1a]">Propiedades Destacadas</h2>
                        </div>
                        <Link href="/products?isTrending=true" className="hidden md:flex items-center gap-2 border border-gray-300 px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-colors">
                            Ver Todas <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingTrending ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="h-96 bg-gray-200 animate-pulse rounded-sm" />
                            ))
                        ) : trendingProducts?.data?.length ? (
                            trendingProducts.data.map((product) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No hay propiedades destacadas disponibles en este momento.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Galería de Arquitectura / Planos */}
            <section id="nosotros" className="py-32 bg-[#1a1a1a] text-white relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-[50vw] h-full bg-[#f5ab1c] opacity-5 -skew-x-12 translate-x-32" />

                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                                Excelencia<br />
                                <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Estructural</span>
                            </h2>
                            <p className="text-white/70 text-lg mb-10 font-light max-w-lg">
                                Cada proyecto en nuestro portfolio representa el balance perfecto entre diseño vanguardista, funcionalidad habitacional y solidez constructiva.
                            </p>
                            <div className="grid grid-cols-2 gap-8 mb-10 border-t border-white/20 pt-8">
                                <div>
                                    <p className="text-4xl font-black text-[#f5ab1c] mb-2">360°</p>
                                    <p className="text-xs font-bold tracking-widest uppercase opacity-70">Vistas Panorámicas</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-[#f5ab1c] mb-2">100%</p>
                                    <p className="text-xs font-bold tracking-widest uppercase opacity-70">Materiales Premium</p>
                                </div>
                            </div>
                            <Button className="bg-white text-black hover:bg-[#f5ab1c] rounded-none px-10 py-6 font-bold uppercase tracking-widest text-xs transition-colors">
                                Ver Modelos 3D
                            </Button>
                        </div>

                        {/* Asymmetric Gallery */}
                        <div className="relative h-[600px] w-full">
                            <div className="absolute top-0 right-0 w-3/4 h-[400px] z-10">
                                <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" alt="Arquitectura Exterior" fill className="object-cover rounded-sm shadow-2xl" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-2/3 h-[300px] z-20 border-8 border-[#1a1a1a]">
                                <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" alt="Interior Premium" fill className="object-cover rounded-sm" />
                            </div>
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-[#7c5a43] p-6 z-30 rounded-full flex flex-col items-center justify-center text-center shadow-2xl animate-spin-slow" style={{ animationDuration: '20s' }}>
                                <span className="text-sm font-bold tracking-[0.2em] uppercase block transform -rotate-12">Calidad</span>
                                <span className="text-sm font-bold tracking-[0.2em] uppercase block transform -rotate-12">Asegurada</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nuevos Ingresos */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[#f5ab1c] font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Recién Llegados</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1a1a1a]">Últimos Ingresos</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingNew ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="h-96 bg-gray-200 animate-pulse rounded-sm" />
                            ))
                        ) : newProducts?.data?.length ? (
                            newProducts.data.map((product) => (
                                <ProductCardRouter key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center">No hay nuevos ingresos en este momento.</p>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/products?isNew=true" className="inline-flex items-center gap-2 border border-gray-300 px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-colors">
                            Explorar Todos los Ingresos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
