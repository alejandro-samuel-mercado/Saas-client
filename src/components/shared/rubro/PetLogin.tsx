"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PawPrint, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function PetLogin() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success("¡Bienvenido de vuelta! 🐾");
            router.push("/profile");
        } catch {
            toast.error("Credenciales incorrectas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#EDE0CF] flex pt-20">
            {/* Left decorative panel */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#8B5E3C] to-[#5C3D2E] flex-col items-center justify-center p-12 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#E8963C]/30 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#EDE0CF]/10 blur-3xl" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paw-print.png")` }} />

                <div className="relative z-10 text-center">
                    <div className="h-24 w-24 rounded-full bg-[#E8963C] flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <PawPrint className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4">
                        {config?.storeName || "PetShop"}
                    </h2>
                    <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed">
                        Lo mejor para tu mascota, a un click de distancia.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {["🐕 Perros", "🐈 Gatos", "🐟 Peces", "🐇 Conejos"].map((tag) => (
                            <span key={tag} className="px-4 py-2 rounded-full bg-[#D4B896]/50 backdrop-blur-xl text-white/80 text-sm font-bold backdrop-blur-sm border border-white/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo (mobile) */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="h-10 w-10 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-black text-xl text-[#5C3D2E]">{config?.storeName || "PetShop"}</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-[#5C3D2E] leading-tight mb-2">
                            ¡Bienvenido <br />
                            <span className="text-[#E8963C]">de vuelta!</span>
                        </h1>
                        <p className="text-[#A0714F] font-medium">Ingresá a tu cuenta para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-[#5C3D2E] mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className="w-full px-5 py-3.5 rounded-2xl border-2 border-[#D4B896] bg-[#D4B896]/40 backdrop-blur-xl text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-black uppercase tracking-wider text-[#5C3D2E]">
                                    Contraseña
                                </label>
                                <Link href="/reset-password" className="text-xs font-bold text-[#E8963C] hover:text-[#D4763B] transition-colors">
                                    ¿Olvidaste?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-5 py-3.5 pr-14 rounded-2xl border-2 border-[#D4B896] bg-[#D4B896]/40 backdrop-blur-xl text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/50 outline-none focus:border-[#E8963C] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0714F] hover:text-[#5C3D2E] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl bg-[#8B5E3C] hover:bg-[#5C3D2E] text-white font-black text-base transition-all duration-200 shadow-lg hover:shadow-[0_20px_50px_rgba(139,94,60,0.15)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Ingresando..." : "Iniciar Sesión 🐾"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#A0714F] font-medium">
                            ¿No tenés cuenta?{" "}
                            <Link href="/register" className="font-black text-[#E8963C] hover:text-[#D4763B] transition-colors">
                                Registrate gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
