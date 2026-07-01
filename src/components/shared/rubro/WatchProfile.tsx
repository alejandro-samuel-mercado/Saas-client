"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Watch, Package, Heart, LogOut, ChevronRight } from "lucide-react";

const TABS = [
    { id: "orders", label: "Pedidos", icon: Package },
    { id: "favorites", label: "Favoritos", icon: Heart },
];

export function WatchProfile() {
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

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pb-32 pt-24">
            {/* Header */}
            <div className="border-b border-primary/10 bg-background">
                <div className="container mx-auto px-6 lg:px-12 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Watch className="h-4 w-4 text-primary" />
                                <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-primary">Mi Cuenta</span>
                            </div>
                            <h1 className="text-3xl font-serif text-foreground">{user.name || user.email}</h1>
                            <p className="text-sm font-mono text-primary/40 mt-1">{user.email}</p>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 border border-primary/15 px-4 py-2.5 text-primary/50 hover:text-foreground hover:border-primary/40 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors">
                            <LogOut className="h-3.5 w-3.5" />
                            Salir
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 py-10">
                {/* Tab nav */}
                <div className="flex gap-0 border-b border-primary/10 mb-10">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-primary/40 hover:text-primary"}`}>
                            <tab.icon className="h-3.5 w-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === "orders" && (
                    <div>
                        <div className="text-center py-20 border border-primary/10 bg-background">
                            <Package className="h-10 w-10 text-primary/20 mx-auto mb-4" />
                            <p className="text-primary/30 font-mono text-sm tracking-widest uppercase mb-4">Sin pedidos aún</p>
                            <a href="/products"
                                className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-primary border border-primary/20 px-6 py-2.5 hover:bg-primary/10 transition-colors">
                                Explorar Colección <ChevronRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                )}

                {activeTab === "favorites" && (
                    <div className="text-center py-20 border border-primary/10 bg-background">
                        <Heart className="h-10 w-10 text-primary/20 mx-auto mb-4" />
                        <p className="text-primary/30 font-mono text-sm tracking-widest uppercase mb-4">Tus favoritos</p>
                        <a href="/favorites"
                            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-primary border border-primary/20 px-6 py-2.5 hover:bg-primary/10 transition-colors">
                            Ver Favoritos <ChevronRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
}
