"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Por favor ingrese un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function PerfumeLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login, loginWithGoogle, verify, resendCode, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      if (redirectUrl?.includes("cart")) {
        window.location.href = redirectUrl;
      } else {
        router.replace(redirectUrl || "/profile");
      }
    }
  }, [isLoading, user, router, redirectUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="w-12 h-12 border-y-2 border-[hsl(var(--primary))] rounded-full animate-spin"></div>
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Inicio de sesión exitoso");
      router.push(redirectUrl || "/");
    } catch (error: any) {
      if (error?.code === 'EMAIL_NOT_VERIFIED') {
        setVerificationEmail(data.email);
        setIsPendingVerification(true);
      }
      console.debug("Login failed handled by global interceptor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    setIsSubmitting(true);
    try {
      await verify(verificationEmail, verificationCode);
      router.push(redirectUrl || "/profile");
    } catch (error) {
      console.debug("Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast.error("Error en inicio de sesión con Google");
    }
  };

  if (isPendingVerification) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="w-full max-w-md bg-[hsl(var(--card))] border border-[hsl(var(--primary))]/20 p-10 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-[hsl(var(--foreground))] mb-4">Verificación</h1>
            <p className="text-white/50 text-sm font-light">
              Ingrese el código de acceso enviado a <br /><span className="text-[hsl(var(--primary))]">{verificationEmail}</span>
            </p>
          </div>

          <form onSubmit={onVerify} className="space-y-8">
            <div className="space-y-3 text-center">
              <Label htmlFor="code" className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">Código Único</Label>
              <Input
                id="code"
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="bg-transparent border-0 border-b border-[hsl(var(--primary))]/30 rounded-none px-0 text-center text-4xl tracking-[1rem] h-16 focus-visible:ring-0 focus-visible:border-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[hsl(var(--primary))] hover:bg-white text-[hsl(var(--background))] font-bold tracking-[0.2em] uppercase text-xs h-14 rounded-none transition-colors"
            >
              {isSubmitting ? "Validando..." : "Acceder"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => resendCode(verificationEmail)}
                className="text-[hsl(var(--primary))] hover:text-white text-xs tracking-wider uppercase transition-colors"
              >
                Reenviar Código
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-[hsl(var(--primary))]/10 pt-8">
            <button
              type="button"
              onClick={() => setIsPendingVerification(false)}
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] grid lg:grid-cols-2 font-sans pt-16">
      {/* LEFT: Decorativo */}
      <div className="hidden lg:flex relative overflow-hidden bg-[hsl(var(--card))] border-r border-[hsl(var(--primary))]/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent opacity-90" />
        
        <div className="relative z-10 flex flex-col justify-end p-20 text-left w-full">
          <span className="text-[hsl(var(--primary))] font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">Maison de Parfum</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[hsl(var(--foreground))] leading-[1.1] mb-8">
            El arte de <br/>
            <span className="text-[hsl(var(--primary))] italic">coleccionar</span>
          </h2>
          <p className="text-white/50 text-lg font-light leading-relaxed max-w-md">
            Acceda a su cuenta para gestionar sus pedidos, descubrir recomendaciones exclusivas y vivir la experiencia olfativa definitiva.
          </p>
        </div>
      </div>

      {/* RIGHT: Formulario */}
      <div className="flex items-center justify-center p-6 md:p-12 relative bg-[hsl(var(--background))]">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-12">
            <h1 className="text-3xl font-serif text-[hsl(var(--foreground))] mb-3">
              Iniciar Sesión
            </h1>
            <p className="text-white/40 font-light text-sm">
              Bienvenido de nuevo a nuestra boutique en línea
            </p>
          </div>

          <div className="space-y-8">
            <Button
              variant="outline"
              className="w-full bg-transparent border border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--primary))]/5 hover:border-[hsl(var(--primary))]/60 h-14 rounded-none transition-all group"
              onClick={handleGoogleLogin}
            >
              <svg className="w-4 h-4 mr-3 text-white/70 group-hover:text-[hsl(var(--primary))] transition-colors" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white/70 group-hover:text-[hsl(var(--primary))] text-xs tracking-wider uppercase transition-colors">
                Continuar con Google
              </span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] tracking-widest uppercase">
                <span className="px-4 bg-[hsl(var(--background))] text-white/30">
                  O utilice su correo
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="ejemplo@correo.com"
                  className={`bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 text-[hsl(var(--foreground))] placeholder:text-white/20 text-base h-10 ${errors.email ? "border-red-500" : "border-[hsl(var(--primary))]/30 focus-visible:border-[hsl(var(--primary))]"}`}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-400 mt-1 uppercase tracking-wider">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[hsl(var(--primary))] text-[10px] tracking-widest uppercase font-bold">
                    Contraseña
                  </Label>
                  <Link href="/reset-password" className="text-white/30 hover:text-white text-[10px] tracking-wider uppercase transition-colors">
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="********"
                  className={`bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 text-[hsl(var(--foreground))] placeholder:text-white/20 text-base h-10 ${errors.password ? "border-red-500" : "border-[hsl(var(--primary))]/30 focus-visible:border-[hsl(var(--primary))]"}`}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-400 mt-1 uppercase tracking-wider">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[hsl(var(--primary))] hover:bg-white text-[hsl(var(--background))] font-bold tracking-[0.2em] uppercase text-xs h-14 rounded-none transition-colors mt-4"
              >
                {isSubmitting ? "Validando..." : "Acceder"}
              </Button>
            </form>

            <div className="text-center border-t border-[hsl(var(--primary))]/10 pt-8 mt-8 text-xs font-light text-white/40">
              ¿No tiene cuenta?{" "}
              <Link href="/register" className="text-[hsl(var(--primary))] hover:text-white uppercase tracking-wider font-bold transition-colors ml-2">
                Crear una cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
