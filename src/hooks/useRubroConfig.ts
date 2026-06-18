/**
 * useRubroConfig
 * Hook centralizado que mapea el slug del rubro del tenant
 * a configuraciones de UI para el storefront.
 *
 * Rubros disponibles (seeds):
 *  general | perfumes | relojes | barberias | mascotas | decoracion | ropa | inmuebles
 */

import { PublicConfig } from "@/services/config";
import { configService } from "@/services/config";
import { useQuery } from "@tanstack/react-query";

export interface RubroUIConfig {
  /** Cómo llamar al "producto" singular (Propiedad, Fragancia, Prenda…) */
  productLabel: string;
  /** Cómo llamar a los "productos" en plural */
  productLabelPlural: string;
  /** Cómo llamar a las "categorías" */
  categoryLabel: string;
  /** Si el rubro usa carrito */
  showCart: boolean;
  /** Si mostrar la sección de Tendencias */
  showTrending: boolean;
  /** Si mostrar la sección de Nuevos Productos */
  showNewProducts: boolean;
  /** Si mostrar el CartAnimation decorativo */
  showCartAnimation: boolean;
  /** Si mostrar el filtro de Marca en /products */
  showBrandFilter: boolean;
  /** Si mostrar el filtro de Envío Gratis en /products */
  showShippingFilter: boolean;
  /** Placeholder del buscador */
  searchPlaceholder: string;
  /** Título de la sección de categorías */
  categorySectionTitle: string;
  /** Items de la marquesina (fallback cuando el admin no configuró ninguno) */
  marqueeItems: string[];
  /** Beneficios (fallback cuando el rubro tiene sus propios beneficios) */
  benefitItems: {
    icon: string;
    title: string;
    description: string;
    color?: string;
  }[];
  /** Título de la sección de tendencias */
  trendingTitle: string;
  /** Subtítulo de la sección de tendencias */
  trendingSubtitle: string;
  /** Título de la sección de nuevos */
  newProductsTitle: string;
  /** Subtítulo de la sección de nuevos */
  newProductsSubtitle: string;
  /** Texto en la vista all link del hero */
  viewAllLabel: string;
  /** Label del nav link principal de productos */
  navProductsLabel: string;
  /** Label del link de Tendencias en el nav (null = ocultar) */
  navTrendingLabel: string | null;
  /** Label del link de Nuevos en el nav (null = ocultar) */
  navNewLabel: string | null;
}

const RUBRO_CONFIGS: Record<string, Partial<RubroUIConfig>> = {
  inmuebles: {
    productLabel: "Propiedad",
    productLabelPlural: "Propiedades",
    categoryLabel: "Tipo de Propiedad",
    showCart: false,
    showTrending: false,
    showNewProducts: true,
    showCartAnimation: false,
    showBrandFilter: false,
    showShippingFilter: false,
    searchPlaceholder: "Buscar propiedades...",
    categorySectionTitle: "Explorar por Tipo de Propiedad",
    marqueeItems: [
      "Encontrá tu hogar ideal",
      "Asesoramiento inmobiliario personalizado",
      "Financiación disponible",
      "Tasación sin cargo",
      "Propiedades en las mejores zonas",
    ],
    benefitItems: [
      { icon: "user", title: "Asesor Personal", description: "Te acompañamos en cada paso" },
      { icon: "calculator", title: "Tasación Gratis", description: "Conocé el valor real de tu propiedad" },
      { icon: "credit-card", title: "Financiación", description: "Opciones adaptadas a tu situación" },
      { icon: "shield-check", title: "Seguridad Legal", description: "Escrituración garantizada" },
    ],
    trendingTitle: "Propiedades Destacadas",
    trendingSubtitle: "Las más consultadas de la semana",
    newProductsTitle: "Nuevas Propiedades",
    newProductsSubtitle: "Recién ingresadas al mercado",
    viewAllLabel: "Ver Todas las Propiedades",
    navProductsLabel: "Propiedades",
    navTrendingLabel: null,
    navNewLabel: "Nuevas",
  },

  perfumes: {
    productLabel: "Fragancia",
    productLabelPlural: "Fragancias",
    categoryLabel: "Tipo de Fragancia",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar fragancias, marcas...",
    categorySectionTitle: "Explora por Tipo de Fragancia",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Fragancias 100% originales",
      "Muestras gratis con cada pedido",
      "Asesoramiento de fragancia personalizado",
    ],
    benefitItems: [
      { icon: "sparkles", title: "100% Originales", description: "Productos certificados y auténticos" },
      { icon: "truck", title: "Envío Cuidadoso", description: "Embalaje especial para fragancias" },
      { icon: "refresh-cw", title: "Cambios Fáciles", description: "Política de cambio de 30 días" },
      { icon: "headphones", title: "Asesoría Experta", description: "Te ayudamos a encontrar tu fragancia" },
    ],
    trendingTitle: "Fragancias del Momento",
    trendingSubtitle: "Las más elegidas esta semana",
    newProductsTitle: "Nuevas Fragancias",
    newProductsSubtitle: "Recién llegadas a nuestra colección",
    viewAllLabel: "Ver Todas las Fragancias",
    navProductsLabel: "Fragancias",
    navTrendingLabel: "Tendencias",
    navNewLabel: "Nuevas",
  },

  relojes: {
    productLabel: "Reloj",
    productLabelPlural: "Relojes",
    categoryLabel: "Tipo",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar relojes, marcas, modelos...",
    categorySectionTitle: "Explora por Categoría",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Relojes originales con garantía",
      "Atención personalizada",
      "Pago seguro",
    ],
    benefitItems: [
      { icon: "shield-check", title: "Garantía Oficial", description: "Certificado de autenticidad incluido" },
      { icon: "truck", title: "Envío Seguro", description: "Embalaje premium para tu reloj" },
      { icon: "refresh-cw", title: "Devoluciones", description: "30 días para cambiar de opinión" },
      { icon: "headphones", title: "Expertos en Relojes", description: "Asesoramiento especializado" },
    ],
    trendingTitle: "Relojes Más Populares",
    trendingSubtitle: "Los más elegidos de la semana",
    newProductsTitle: "Nuevos Modelos",
    newProductsSubtitle: "Últimas incorporaciones a nuestra colección",
    viewAllLabel: "Ver Todos los Relojes",
    navProductsLabel: "Relojes",
    navTrendingLabel: "Tendencias",
    navNewLabel: "Nuevos",
  },

  barberias: {
    productLabel: "Artículo",
    productLabelPlural: "Artículos",
    categoryLabel: "Categoría",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar productos de barbería...",
    categorySectionTitle: "Explora por Categoría",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Productos profesionales para barbería",
      "Atención personalizada",
      "Las mejores marcas del mercado",
    ],
    benefitItems: [
      { icon: "scissors", title: "Uso Profesional", description: "Productos para resultados perfectos" },
      { icon: "truck", title: "Envío Rápido", description: "Tu pedido llega sin demoras" },
      { icon: "shield-check", title: "Calidad Garantizada", description: "Solo las mejores marcas" },
      { icon: "headphones", title: "Soporte Experto", description: "Asesoramiento de profesionales" },
    ],
    trendingTitle: "Más Vendidos",
    trendingSubtitle: "Los productos favoritos de los barberos",
    newProductsTitle: "Novedades",
    newProductsSubtitle: "Lo último en productos de barbería",
    viewAllLabel: "Ver Todos los Productos",
    navProductsLabel: "Productos",
    navTrendingLabel: "Más Vendidos",
    navNewLabel: "Novedades",
  },

  mascotas: {
    productLabel: "Producto",
    productLabelPlural: "Productos",
    categoryLabel: "Categoría",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar para tu mascota...",
    categorySectionTitle: "Explora por Tipo de Mascota",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Todo para el bienestar de tu mascota",
      "Alimentos premium y accesorios",
      "Soporte veterinario online",
    ],
    benefitItems: [
      { icon: "heart", title: "Amor Animal", description: "Productos pensados para el bienestar" },
      { icon: "truck", title: "Envío Rápido", description: "Tu pedido llega sin demoras" },
      { icon: "shield-check", title: "Calidad Premium", description: "Productos seguros y certificados" },
      { icon: "headphones", title: "Asesoría Vet", description: "Consultoría especializada" },
    ],
    trendingTitle: "Los Más Elegidos",
    trendingSubtitle: "Los productos favoritos de las mascotas",
    newProductsTitle: "Novedades",
    newProductsSubtitle: "Lo último para el cuidado de tu mascota",
    viewAllLabel: "Ver Todos los Productos",
    navProductsLabel: "Productos",
    navTrendingLabel: "Favoritos",
    navNewLabel: "Novedades",
  },

  decoracion: {
    productLabel: "Artículo",
    productLabelPlural: "Artículos",
    categoryLabel: "Tipo de Evento",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: false,
    showShippingFilter: true,
    searchPlaceholder: "Buscar decoración, eventos...",
    categorySectionTitle: "Explora por Tipo de Evento",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Decoración única para tu evento especial",
      "Pedidos personalizados disponibles",
      "Los mejores precios del mercado",
    ],
    benefitItems: [
      { icon: "party-popper", title: "Eventos Únicos", description: "Hacemos tu celebración especial" },
      { icon: "truck", title: "Envío a Tiempo", description: "Coordinamos con tu fecha de evento" },
      { icon: "sparkles", title: "Personalizable", description: "Adaptamos colores y diseños" },
      { icon: "headphones", title: "Asesoría de Eventos", description: "Te ayudamos a planificar" },
    ],
    trendingTitle: "Los Más Elegidos",
    trendingSubtitle: "Las decoraciones más populares",
    newProductsTitle: "Nuevas Colecciones",
    newProductsSubtitle: "Novedades para tus próximas celebraciones",
    viewAllLabel: "Ver Todos los Artículos",
    navProductsLabel: "Artículos",
    navTrendingLabel: "Populares",
    navNewLabel: "Novedades",
  },

  ropa: {
    productLabel: "Prenda",
    productLabelPlural: "Prendas",
    categoryLabel: "Categoría",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar prendas, marcas, estilos...",
    categorySectionTitle: "Explora por Categoría",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Moda para todas las ocasiones",
      "Cambios y devoluciones fáciles",
      "Las mejores marcas a tu alcance",
    ],
    benefitItems: [
      { icon: "shirt", title: "Moda Premium", description: "Las mejores prendas y marcas" },
      { icon: "truck", title: "Envío Rápido", description: "Recibí tu compra sin demoras" },
      { icon: "refresh-cw", title: "Cambios Fáciles", description: "Política de cambio de 30 días" },
      { icon: "headphones", title: "Asesoramiento", description: "Te ayudamos con talle y estilo" },
    ],
    trendingTitle: "Tendencias de Temporada",
    trendingSubtitle: "Las prendas más elegidas",
    newProductsTitle: "Nueva Colección",
    newProductsSubtitle: "Recién llegadas a nuestra tienda",
    viewAllLabel: "Ver Toda la Colección",
    navProductsLabel: "Colección",
    navTrendingLabel: "Tendencias",
    navNewLabel: "Novedades",
  },

  general: {
    productLabel: "Producto",
    productLabelPlural: "Productos",
    categoryLabel: "Categoría",
    showCart: true,
    showTrending: true,
    showNewProducts: true,
    showCartAnimation: true,
    showBrandFilter: true,
    showShippingFilter: true,
    searchPlaceholder: "Buscar electrodomésticos, tecnología...",
    categorySectionTitle: "Explora por Categoría",
    marqueeItems: [
      "Envío gratis en pedidos superiores a {0}",
      "Electrodomésticos y tecnología al mejor precio",
      "Garantía oficial en todos los productos",
      "Cuotas sin interés disponibles",
      "Soporte técnico especializado",
    ],
    benefitItems: [
      { icon: "shield-check", title: "Garantía Oficial", description: "Todos los productos con garantía de fábrica", color: "#3b82f6" },
      { icon: "truck", title: "Envío Seguro", description: "Embalaje especial para tus equipos", color: "#8b5cf6" },
      { icon: "refresh-cw", title: "Devoluciones Fáciles", description: "30 días para cambiar de opinión", color: "#10b981" },
      { icon: "headphones", title: "Soporte Técnico", description: "Asesoramiento especializado en tecnología", color: "#f59e0b" },
    ],
    trendingTitle: "Más Vendidos",
    trendingSubtitle: "Los productos más elegidos de la semana",
    newProductsTitle: "Novedades",
    newProductsSubtitle: "Las últimas incorporaciones en tecnología y electrodomésticos",
    viewAllLabel: "Ver Todos los Productos",
    navProductsLabel: "Productos",
    navTrendingLabel: "Más Vendidos",
    navNewLabel: "Novedades",
  },
};

const DEFAULT_CONFIG: RubroUIConfig = {
  productLabel: "Producto",
  productLabelPlural: "Productos",
  categoryLabel: "Categoría",
  showCart: true,
  showTrending: true,
  showNewProducts: true,
  showCartAnimation: true,
  showBrandFilter: true,
  showShippingFilter: true,
  searchPlaceholder: "Buscar productos...",
  categorySectionTitle: "Explora por Categoría",
  marqueeItems: [
    "Envío Gratis en Pedidos Superiores a {0}",
    "Garantía de Devolución de 30 Días",
    "Soporte al Cliente 24/7",
    "Pago Seguro",
    "Descuentos Exclusivos para Miembros",
  ],
  benefitItems: [
    { icon: "truck", title: "Envío Gratis", description: "En pedidos superiores a {0}" },
    { icon: "shield-check", title: "Pago Seguro", description: "Transacciones 100% protegidas" },
    { icon: "refresh-cw", title: "Devoluciones Fáciles", description: "Política de devolución de 30 días" },
    { icon: "headphones", title: "Soporte 24/7", description: "Servicio al cliente dedicado" },
  ],
  trendingTitle: "Tendencias",
  trendingSubtitle: "Productos más populares de la semana",
  newProductsTitle: "Nuevos Productos",
  newProductsSubtitle: "Recién llegados a nuestra tienda",
  viewAllLabel: "Ver Todos los Productos",
  navProductsLabel: "Productos",
  navTrendingLabel: "Tendencias",
  navNewLabel: "Nuevos",
};

export function getRubroConfig(rubro: PublicConfig["rubro"]): RubroUIConfig {
  if (!rubro?.slug) return DEFAULT_CONFIG;

  // Respetar siempre cartEnabled del backend como source of truth
  const cartEnabled = rubro.cartEnabled ?? true;
  const overrides = RUBRO_CONFIGS[rubro.slug] ?? {};

  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    // El backend siempre manda cartEnabled, lo tomamos como autoridad
    showCart: cartEnabled,
    showCartAnimation: cartEnabled,
    // Usar productLabel del productFormConfig del backend si existe
    productLabel: rubro.productFormConfig?.productLabel ?? overrides.productLabel ?? DEFAULT_CONFIG.productLabel,
    productLabelPlural: overrides.productLabelPlural ?? DEFAULT_CONFIG.productLabelPlural,
    categoryLabel: rubro.productFormConfig?.categoryLabel ?? overrides.categoryLabel ?? DEFAULT_CONFIG.categoryLabel,
  };
}

export function useRubroConfig(): RubroUIConfig {
  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  return getRubroConfig(config?.rubro ?? null);
}
