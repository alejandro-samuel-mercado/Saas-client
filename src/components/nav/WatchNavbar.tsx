/* eslint-disable @next/next/no-img-element */
"use client";

import { configService } from "@/services/config";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Heart, Menu, ShoppingCart, User, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function WatchNavbar() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    const { user } = useAuth();
    const { toggleMobileMenu, toggleCart } = useUIStore();
    const { getTotalItems } = useCartStore();
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const navLinks = [
        { name: "Colección", href: "/products" },
        { name: "Lujo", href: "/products?category=relojes-lujo" },
        { name: "Smartwatch", href: "/products?category=smartwatch" },
        { name: "Accesorios", href: "/products?category=accesorios-reloj" },
    ];

    const totalItems = mounted ? getTotalItems() : 0;

    return (
        <>
            {/* Search overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[200] bg-[#1A1A1A]/95 backdrop-blur-md flex items-center justify-center px-6">
                    <form onSubmit={handleSearch} className="w-full max-w-2xl">
                        <div className="flex items-center border-b border-[#C8A97E]/50 pb-4">
                            <Search className="h-5 w-5 text-[#C8A97E] mr-4 flex-shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar colección..."
                                className="flex-1 bg-transparent text-[#E6D2B5] text-xl font-serif placeholder:text-[#C8A97E]/40 outline-none"
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="ml-4 text-[#C8A97E]/50 hover:text-[#E6D2B5] transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pt-6 px-4 lg:px-8`}>
                <div className={`mx-auto max-w-7xl rounded-full transition-all duration-500 px-6 py-4 flex items-center justify-between ${
                    scrolled ? "bg-[#1A1A1A]/90 backdrop-blur-md shadow-lg border border-[#C8A97E]/20" : "bg-transparent"
                }`}>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        {config?.logoUrl ? (
                            <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-6 w-auto brightness-0 invert opacity-90" />
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Intertwined H monogram mockup */}
                                <div className="text-[#C8A97E] font-serif text-2xl leading-none italic font-bold">H</div>
                                <span className="hidden md:block text-[#E6D2B5] font-serif text-xl leading-none group-hover:text-white transition-colors">
                                    {config?.storeName || "HORLOGER"}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-sans tracking-wide transition-all relative group ${
                                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]))
                                        ? "text-[#E6D2B5]"
                                        : "text-[#E6D2B5]/70 hover:text-[#E6D2B5]"
                                }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8A97E] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Area */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSearchOpen(true)} className="flex items-center justify-center w-8 h-8 rounded-full bg-[#242424] text-[#E6D2B5]/70 hover:text-[#E6D2B5] border border-[#C8A97E]/20 hover:border-[#C8A97E]/50 transition-all">
                                <Search className="h-3.5 w-3.5" />
                            </button>

                            <button onClick={() => router.push(user ? "/profile" : "/login")} className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#242424] text-[#E6D2B5]/70 hover:text-[#E6D2B5] border border-[#C8A97E]/20 hover:border-[#C8A97E]/50 transition-all">
                                <User className="h-3.5 w-3.5" />
                            </button>

                            <button onClick={toggleCart} className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#242424] text-[#E6D2B5]/70 hover:text-[#E6D2B5] border border-[#C8A97E]/20 hover:border-[#C8A97E]/50 transition-all">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#C8A97E] text-[#1A1A1A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        <div className="w-px h-6 bg-[#C8A97E]/20 hidden lg:block mx-2" />

                        <Link href="/contact" className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#1A1A1A] font-medium text-sm hover:bg-[#E6D2B5] transition-colors">
                            Contacto
                        </Link>

                        <button onClick={toggleMobileMenu} className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#242424] text-[#E6D2B5]/70 border border-[#C8A97E]/20">
                            <Menu className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
