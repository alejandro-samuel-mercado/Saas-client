"use client";

import { home } from "@/../content/home";
import { navbar } from "@/../content/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/utils";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { useUIStore } from "@/store/ui";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Headphones,
    Heart,
    Menu,
    Package,
    Search,
    ShieldCheck,
    ShoppingCart,
    Truck,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    truck: Truck,
    "shield-check": ShieldCheck,
    package: Package,
    headphones: Headphones,
};

export function GeneralHero() {
    const { data: config, isLoading: isConfigLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });
    const { carousel } = home.hero;
    const { user } = useAuth();
    const {
        toggleCart,
        toggleNotifications,
        toggleMobileMenu,
        isMobileMenuOpen
    } = useUIStore();
    const { currency } = useCurrencyStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [categoriesTree, setCategoriesTree] = useState<any[]>([]);

    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const { getTotalItems } = useCartStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchContainerRef = useRef<HTMLFormElement>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
    const rubroConfig = useRubroConfig();
    const featureBadges = rubroConfig.benefitItems.slice(0, 2);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 0) {
                setIsSearching(true);
                setShowSearchResults(true);
                try {
                    const results = await productService.searchProducts(
                        searchQuery as any,
                    );
                    setSearchResults(results.data || []);
                } catch (error) {
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
                setIsSearching(false);
            }
        }, 90);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        setMounted(true);
        productService.getCategoriesTree().then(setCategoriesTree);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowSearchResults(false);
            }
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            setShowSearchResults(false);
        };

        if (showSearchResults) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [showSearchResults]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setShowSearchResults(false);
    };

    const getBannerSlides = () => {
        if (!config?.bannerImage) return carousel.slides;

        if (Array.isArray(config.bannerImage)) {
            return config.bannerImage.length > 0
                ? config.bannerImage
                : carousel.slides;
        }

        const legacyBanner = config.bannerImage as any;
        if (typeof legacyBanner === "string" && legacyBanner.trim()) {
            return [
                {
                    image: legacyBanner,
                    imageAlt: "Store Banner",
                    backgroundColor: "#f3f4f6",
                    title: config.storeName || "Bienvenidos",
                    subtitle: "Nuestra selección para ti",
                },
            ];
        }

        return carousel.slides;
    };

    const bannerSlides = getBannerSlides();

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, [bannerSlides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide(
            (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length,
        );
    }, [bannerSlides.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, carousel.autoPlayInterval);

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, carousel.autoPlayInterval]);

    if (isConfigLoading) {
        return (
            <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-[25vh] pt-6 max-md:pt-0 pb-12">
                <div className="px-40 mx-auto px-4 ">
                    <div className="bg-zinc-50 borde">
                        {/* Barra de búsqueda Skeleton */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-xl h-14 bg-white/50 rounded-full animate-pulse" />

                        {/* Contenido Skeleton */}
                        <div className="absolute left-20 top-1/2 -translate-y-1/2 space-y-6">
                            <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
                            <div className="h-16 w-[500px] bg-zinc-200 rounded-2xl animate-pulse" />
                            <div className="h-16 w-[400px] bg-zinc-200 rounded-2xl animate-pulse" />
                            <div className="h-10 w-48 bg-zinc-200 rounded-full animate-pulse mt-8" />
                        </div>

                        {/* Badges Skeleton */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-24 w-48 bg-white/50 rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentSlideData = bannerSlides[currentSlide];
    const CategoryColumn = ({ category }: { category: any }) => {
        const hasChildren = category.children && category.children.length > 0;

        return (
            <div className="break-inside-avoid mb-6">
                <Link
                    href={`/products?categoria=${category.slug}`}
                    className="font-bold mb-2 text-primary block hover:underline"
                >
                    {category.name}
                </Link>
                {hasChildren && (
                    <ul className="space-y-1 ml-1 pl-2 border-l border-border">
                        {category.children.map((child: any) => (
                            <li key={child.id}>
                                <Link
                                    href={`/products?categoria=${category.slug}&subcategoria=${child.slug}`}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-0.5"
                                >
                                    {child.name}
                                </Link>

                                {child.children && child.children.length > 0 && (
                                    <ul className="pl-2 mt-1 space-y-1">
                                        {child.children.map((grandChild: any) => (
                                            <li key={grandChild.id}>
                                                <Link
                                                    href={`/products?categoria=${category.slug}&subcategoria=${child.slug}&subcategoria=${grandChild.slug}`}
                                                    className="text-xs text-muted-foreground/80 hover:text-primary transition-colors block"
                                                >
                                                    - {grandChild.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-[25vh] max-lg:mb-[15vh] max-md:mb-[25vh] pt-6 max-md:pt-0 pb-12 max-sm:pb-28">

            {/* Tarjeta de Calificación Flotante - Lado Izquierdo */}
            <div className="px-20 mx-auto max-xl:px-10 max-lg:px-5 max-md:px-0 max-md:mt-12 max-sm:pt-4 ">
                <motion.div
                    animate={{
                        rotate: [1, -1, 1],
                        y: [0, -5, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="bg-white rounded-[2.5rem] max-md:rounded-none shadow-xl overflow-hidden relative "
                >
                    {/* Contenido del Hero con Fondo */}
                    <div className="relative min-h-[85vh] max-md:min-h-[35vh] max-sm:min-h-[28vh] max-lg:min-h-[45vh] ">

                        <div
                            className="absolute inset-0 rounded-[2.5rem] max-md:rounded-none overflow-hidden "
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: carousel.transitionDuration / 1000 }}
                                    className="absolute inset-0 "
                                    style={{ backgroundColor: currentSlideData.backgroundColor }}
                                >
                                    <Image
                                        src={currentSlideData.url || currentSlideData.image}
                                        alt={currentSlideData.title || currentSlideData.imageAlt}
                                        fill
                                        className="object-cover "
                                        priority={currentSlide === 0}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Contenido Principal */}
                        <div className="container mx-auto px-4 h-[75vh] max-md:h-[30vh] max-sm:h-[20vh] max-lg:mh-[40vh] flex items-center justify-start relative z-10 pointer-events-none ">
                            <div className="max-w-2xl pl-0 lg:pl-8 pointer-events-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-left py-12"
                                    >
                                        <div className="text-white">
                                            <motion.h1
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-5xl md:text-7xl font-bold mb-2 leading-tight drop-shadow-lg"
                                            >
                                                {currentSlideData.title}
                                            </motion.h1>
                                            {currentSlideData.titleLine2 && (
                                                <motion.h1
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg"
                                                >
                                                    {currentSlideData.titleLine2}
                                                </motion.h1>
                                            )}
                                            <motion.p
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-xl md:text-2xl opacity-90 mb-10 max-w-xl drop-shadow-md"
                                            >
                                                {currentSlideData.subtitle}
                                            </motion.p>

                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Indicadores del Carousel */}
                        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
                            {bannerSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    onMouseEnter={() => setIsAutoPlaying(false)}
                                    onMouseLeave={() => setIsAutoPlaying(true)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 hover:cursor-pointer ${currentSlide === index
                                        ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                        : "bg-white/40 hover:bg-white/60"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Badges de Características - Sobresaliendo del fondo */}
            <div className=" absolute lg:-bottom-16 max-sm:-bottom-[80%]  z-40 w-full max-md:-bottom-10  max-md:h-full ">
                <div className="md:container flex mx-auto  w-full justify-center    max-sm:h-46 max-md:h-48 lg:h-46 ">
                    <div className="flex gap-60 max-lg:gap-36 justify-center max-md:justify-between w-[40vw] md:w-[65vw] max-md:gap-28 max-sm:gap-4 max-md:w-[100%] max-sm:mx-6 max-sm:w-[100%]  max-md:mx-10    h-full">
                        {featureBadges.map((badge: any, index: any) => {
                            const Icon = iconMap[badge.icon];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="border-2 border-gray-400 bg-background/20 backdrop-blur-xl shadow-sm rounded-2xl p-6 w-50 "
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor: `${badge.color}`,
                                                color: "white",
                                            }}
                                        >
                                            {Icon && <Icon className="w-7 h-7 [color:inherit]" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-600  text-sm md:text-base mb-1">
                                                {badge.title}
                                            </h3>
                                            <p className="text-xs text-gray-400  font-semibold">
                                                {badge.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
