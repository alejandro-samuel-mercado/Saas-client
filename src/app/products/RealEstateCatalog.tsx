"use client";

import { products as productsContent } from "@/../content/products";
import { ProductCardRouter } from "@/components/shared/ProductCardRouter";
import { ProductSkeleton } from "@/components/shared/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { configService } from "@/services/config";
import { productService } from "@/services/products";
import { useCurrencyStore } from "@/store/currency";
import { useRubroConfig } from "@/hooks/useRubroConfig";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

interface Filters {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
  freeShipping?: boolean;
  inStock?: boolean;
  search?: string;
}

export function RealEstateCatalog() {
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

  // Cargar datos de filtros al montar el componente
  useEffect(() => {
    if (!config?.rubro?.slug) return;
    const fetchFilterData = async () => {
      try {
        const [cats, brnds] = await Promise.all([
          productService.getCategories(config?.rubro?.slug),
          productService.getBrands(),
        ]);
        setCategories(cats as any);
        setBrands(brnds);
      } catch (err) {}
    };
    fetchFilterData();
  }, [config?.rubro?.slug]);


  useEffect(() => {
    const urlFilters: Record<string, any> = {};
    searchParams.forEach((value, key) => {
   
      if (value.includes(",")) {
        urlFilters[key] = value.split(",");
      } else if (value === "true") {
        urlFilters[key] = true;
      } else if (value === "false") {
        urlFilters[key] = false;
      } else if (key === "minPrice" || key === "maxPrice") {
        urlFilters[key] = Number(value);
      } else {
        urlFilters[key] = value;
      }
    });
    setFilters(urlFilters);
    
    setSearchInput(urlFilters.search || "");
  }, [searchParams]);

  // Efecto de búsqueda con debounce 
  useEffect(() => {
    if (searchInput === (filters.search || "")) return;

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, search: searchInput || undefined };
      if (!searchInput) {
        delete newFilters.search;
      }

      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, String(value));
          }
        }
      });

      router.push(`/products?${params.toString()}`, { scroll: false });
      setPage(1);
    }, 300);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchInput, router, filters]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["products", page, filters],
    queryFn: () =>
      productService.getProducts({
        page,
        limit: productsContent.listing.itemsPerPage,
        ...filters,
      }),
  });

  const updateURL = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== false
      ) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      }
    });
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (
      value === undefined ||
      value === null ||
      value === false ||
      value === "all"
    ) {
      delete newFilters[key];
    }
    setFilters(newFilters);
    updateURL(newFilters);
    setPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max };
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

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="">
        <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Ordenar Por</h3>
        <Select
          value={filters.sort}
          onValueChange={(v) => handleFilterChange("sort", v)}
        >
          <SelectTrigger className="border border-gray-300 hover:border-black rounded-none h-12">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {productsContent.listing.sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de categoría */}
      <div>
        <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Categoría</h3>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) =>
            handleFilterChange("category", v === "all" ? undefined : v)
          }
        >
          <SelectTrigger className="border border-[#1a1a1a]/20 hover:border-[#1a1a1a] rounded-none h-12">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Ubicación (Específico para Inmuebles) */}
      {config?.rubro?.slug === "inmuebles" && (
        <div>
          <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Ubicación / Zona</h3>
          <Input 
            placeholder="Ej: Centro, Norte..."
            value={filters.ubicacion || ""}
            onChange={(e) => handleFilterChange("ubicacion", e.target.value)}
            className="border-[#1a1a1a]/20 hover:border-[#1a1a1a] focus-visible:ring-0 rounded-none h-12 uppercase text-xs tracking-widest"
          />
        </div>
      )}

      {/* Filtro de marca — solo si el rubro lo usa */}
      {rubroConfig.showBrandFilter && (
        <div>
          <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Marca</h3>
          <Select
            value={filters.brand || "all"}
            onValueChange={(v) =>
              handleFilterChange("brand", v === "all" ? undefined : v)
            }
          >
            <SelectTrigger className="border border-[#1a1a1a] hover:border-[#1a1a1a] rounded-none h-12">
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {config?.rubro?.productFormConfig?.showSaleMode && (
        <>
          <Separator className="bg-[#1a1a1a]" />
          <div>
            <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Modo</h3>
            <Select
              value={filters.saleMode || "all"}
              onValueChange={(v) =>
                handleFilterChange("saleMode", v === "all" ? undefined : v)
              }
            >
              <SelectTrigger className="border border-[#1a1a1a]/20 hover:border-[#1a1a1a] rounded-none h-12">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="VENTA">Venta</SelectItem>
                <SelectItem value="ALQUILER">Alquiler</SelectItem>
                <SelectItem value="AMBOS">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Separator className="bg-[#1a1a1a]" />

      <div>
        <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Rango de Precio</h3>
        <div className="space-y-2">
          {productsContent.listing.filters.priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handlePriceRangeChange(range.min, range.max)}
              className={`block w-full text-left text-xs uppercase tracking-widest px-4 py-4 rounded-none border transition-colors ${
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white font-bold"
                  : "border-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-gray-50 text-gray-600 font-medium"
              }`}
            >
              {range.label
                .replace("{0}", formatPrice(range.min, currency))
                .replace("{1}", formatPrice(range.min, currency))
                .replace(/{(\d+)}/g, (match, number) => {
                  const val =
                    number === "0" ? range.min : number === "1" ? range.max : 0;
                  return formatPrice(val, currency);
                })}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-[#1a1a1a]" />

      <div>
        <h3 className="font-bold mb-4 text-[#1a1a1a] uppercase tracking-widest text-xs">Filtros Rápidos</h3>
        <div className="space-y-3">
          {rubroConfig.showShippingFilter && (
            <div className="flex items-center gap-3 p-4 border border-[#1a1a1a] hover:border-black transition-colors">
              <Checkbox
                id="free-shipping"
                checked={filters.freeShipping}
                onCheckedChange={(checked) =>
                  handleFilterChange("freeShipping", checked)
                }
                className="border-[#1a1a1a] rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <Label
                htmlFor="free-shipping"
                className="cursor-pointer font-medium"
              >
                {productsContent.listing.filters.shipping.label}
              </Label>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 border border-[#1a1a1a] hover:border-black transition-colors">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                handleFilterChange("inStock", checked)
              }
              className="border-[#1a1a1a] rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <Label htmlFor="in-stock" className="cursor-pointer font-medium">
              {productsContent.listing.filters.availability.label}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="bg-white min-h-screen pb-40 pt-32">
      <div className="mx-auto max-w-[80%] max-md:max-w-[90%] max-lg:max-w-[95%] max-sm:max-w-[80%]">
        <div className="flex items-center justify-between mb-8">
          {/* Botón de filtros  */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" className="border-2 border-[#1a1a1a] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="max-sm:overflow-y-scroll">
              <SheetHeader>
                <SheetTitle>{productsContent.listing.filters.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 ">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="w-full flex max-md:flex-col gap-10">
          {/* Barra de búsqueda */}
          <div className="mb-10 w-full max-w-2xl">
            <div className="relative w-full">
              <div className="relative border border-[#1a1a1a] transition-colors focus-within:border-black focus-within:border-2">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a1a1a]" />
                <Input
                  type="search"
                  placeholder={rubroConfig.searchPlaceholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-16 pr-16 h-14 text-sm font-medium border-none bg-transparent rounded-none focus-visible:ring-0 placeholder:text-[#1a1a1a] uppercase tracking-widest"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] rounded-none p-2 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtros activos */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6  w-full">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                let label = `${key}: ${value}`;
                if (key === "sort")
                  label = `Ordenar: ${productsContent.listing.sortOptions.find((o) => o.value === value)?.label || value}`;
                if (key === "minPrice")
                  label = `Precio Mín: ${formatPrice(Number(value), currency)}`;
                if (key === "maxPrice")
                  label = `Precio Máx: ${formatPrice(Number(value), currency)}`;
                if (key === "category") label = `Categoría: ${value}`;
                if (key === "subcategoria") label = `Subcategoría: ${value}`;
                if (key === "saleMode") label = `Modo: ${value === 'VENTA' ? 'Venta' : value === 'ALQUILER' ? 'Alquiler' : 'Ambos'}`;
                if (key === "search") label = `Búsqueda: "${value}"`;
                if (key === "freeShipping") label = "Envío Gratis";
                if (key === "inStock") label = "Solo en Stock";
                if (key === "isNew") label = "Nuevos";
                if (key === "isTrending") label = "Tendencias";
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-3 px-5 py-3 border border-[#1a1a1a] bg-[#1a1a1a] text-white font-bold text-[10px] tracking-widest uppercase transition-colors"
                  >
                    {label}
                    <button
                      onClick={() => handleFilterChange(key, undefined)}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="px-6 py-3 border border-[#1a1a1a] bg-white text-[#1a1a1a] text-[10px] tracking-widest uppercase font-bold hover:bg-gray-100 hover:border-[#1a1a1a] rounded-none transition-colors"
              >
                {productsContent.listing.filters.clearAll}
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
              <div
              className="sticky top-24"
            >
              <div className="bg-[#f8f8f8] border border-[#1a1a1a] p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-xl font-black uppercase tracking-widest text-[#1a1a1a] mb-2">
                    {productsContent.listing.filters.title}
                  </h2>
                  <div className="h-[2px] w-12 bg-[#f5ab1c]"></div>
                </div>
                <div className="">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="flex-1 min-h-[1000px] p-0 md:p-8">
            {isLoading || isFetching ? (
              <div className={`grid gap-6 ${config?.rubro?.slug === "inmuebles" ? "grid-cols-1 xl:grid-cols-2" : "md:grid-cols-3 grid-cols-4 max-md:grid-cols-1"}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Error cargando productos. Por favor intenta de nuevo.
                </p>
              </div>
            ) : !data || data.data.length === 0 ? (
              <div className="text-center py-2">
                <p className="text-muted-foreground">
                  {productsContent.listing.noResults}
                </p>
                <Button className="mt-4" onClick={clearAllFilters}>
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${config?.rubro?.slug === "inmuebles" ? "grid-cols-1 xl:grid-cols-2" : "max-md:grid-cols-2 max-sm:grid-cols-1 max-xl:grid-cols-3 grid-cols-4"}`}>
                  {data.data.map((product) => (
                    <ProductCardRouter key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginación numerada */}
                {data && data.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-16">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="rounded-full w-10 h-10 border-border-foreground/20"
                    >
                      ←
                    </Button>

                    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full">
                      {Array.from({ length: Math.min(5, data.totalPages) }).map(
                        (_, i) => {
                          let pageNum = i + 1;
                          if (data.totalPages > 5) {
                            if (page > 3 && page < data.totalPages - 2) {
                              pageNum = page - 2 + i;
                            } else if (page >= data.totalPages - 2) {
                              pageNum = data.totalPages - 4 + i;
                            }
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "ghost"}
                              size="sm"
                              onClick={() => {
                                setPage(pageNum);
                                window.scrollTo({ top: 0, behavior: 'instant' });
                              }}
                              className={`rounded-full w-9 h-9 p-0 font-medium ${page === pageNum ? "shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === data.totalPages}
                      onClick={() => {
                        setPage((p) => Math.min(data.totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="rounded-full w-10 h-10 border-border-foreground/20"
                    >
                      →
                    </Button>
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
