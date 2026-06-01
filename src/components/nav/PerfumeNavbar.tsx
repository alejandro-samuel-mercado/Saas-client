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

export function PerfumeNavbar() {
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
        const handleScroll = () => setScrolled(window.scrollY > 60);
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
        { name: "Clásicos", href: "/products?category=clasicos-perfumes" },
        { name: "Orientales", href: "/products?category=orientales-amaderados" },
        { name: "Florales", href: "/products?category=florales-frescos" },
        { name: "Oud", href: "/products?category=arabes-oud" },
        { name: "Contacto", href: "/contact" },
    ];

    const totalItems = mounted ? getTotalItems() : 0;

    return (
        <>
            {/* Search overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center px-6">
                    <form onSubmit={handleSearch} className="w-full max-w-2xl">
                        <div className="flex items-center border-b-2 border-[#d4af37] pb-4">
                            <Search className="h-5 w-5 text-[#d4af37] mr-4 flex-shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar fragancia, marca, concentración..."
                                className="flex-1 bg-transparent text-[#f9f1d8] text-xl font-light placeholder:text-white/30 outline-none tracking-widest"
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="ml-4 text-white/50 hover:text-[#d4af37] transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-white/30 tracking-[0.3em] uppercase">Presiona Enter para buscar</p>
                    </form>
                </div>
            )}

            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
                scrolled
                    ? "bg-[#0a0a0a]/95 backdrop-blur-md py-4 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent py-8"
            }`}>
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            {config?.logoUrl ? (
                                <img src={config.logoUrl} alt={config.storeName || "Logo"} className="h-8 md:h-10 w-auto brightness-0 invert" />
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-[#d4af37] font-serif text-xl md:text-2xl tracking-[0.3em] uppercase leading-none">
                                        {config?.storeName || "MAISON"}
                                    </span>
                                    <span className="text-white/30 text-[8px] tracking-[0.5em] uppercase font-light">Parfum</span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {pathname !== "/" && (
                                <Link href="/" className="text-white/50 hover:text-[#d4af37] text-[10px] font-bold tracking-[0.3em] uppercase transition-colors">
                                    Home
                                </Link>
                            )}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-[10px] font-bold tracking-[0.25em] uppercase transition-all relative group ${
                                        pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]))
                                            ? "text-[#d4af37]"
                                            : "text-white/70 hover:text-[#d4af37]"
                                    }`}
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-white/60 hover:text-[#d4af37] transition-colors p-2"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            <button
                                onClick={() => router.push("/favorites")}
                                className="text-white/60 hover:text-[#d4af37] transition-colors p-2 hidden sm:flex"
                            >
                                <Heart className="h-5 w-5" />
                            </button>

                            <button
                                onClick={() => router.push(user ? "/profile" : "/login")}
                                className="text-white/60 hover:text-[#d4af37] transition-colors p-2 hidden sm:flex"
                            >
                                <User className="h-5 w-5" />
                            </button>

                            <button
                                onClick={toggleCart}
                                className="relative text-white/60 hover:text-[#d4af37] transition-colors p-2"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden text-white/60 hover:text-[#d4af37] transition-colors p-2"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
