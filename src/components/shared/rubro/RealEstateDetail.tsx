"use client";

import { formatPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/store/currency";
import { Product } from "@/types";
import { Bath, BedDouble, Check, MapPin, Maximize, Phone, Share2, Heart, ArrowRight, Map as MapIcon, FileText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFavoritesStore } from "@/store/favorites";

interface RealEstateDetailProps {
    product: Product;
    config: any;
}

function getCharValue(product: Product, ...keys: string[]): string | null {
    const chars = (product as any).characteristics;
    if (!Array.isArray(chars)) return null;
    for (const key of keys) {
        // match exact key or contains
        const found = chars.find((c: any) => c.key?.toLowerCase().includes(key.toLowerCase()));
        if (found?.value) return found.value;
    }
    return null;
}

export function RealEstateDetail({ product, config }: RealEstateDetailProps) {
    const { currency } = useCurrencyStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(product.id);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const price = (product as any).discountedPrice || product.basePrice || 0;
    const currencyCode = (product as any).currencyCode || currency;

    const squareMeters = getCharValue(product, "m2", "metros cuadrados", "superficie", "metros", "área total");
    const rooms = getCharValue(product, "habitaciones", "ambientes", "dormitorios", "cuartos");
    const bathrooms = getCharValue(product, "baños", "banos", "toilettes");
    const parking = getCharValue(product, "cochera", "garaje", "estacionamiento");

    const mapUrlStr = getCharValue(product, "mapa", "gps", "ubicación satelital");
    const addressStr = (product as any).address || getCharValue(product, "ciudad/zona/dirección", "ciudad", "zona");
    
    // Robust Map Embed Logic
    let embedUrl = null;
    if (mapUrlStr && mapUrlStr.includes("<iframe")) {
        const srcMatch = mapUrlStr.match(/src="([^"]+)"/);
        if (srcMatch) embedUrl = srcMatch[1];
    } else if (mapUrlStr && mapUrlStr.includes("output=embed")) {
        embedUrl = mapUrlStr;
    } else if (addressStr) {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressStr)}&hl=es&z=14&output=embed`;
    }

    const planoUrl = getCharValue(product, "plano", "croquis");

    const images = product.images || [];
    const mainImage = images[0] || "/images/placeholder.png";
    const secondaryImages = images.slice(1);

    const whatsappMessage = encodeURIComponent(
        `Hola, me interesa la propiedad "${product.name}" publicada en su sitio web.`
    );
    const whatsappUrl = `https://wa.me/${config?.contactPhone?.replace(/\D/g, "")}?text=${whatsappMessage}`;

    const allChars = (product as any).characteristics || [];
    
    const getGroup = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes('uso') || k.includes('tipo')) return 'Datos Generales';
        if (k.includes('ciudad') || k.includes('zona') || k.includes('direcci') || k.includes('mapa') || k.includes('referencia') || k.includes('ubicaci')) return 'Ubicación';
        if (k.includes('área') || k.includes('area') || k.includes('frente') || k.includes('forma') || k.includes('superficie') || k.includes('m2') || k.includes('medida')) return 'Medidas';
        if (k.includes('servicio') || k.includes('dormitorio') || k.includes('baño') || k.includes('bano') || k.includes('cochera') || k.includes('cerco') || k.includes('pozo') || k.includes('característica')) return 'Características';
        if (k.includes('legal') || k.includes('escritura') || k.includes('trámite') || k.includes('tramite') || k.includes('gravamen')) return 'Legal';
        if (k.includes('precio') || k.includes('pago') || k.includes('alquiler') || k.includes('expensa') || k.includes('financiación')) return 'Económicos';
        if (k.includes('plano') || k.includes('croquis') || k.includes('documento')) return 'Documentos';
        if (k.includes('persona') || k.includes('contacto') || k.includes('encargad')) return 'Contacto';
        return 'Otras Especificaciones';
    };

    const groupedSpecs = allChars.reduce((acc: any, char: any) => {
        if (!char.value) return acc;
        // Don't show map and plano in generic specs if we handle them specially
        if (char.key.toLowerCase().includes('mapa') || char.key.toLowerCase().includes('plano')) return acc;
        
        const group = getGroup(char.key);
        if (!acc[group]) acc[group] = [];
        acc[group].push(char);
        return acc;
    }, {});
    
    const order = ['Datos Generales', 'Ubicación', 'Medidas', 'Características', 'Legal', 'Económicos', 'Documentos', 'Contacto', 'Otras Especificaciones'];
    const specGroups = Object.entries(groupedSpecs)
        .map(([title, items]) => ({ title, items: items as any[] }))
        .sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));

    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-sans">
            
            {/* HERO FULL-SCREEN */}
            <div className="relative w-full h-[85vh] lg:h-screen bg-black">
                <Image 
                    src={mainImage as string} 
                    alt={product.name} 
                    fill 
                    className="object-cover opacity-80"
                    priority
                />
                {/* Degradado sobre la imagen para legibilidad del Hero (se mantiene oscuro para contraste con foto) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Contenido sobre el Hero */}
                <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 lg:px-24 pb-16 z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="w-full md:w-2/3">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.3em] uppercase text-gray-300 mb-6">
                            <span className="bg-white text-black px-3 py-1">{(product as any).saleMode || "Venta"}</span>
                            <span>{product.brand && product.brand !== "-" ? product.brand : "Premium"}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none drop-shadow-lg">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3 text-white font-medium text-lg drop-shadow-md">
                            <MapPin className="h-6 w-6 text-white" />
                            <span>{addressStr || "Ubicación Reservada"}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <button 
                            className="flex flex-col items-center gap-2 font-bold text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Enlace copiado al portapapeles");
                            }}
                        >
                            <div className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Share2 className="h-5 w-5" />
                            </div>
                            Compartir
                        </button>
                        <button 
                            className={`flex flex-col items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${isFav ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
                            onClick={() => toggleFavorite(product.id)}
                        >
                            <div className={`h-12 w-12 rounded-full border ${isFav ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors`}>
                                <Heart className={`h-5 w-5 ${isFav ? "fill-current text-red-500" : ""}`} />
                            </div>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* SPLIT-SCREEN CONTENT */}
            <div className="container mx-auto px-4 md:px-12 lg:px-24 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
                    
                    {/* COLUMNA IZQUIERDA: Contenido */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* Quick Amenities */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y-2 border-black">
                            {squareMeters && (
                                <div className="flex flex-col gap-3">
                                    <Maximize className="h-8 w-8 text-black" />
                                    <span className="font-black text-4xl text-black">{squareMeters.split(' ')[0]} <span className="text-xl text-gray-500">m²</span></span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Superficie</span>
                                </div>
                            )}
                            {rooms && rooms !== '-' && (
                                <div className="flex flex-col gap-3">
                                    <BedDouble className="h-8 w-8 text-black" />
                                    <span className="font-black text-4xl text-black">{rooms.split(' ')[0]}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Dormitorios</span>
                                </div>
                            )}
                            {bathrooms && bathrooms !== '-' && (
                                <div className="flex flex-col gap-3">
                                    <Bath className="h-8 w-8 text-black" />
                                    <span className="font-black text-4xl text-black">{bathrooms.split(' ')[0]}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Baños</span>
                                </div>
                            )}
                            {parking && parking !== '-' && (
                                <div className="flex flex-col gap-3">
                                    <Check className="h-8 w-8 text-black" />
                                    <span className="font-black text-4xl text-black">{parking.split(' ')[0]}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Cochera</span>
                                </div>
                            )}
                        </div>

                        {/* Descripción Editorial */}
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 mb-8 border-l-4 border-black pl-4">Concepto de la Propiedad</h2>
                            <div className="prose prose-xl font-medium text-gray-800 leading-relaxed whitespace-pre-line">
                                {product.description || "Esta propiedad excepcional combina arquitectura moderna con acabados de la más alta calidad. Contáctenos para agendar una visita y conocer todos los detalles de esta oportunidad única."}
                            </div>
                        </div>

                        {/* MAPA INTERACTIVO */}
                        {embedUrl && (
                            <div className="space-y-6">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2 border-l-4 border-black pl-4">
                                    <MapIcon className="h-5 w-5 text-black" /> Ubicación
                                </h2>
                                <div className="w-full h-[400px] border-2 border-black bg-gray-100">
                                    <iframe 
                                        src={embedUrl} 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }}
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        )}

                        {/* GALERÍA DE IMÁGENES SECUNDARIAS */}
                        {secondaryImages.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 border-l-4 border-black pl-4">Galería de la Propiedad</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {secondaryImages.map((img: any, i) => (
                                        <div key={i} className={`relative cursor-pointer group overflow-hidden bg-gray-200 border border-gray-300 ${i % 3 === 0 ? 'md:col-span-2 h-[50vh]' : 'h-[35vh]'}`} 
                                             onClick={() => { setActiveImage(i + 1); setIsGalleryOpen(true); }}>
                                            <Image 
                                                src={img.url || img} 
                                                alt={`Interior/Exterior ${i}`} 
                                                fill 
                                                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                                            />
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Especificaciones Agrupadas */}
                        {specGroups.length > 0 && (
                            <div className="space-y-16">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 border-l-4 border-black pl-4">Especificaciones Técnicas</h2>
                                {specGroups.map((group, gIdx) => (
                                    <div key={gIdx} className="border-t-2 border-black pt-8">
                                        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-black">{group.title}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
                                            {group.items.map((char: any, i: number) => (
                                                <div key={i} className="flex flex-col gap-2">
                                                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">{char.key}</span>
                                                    <span className="font-bold text-black text-lg break-words">
                                                        {char.value.startsWith('http') ? (
                                                            <a href={char.value} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 underline decoration-2 underline-offset-4">
                                                                <Share2 className="h-4 w-4" /> Abrir Enlace
                                                            </a>
                                                        ) : (
                                                            char.value
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: Sidebar Sticky */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-32 flex flex-col gap-8">
                            
                            {/* Bloque Precio */}
                            <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="mb-8">
                                    <p className="text-xs uppercase tracking-[0.2em] font-black text-gray-500 mb-3">Valor de {(product as any).saleMode || "Venta"}</p>
                                    <p className="text-5xl font-black text-black tracking-tighter">{formatPrice(Number(price), currencyCode)}</p>
                                </div>

                                <div className="space-y-4">
                                    <a 
                                        href={whatsappUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full bg-black hover:bg-gray-800 text-white font-black uppercase tracking-widest text-xs px-6 py-5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5" />
                                            <span>Contactar Asesor</span>
                                        </div>
                                        <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                                    </a>

                                    {/* PLANO BUTTON */}
                                    {planoUrl && (
                                        <a 
                                            href={planoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between w-full border-2 border-black hover:bg-black hover:text-white text-black font-black uppercase tracking-widest text-xs px-6 py-5 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5" />
                                                <span>Ver Plano / Croquis</span>
                                            </div>
                                            <Share2 className="h-4 w-4" />
                                        </a>
                                    )}

                                    <div className="bg-gray-100 p-6 border-2 border-black text-center mt-4">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-2">Línea Directa</p>
                                        <p className="text-xl font-black text-black tracking-widest">{config?.contactPhone || "+54 11 0000-0000"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bloque Info Adicional */}
                            <div className="bg-gray-100 p-8 border-2 border-black border-dashed">
                                <h4 className="text-sm font-black uppercase tracking-widest text-black mb-4">Garantía Inmobiliaria</h4>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                    Todas las propiedades publicadas han sido auditadas física y legalmente por nuestro equipo de expertos para garantizar una operación segura.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            
            {/* Gallery Modal Full Screen */}
            {isGalleryOpen && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b-2 border-black bg-gray-50">
                        <span className="text-black font-black uppercase tracking-widest text-xs">Galería de Imágenes</span>
                        <button className="text-gray-600 hover:text-black transition-colors uppercase tracking-widest text-xs font-black flex items-center gap-2" onClick={() => setIsGalleryOpen(false)}>
                            Cerrar <div className="border border-black px-2 py-1">X</div>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-12 custom-scrollbar bg-gray-100">
                        {images.map((img: any, i: number) => (
                            <div key={i} id={`gallery-img-${i}`} className={`relative w-full h-[60vh] md:h-[90vh] bg-white border-2 ${i === activeImage ? 'border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'border-gray-300'}`}>
                                <Image src={img.url || img} alt={`Gallery ${i}`} fill className="object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
