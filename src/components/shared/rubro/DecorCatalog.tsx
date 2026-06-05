"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SORT_OPTIONS = [
    { value: "", label: "Relevancia" },
    { value: "price_asc", label: "Menor precio" },
    { value: "price_desc", label: "Mayor precio" },
    { value: "newest", label: "Novedades" },
];

export function DecorCatalog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const { currency } = useCurrencyStore();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const searchDebounceRef = useRef<NodeJS.Timeout>();
    const [categories, setCategories] = useState<Category[]>([]);

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        if (!config?.rubro?.slug) return;
        productService.getCategories(config.rubro.slug).then((cats) => setCategories(cats as any)).catch(() => {});
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

    const buildQS = (f: Record<string, any>) => {
        const params = new URLSearchParams();
        Object.entries(f).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "" && v !== false) params.set(k, String(v));
        });
        return params.toString();
    };

    const applyFilter = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        if (!value || value === "") delete newFilters[key];
        router.push(`/products?${buildQS(newFilters)}`, { scroll: false });
    };

    const clearAll = () => router.push("/products", { scroll: false });

    const { data, isLoading } = useQuery({
        queryKey: ["products", "catalog", filters, page],
        queryFn: () => productService.getProducts({ ...filters, page, limit: 12 }),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-32">
            
            {/* Minimalist Header */}
            <div className="w-full bg-[#F0E5D8] pt-32 pb-16 px-6 lg:px-12 text-center">
                <p className="text-xs tracking-[0.2em] text-[#3A302A]/60 uppercase mb-4">
                    {config?.rubro?.name || "Decoración y Eventos"}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-[#3A302A]">
                    {config?.storeName || "Colecciones"}
                </h1>
                {config?.customPageDescription && (
                    <p className="mt-4 text-[#5C4A3E] font-sans text-base max-w-xl mx-auto">
                        {config.customPageDescription}
                    </p>
                )}
            </div>

            <div className="container mx-auto px-6 lg:px-12 mt-12 flex flex-col lg:flex-row gap-12">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex items-center justify-between border-b border-[#3A302A]/10 pb-4">
                    <span className="text-[#3A302A] font-serif text-lg">Filtros</span>
                    <button onClick={() => setFiltersOpen(!filtersOpen)} className="text-[#3A302A] p-2 bg-[#E1CDBF]/30 rounded-full">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Sidebar Filters */}
                <aside className={`lg:w-64 flex-shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
                    <div className="sticky top-32 flex flex-col gap-10">
                        
                        {/* Search */}
                        <div>
                            <h3 className="text-[#3A302A] font-serif text-xl mb-4">Buscar</h3>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        clearTimeout(searchDebounceRef.current);
                                        searchDebounceRef.current = setTimeout(() => applyFilter("search", e.target.value), 500);
                                    }}
                                    placeholder="Buscar artículos..."
                                    className="w-full bg-transparent border-b border-[#3A302A]/20 py-2 pl-0 pr-8 text-sm focus:outline-none focus:border-[#3A302A] transition-colors placeholder:text-[#3A302A]/40"
                                />
                                <Search size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3A302A]/40" />
                            </div>
                        </div>

                        {/* Modality (Venta/Alquiler) */}
                        {config?.rubro?.productFormConfig?.showSaleMode && (
                            <div>
                                <h3 className="text-[#3A302A] font-serif text-xl mb-4">Modalidad</h3>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { label: "Todo", value: "" },
                                        { label: "Venta", value: "VENTA" },
                                        { label: "Alquiler", value: "ALQUILER" },
                                    ].map((opt) => (
                                        <button 
                                            key={opt.value}
                                            onClick={() => applyFilter("saleMode", opt.value)}
                                            className={`flex items-center gap-3 text-sm tracking-wide ${filters.saleMode === opt.value || (!filters.saleMode && opt.value === "") ? "text-[#3A302A] font-medium" : "text-[#3A302A]/60 hover:text-[#3A302A]"}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full border border-[#3A302A] flex items-center justify-center ${filters.saleMode === opt.value || (!filters.saleMode && opt.value === "") ? "bg-[#3A302A]" : "bg-transparent"}`} />
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div>
                                <h3 className="text-[#3A302A] font-serif text-xl mb-4">Categorías</h3>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => applyFilter("category", "")}
                                        className={`text-left text-sm tracking-wide ${!filters.category ? "text-[#3A302A] font-medium" : "text-[#3A302A]/60 hover:text-[#3A302A]"}`}
                                    >
                                        Todas las categorías
                                    </button>
                                    {categories.map((cat) => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => applyFilter("category", cat.slug)}
                                            className={`text-left text-sm tracking-wide ${filters.category === cat.slug ? "text-[#3A302A] font-medium" : "text-[#3A302A]/60 hover:text-[#3A302A]"}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sort */}
                        <div>
                            <h3 className="text-[#3A302A] font-serif text-xl mb-4">Ordenar</h3>
                            <div className="flex flex-col gap-3">
                                {SORT_OPTIONS.map((opt) => (
                                    <button 
                                        key={opt.value}
                                        onClick={() => applyFilter("sort", opt.value)}
                                        className={`text-left text-sm tracking-wide ${(filters.sort || "") === opt.value ? "text-[#3A302A] font-medium" : "text-[#3A302A]/60 hover:text-[#3A302A]"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {Object.keys(filters).length > 0 && (
                            <button 
                                onClick={clearAll}
                                className="text-xs tracking-[0.2em] uppercase text-[#3A302A]/50 hover:text-[#3A302A] transition-colors self-start border-b border-transparent hover:border-[#3A302A]"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-8 border-b border-[#3A302A]/10 pb-4">
                        <span className="text-sm text-[#3A302A]/60 font-sans">
                            {data?.total || 0} {(data?.total || 0) === 1 ? "artículo" : "artículos"}
                        </span>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="animate-pulse flex flex-col gap-4">
                                    <div className="w-full aspect-[4/5] bg-[#E1CDBF]/30" />
                                    <div className="h-6 w-2/3 bg-[#E1CDBF]/30" />
                                </div>
                            ))}
                        </div>
                    ) : !data || data.data.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl font-serif text-[#3A302A]/60 mb-6">No encontramos productos con esos filtros.</p>
                            <button 
                                onClick={clearAll}
                                className="inline-block bg-[#E1CDBF] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#E1CDBF] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-10"
                            >
                                Ver toda la colección
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                                {data.data.map((product) => (
                                    <ProductCardRouter key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-20">
                                    <button 
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="w-10 h-10 border border-[#3A302A]/20 flex items-center justify-center text-[#3A302A] disabled:opacity-30 hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-colors"
                                    >
                                        ←
                                    </button>
                                    <span className="font-serif text-[#3A302A] text-lg">
                                        {page} / {data.totalPages}
                                    </span>
                                    <button 
                                        disabled={page === data.totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="w-10 h-10 border border-[#3A302A]/20 flex items-center justify-center text-[#3A302A] disabled:opacity-30 hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
