"use client";

import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/footer/Footer";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { Navbar } from "@/components/nav/Navbar";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

import { FloatingEssentials } from "@/components/features/floating/FloatingEssentials";
import { ScrollBackground } from "@/components/features/home/ScrollBackground";
import { MaintenancePage } from "@/components/maintenance/MaintenancePage";
import { useMaintenance } from "@/hooks/useMaintenance";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import "./globals.css";
import { hexToHsl } from "@/lib/utils";

import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Providers>
                    <LayoutContent>
                        <ScrollBackground />
                        {children}
                    </LayoutContent>
                </Providers>
            </body>
        </html>
    );
}

import { SplashScreen } from "@/components/ui/SplashScreen";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { MobileBottomNav } from "@/components/nav/MobileBottomNav";
import { FloatingWhastappButton } from "@/components/features/floating/WhatsAppButton";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const { isMaintenanceMode, loading: maintenanceLoading } = useMaintenance();

    const { data: config, isLoading: configLoading } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (config) {
            const storeName = config.storeName || "Storefront";
            const productLabel = config.rubro?.productFormConfig?.productLabel || "Productos";
            document.title = `${storeName} | Descubre nuestros/as ${productLabel.toLowerCase()}`;
            
            const themes = ["theme-perfumes", "theme-general", "theme-relojes", "theme-barberias", "theme-mascotas", "theme-decoracion"];
            themes.forEach(t => document.body.classList.remove(t));
            
            if (config.rubro?.slug) {
                document.body.classList.add(`theme-${config.rubro.slug}`);
            }
        }
    }, [config]);

    const isLoading = maintenanceLoading || (isHomePage && configLoading);

    if (isMaintenanceMode && !maintenanceLoading) {
        return <MaintenancePage />;
    }

    return (
        <>
            <SplashScreen
                isLoading={isLoading}
                logo={config?.logoUrl}
                storeName={config?.storeName}
            />

            {config?.themeColors && Object.keys(config.themeColors).length > 0 && (
                <style dangerouslySetInnerHTML={{
                    __html: `:root, .theme-perfumes {
                        ${Object.entries(config.themeColors)
                            .filter(([key]) => !key.endsWith('-hex'))
                            .map(([key, value]) => {
                                let val = value as string;
                                if (val.startsWith('#')) {
                                    val = hexToHsl(val);
                                }
                                return `--${key}: ${val};`;
                            })
                            .join('\n')}
                    }
                    ${config.themeColors.background ? `
                    body.theme-perfumes, body.theme-relojes {
                        background: hsl(${config.themeColors.background});
                    }
                    ` : ''}`
                }} />
            )}

            <Navbar />
            <div className={`overflow-x-hidden ${!isHomePage && config?.rubro?.slug !== "perfumes" ? "pt-16 md:pt-2" : "max-sm:px-2 max-md:px-6 max-xl:px-10"}`}>
                {children}
            </div>
            <Footer />
            <MobileMenu />
            <CartDrawer />
            <CookieBanner />
            <Toaster expand={true} richColors closeButton />
            <FloatingEssentials />
            <FloatingWhastappButton />
            <Suspense fallback={null}>
                <MobileBottomNav />
            </Suspense>
        </>
    );
}
