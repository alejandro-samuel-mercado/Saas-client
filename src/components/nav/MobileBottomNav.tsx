"use client";

import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { motion } from "framer-motion";
import {
  Bone,
  Building2,
  Calendar,
  Cat,
  Dog,
  Grid3X3,
  Heart,
  Home,
  Key,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Package,
  PawPrint,
  Phone,
  Search,
  Scissors,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  User,
  Watch,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";
import { useRouter } from "next/navigation";

// ─── Shared badge ──────────────────────────────────────────────────────────────
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-2 -right-2 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold ring-2 ring-current bg-inherit">
      {count}
    </span>
  );
}

// ─── Shared NavItem ────────────────────────────────────────────────────────────
interface NavItemDef {
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  active: boolean;
  badge?: number;
  /** custom active color class e.g. "text-[#d4af37]" */
  activeColor?: string;
}

function NavItem({ item, activeColor }: { item: NavItemDef; activeColor?: string }) {
  const { closeAll } = useUIStore();
  const Icon = item.icon;
  const color = item.active ? (activeColor || "text-primary") : "text-muted-foreground";

  const content = (
    <motion.div
      whileTap={{ scale: 0.88 }}
      className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${color}`}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />
        {item.badge !== undefined && item.badge > 0 && (
          <span className={`absolute -top-2 -right-2 text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold ring-2 ring-background ${item.active ? "bg-primary text-white" : "bg-primary text-white"}`}>
            {item.badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
    </motion.div>
  );

  if (item.href) {
    return <Link href={item.href} onClick={closeAll}>{content}</Link>;
  }
  return <button onClick={item.onClick} className="outline-none">{content}</button>;
}

// ─── Default Bottom Nav (wave bg) ─────────────────────────────────────────────
function DefaultBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toggleCart, toggleChat, isCartOpen, isChatOpen } = useUIStore();
  const { getTotalItems } = useCartStore();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig, staleTime: 1000 * 60 * 5 });

  const isAnyOverlayOpen = isCartOpen || isChatOpen;
  const items: NavItemDef[] = [
    { label: "Productos", icon: LayoutGrid, href: "/products", active: pathname === "/products" && !isAnyOverlayOpen },
    ...(config?.rubro?.cartEnabled !== false ? [{ label: "Carrito", icon: ShoppingBag, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() }] : []),
    { label: "Pedidos", icon: Package, href: "/profile?tab=orders", active: pathname === "/profile" && !isAnyOverlayOpen && searchParams.get("tab") === "orders" },
    { label: "Chat", icon: MessageCircle, onClick: toggleChat, active: isChatOpen },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" && !isAnyOverlayOpen },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden translate-y-2">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0,60 C150,100 350,45 500,60 L500,150 L0,150 Z" className="fill-background shadow-2xl" />
          <path d="M0,60 C150,100 350,45 500,60" fill="none" className="stroke-primary/30" strokeWidth="2" />
        </svg>
      </div>
      <nav className="relative flex justify-around items-end pt-12 pb-0 h-24">
        {items.map((item, idx) => <NavItem key={idx} item={item} />)}
      </nav>
    </div>
  );
}

// ─── Real Estate Bottom Nav ────────────────────────────────────────────────────
function RealEstateBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: config } = useQuery({ queryKey: ["publicConfig"], queryFn: configService.getPublicConfig, staleTime: 1000 * 60 * 5 });

  const items: NavItemDef[] = [
    { label: "Inicio", icon: Home, href: "/", active: pathname === "/" },
    { label: "Inmuebles", icon: Building2, href: "/products", active: pathname === "/products" },
    { label: "Alquiler", icon: Key, href: "/products?saleMode=ALQUILER", active: false },
    { label: "Mapa", icon: MapPin, href: "/products", active: false },
    { label: "Contacto", icon: Phone, href: "/contact", active: pathname === "/contact" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-t border-white/10" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          <Link key={idx} href={item.href!} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#f5ab1c]" : "text-white/50"}`}>
            <motion.div whileTap={{ scale: 0.85 }}>
              <item.icon className="w-5 h-5" />
            </motion.div>
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="h-safe-area-inset-bottom bg-black/90" />
    </div>
  );
}

// ─── Perfume Bottom Nav ────────────────────────────────────────────────────────
function PerfumeBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleCart, isCartOpen } = useUIStore();
  const { getTotalItems } = useCartStore();

  const items: NavItemDef[] = [
    { label: "Colección", icon: Sparkles, href: "/products", active: pathname === "/products" && !isCartOpen },
    { label: "Carrito", icon: ShoppingCart, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() },
    { label: "Favoritos", icon: Heart, href: "/favorites", active: pathname === "/favorites" },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a, #0a0a0a/95)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#d4af37]" : "text-white/40"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] tracking-[0.15em] uppercase font-light">{item.label}</span>
            </Link>
          ) : (
            <button key={idx} onClick={item.onClick} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#d4af37]" : "text-white/40"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] tracking-[0.15em] uppercase font-light">{item.label}</span>
            </button>
          )
        ))}
      </nav>
      <div className="h-safe-area-inset-bottom" style={{ background: "#0a0a0a" }} />
    </div>
  );
}

// ─── Watch Bottom Nav ──────────────────────────────────────────────────────────
function WatchBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleCart, isCartOpen } = useUIStore();
  const { getTotalItems } = useCartStore();

  const items: NavItemDef[] = [
    { label: "Inicio", icon: Home, href: "/", active: pathname === "/" && !isCartOpen },
    { label: "Relojes", icon: Watch, href: "/products", active: pathname === "/products" && !isCartOpen },
    { label: "Carrito", icon: ShoppingCart, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() },
    { label: "Favoritos", icon: Heart, href: "/favorites", active: pathname === "/favorites" },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute inset-0 bg-card/95 backdrop-blur-xl border-t border-primary/20" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-primary" : "text-foreground/40"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[9px] tracking-wide uppercase font-medium">{item.label}</span>
            </Link>
          ) : (
            <button key={idx} onClick={item.onClick} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-primary" : "text-foreground/40"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-background text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] tracking-wide uppercase font-medium">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}

// ─── Barber Bottom Nav ─────────────────────────────────────────────────────────
function BarberBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleCart, isCartOpen } = useUIStore();
  const { getTotalItems } = useCartStore();
  const router = useRouter();

  const items = [
    { label: "Tienda", icon: LayoutGrid, href: "/products", active: pathname === "/products" && !isCartOpen },
    { label: "Carrito", icon: ShoppingCart, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() },
    { label: "Favoritos", icon: Heart, href: "/favorites", active: pathname === "/favorites" },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" },
    { label: "Contacto", icon: Phone, href: "/contact", active: pathname === "/contact" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      {/* Barber stripe */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e65c00] via-[#f9a825] to-[#e65c00]" />
      <div className="absolute inset-0 bg-stone-950/97 backdrop-blur-xl border-t border-stone-800" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#e65c00]" : "text-stone-500"}`}>
              <motion.div whileTap={{ scale: 0.85 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          ) : (
            <button key={idx} onClick={item.onClick} className={`flex flex-col items-center gap-1 p-2 transition-all outline-none ${item.active ? "text-[#e65c00]" : "text-stone-500"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e65c00] text-white text-[10px] rounded-sm h-4 w-4 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}

// ─── Pet Bottom Nav ────────────────────────────────────────────────────────────
function PetBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleCart, isCartOpen } = useUIStore();
  const { getTotalItems } = useCartStore();

  const items = [
    { label: "Inicio", icon: Home, href: "/", active: pathname === "/" && !isCartOpen },
    { label: "Perros", icon: Dog, href: "/products?category=alimentos-perros", active: false },
    { label: "Carrito", icon: ShoppingCart, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() },
    { label: "Gatos", icon: Cat, href: "/products?category=alimentos-gatos", active: false },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute inset-0 bg-[#EDE0CF]/95 backdrop-blur-xl border-t border-[#D4B896]/70 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#8B5E3C]" : "text-[#A0714F]/50"}`}>
              <motion.div whileTap={{ scale: 0.85 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </Link>
          ) : (
            <button key={idx} onClick={item.onClick} className={`flex flex-col items-center gap-1 p-2 transition-all outline-none ${item.active ? "text-[#8B5E3C]" : "text-[#A0714F]/50"}`}>
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E8963C] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold ring-2 ring-[#EDE0CF]">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}

// ─── Decor Bottom Nav ──────────────────────────────────────────────────────────
function DecorBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [
    { label: "Inicio", icon: Home, href: "/", active: pathname === "/" },
    { label: "Colección", icon: Grid3X3, href: "/products", active: pathname === "/products" },
    { label: "Bolsa", icon: ShoppingBag, href: "/cart", active: pathname === "/cart" },
    { label: "Nosotros", icon: Star, href: "/about", active: pathname === "/about" },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute inset-0 bg-[#F0E5D8]/97 backdrop-blur-xl border-t border-[#D5BBAA]" />
      <nav className="relative flex justify-around items-center h-16 px-2">
        {items.map((item, idx) => (
          <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-[#3A302A]" : "text-[#3A302A]/35"}`}>
            <motion.div whileTap={{ scale: 0.85 }}>
              <item.icon className="w-5 h-5" strokeWidth={item.active ? 2 : 1.5} />
            </motion.div>
            <span className="text-[9px] uppercase tracking-widest font-light">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

// ─── General Bottom Nav ────────────────────────────────────────────────────────
function GeneralBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toggleCart, toggleChat, isCartOpen, isChatOpen } = useUIStore();
  const { getTotalItems } = useCartStore();

  const isAnyOverlayOpen = isCartOpen || isChatOpen;

  const items = [
    { label: "Productos", icon: LayoutGrid, href: "/products", active: pathname === "/products" && !isAnyOverlayOpen },
    { label: "Carrito", icon: ShoppingCart, onClick: toggleCart, active: isCartOpen, badge: getTotalItems() },
    { label: "Pedidos", icon: Package, href: "/profile?tab=orders", active: pathname === "/profile" && !isAnyOverlayOpen && searchParams.get("tab") === "orders" },
    { label: "Chat", icon: MessageCircle, onClick: toggleChat, active: isChatOpen },
    { label: "Perfil", icon: User, href: user ? "/profile" : "/login", active: pathname === "/profile" && !isAnyOverlayOpen },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[1000]">
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden translate-y-2">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0,60 C150,100 350,45 500,60 L500,150 L0,150 Z" className="fill-background shadow-2xl" />
          <path d="M0,60 C150,100 350,45 500,60" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" />
        </svg>
      </div>
      <nav className="relative flex justify-around items-end pt-12 pb-0 h-24">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href} onClick={useUIStore.getState().closeAll} className={`flex flex-col items-center gap-1 p-2 transition-all ${item.active ? "text-primary" : "text-muted-foreground"}`}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <item.icon className="w-6 h-6" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          ) : (
            <button key={idx} onClick={item.onClick} className={`flex flex-col items-center gap-1 p-2 transition-all outline-none ${item.active ? "text-primary" : "text-muted-foreground"}`}>
              <motion.div whileTap={{ scale: 0.9 }} className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold ring-2 ring-background">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          )
        ))}
      </nav>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────
export function MobileBottomNav() {
  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  const rubro = config?.rubro?.slug;

  if (rubro === "inmuebles") return <RealEstateBottomNav />;
  if (rubro === "perfumes") return <PerfumeBottomNav />;
  if (rubro === "relojes") return <WatchBottomNav />;
  if (rubro === "barberias") return <BarberBottomNav />;
  if (rubro === "mascotas") return <PetBottomNav />;
  if (rubro === "decoracion") return <DecorBottomNav />;
  if (rubro === "general") return <GeneralBottomNav />;

  return <DefaultBottomNav />;
}
