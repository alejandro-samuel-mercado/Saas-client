"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X, ChevronDown, Scissors, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function BarberCatalog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const { currency } = useCurrencyStore();

    const [filters, setFilters] = useState<Record<string, any>>({});
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const searchDebounceRef = useRef<NodeJS.Timeout>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        if (!config?.rubro?.slug) return;
        productService.getCategories().then((cats) => setCategories(cats as any)).catch(() => { });
        productService.getBrands().then(setBrands).catch(() => { });
    }, [config?.rubro?.slug]);

    useEffect(() => {
        const urlFilters: Record<string, any> = {};
        searchParams.forEach((value, key) => {
            if (value === "true") urlFilters[key] = true;
            else if (value === "false") urlFilters[key] = false;
            else if (key === "minPrice" || key === "maxPrice") urlFilters[key] = Number(value);
            else urlFilters[key] = value;
        });
        setFilters(urlFilters);
        setSearchInput(urlFilters.search || "");
    }, [searchParams]);

    const buildQueryString = (f: Record<string, any>) => {
        const params = new URLSearchParams();
        Object.entries(f).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "" && v !== false) params.set(k, String(v));
        });
        return params.toString();
    };

    const applyFilter = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        if (!value || value === "") delete newFilters[key];
        router.push(`/products?${buildQueryString(newFilters)}`, { scroll: false });
    };

    const clearAll = () => router.push("/products", { scroll: false });

    const { data, isLoading } = useQuery({
        queryKey: ["products", "catalog", filters, page],
        queryFn: () => productService.getProducts({ ...filters, page, limit: 12, currency }),
    });

    const MOCK_PRODUCTS = [
        { id: 1, name: "Wahl Magic Clip Cordless", basePrice: 150000, category: { name: "Máquinas" }, brand: "Wahl", images: ["https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800"] },
        { id: 2, name: "Aceite para Barba Proraso", basePrice: 25000, category: { name: "Cuidado de Barba" }, brand: "Proraso", images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800"] },
        { id: 3, name: "Pomada Reuzel Blue", basePrice: 18000, category: { name: "Pomadas" }, brand: "Reuzel", images: ["https://images.unsplash.com/photo-1593702295071-553ce11bb5cb?auto=format&fit=crop&q=80&w=800"] },
        { id: 4, name: "Navaja Clásica Feather", basePrice: 35000, category: { name: "Accesorios" }, brand: "Feather", images: ["https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800"] }
    ];

    const products = ((data as any)?.data?.length > 0 ? (data as any).data : MOCK_PRODUCTS) || [];
    const totalPages = (data as any)?.totalPages || 1;
    const activeFilterCount = Object.keys(filters).filter(k => !["page", "limit"].includes(k) && filters[k]).length;

    const SORT_OPTIONS = [
        { value: "", label: "Relevancia" },
        { value: "price_asc", label: "Menor a Mayor" },
        { value: "price_desc", label: "Mayor a Menor" },
        { value: "newest", label: "Novedades" },
    ];

    return (
        <main className="min-h-screen bg-stone-900 text-stone-200 font-sans pb-24 selection:bg-[#e65c00] selection:text-white">
            {/* Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* HERO BANNER */}
            <section className="relative pt-24 pb-12 overflow-hidden border-b border-stone-800 z-10 bg-stone-900">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920" alt="Barber Tools" className="w-full h-full object-cover opacity-[0.08] grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
                </div>
                <div className="container relative mx-auto px-4 lg:px-8 z-10 text-center max-w-7xl pt-10">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-stone-100 mb-4 leading-none">
                        Catálogo <span className="text-[#e65c00]">Profesional</span>
                    </h1>
                    <p className="text-stone-400 max-w-2xl mx-auto text-sm">Las mejores herramientas y productos para el cuidado masculino.</p>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-10 mt-8">
                {/* TOOLBAR & FILTERS (Horizontal) */}
                <div className="flex flex-col gap-4 mb-10 bg-stone-800 p-4 border border-stone-700 rounded-sm shadow-sm">
                    
                    {/* Top Row: Search & Sort */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-stone-900 border border-stone-700 focus-within:border-[#e65c00] transition-colors w-full md:max-w-md rounded-sm">
                            <Search className="h-4 w-4 text-[#e65c00]" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                                    searchDebounceRef.current = setTimeout(() => applyFilter("search", e.target.value || undefined), 400);
                                }}
                                placeholder="Buscar herramientas..."
                                className="bg-transparent text-stone-100 text-xs placeholder:text-stone-500 outline-none flex-1 font-bold uppercase tracking-wider"
                            />
                            {searchInput && (
                                <button onClick={() => { setSearchInput(""); applyFilter("search", undefined); }}>
                                    <X className="h-4 w-4 text-stone-500 hover:text-stone-200" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto hide-scrollbar">
                            <div className="relative flex items-center px-4 py-3 bg-stone-900 border border-stone-700 rounded-sm flex-shrink-0 focus-within:border-[#e65c00] transition-colors">
                                <select
                                    value={filters.sort || ""}
                                    onChange={(e) => applyFilter("sort", e.target.value || undefined)}
                                    className="bg-transparent text-stone-200 font-bold text-xs outline-none cursor-pointer appearance-none pr-8 uppercase tracking-wider"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-stone-900 text-stone-200">{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="h-3 w-3 text-[#e65c00] absolute right-3 pointer-events-none" />
                            </div>

                            <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="flex items-center gap-2 px-4 py-3 bg-stone-900 border border-stone-700 hover:border-[#e65c00] text-stone-200 font-bold text-xs flex-shrink-0 uppercase tracking-wider transition-colors rounded-sm">
                                <Filter className="h-4 w-4 text-[#e65c00]" /> Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </button>
                            
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="px-4 py-3 bg-[#e65c00]/10 border border-[#e65c00]/30 text-[#e65c00] hover:bg-[#e65c00] hover:text-stone-100 font-bold text-xs flex-shrink-0 uppercase tracking-wider transition-colors rounded-sm">
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {isMobileFilterOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-2 border-t border-stone-700 animate-in fade-in slide-in-from-top-4 duration-300">
                            
                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#e65c00] rounded-full" /> Categorías
                                </h3>
                                <div className="space-y-2">
                                    {categories?.filter(c => c.slug !== "servicios").map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filters.category === cat.slug}
                                                onChange={(e) => applyFilter("category", e.target.checked ? cat.slug : undefined)}
                                                className="w-4 h-4 rounded-none border-stone-600 bg-stone-900 checked:bg-[#e65c00] checked:border-[#e65c00] focus:ring-[#e65c00] focus:ring-offset-stone-800 transition-colors cursor-pointer"
                                            />
                                            <span className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors uppercase tracking-wider font-bold">
                                                {cat.name}
                                            </span>
                                        </label>
                                    ))}
                                    {(!categories || categories.length === 0) && (
                                        <div className="text-stone-500 text-xs italic">No hay categorías disponibles</div>
                                    )}
                                </div>
                            </div>

                            {/* Brands */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#e65c00] rounded-full" /> Marcas
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                                    {brands?.map((brand) => (
                                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filters.brand === brand}
                                                onChange={(e) => applyFilter("brand", e.target.checked ? brand : undefined)}
                                                className="w-4 h-4 rounded-none border-stone-600 bg-stone-900 checked:bg-[#e65c00] checked:border-[#e65c00] focus:ring-[#e65c00] focus:ring-offset-stone-800 transition-colors cursor-pointer"
                                            />
                                            <span className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors uppercase tracking-wider font-bold">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                    {(!brands || brands.length === 0) && (
                                        <div className="text-stone-500 text-xs italic">No hay marcas disponibles</div>
                                    )}
                                </div>
                            </div>

                            {/* Stock Filter */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#e65c00] rounded-full" /> Disponibilidad
                                </h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock === true}
                                        onChange={(e) => applyFilter("inStock", e.target.checked ? true : undefined)}
                                        className="w-4 h-4 rounded-none border-stone-600 bg-stone-900 checked:bg-[#e65c00] checked:border-[#e65c00] focus:ring-[#e65c00] focus:ring-offset-stone-800 transition-colors cursor-pointer"
                                    />
                                    <span className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors uppercase tracking-wider font-bold">
                                        Solo en Stock
                                    </span>
                                </label>
                            </div>

                        </div>
                    )}
                </div>

                {/* ACTIVE FILTERS CHIPS */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {Object.entries(filters).filter(([k, v]) => !["page", "limit", "sort"].includes(k) && v).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-[#e65c00]/10 border border-[#e65c00]/30 text-[#e65c00] text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                <span>{key === "search" ? `Búsqueda: ${value}` : key === "inStock" ? "En Stock" : value}</span>
                                <button onClick={() => applyFilter(key, undefined)} className="hover:text-white transition-colors">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* PRODUCT GRID */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {products.map((product: any) => (
                            <ProductCardRouter key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border border-stone-800 bg-stone-800/50 rounded-sm">
                        <Scissors className="h-12 w-12 text-stone-700 mx-auto mb-4" />
                        <h3 className="text-xl font-black uppercase text-stone-300 mb-2">Sin Resultados</h3>
                        <p className="text-stone-500 font-medium">No encontramos productos que coincidan con tus filtros.</p>
                        <button onClick={clearAll} className="mt-6 px-6 py-3 bg-[#e65c00] text-stone-100 text-sm font-bold uppercase tracking-wider hover:bg-stone-100 hover:text-stone-900 transition-colors rounded-sm">
                            Limpiar Filtros
                        </button>
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 flex items-center justify-center border font-bold text-sm transition-colors rounded-sm ${
                                    page === p 
                                        ? "bg-[#e65c00] border-[#e65c00] text-stone-100" 
                                        : "bg-stone-800 border-stone-700 text-stone-400 hover:border-[#e65c00] hover:text-[#e65c00]"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
