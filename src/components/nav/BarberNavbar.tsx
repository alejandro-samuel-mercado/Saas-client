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

export function BarberNavbar() {
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
        { name: "Máquinas", href: "/products?category=maquinas" },
        { name: "Cuidado Barba", href: "/products?category=cuidado-barba" },
        { name: "Pomadas", href: "/products?category=pomadas" },
        { name: "Accesorios", href: "/products?category=accesorios" },
        { name: "Contacto", href: "/contact" },
    ];

    const totalItems = mounted ? getTotalItems() : 0;

    return (
        <>
            {/* Search overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[200] bg-stone-900/95 backdrop-blur-md flex items-center justify-center px-6">
                    <form onSubmit={handleSearch} className="w-full max-w-2xl">
                        <div className="flex items-center border-b border-stone-700 pb-4">
                            <Search className="h-5 w-5 text-[#e65c00] mr-4 flex-shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar herramientas o productos..."
                                className="flex-1 bg-transparent text-stone-100 text-xl font-sans font-bold placeholder:text-stone-500 outline-none"
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="ml-4 text-stone-500 hover:text-stone-200 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pt-6 px-4 lg:px-8`}>
                <div className={`mx-auto max-w-7xl transition-all duration-500 px-6 py-4 flex items-center justify-between shadow-sm ${
                    scrolled ? "bg-stone-900/95 backdrop-blur-md border-b border-stone-800" : "bg-transparent"
                }`}>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        {config?.logoUrl ? (
                            <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-6 w-auto invert opacity-90" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="text-[#e65c00] font-sans text-2xl leading-none italic font-black uppercase tracking-tighter">Slick</div>
                                <span className="hidden md:block text-stone-100 font-sans text-xl leading-none font-bold group-hover:text-[#e65c00] transition-colors uppercase tracking-widest">
                                    {config?.storeName || "STYLE"}
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
                                className={`text-sm font-sans tracking-wide uppercase font-bold transition-all relative group ${
                                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]))
                                        ? "text-[#e65c00]"
                                        : "text-stone-400 hover:text-stone-200"
                                }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#e65c00] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right Area */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSearchOpen(true)} className="flex items-center justify-center w-9 h-9 bg-transparent text-stone-400 hover:text-white border border-transparent hover:border-stone-700 hover:bg-stone-800 transition-all rounded-sm">
                                <Search className="h-4 w-4" />
                            </button>

                            <button onClick={() => router.push(user ? "/profile" : "/login")} className="hidden sm:flex items-center justify-center w-9 h-9 bg-transparent text-stone-400 hover:text-white border border-transparent hover:border-stone-700 hover:bg-stone-800 transition-all rounded-sm">
                                <User className="h-4 w-4" />
                            </button>

                            <button onClick={toggleCart} className="relative flex items-center justify-center w-9 h-9 bg-transparent text-stone-400 hover:text-white border border-transparent hover:border-stone-700 hover:bg-stone-800 transition-all rounded-sm">
                                <ShoppingCart className="h-4 w-4" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#e65c00] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                        
                        <div className="w-px h-6 bg-stone-700 hidden lg:block mx-2" />

                        <button onClick={toggleMobileMenu} className="lg:hidden flex items-center justify-center w-9 h-9 bg-transparent text-stone-300 border border-stone-700 hover:bg-stone-800 rounded-sm">
                            <Menu className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
