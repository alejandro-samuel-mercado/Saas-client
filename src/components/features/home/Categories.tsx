"use client";

import { useRubroConfig } from "@/hooks/useRubroConfig";
import { productService } from "@/services/products";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";

export function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const rubroConfig = useRubroConfig();

  const { data: config } = useQuery({
    queryKey: ["publicConfig"],
    queryFn: configService.getPublicConfig,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    productService.getCategoriesTree(config?.rubro?.slug).then((data) => {
      const filteredAndSorted = data
        .filter((cat: any) => cat._count?.products > 0)
        .sort((a: any, b: any) => (b._count?.products || 0) - (a._count?.products || 0))
        .slice(0, 8);
      setCategories(filteredAndSorted);
    });
  }, [config?.rubro?.slug]);

  const ctaLabel = rubroConfig.categoryLabel === "Categoría"
    ? "Ver Todas las Categorías"
    : `Ver Todos los ${rubroConfig.categoryLabel}s`;

  return (
    <section className="py-20 relative sm:bg-background/20 ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {rubroConfig.categorySectionTitle}
          </h2>
        </div>

        <div className="grid max-md:grid-cols-2  max-lg:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/products?categoria=${category.slug}`}
                className="group block relative aspect-[3/4] max-md:aspect-[1] rounded-2xl overflow-hidden soft-shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-secondary/40 to-accent/60 z-10 group-hover:opacity-90 transition-opacity" />
                <Image
                  src={`https://picsum.photos/seed/${category.slug}/400/600`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 p-6 z-20 text-white flex flex-col justify-end">
                  <h3 className="text-3xl max-md:text-xl font-bold mb-2 drop-shadow-lg break-words">
                    {category.name}
                  </h3>
                  <p className="text-sm drop-shadow font-medium opacity-90">
                    {category._count?.products || 0} {rubroConfig.productLabelPlural.toLowerCase()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
