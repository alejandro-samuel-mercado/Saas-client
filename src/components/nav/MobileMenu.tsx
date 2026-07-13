"use client";

import { productService } from "@/services/products";
import { useUIStore } from "@/store/ui";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bone,
  Building2,
  Calendar,
  Cat,
  ChevronRight,
  Dog,
  Fish,
  Flame,
  Globe,
  Grid3X3,
  Heart,
  Home,
  Key,
  LayoutGrid,
  Leaf,
  MapPin,
  Package,
  Phone,
  PawPrint,
  Scissors,
  Search,
  Sparkles,
  Star,
  Tag,
  Watch,
  Wind,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { useAuth } from "@/contexts/AuthContext";

// ─── Default/General Mobile Menu ──────────────────────────────────────────────
function DefaultMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user } = useAuth();

  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
  });

  useEffect(() => {
    productService.getCategoriesTree().then(setCategories);
  }, []);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: -2000, x: 1000 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -2000, x: 1000 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 pb-20 z-[1050] lg:hidden flex flex-col bg-white/95 backdrop-blur-3xl overflow-y-auto w-full h-auto"
        >
          <div className="flex items-center justify-between p-4 px-6 border-b border-gray-200/50">
            <Link className="h-10 w-14 m-2" href="/">
              {config?.logoUrl && (
                <img src={config.logoUrl} alt={config.storeName || ""} />
              )}
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex-1 px-8 py-0 flex flex-col gap-6 w-full max-w-lg mx-auto">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2 mt-4"
            >
              Inicio
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            <div>
              <button
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className="w-full flex justify-between items-center text-3xl max-sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent py-2"
              >
                Categorías
                <motion.span animate={{ rotate: isCategoriesOpen ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-primary">
                  <ChevronRight className="w-6 h-6" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 pl-4 mt-4 border-l-2 border-primary/30">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={closeMobileMenu}
                          className="text-xl font-medium text-gray-600 hover:text-primary hover:translate-x-2 transition-all"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/products?isTrending=true" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              Tendencias
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            {config?.navItemName && (
              <Link href="/custom" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
                {config.navItemName}
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </Link>
            )}

            <Link href="/products?isNew=true" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              Nuevos
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            <Link href="/products" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              Todos los Productos
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            <Link href="/favorites" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              Mis Favoritos
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            <Link href="/profile?tab=orders" onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              Mis Pedidos
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>

            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex justify-between items-center text-3xl max-sm:text-2xl font-semibold text-gray-800 hover:text-primary transition-all py-2">
              {user ? "Mi Cuenta" : "Iniciar Sesión"}
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Real Estate Mobile Menu ──────────────────────────────────────────────────
function RealEstateMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });

  const links = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Inmuebles", href: "/products", icon: Building2 },
    { label: "Alquileres", href: "/products?saleMode=ALQUILER", icon: Key },
    { label: "Terrenos y Lotes", href: "/products?search=lote", icon: MapPin },
    { label: "Nosotros", href: "/about", icon: Globe },
    { label: "Contacto", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[1050] lg:hidden bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/" onClick={closeMobileMenu}>
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt={config.storeName || ""} className="h-10 w-auto brightness-0 invert" />
              ) : (
                <span className="text-white font-bold text-xl tracking-widest uppercase">{config?.storeName || "REAL ESTATE"}</span>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <link.icon className="w-5 h-5 text-[#f5ab1c] group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold tracking-wide uppercase text-[11px]">{link.label}</span>
                  <ChevronRight className="ml-auto w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="px-6 pb-8 flex flex-col gap-3">
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all">
              {user ? "Mi Perfil" : "Iniciar Sesión"}
            </Link>
            {config?.contactPhone && (
              <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-full bg-[#f5ab1c] text-black font-bold text-sm uppercase tracking-widest">
                Contactar Agente
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Perfume Mobile Menu ───────────────────────────────────────────────────────
function PerfumeMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => import("@/services/products").then(m => m.productService.getCategoriesTree()),
    staleTime: 1000 * 60 * 60,
  });

  const dynLinks = (categories as any[]).filter((c: any) => c._count?.products > 0).slice(0, 4).map((c: any) => ({
    label: c.name, href: `/products?categoria=${c.slug}`, icon: Wind,
  }));

  const links = [
    { label: "Colección", href: "/products", icon: Sparkles },
    ...dynLinks,
    { label: "Contacto", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col"
          style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 50%, #0d0d1a 100%)" }}
        >
          {/* Decorative gold lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#d4af37]/20 via-transparent to-transparent" />
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#d4af37]/10 to-transparent" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-6 border-b border-[#d4af37]/20">
            <Link href="/" onClick={closeMobileMenu} className="flex flex-col">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-8 w-auto brightness-0 invert" />
              ) : (
                <>
                  <span className="text-[#d4af37] font-serif text-lg tracking-[0.3em] uppercase">{config?.storeName || "MAISON"}</span>
                  <span className="text-white/30 text-[8px] tracking-[0.5em] uppercase font-light">Parfum</span>
                </>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="p-2 border border-[#d4af37]/30 text-[#d4af37]/60 hover:text-[#d4af37] hover:border-[#d4af37]/60 transition-all rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="relative flex-1 flex flex-col px-8 py-8 gap-2 overflow-y-auto">
            <p className="text-[9px] text-[#d4af37]/40 tracking-[0.4em] uppercase mb-4">Explorar</p>
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 py-4 border-b border-white/5 text-white/70 hover:text-[#d4af37] group transition-all"
                >
                  <link.icon className="w-4 h-4 text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors" />
                  <span className="text-sm tracking-[0.2em] uppercase font-light">{link.label}</span>
                  <ChevronRight className="ml-auto w-3 h-3 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="relative px-8 pb-10 flex flex-col gap-3">
            <Link href="/favorites" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 border border-[#d4af37]/30 text-[#d4af37] text-xs tracking-[0.2em] uppercase hover:bg-[#d4af37]/10 transition-all rounded-full">
              <Heart className="w-4 h-4" /> Favoritos
            </Link>
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 bg-[#d4af37] text-black text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#c9a22a] transition-colors">
              {user ? "Mi Cuenta" : "Acceder"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Watch Mobile Menu ─────────────────────────────────────────────────────────
function WatchMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => import("@/services/products").then(m => m.productService.getCategoriesTree()),
    staleTime: 1000 * 60 * 60,
  });

  const dynLinks = (categories as any[]).filter((c: any) => c._count?.products > 0).slice(0, 3).map((c: any) => ({
    label: c.name, href: `/products?categoria=${c.slug}`,
  }));

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Todos los Relojes", href: "/products" },
    ...dynLinks,
    ...(config?.navItemName ? [{ label: config.navItemName, href: "/about" }] : []),
    { label: "Contacto", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ clipPath: "circle(0% at 95% 5%)" }}
          animate={{ clipPath: "circle(150% at 95% 5%)" }}
          exit={{ clipPath: "circle(0% at 95% 5%)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col bg-card"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-8 w-auto" />
              ) : (
                <span className="font-serif text-2xl text-foreground tracking-wider">{config?.storeName || "HORLOGER"}</span>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-primary/50 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-6 py-6 gap-0 overflow-y-auto">
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between py-5 border-b border-primary/10 text-foreground/80 hover:text-foreground group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Watch className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="text-base font-medium tracking-wide">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-6 pb-10 flex flex-col gap-3">
            <Link href="/favorites" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 rounded-full border border-primary/30 text-foreground text-sm font-medium hover:bg-primary/5 transition-all">
              <Heart className="w-4 h-4" /> Favoritos
            </Link>
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors">
              {user ? "Mi Perfil" : "Acceder"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Barber Mobile Menu ────────────────────────────────────────────────────────
function BarberMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });

  const links = [
    { label: "Máquinas", href: "/products?category=maquinas", icon: Scissors },
    { label: "Cuidado Barba", href: "/products?category=cuidado-barba", icon: Tag },
    { label: "Pomadas", href: "/products?category=pomadas", icon: Star },
    { label: "Accesorios", href: "/products?category=accesorios", icon: Package },
    { label: "Contacto", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col bg-stone-950"
        >
          {/* Orange accent line */}
          <div className="h-1 bg-gradient-to-r from-[#e65c00] via-[#f9a825] to-[#e65c00]" />

          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-8 w-auto invert" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[#e65c00] font-sans text-xl italic font-black uppercase tracking-tighter">Slick</span>
                  <span className="text-stone-100 font-sans text-lg font-bold uppercase tracking-widest">{config?.storeName || "STYLE"}</span>
                </div>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="p-2 border border-stone-700 rounded-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-6 py-6 gap-1 overflow-y-auto">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-4 px-4 py-4 text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all group rounded-sm border-b border-stone-800/50">
              <Home className="w-4 h-4 text-[#e65c00]" />
              <span className="text-sm font-bold uppercase tracking-widest">Inicio</span>
              <ChevronRight className="ml-auto w-3 h-3 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
            </Link>
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-4 text-stone-400 hover:text-white hover:bg-stone-800/50 transition-all group rounded-sm border-b border-stone-800/50"
                >
                  <link.icon className="w-4 h-4 text-[#e65c00]" />
                  <span className="text-sm font-bold uppercase tracking-widest">{link.label}</span>
                  <ChevronRight className="ml-auto w-3 h-3 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-6 pb-10 flex flex-col gap-3 border-t border-stone-800 pt-6">
            <Link href="/favorites" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 border border-stone-700 text-stone-300 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all rounded-sm">
              <Heart className="w-4 h-4" /> Favoritos
            </Link>
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 bg-[#e65c00] text-white text-xs font-black uppercase tracking-widest hover:bg-[#cc4e00] transition-all rounded-sm">
              {user ? "Mi Cuenta" : "Ingresar"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Pet Mobile Menu ───────────────────────────────────────────────────────────
function PetMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });

  const links = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Perros", href: "/products?category=alimentos-perros", icon: Dog },
    { label: "Gatos", href: "/products?category=alimentos-gatos", icon: Cat },
    { label: "Accesorios", href: "/products?category=accesorios-mascotas", icon: Fish },
    { label: "Higiene", href: "/products?category=higiene-mascotas", icon: Bone },
    { label: "Nosotros", href: "/about", icon: Heart },
    { label: "Contacto", href: "/contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col bg-[#EDE0CF]"
        >
          {/* Decorative paw prints */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
            {[...Array(6)].map((_, i) => (
              <PawPrint key={i} className="absolute w-16 h-16 text-[#8B5E3C]" style={{ top: `${i * 17}%`, left: `${i % 2 === 0 ? 10 : 75}%`, transform: `rotate(${i * 30}deg)` }} />
            ))}
          </div>

          <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#D4B896]/50">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-10 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                    <PawPrint className="h-5 w-5 text-[#EDE0CF]" />
                  </div>
                  <span className="font-black text-xl text-[#5C3D2E]">{config?.storeName || "PetShop"}</span>
                </div>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="p-2 rounded-full bg-[#D4B896]/50 text-[#5C3D2E] hover:bg-[#D4B896] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="relative flex-1 flex flex-col px-4 py-4 gap-1 overflow-y-auto">
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#5C3D2E] hover:bg-[#D4B896]/60 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center group-hover:bg-[#8B5E3C]/20 transition-colors">
                    <link.icon className="w-4 h-4 text-[#8B5E3C]" />
                  </div>
                  <span className="text-base font-bold">{link.label}</span>
                  <ChevronRight className="ml-auto w-4 h-4 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="relative px-6 pb-10 pt-4 border-t border-[#D4B896]/50 flex flex-col gap-3">
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#8B5E3C] text-[#EDE0CF] font-bold text-sm hover:bg-[#5C3D2E] transition-colors">
              {user ? "Mi Perfil" : "Ingresar"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Decor Mobile Menu ─────────────────────────────────────────────────────────
function DecorMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Colecciones", href: "/products" },
    { label: "Nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col bg-[#F0E5D8] text-[#3A302A]"
        >
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#D5BBAA]/50">
            <Link href="/" onClick={closeMobileMenu}>
              <span className="font-serif text-2xl tracking-tighter uppercase">{config?.storeName || "FLEUR"}</span>
            </Link>
            <button onClick={closeMobileMenu} className="hover:opacity-60 transition-opacity">
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-8 py-8 gap-6 overflow-y-auto">
            {links.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                <Link href={link.href} onClick={closeMobileMenu} className="flex items-center justify-between text-2xl font-serif text-[#3A302A] hover:opacity-60 transition-all group border-b border-[#D5BBAA]/40 pb-4">
                  {link.label}
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-60 group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-8 pb-10 flex flex-col gap-3">
            <Link href="/cart" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 border border-[#D5BBAA] text-[#3A302A] text-sm font-serif hover:bg-[#D5BBAA]/30 transition-all">
              Ver Bolsa
            </Link>
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 bg-[#3A302A] text-[#F0E5D8] text-sm font-serif hover:bg-[#5a4a3a] transition-colors">
              {user ? "Mi Cuenta" : "Ingresar"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── General (Electro) Mobile Menu ────────────────────────────────────────────
function GeneralMobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user } = useAuth();

  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig });

  useEffect(() => {
    productService.getCategoriesTree().then(setCategories);
  }, []);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[1050] lg:hidden flex flex-col bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--primary))]"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/" onClick={closeMobileMenu}>
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-9 w-auto" />
              ) : (
                <span className="font-bold text-xl text-white">{config?.storeName || "Electro Store"}</span>
              )}
            </Link>
            <button onClick={closeMobileMenu} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-6 py-4 gap-1 overflow-y-auto">
            {[
              { label: "Inicio", href: "/", icon: Home },
              { label: "Productos", href: "/products", icon: LayoutGrid },
              { label: "Más Vendidos", href: "/products?isTrending=true", icon: Flame },
              { label: "Novedades", href: "/products?isNew=true", icon: Sparkles },
            ].map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white hover:bg-white/10 transition-all group"
                >
                  <link.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  <span className="text-base font-semibold">{link.label}</span>
                  <ChevronRight className="ml-auto w-4 h-4 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}

            {/* Categorías accordion */}
            <div className="mt-2">
              <button
                onClick={() => setIsCategoriesOpen(p => !p)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white hover:bg-white/10 transition-all"
              >
                <Grid3X3 className="w-5 h-5 text-white/70" />
                <span className="text-base font-semibold">Categorías</span>
                <motion.div animate={{ rotate: isCategoriesOpen ? 90 : 0 }} className="ml-auto">
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                    <div className="ml-4 border-l border-white/20 pl-4 flex flex-col gap-1 py-2">
                      {categories.map(cat => (
                        <Link key={cat.id} href={`/products?category=${cat.slug}`} onClick={closeMobileMenu} className="text-white/70 hover:text-white py-1.5 text-sm font-medium transition-colors">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {config?.navItemName && (
              <Link href="/custom" onClick={closeMobileMenu} className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white hover:bg-white/10 transition-all group">
                <Leaf className="w-5 h-5 text-white/70" />
                <span className="text-base font-semibold">{config.navItemName}</span>
              </Link>
            )}
          </nav>

          <div className="px-6 pb-10 pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex gap-3">
              <Link href="/favorites" onClick={closeMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                <Heart className="w-4 h-4" /> Favoritos
              </Link>
              <Link href="/profile?tab=orders" onClick={closeMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                <Package className="w-4 h-4" /> Pedidos
              </Link>
            </div>
            <Link href={user ? "/profile" : "/login"} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-colors">
              {user ? "Mi Cuenta" : "Ingresar"}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────
export function MobileMenu() {
  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  const rubro = config?.rubro?.slug;

  if (rubro === "inmuebles") return <RealEstateMobileMenu />;
  if (rubro === "perfumes") return <PerfumeMobileMenu />;
  if (rubro === "relojes") return <WatchMobileMenu />;
  if (rubro === "barberias") return <BarberMobileMenu />;
  if (rubro === "mascotas") return <PetMobileMenu />;
  if (rubro === "decoracion") return <DecorMobileMenu />;
  if (rubro === "general") return <GeneralMobileMenu />;

  return <DefaultMobileMenu />;
}