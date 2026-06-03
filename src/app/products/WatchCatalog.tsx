"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X, ChevronDown, Watch, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function WatchCatalog() {
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
        productService.getCategories(config?.rubro?.slug).then((cats) => setCategories(cats as any)).catch(() => { });
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

    const products = (data as any)?.data || [];
    console.log("WATCH CATALOG DATA:", data);
    const totalPages = (data as any)?.totalPages || 1;
    const activeFilterCount = Object.keys(filters).filter(k => !["page", "limit"].includes(k) && filters[k]).length;

    const SORT_OPTIONS = [
        { value: "", label: "Relevancia" },
        { value: "price_asc", label: "Menor a Mayor" },
        { value: "price_desc", label: "Mayor a Menor" },
        { value: "newest", label: "Novedades" },
    ];

    const WATCH_CATEGORIES = [
        { name: "Lujo", href: "/products?category=relojes-lujo", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400" },
        { name: "Smartwatch", href: "/products?category=smartwatch", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=400" },
        { name: "Accesorios", href: "/products?category=accesorios-reloj", image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-[#E6D2B5] font-sans pb-24">

            {/* HERO BANNER */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C8A97E]/20">
                <div className="absolute inset-0 bg-[#0a0d11]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
                </div>
                <div className="container relative mx-auto px-6 lg:px-12 text-center">

                    <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">Colección Exclusiva</h1>
                    <p className="text-[#E6D2B5]/70 max-w-2xl mx-auto font-light text-lg">
                        Explora nuestra cuidada selección de piezas maestras.
                    </p>
                </div>
            </section>

            {/* QUICK CATEGORIES (Visual Row) */}
            <section className="container mx-auto px-6 lg:px-12 -mt-10 relative z-10 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {WATCH_CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={cat.href} className="group relative h-32 rounded-[2rem] overflow-hidden bg-[#242424] border border-[#C8A97E]/20 hover:border-[#C8A97E]/50 transition-all flex items-center p-4 gap-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-white mb-1 group-hover:text-[#C8A97E] transition-colors">{cat.name}</h3>
                                <span className="text-[#E6D2B5]/50 text-xs tracking-widest uppercase flex items-center gap-2 group-hover:text-[#E6D2B5] transition-colors">
                                    Ver productos <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="container mx-auto px-6 lg:px-12">
                {/* TOOLBAR & FILTERS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-[#242424] p-4 rounded-[2rem] border border-[#C8A97E]/20">

                    {/* Search */}
                    <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] rounded-full border border-[#C8A97E]/10 max-w-md">
                        <Search className="h-4 w-4 text-[#C8A97E]" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                                searchDebounceRef.current = setTimeout(() => applyFilter("search", e.target.value || undefined), 400);
                            }}
                            placeholder="Buscar marca, modelo..."
                            className="bg-transparent text-[#E6D2B5] text-sm placeholder:text-[#E6D2B5]/40 outline-none flex-1"
                        />
                        {searchInput && (
                            <button onClick={() => { setSearchInput(""); applyFilter("search", undefined); }}>
                                <X className="h-4 w-4 text-[#E6D2B5]/40 hover:text-[#E6D2B5]" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {/* Sort Dropdown */}
                        <div className="relative flex items-center px-4 py-2 bg-[#1A1A1A] rounded-full border border-[#C8A97E]/10 flex-shrink-0">
                            <select
                                value={filters.sort || ""}
                                onChange={(e) => applyFilter("sort", e.target.value || undefined)}
                                className="bg-transparent text-[#E6D2B5]/90 text-sm outline-none cursor-pointer appearance-none pr-8 w-32"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-[#1A1A1A]">{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="h-4 w-4 text-[#C8A97E] absolute right-4 pointer-events-none" />
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#C8A97E] text-[#1A1A1A] rounded-full font-medium text-sm flex-shrink-0">
                            <Filter className="h-4 w-4" /> Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* SIDEBAR FILTERS (Desktop) */}
                    <aside className={`lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block mb-8 bg-[#242424] p-6 rounded-[2rem] border border-[#C8A97E]/20' : 'hidden lg:block'}`}>
                        <div className="space-y-8">

                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="w-full py-2.5 rounded-full border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                                    Limpiar Filtros
                                </button>
                            )}

                            <div>
                                <h3 className="text-[#C8A97E] text-xs tracking-widest uppercase mb-4 border-b border-[#C8A97E]/20 pb-3">Categoría</h3>
                                <div className="space-y-2">
                                    {categories.map((cat: any) => (
                                        <button key={cat.id} onClick={() => applyFilter("category", filters.category === cat.slug ? undefined : cat.slug)}
                                            className={`block w-full text-left text-sm py-1.5 px-3 rounded-xl transition-all ${filters.category === cat.slug ? "bg-[#C8A97E] text-[#1A1A1A] font-medium" : "text-[#E6D2B5]/70 hover:bg-[#1A1A1A] hover:text-[#E6D2B5]"}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#C8A97E] text-xs tracking-widest uppercase mb-4 border-b border-[#C8A97E]/20 pb-3">Marca</h3>
                                <div className="space-y-2">
                                    {brands.slice(0, 10).map((brand) => (
                                        <button key={brand} onClick={() => applyFilter("brand", filters.brand === brand ? undefined : brand)}
                                            className={`block w-full text-left text-sm py-1.5 px-3 rounded-xl transition-all ${filters.brand === brand ? "bg-[#C8A97E] text-[#1A1A1A] font-medium" : "text-[#E6D2B5]/70 hover:bg-[#1A1A1A] hover:text-[#E6D2B5]"}`}>
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#C8A97E] text-xs tracking-widest uppercase mb-4 border-b border-[#C8A97E]/20 pb-3">Estado</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: "Nuevo", value: "NEW" },
                                        { label: "Usado", value: "USED" },
                                        { label: "Colección", value: "REFURBISHED" }
                                    ].map(state => (
                                        <button key={state.value} onClick={() => applyFilter("condition", filters.condition === state.value ? undefined : state.value)}
                                            className={`block w-full text-left text-sm py-1.5 px-3 rounded-xl transition-all ${filters.condition === state.value ? "bg-[#C8A97E] text-[#1A1A1A] font-medium" : "text-[#E6D2B5]/70 hover:bg-[#1A1A1A] hover:text-[#E6D2B5]"}`}>
                                            {state.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#C8A97E] text-xs tracking-widest uppercase mb-4 border-b border-[#C8A97E]/20 pb-3">Disponibilidad</h3>
                                <button onClick={() => applyFilter("inStock", !filters.inStock)}
                                    className={`flex items-center gap-3 w-full text-left text-sm py-1.5 px-3 rounded-xl transition-all ${filters.inStock ? "bg-[#C8A97E]/10 text-[#C8A97E]" : "text-[#E6D2B5]/70 hover:bg-[#1A1A1A]"}`}>
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.inStock ? "border-[#C8A97E] bg-[#C8A97E] text-[#1A1A1A]" : "border-[#E6D2B5]/30"}`}>
                                        {filters.inStock && "✓"}
                                    </span>
                                    Solo con stock
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-[#242424] rounded-[2.5rem] border border-[#C8A97E]/10">
                                <Watch className="w-16 h-16 text-[#C8A97E]/30 mx-auto mb-6" />
                                <h3 className="text-2xl font-serif text-white mb-2">Sin Resultados</h3>
                                <p className="text-[#E6D2B5]/60 mb-8 max-w-md mx-auto">No pudimos encontrar piezas que coincidan con tu búsqueda. Intenta modificar los filtros.</p>
                                <button onClick={clearAll} className="px-8 py-3 rounded-full bg-[#C8A97E] text-[#1A1A1A] font-medium hover:bg-white transition-colors">
                                    Ver toda la colección
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product: any) => (
                                        <div key={product.id} className="[&>div]:border-[#C8A97E]/20 [&>div]:bg-[#242424] [&>div]:rounded-[2rem] hover:[&>div]:border-[#C8A97E]/50">
                                            <ProductCardRouter product={product} />
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-[#C8A97E]/20">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-full text-sm transition-all ${p === page ? "bg-[#C8A97E] text-[#1A1A1A] font-bold" : "border border-[#C8A97E]/30 text-[#E6D2B5]/70 hover:border-[#C8A97E] hover:text-[#C8A97E]"}`}>
                                                {p}
                                            </button>
                                        ))}
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
