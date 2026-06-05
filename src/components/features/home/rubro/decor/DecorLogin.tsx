"use client";

import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Flower2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

export function DecorLogin() {
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
            toast.success("¡Bienvenida de vuelta! ✦");
            router.push("/profile");
        } catch {
            toast.error("Credenciales incorrectas. Verificá tu correo y contraseña.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex" style={{ backgroundColor: "#F0E5D8" }}>

            {/* Left — Editorial dark panel */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-16 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #3A302A 0%, #5C4A3E 50%, #8B6F5E 100%)" }}>

                {/* Texture */}
                <div className="absolute inset-0 opacity-15 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                {/* Decorative arches */}
                <div className="absolute top-0 right-0 w-64 h-80 rounded-b-full border border-[#E1CDBF]/20 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-48 h-64 rounded-t-full border border-[#C4A882]/20 -translate-x-16" />

                {/* Content */}
                <div className="relative z-10 text-center max-w-sm">
                    <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="h-20 w-20 rounded-full bg-[#C4A882] flex items-center justify-center mx-auto mb-10 shadow-2xl"
                    >
                        <Flower2 className="h-10 w-10 text-[#3A302A]" />
                    </motion.div>

                    <h2 className="font-serif text-5xl text-[#F0E5D8] leading-tight mb-6">
                        {config?.storeName || "Fleur Events"}
                    </h2>
                    <p className="text-[#C4A882]/80 text-base leading-relaxed font-sans font-light">
                        {config?.customPageDescription || "Decoración de eventos que transforma espacios en experiencias únicas e irrepetibles."}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        {(config?.marqueeText?.length
                            ? config.marqueeText.slice(0, 5)
                            : ["Bodas", "Bautismos", "Quinceaños", "Cumpleaños", "Corporativos"]
                        ).map((tag) => (
                            <span key={tag} className="px-4 py-2 border border-[#C4A882]/30 text-[#C4A882]/70 text-xs font-sans tracking-widest">
                                ✦ {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 rounded-full bg-[#3A302A] flex items-center justify-center">
                            <Flower2 className="h-5 w-5 text-[#C4A882]" />
                        </div>
                        <span className="font-serif text-2xl text-[#3A302A]">{config?.storeName || "Fleur Events"}</span>
                    </div>

                    <div className="mb-12">
                        <p className="text-[#8B6F5E] text-xs tracking-[0.3em] uppercase mb-4 font-sans">Bienvenida</p>
                        <h1 className="font-serif text-5xl text-[#3A302A] leading-tight">
                            Iniciá <br /><span className="italic text-[#8B6F5E]">sesión</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#5C4A3E] mb-3">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                required
                                className="w-full px-0 py-3 border-b-2 border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#5C4A3E]">
                                    Contraseña
                                </label>
                                <Link href="/reset-password" className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B6F5E] hover:text-[#3A302A] transition-colors">
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
                                    className="w-full px-0 py-3 pr-10 border-b-2 border-[#3A302A]/20 bg-transparent text-[#3A302A] text-sm font-sans placeholder:text-[#3A302A]/30 outline-none focus:border-[#3A302A] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3A302A]/40 hover:text-[#3A302A] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-4 bg-[#3A302A] text-[#F0E5D8] font-sans text-xs tracking-[0.3em] uppercase hover:bg-[#5C4A3E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[#5C4A3E] font-sans font-light">
                        ¿No tenés cuenta?{" "}
                        <Link href="/register" className="text-[#3A302A] font-medium hover:text-[#8B6F5E] transition-colors underline underline-offset-4">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
