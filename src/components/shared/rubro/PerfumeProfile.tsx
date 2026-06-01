/* eslint-disable @next/next/no-img-element */
"use client";

import { FavoritesTab } from "@/components/features/profile/FavoritesTab";
import { OrdersTab } from "@/components/features/profile/OrdersTab";
import { PointsTab } from "@/components/features/profile/PointsTab";
import { ProfileEditTab } from "@/components/features/profile/ProfileEditTab";
import { ReviewsTab } from "@/components/features/profile/ReviewsTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { PublicConfig, configService } from "@/services/config";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, LogOut, Mail, MapPin, MessageSquare, Package, User as UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { guestOrderPersistence } from "@/lib/guest-persistence";

export function PerfumeProfile() {
  const { user: authUser, isLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [storeConfig, setStoreConfig] = useState<PublicConfig | null>(null);

  useEffect(() => {
    configService.getPublicConfig().then(setStoreConfig).catch(console.error);
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setIsGuest(false);
    } else if (!isLoading) {
      const gOrders = guestOrderPersistence.getOrders();
      const isOrdersTab = searchParams.get("tab") === "orders" || activeTab === "orders";

      if (gOrders.length > 0 || isOrdersTab) {
        setIsGuest(true);
        setUser({
          name: "Invitado",
          email: "Compra sin cuenta",
          role: { name: "CUSTOMER" },
          points: 0,
        });
        if (!searchParams.get("tab")) {
          setActiveTab("orders");
        }
      } else {
        router.push("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isLoading, router, searchParams]);

  if (isLoading || (!user && !isGuest)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171310]">
        <div className="w-12 h-12 border-y-2 border-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171310] text-[#f9f1d8] font-sans pt-20 pb-40">
      {/* HEADER */}
      <div className="relative h-[25vh] w-full border-b border-[#d4af37]/20 bg-[#1e1a14] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <h1 className="text-4xl md:text-5xl font-serif text-[#d4af37] relative z-10 uppercase tracking-widest">
            Mi Espacio
        </h1>
        {user && !isGuest && (
          <div className="absolute top-6 right-6 z-20">
            <Button
              variant="outline"
              onClick={logout}
              className="bg-transparent border border-[#d4af37]/50 hover:bg-[#d4af37]/10 text-[#d4af37] transition-all rounded-none gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Salir</span>
            </Button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 lg:px-12 -mt-16 relative z-10">
        <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 shadow-2xl">
          {/* Avatar */}
          <div className="h-32 w-32 shrink-0 rounded-full border border-[#d4af37]/50 p-1 relative bg-[#171310]">
            <div className="h-full w-full rounded-full bg-[#1a1614] flex items-center justify-center text-4xl font-serif overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover opacity-80" />
              ) : (
                <span className="text-[#d4af37]">{user.name?.charAt(0)}</span>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left mt-2">
            <h2 className="text-3xl font-serif text-[#f9f1d8] mb-4">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/50 text-[10px] uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2 border border-[#d4af37]/20 px-3 py-1 bg-[#171310]">
                <Mail className="w-3 h-3 text-[#d4af37]" /> {user.email}
              </span>
              <span className="flex items-center gap-2 border border-[#d4af37]/20 px-3 py-1 bg-[#171310]">
                <MapPin className="w-3 h-3 text-[#d4af37]" /> {user.city || "Sin ciudad"}
              </span>
              <span className="border border-[#d4af37] px-3 py-1 text-[#d4af37]">
                {(user.role as any)?.name === "CUSTOMER" ? "Cliente VIP" : "Maison Staff"}
              </span>
            </div>
          </div>

          {storeConfig?.enablePoints && (
            <div className="text-center md:text-right pt-4">
              <p className="text-4xl font-serif text-[#d4af37] mb-1">{user.points}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Puntos</p>
            </div>
          )}
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-[#d4af37]/20 mb-8 overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 flex justify-start gap-8 min-w-max">
              {!isGuest && (
                <TabsTrigger value="profile" className="perfume-tab">
                  <UserIcon className="w-4 h-4 mb-2 mx-auto" /> Detalles
                </TabsTrigger>
              )}
              <TabsTrigger value="orders" className="perfume-tab">
                <Package className="w-4 h-4 mb-2 mx-auto" /> Colección
              </TabsTrigger>
              <TabsTrigger value="favorites" className="perfume-tab">
                <Heart className="w-4 h-4 mb-2 mx-auto" /> Deseos
              </TabsTrigger>
              {!isGuest && (
                <TabsTrigger value="comments" className="perfume-tab">
                  <MessageSquare className="w-4 h-4 mb-2 mx-auto" /> Reseñas
                </TabsTrigger>
              )}
              {!isGuest && storeConfig?.enablePoints && (
                <TabsTrigger value="points" className="perfume-tab">
                  <Gift className="w-4 h-4 mb-2 mx-auto" /> Privilegios
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TabsContent value="profile" className="m-0 focus-visible:ring-0">
                <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 md:p-12">
                  <ProfileEditTab user={user} />
                </div>
              </TabsContent>

              <TabsContent value="orders" className="m-0 focus-visible:ring-0">
                <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 md:p-12">
                  <h3 className="text-2xl font-serif text-[#d4af37] mb-8 border-b border-[#d4af37]/10 pb-4">Historial de Adquisiciones</h3>
                  <OrdersTab />
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="m-0 focus-visible:ring-0">
                <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 md:p-12">
                  <h3 className="text-2xl font-serif text-[#d4af37] mb-8 border-b border-[#d4af37]/10 pb-4">Sus Favoritos</h3>
                  <FavoritesTab />
                </div>
              </TabsContent>

              <TabsContent value="comments" className="m-0 focus-visible:ring-0">
                <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 md:p-12">
                  <h3 className="text-2xl font-serif text-[#d4af37] mb-8 border-b border-[#d4af37]/10 pb-4">Sus Reseñas</h3>
                  <ReviewsTab />
                </div>
              </TabsContent>

              {storeConfig?.enablePoints && (
                <TabsContent value="points" className="m-0 focus-visible:ring-0">
                  <div className="bg-[#1e1a14] border border-[#d4af37]/20 p-8 md:p-12">
                    <PointsTab />
                  </div>
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      <style jsx global>{`
        .perfume-tab {
          @apply bg-transparent flex flex-col items-center justify-center pb-4 pt-2 px-6 text-[10px] uppercase tracking-widest text-white/40 border-b-2 border-transparent transition-all rounded-none hover:text-[#d4af37];
        }
        .perfume-tab[data-state="active"] {
          @apply text-[#d4af37] border-[#d4af37];
        }
      `}</style>
    </div>
  );
}
