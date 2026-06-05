"use client";

import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X, ChevronDown, PawPrint, SlidersHorizontal, Dog, Cat, Bone, Fish } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    perros: Dog,
    gatos: Cat,
    alimentos: Bone,
    accesorios: Fish,
};

const MOCK_PET_PRODUCTS = [
    { id: 1, name: "Royal Canin Medium Adult", basePrice: 8500, category: { name: "Alimentos" }, brand: "Royal Canin", images: ["https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&q=80&w=800"] },
    { id: 2, name: "Collar Ajustable Premium", basePrice: 2200, category: { name: "Accesorios" }, brand: "PetLife", images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800"] },
    { id: 3, name: "Cama Ortopédica XL", basePrice: 12000, category: { name: "Descanso" }, brand: "Comforpet", images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800"] },
    { id: 4, name: "Shampoo Natural Perros", basePrice: 1800, category: { name: "Higiene" }, brand: "PetGreen", images: ["https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"] },
    { id: 5, name: "Arena para Gatos Premium", basePrice: 3500, category: { name: "Gatos" }, brand: "CatMaster", images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"] },
    { id: 6, name: "Snacks Dentales Perros", basePrice: 950, category: { name: "Snacks" }, brand: "Pedigree", images: ["https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800"] },
    { id: 7, name: "Juguete Interactivo Gato", basePrice: 2900, category: { name: "Juguetes" }, brand: "PlayPet", images: ["https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&q=80&w=800"] },
    { id: 8, name: "Correa Retráctil 5m", basePrice: 3200, category: { name: "Paseo" }, brand: "FleXi", images: ["https://images.unsplash.com/photo-1601758174493-62aa7f5c3ce0?auto=format&fit=crop&q=80&w=800"] },
];

const SORT_OPTIONS = [
    { value: "", label: "Relevancia" },
    { value: "price_asc", label: "Menor precio" },
    { value: "price_desc", label: "Mayor precio" },
    { value: "newest", label: "Novedades" },
];

const QUICK_CATS = [
    { label: "Perros", slug: "perros", icon: Dog, color: "bg-[#E8963C]" },
    { label: "Gatos", slug: "gatos", icon: Cat, color: "bg-[#8B5E3C]" },
    { label: "Alimentos", slug: "alimentos", icon: Bone, color: "bg-[#A0714F]" },
    { label: "Accesorios", slug: "accesorios", icon: Fish, color: "bg-[#5C3D2E]" },
];

export function PetCatalog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const { currency } = useCurrencyStore();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [filtersOpen, setFiltersOpen] = useState(false);
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
        productService.getCategories(config.rubro.slug).then((cats) => setCategories(cats as any)).catch(() => {});
        productService.getBrands().then(setBrands).catch(() => {});
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
        queryFn: () => productService.getProducts({ ...filters, page, limit: 16, currency }),
    });

    const products = (data as any)?.data ?? MOCK_PET_PRODUCTS;
    const totalPages = (data as any)?.totalPages || 1;
    const activeFilterCount = Object.keys(filters).filter(k => !["page", "limit"].includes(k) && filters[k]).length;

    return (
        <main className="min-h-screen bg-[#EDE0CF] text-[#5C3D2E] pt-20 md:pt-24 pb-24">

            {/* ── HERO BANNER ── */}
            <section className="relative bg-gradient-to-br from-[#8B5E3C] via-[#A0714F] to-[#5C3D2E] overflow-hidden mb-10">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1920"
                        alt="Pets"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#D4B896]/50 backdrop-blur-xl backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                            <PawPrint className="h-3.5 w-3.5" />
                            Todo para tu compañero
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                            Nuestro Catálogo
                        </h1>
                        <p className="text-white/70 text-sm max-w-md">Alimentos premium, juguetes y accesorios seleccionados con amor para hacer feliz a tu mascota.</p>
                    </div>

                    {/* Quick Category Pills */}
                    <div className="flex flex-wrap gap-3 md:ml-auto justify-center">
                        {QUICK_CATS.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = filters.category === cat.slug;
                            return (
                                <button
                                    key={cat.slug}
                                    onClick={() => applyFilter("category", isActive ? undefined : cat.slug)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
                                        isActive
                                            ? "bg-[#D4B896]/40 backdrop-blur-xl text-[#5C3D2E] shadow-lg scale-105"
                                            : "bg-[#D4B896]/50 backdrop-blur-xl text-white hover:bg-[#D4B896]/50 backdrop-blur-xl backdrop-blur-sm"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* ── TOOLBAR ── */}
                <div className="bg-[#D4B896]/40 backdrop-blur-xl rounded-2xl shadow-lg border border-[#EDE0CF] p-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">

                        {/* Search */}
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0714F]" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                                    searchDebounceRef.current = setTimeout(() => applyFilter("search", e.target.value || undefined), 400);
                                }}
                                placeholder="Buscar productos..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-medium placeholder:text-[#A0714F]/60 outline-none focus:border-[#E8963C] transition-colors"
                            />
                            {searchInput && (
                                <button onClick={() => { setSearchInput(""); applyFilter("search", undefined); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X className="h-4 w-4 text-[#A0714F] hover:text-[#5C3D2E]" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={filters.sort || ""}
                                    onChange={(e) => applyFilter("sort", e.target.value || undefined)}
                                    className="pl-3 pr-8 py-2.5 rounded-xl border border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] text-sm font-bold outline-none focus:border-[#E8963C] appearance-none cursor-pointer transition-colors"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A0714F] pointer-events-none" />
                            </div>

                            {/* Filters toggle */}
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200 ${
                                    filtersOpen || activeFilterCount > 0
                                        ? "bg-[#8B5E3C] border-[#8B5E3C] text-white"
                                        : "border-[#D4B896] bg-[#EDE0CF] text-[#5C3D2E] hover:border-[#8B5E3C]"
                                }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </button>

                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="px-4 py-2.5 rounded-xl bg-[#EDE0CF] text-[#5C3D2E] font-bold text-sm hover:bg-[#D4B896] transition-colors">
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {filtersOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 pt-5 border-t border-[#EDE0CF] animate-in fade-in slide-in-from-top-2 duration-200">

                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#A0714F] mb-3 flex items-center gap-2">
                                    <span className="h-0.5 w-3 bg-[#E8963C] rounded-full" /> Categorías
                                </h3>
                                <div className="space-y-2">
                                    {categories.length > 0 ? categories.map((cat: any) => (
                                        <label key={cat.id || cat.slug} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filters.category === (cat.slug || cat)}
                                                onChange={(e) => applyFilter("category", e.target.checked ? (cat.slug || cat) : undefined)}
                                                className="w-4 h-4 rounded border-[#C9A882] bg-[#EDE0CF] accent-[#E8963C] cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-[#5C3D2E] group-hover:text-[#8B5E3C] transition-colors capitalize">
                                                {cat.name || cat}
                                            </span>
                                        </label>
                                    )) : (
                                        <p className="text-xs text-[#A0714F] italic">No hay categorías disponibles</p>
                                    )}
                                </div>
                            </div>

                            {/* Brands */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#A0714F] mb-3 flex items-center gap-2">
                                    <span className="h-0.5 w-3 bg-[#E8963C] rounded-full" /> Marcas
                                </h3>
                                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                    {brands.length > 0 ? brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filters.brand === brand}
                                                onChange={(e) => applyFilter("brand", e.target.checked ? brand : undefined)}
                                                className="w-4 h-4 rounded border-[#C9A882] bg-[#EDE0CF] accent-[#E8963C] cursor-pointer"
                                            />
                                            <span className="text-sm font-medium text-[#5C3D2E] group-hover:text-[#8B5E3C] transition-colors">
                                                {brand}
                                            </span>
                                        </label>
                                    )) : (
                                        <p className="text-xs text-[#A0714F] italic">No hay marcas disponibles</p>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#A0714F] mb-3 flex items-center gap-2">
                                    <span className="h-0.5 w-3 bg-[#E8963C] rounded-full" /> Disponibilidad
                                </h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock === true}
                                        onChange={(e) => applyFilter("inStock", e.target.checked ? true : undefined)}
                                        className="w-4 h-4 rounded border-[#C9A882] bg-[#EDE0CF] accent-[#E8963C] cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-[#5C3D2E] group-hover:text-[#8B5E3C] transition-colors">Solo en stock</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {Object.entries(filters).filter(([k, v]) => !["page", "limit", "sort"].includes(k) && v).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-[#EDE0CF] border border-[#D4B896] text-[#5C3D2E] text-xs font-bold rounded-full">
                                <span>{key === "search" ? `"${value}"` : key === "inStock" ? "En Stock" : value}</span>
                                <button onClick={() => applyFilter(key, undefined)} className="hover:text-[#8B5E3C]">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results count */}
                <p className="text-sm text-[#A0714F] font-medium mb-6">
                    {isLoading ? "Buscando..." : `${products.length} productos encontrados`}
                </p>

                {/* ── PRODUCT GRID ── */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product: any) => (
                            <ProductCardRouter key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-[#D4B896]/40 backdrop-blur-xl rounded-3xl border border-[#EDE0CF]">
                        <PawPrint className="h-14 w-14 text-[#D4B896] mx-auto mb-4" />
                        <h3 className="text-xl font-black text-[#5C3D2E] mb-2">Sin resultados</h3>
                        <p className="text-[#A0714F] text-sm">No encontramos productos que coincidan con tus filtros.</p>
                        <button onClick={clearAll} className="mt-6 px-6 py-3 rounded-full bg-[#8B5E3C] text-white font-bold text-sm hover:bg-[#5C3D2E] transition-colors">
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                                    page === p
                                        ? "bg-[#8B5E3C] text-white shadow-lg"
                                        : "bg-[#D4B896]/40 backdrop-blur-xl border border-[#D4B896] text-[#5C3D2E] hover:border-[#8B5E3C] hover:text-[#8B5E3C]"
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
