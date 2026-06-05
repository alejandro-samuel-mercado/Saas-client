"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PawPrint, Package, Heart, LogOut, ChevronRight, User, Settings } from "lucide-react";
import Link from "next/link";

const TABS = [
    { id: "orders", label: "Mis Pedidos", icon: Package },
    { id: "favorites", label: "Favoritos", icon: Heart },
];

export function PetProfile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("orders");

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (!user) {
        router.push("/login");
        return null;
    }

    const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24">

            {/* ── HEADER ── */}
            <div className="bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] border-b border-[#D4B896]">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-full bg-[#E8963C] flex items-center justify-center shadow-lg text-white font-black text-2xl flex-shrink-0">
                                {initials}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <PawPrint className="h-4 w-4 text-[#E8963C]" />
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Mi Cuenta</span>
                                </div>
                                <h1 className="text-2xl font-black text-white">{user.name || "Mi Perfil"}</h1>
                                <p className="text-white/50 text-sm">{user.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-bold text-sm transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Tab nav */}
                <div className="flex gap-2 mb-8 bg-[#D4B896]/40 backdrop-blur-xl rounded-2xl border border-[#EDE0CF] p-1.5 shadow-lg w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-[#8B5E3C] text-white shadow-lg"
                                    : "text-[#A0714F] hover:text-[#5C3D2E]"
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === "orders" && (
                    <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] shadow-lg p-10 text-center">
                        <div className="h-20 w-20 rounded-full bg-[#EDE0CF] flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-[#A0714F]" />
                        </div>
                        <h3 className="text-xl font-black text-[#5C3D2E] mb-2">Todavía no compraste nada</h3>
                        <p className="text-[#A0714F] text-sm mb-6">Explorá nuestro catálogo y encontrá lo mejor para tu mascota.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B5E3C] text-white font-bold text-sm hover:bg-[#5C3D2E] transition-colors shadow-lg"
                        >
                            Ver Productos <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}

                {activeTab === "favorites" && (
                    <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF] shadow-lg p-10 text-center">
                        <div className="h-20 w-20 rounded-full bg-[#EDE0CF] flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-[#A0714F]" />
                        </div>
                        <h3 className="text-xl font-black text-[#5C3D2E] mb-2">No tenés favoritos guardados</h3>
                        <p className="text-[#A0714F] text-sm mb-6">Hacé click en el ♥ de cualquier producto para guardarlo acá.</p>
                        <Link
                            href="/favorites"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B5E3C] text-white font-bold text-sm hover:bg-[#5C3D2E] transition-colors shadow-lg"
                        >
                            Ver Favoritos <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
