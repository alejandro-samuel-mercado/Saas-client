"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Package, Heart, LogOut, Flower2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/adapters/http";
import { guestOrderPersistence } from "@/lib/guest-persistence";
import { useFavoritesStore } from "@/store/favorites";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

const TABS = [
    { id: "orders", label: "Mis Pedidos", icon: Package },
    { id: "favorites", label: "Favoritos", icon: Heart },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pendiente", color: "#C4A882" },
    CONFIRMED: { label: "Confirmado", color: "#8B6F5E" },
    DELIVERING: { label: "En camino", color: "#5C4A3E" },
    DELIVERED: { label: "Entregado", color: "#3A302A" },
    CANCELLED: { label: "Cancelado", color: "#999" },
};

export function DecorProfile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("orders");
    const { favorites } = useFavoritesStore();

    const { data: ordersData } = useQuery({
        queryKey: ["orders", "my"],
        queryFn: async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const response = await http<{ success: boolean; data: any[] }>("/api/sales/my-purchases?includePending=true");
                return response.data || [];
            } else {
                const guestOrders = guestOrderPersistence.getOrders();
                if (guestOrders.length === 0) return [];
                const detailedOrders = await Promise.all(
                    guestOrders.map(async (go) => {
                        try {
                            const res = await http<any>(`/api/sales/guest/${go.id}`);
                            return res.data || res;
                        } catch (err) {
                            return null;
                        }
                    })
                );
                return detailedOrders.filter(Boolean);
            }
        },
        enabled: !!user || typeof window !== 'undefined',
    });

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) {
        router.push("/login");
        return null;
    }

    const orders = (ordersData as any) || [];
    const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

    return (
        <main className="min-h-screen pt-20 pb-24" style={{ backgroundColor: "#F0E5D8" }}>

            {/* ── HEADER BANNER ── */}
            <div className="w-full" style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 60%, #8B6F5E 100%)" }}>
                <div className="relative overflow-hidden">
                    {/* Texture */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                    {/* Arch decoration */}
                    <div className="absolute top-0 right-0 w-80 h-48 rounded-b-full border border-[#C4A882]/20 translate-x-20 hidden lg:block" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-full bg-[#C4A882] flex items-center justify-center shadow-lg font-serif text-2xl text-[#3A302A] font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div>
                                <p className="text-[#C4A882] text-[10px] tracking-[0.3em] uppercase font-sans mb-1 flex items-center gap-2">
                                    <Flower2 size={12} /> Mi Cuenta
                                </p>
                                <h1 className="font-serif text-3xl text-[#F0E5D8]">{user.name || "Mi Perfil"}</h1>
                                <p className="text-[#C4A882]/60 text-sm font-sans font-light">{user.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 border border-[#C4A882]/30 text-[#C4A882]/70 hover:text-[#F0E5D8] hover:border-[#C4A882]/60 font-sans text-xs tracking-[0.2em] uppercase transition-all"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>

                {/* Wave */}
                <div className="w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#F0E5D8" />
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                {/* Tab nav */}
                <div className="flex gap-0 mb-10 border-b border-[#3A302A]/15 w-full">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-all border-b-2 -mb-[2px] ${
                                activeTab === tab.id
                                    ? "border-[#3A302A] text-[#3A302A]"
                                    : "border-transparent text-[#3A302A]/40 hover:text-[#3A302A]/70"
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                        {orders.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center gap-4">
                                <Flower2 size={40} className="text-[#C4A882]" />
                                <p className="font-serif text-2xl text-[#3A302A]">Aún no tenés pedidos</p>
                                <Link href="/products" className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#3A302A] underline underline-offset-4 hover:text-[#8B6F5E] transition-colors">
                                    Explorar catálogo
                                </Link>
                            </div>
                        ) : orders.map((order: any) => {
                            const status = STATUS_LABEL[order.status] || { label: order.status, color: "#999" };
                            return (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="group flex items-center justify-between p-6 bg-[#E1CDBF]/30 hover:bg-[#E1CDBF]/60 transition-colors border border-[#3A302A]/8"
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#5C4A3E]">
                                            Pedido #{order.id}
                                        </p>
                                        <p className="font-serif text-xl text-[#3A302A]">
                                            {formatPrice(Number(order.totalAmount || 0))}
                                        </p>
                                        <p className="font-sans text-xs text-[#5C4A3E]">
                                            {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 border" style={{ color: status.color, borderColor: status.color }}>
                                            {status.label}
                                        </span>
                                        <ChevronRight size={16} className="text-[#3A302A]/30 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}

                {/* FAVORITES */}
                {activeTab === "favorites" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {favorites.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center gap-4">
                                <Heart size={40} className="text-[#C4A882]" />
                                <p className="font-serif text-2xl text-[#3A302A]">Aún no tenés favoritos</p>
                                <Link href="/products" className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#3A302A] underline underline-offset-4 hover:text-[#8B6F5E] transition-colors">
                                    Explorar catálogo
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {favorites.map((fav: any) => (
                                    <Link key={fav.id} href={`/products/${fav.id}`} className="group flex flex-col gap-3">
                                        <div className="relative aspect-[4/5] bg-[#E1CDBF]/30 overflow-hidden">
                                            {fav.images?.[0] && (
                                                <img src={fav.images[0]} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                        </div>
                                        <p className="font-serif text-[#3A302A] truncate">{fav.name}</p>
                                        <p className="font-sans text-xs text-[#5C4A3E]">{formatPrice(Number(fav.basePrice))}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </main>
    );
}
