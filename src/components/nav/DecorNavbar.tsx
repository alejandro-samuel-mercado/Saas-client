"use client";

import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/contexts/AuthContext";
import { useUIStore } from "@/store/ui";

export function DecorNavbar() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const [isScrolled, setIsScrolled] = useState(false);
    const { toggleMobileMenu } = useUIStore();
    const cartItems = useCartStore((state) => state.items);
    const { user } = useAuth();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Minimalist, Boho, Editorial aesthetic
    // Main bg: #F0E5D8, Text: #3A302A
    const showSolidBg = isScrolled || !isHomePage;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans tracking-wide
            ${showSolidBg ? "bg-[#F0E5D8] shadow-sm py-4 text-[#3A302A]" : "bg-transparent py-6 text-[#F0E5D8]"}`}
        >
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between">

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden hover:opacity-70 transition-colors"
                        onClick={toggleMobileMenu}
                    >
                        <Menu size={24} strokeWidth={1.5} />
                    </button>

                    {/* Logo */}
                    <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
                        <Link href="/" className="font-serif text-3xl tracking-tighter">
                            {config?.storeName ? (
                                <span className="uppercase">{config.storeName}</span>
                            ) : (
                                "FLEUR"
                            )}
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex flex-1 justify-center gap-10 text-sm tracking-widest uppercase">
                        <Link href="/" className="hover:opacity-60 transition-opacity">Inicio</Link>
                        <Link href="/products" className="hover:opacity-60 transition-opacity">Colecciones</Link>
                        <Link href="/about" className="hover:opacity-60 transition-opacity">Nosotros</Link>
                        <Link href="/contact" className="hover:opacity-60 transition-opacity">Contacto</Link>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-6">
                        <button className="hidden sm:block hover:opacity-60 transition-opacity">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <Link href={user ? "/profile" : "/login"} className="hover:opacity-60 transition-opacity">
                            <User size={20} strokeWidth={1.5} />
                        </Link>
                        {config?.rubro?.cartEnabled !== false && (
                            <Link href="/cart" className="relative hover:opacity-60 transition-opacity">
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#D5BBAA] text-[#3A302A] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

        </nav>
    );
}
