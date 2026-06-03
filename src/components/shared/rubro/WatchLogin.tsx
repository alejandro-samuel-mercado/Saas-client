"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Watch, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function WatchLogin() {
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
            toast.success("Bienvenido");
            router.push("/profile");
        } catch {
            toast.error("Credenciales incorrectas");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full bg-[#080b0f] border border-[#8a9ab5]/15 text-[#c0cfe0] font-mono text-sm px-4 py-3.5 outline-none focus:border-[#8a9ab5]/50 transition-colors placeholder:text-[#8a9ab5]/25";

    return (
        <main className="min-h-screen bg-[#0a0d11] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{ backgroundImage: "linear-gradient(#8a9ab5 1px, transparent 1px), linear-gradient(90deg, #8a9ab5 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            {/* Decorative circle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#8a9ab5]/5 rounded-full hidden lg:block" />
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-[#8a9ab5]/4 rounded-full hidden lg:block" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Watch className="h-5 w-5 text-[#8a9ab5]" />
                        <span className="font-mono text-lg tracking-[0.3em] uppercase text-[#c0cfe0]">
                            {config?.storeName || "Horloger"}
                        </span>
                    </div>
                    <div className="h-px w-16 bg-[#8a9ab5]/30 mx-auto mb-4" />
                    <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#8a9ab5]/40">Acceso a tu cuenta</p>
                </div>

                {/* Form card */}
                <div className="border border-[#8a9ab5]/10 bg-[#080b0f] p-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#8a9ab5]/50 block mb-2">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com" required className={inputClass} />
                        </div>

                        <div>
                            <label className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#8a9ab5]/50 block mb-2">Contraseña</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required className={`${inputClass} pr-12`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9ab5]/40 hover:text-[#8a9ab5] transition-colors">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full mt-2 bg-[#8a9ab5] text-[#0a0d11] py-4 font-mono text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#c0cfe0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Verificando..." : "Ingresar"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#8a9ab5]/10 text-center">
                        <p className="text-[11px] font-mono text-[#8a9ab5]/40">
                            ¿No tenés cuenta?{" "}
                            <a href="/register" className="text-[#8a9ab5] hover:text-[#c0cfe0] transition-colors">
                                Registrate
                            </a>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-6 text-[9px] font-mono tracking-[0.3em] uppercase text-[#8a9ab5]/25">
                    Plataforma Segura
                </p>
            </div>
        </main>
    );
}
