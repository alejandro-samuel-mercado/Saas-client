"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function BarberLogin() {
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

    const inputClass = "w-full bg-[#1A1A1A] border border-[#333] text-white font-bold text-sm px-6 py-4 outline-none focus:border-[#e65c00] transition-colors placeholder:text-gray-600 uppercase tracking-wider";

    return (
        <main className="min-h-screen bg-[#111] flex items-center justify-center px-6 relative overflow-hidden pt-24 pb-24 selection:bg-[#e65c00] selection:text-white">
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* Decorative Side Image */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden lg:block border-r border-[#333] opacity-30 grayscale">
                <img src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fe5?auto=format&fit=crop&q=80&w=1920" alt="Barber" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111]" />
            </div>

            <div className="relative z-10 w-full max-w-md ml-auto lg:mr-[10%]">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-8 bg-[#e65c00]" />
                        <Scissors className="h-6 w-6 text-[#e65c00]" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2 leading-none">
                        Acceso <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e65c00] to-[#ff8c33]">Cliente</span>
                    </h1>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mt-4">Ingresa a tu cuenta</p>
                </div>

                {/* Form card */}
                <div className="border border-[#333] bg-[#161616] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#e65c00] opacity-0 group-hover:opacity-10 -rotate-45 translate-x-8 -translate-y-8 transition-all duration-500" />
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-black tracking-[0.1em] uppercase text-white block mb-3">Correo Electrónico</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com" required className={inputClass} />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-xs font-black tracking-[0.1em] uppercase text-white block">Contraseña</label>
                                <Link href="/reset-password" className="text-[10px] font-bold text-[#e65c00] hover:text-white uppercase tracking-wider transition-colors">¿Olvidaste?</Link>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required className={`${inputClass} pr-14`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full mt-4 bg-[#e65c00] text-white py-4 font-black text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#333] text-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            ¿No tienes cuenta?{" "}
                            <Link href="/register" className="text-[#e65c00] hover:text-white transition-colors">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
