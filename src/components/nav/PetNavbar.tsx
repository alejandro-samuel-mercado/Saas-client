"use client";

import { useAuth } from "@/contexts/AuthContext";
import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Dog, Heart, Menu, Search, ShoppingCart, User, X, Cat, Bone, Fish, PawPrint, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PetNavbar() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { user } = useAuth();
    const { toggleCart, toggleMobileMenu, isMobileMenuOpen } = useUIStore();
    const { getTotalItems } = useCartStore();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
        const handler = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const NAV_LINKS = [
        { label: "Inicio", href: "/", icon: Home },
        { label: "Perros", href: "/products?category=perros", icon: Dog },
        { label: "Gatos", href: "/products?category=gatos", icon: Cat },
        { label: "Alimentos", href: "/products?category=alimentos", icon: Bone },
        { label: "Accesorios", href: "/products?category=accesorios", icon: Fish },
        { label: "Nosotros", href: "/about", icon: null },
        { label: "Contacto", href: "/contact", icon: null },
    ];

    const cartCount = mounted ? getTotalItems() : 0;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[#D4B896]/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/20"
                    : "bg-[#EDE0CF]/80 backdrop-blur-md border-b border-[#D4B896]/30"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                    {config?.logoUrl ? (
                        <img src={config.logoUrl} alt={config.storeName || "PetShop"} className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-full bg-[#8B5E3C] flex items-center justify-center shadow-lg group-hover:bg-[#E8963C] transition-colors">
                                <PawPrint className="h-5 w-5 text-[#EDE0CF]" />
                            </div>
                            <span className="font-black text-xl text-[#5C3D2E] tracking-tight group-hover:text-[#8B5E3C] transition-colors">
                                {config?.storeName || "PetShop"}
                            </span>
                        </div>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-[#5C3D2E] hover:text-[#8B5E3C] hover:bg-[#EDE0CF] transition-all duration-200"
                        >
                            {link.icon && <link.icon className="h-3.5 w-3.5" />}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Icons */}
                <div className="flex items-center gap-1 md:gap-2">
                    {/* Search */}
                    <div className="relative">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors"
                        >
                            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </button>
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.form
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 220 }}
                                    exit={{ opacity: 0, width: 0 }}
                                    onSubmit={handleSearch}
                                    className="absolute right-full top-1/2 -translate-y-1/2 mr-2 overflow-hidden"
                                >
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar productos..."
                                        className="w-full px-4 py-2 rounded-full border-2 border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/60 outline-none focus:border-[#E8963C]"
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Favorites */}
                    <button
                        onClick={() => router.push("/favorites")}
                        className="hidden sm:flex h-9 w-9 rounded-full items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors"
                    >
                        <Heart className="h-5 w-5" />
                    </button>

                    {/* User */}
                    <button
                        onClick={() => router.push(user ? "/profile" : "/login")}
                        className="hidden sm:flex h-9 w-9 rounded-full items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors"
                    >
                        <User className="h-5 w-5" />
                    </button>

                    {/* Cart */}
                    <button
                        onClick={toggleCart}
                        className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5E3C] hover:bg-[#5C3D2E] text-[#EDE0CF] font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {cartCount > 0 && (
                            <span className="font-black">{cartCount}</span>
                        )}
                    </button>

                    {/* Mobile menu */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden h-9 w-9 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden overflow-hidden border-t border-white/20 bg-[#D4B896]/50 backdrop-blur-xl shadow-2xl"
                    >
                        <nav className="px-4 py-4 flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={toggleMobileMenu}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[#5C3D2E] hover:bg-[#EDE0CF] transition-colors"
                                >
                                    {link.icon && <link.icon className="h-4 w-4 text-[#8B5E3C]" />}
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex gap-2 mt-3 pt-3 border-t border-[#D4B896]">
                                <Link href="/favorites" onClick={toggleMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-[#D4B896] text-[#5C3D2E] font-bold text-sm">
                                    <Heart className="h-4 w-4" /> Favoritos
                                </Link>
                                <Link href={user ? "/profile" : "/login"} onClick={toggleMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-[#D4B896] text-[#5C3D2E] font-bold text-sm">
                                    <User className="h-4 w-4" /> {user ? "Perfil" : "Ingresar"}
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
