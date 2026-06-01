"use client";

import { products as productsContent } from "@/../content/products";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Filter, Search, Sparkles, Star, Wind, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PerfumeCatalog() {
    const { currency } = useCurrencyStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const rubroConfig = useRubroConfig();

    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    const [filters, setFilters] = useState<Record<string, any>>({});
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const searchDebounceRef = useRef<NodeJS.Timeout>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    useEffect(() => {
        productService.getCategories().then((cats) => setCategories(cats as any)).catch(() => {});
        productService.getBrands().then(setBrands).catch(() => {});
    }, []);

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

    useEffect(() => {
        if (searchInput === (filters.search || "")) return;
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            const newFilters = { ...filters, search: searchInput || undefined };
            if (!searchInput) delete newFilters.search;
            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
            });
            router.push(`/products?${params.toString()}`, { scroll: false });
            setPage(1);
        }, 300);
        return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
    }, [searchInput, router, filters]);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["products", page, filters],
        queryFn: () => productService.getProducts({ page, limit: productsContent.listing.itemsPerPage, ...filters }),
    });

    const updateURL = (newFilters: Record<string, any>) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "" && v !== false) params.set(k, String(v));
        });
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        if (!value || value === "all") delete newFilters[key];
        setFilters(newFilters);
        updateURL(newFilters);
        setPage(1);
    };

    const clearAllFilters = () => {
        setFilters({});
        setSearchInput("");
        router.push("/products", { scroll: false });
        setPage(1);
    };

    const activeFilterCount = Object.keys(filters).length;

    // Sidebar Filter Component
    const FilterSidebar = () => (
        <div className="space-y-8 text-[#f9f1d8]">
            {/* Ordenar */}
            <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] mb-4">Ordenar Por</h3>
                <div className="space-y-2">
                    {productsContent.listing.sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleFilterChange("sort", option.value)}
                            className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase border transition-all ${
                                filters.sort === option.value
                                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Categoría */}
            <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] mb-4">Familia Olfativa</h3>
                <div className="space-y-2">
                    {[{ id: "all", name: "Todas las familias", slug: "all" }, ...categories].map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => handleFilterChange("category", cat.slug === "all" ? undefined : cat.slug)}
                            className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase border transition-all ${
                                (cat.slug === "all" && !filters.category) || filters.category === cat.slug
                                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Marcas */}
            {brands.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] mb-4 flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />Marca
                    </h3>
                    <div className="space-y-2">
                        {brands.slice(0, 8).map((b) => (
                            <button
                                key={b}
                                onClick={() => handleFilterChange("brand", filters.brand === b ? undefined : b)}
                                className={`w-full text-left px-4 py-3 text-xs tracking-widest uppercase border transition-all ${
                                    filters.brand === b
                                        ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                        : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                                }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="h-px bg-white/10" />

            {/* Rango de Precio */}
            <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] mb-4">Rango de Precio</h3>
                <div className="space-y-2">
                    {productsContent.listing.filters.priceRanges.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => {
                                const newFilters = { ...filters, minPrice: range.min, maxPrice: range.max };
                                setFilters(newFilters);
                                updateURL(newFilters);
                                setPage(1);
                            }}
                            className={`block w-full text-left text-[10px] uppercase tracking-widest px-4 py-3 border transition-colors ${
                                filters.minPrice === range.min && filters.maxPrice === range.max
                                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] font-bold"
                                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                            }`}
                        >
                            {range.label.replace(/{(\d+)}/g, (_, num) => {
                                const val = num === "0" ? range.min : range.max;
                                return formatPrice(val, currency);
                            })}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Filtros rápidos */}
            <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#d4af37] mb-4 flex items-center gap-2">
                    <Wind className="h-3 w-3" />Filtros Rápidos
                </h3>
                <div className="space-y-2">
                    {[
                        { key: "isTrending", label: "Más Vendidos", icon: Star },
                        { key: "isNew", label: "Recién Llegadas", icon: Sparkles },
                        { key: "inStock", label: "En Stock", icon: Droplets },
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => handleFilterChange(key, !filters[key])}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase border transition-all ${
                                filters[key]
                                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                            }`}
                        >
                            <Icon className="h-3 w-3" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#f5f0e6] text-[#1a1614] pt-32 pb-20">

            {/* Mobile filter overlay */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className="fixed inset-0 z-[200] bg-[#1a1614] overflow-y-auto p-8"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-bold">Filtros</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="text-white/50 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSidebar />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="mb-12">
                    <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">Catálogo Completo</span>
                    <div className="flex items-end justify-between">
                        <h1 className="text-5xl md:text-6xl font-serif text-[#1a1614]">
                            Colección
                            <span className="block text-transparent" style={{ WebkitTextStroke: "1px #d4af37" }}>de Fragancias</span>
                        </h1>
                        {data && (
                            <p className="text-[#1a1614]/40 text-xs tracking-widest uppercase hidden md:block">
                                {data.total ?? data.data?.length ?? 0} fragancias
                            </p>
                        )}
                    </div>
                </div>

                {/* Search bar */}
                <div className="mb-10">
                    <div className="relative border border-[#1a1614]/20 hover:border-[#d4af37]/60 focus-within:border-[#d4af37] transition-colors bg-white">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d4af37]" />
                        <input
                            type="search"
                            placeholder="Buscar fragancia, marca, concentración..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-14 pr-16 h-14 bg-transparent text-sm font-light placeholder:text-[#1a1614]/30 text-[#1a1614] outline-none tracking-widest"
                        />
                        {searchInput && (
                            <button onClick={() => setSearchInput("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#d4af37]">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Active filters */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                        {Object.entries(filters).map(([key, value]) => {
                            if (!value) return null;
                            let label = `${key}: ${value}`;
                            if (key === "category") label = `Familia: ${value}`;
                            if (key === "search") label = `"${value}"`;
                            if (key === "isTrending") label = "Más Vendidos";
                            if (key === "isNew") label = "Nuevas";
                            if (key === "inStock") label = "En Stock";
                            if (key === "minPrice") label = `Desde ${formatPrice(Number(value), currency)}`;
                            if (key === "maxPrice") label = `Hasta ${formatPrice(Number(value), currency)}`;
                            if (key === "sort") label = `Orden: ${productsContent.listing.sortOptions.find(o => o.value === value)?.label || value}`;
                            return (
                                <motion.span
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-[10px] tracking-widest uppercase font-bold"
                                >
                                    {label}
                                    <button onClick={() => handleFilterChange(key, undefined)} className="hover:text-white">
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.span>
                            );
                        })}
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 border border-white/10 text-white/30 text-[10px] tracking-widest uppercase hover:border-white/30 hover:text-white/60 transition-colors"
                        >
                            Limpiar Todo
                        </button>
                    </div>
                )}

                <div className="flex gap-10">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-36">
                            <div className="bg-[#1a1614] p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-px flex-1 bg-[#d4af37]/30" />
                                    <h2 className="text-[10px] text-[#d4af37] tracking-[0.4em] uppercase font-bold">Filtros</h2>
                                    <div className="h-px flex-1 bg-[#d4af37]/30" />
                                </div>
                                <FilterSidebar />
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        {/* Mobile filter button */}
                        <div className="lg:hidden mb-6 flex gap-3">
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="flex items-center gap-2 border border-white/10 px-6 py-3 text-[10px] tracking-widest uppercase text-white/60 hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                Filtros {activeFilterCount > 0 && <Badge className="ml-1 bg-[#d4af37] text-black text-[9px]">{activeFilterCount}</Badge>}
                            </button>
                        </div>

                        {isLoading || isFetching ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-96 bg-[#1a1a1a] animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <p className="text-white/30 text-center py-20">Error cargando fragancias.</p>
                        ) : !data || data.data.length === 0 ? (
                            <div className="text-center py-20">
                                <Sparkles className="h-12 w-12 text-[#d4af37]/20 mx-auto mb-4" />
                                <p className="text-white/30 text-sm tracking-widest uppercase">No encontramos fragancias con ese criterio.</p>
                                <button onClick={clearAllFilters} className="mt-6 px-8 py-3 border border-[#d4af37]/40 text-[#d4af37] text-[10px] tracking-widest uppercase hover:bg-[#d4af37] hover:text-black transition-all">
                                    Ver Todo el Catálogo
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {data.data.map((product) => (
                                        <ProductCardRouter key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data.totalPages > 1 && (
                                    <div className="flex justify-center gap-3 mt-16">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "instant" }); }}
                                            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all disabled:opacity-20"
                                        >
                                            ←
                                        </button>
                                        {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                                            let pg = i + 1;
                                            if (data.totalPages > 5) {
                                                if (page > 3 && page < data.totalPages - 2) pg = page - 2 + i;
                                                else if (page >= data.totalPages - 2) pg = data.totalPages - 4 + i;
                                            }
                                            return (
                                                <button
                                                    key={pg}
                                                    onClick={() => { setPage(pg); window.scrollTo({ top: 0, behavior: "instant" }); }}
                                                    className={`w-10 h-10 flex items-center justify-center text-sm transition-all ${
                                                        page === pg
                                                            ? "bg-[#d4af37] text-black font-bold"
                                                            : "border border-white/10 text-white/40 hover:border-[#d4af37]/40 hover:text-[#d4af37]"
                                                    }`}
                                                >
                                                    {pg}
                                                </button>
                                            );
                                        })}
                                        <button
                                            disabled={page === data.totalPages}
                                            onClick={() => { setPage(p => Math.min(data.totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "instant" }); }}
                                            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all disabled:opacity-20"
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
        </main>
    );
}
