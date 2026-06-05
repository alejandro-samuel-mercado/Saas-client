"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { DecorProductCard } from "./DecorProductCard";
import Link from "next/link";
import { Product } from "@/types";

export function DecorPopular() {
    // Fetch products
    const { data } = useQuery({
        queryKey: ["products", "popular"],
        queryFn: () => productService.getProducts({ page: 1, limit: 4 }),
        staleTime: 1000 * 60 * 5,
    });

    const products: Product[] = data?.data || [];

    return (
        <section className="w-full bg-[#F0E5D8] py-24 border-t border-[#3A302A]/10">
            <div className="container mx-auto px-6 lg:px-12">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs tracking-[0.2em] text-[#3A302A]/60 uppercase mb-4 font-sans">
                        Dried Flower Collection
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#3A302A]">
                        See What&apos;s Popular
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <DecorProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        // Skeleton/Fallback if no products
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse flex flex-col gap-4">
                                <div className="w-full aspect-[4/5] bg-[#E1CDBF]/30" />
                                <div className="h-6 w-2/3 bg-[#E1CDBF]/30" />
                                <div className="h-4 w-1/3 bg-[#E1CDBF]/30" />
                            </div>
                        ))
                    )}
                </div>

                {/* View All Button */}
                <div className="mt-16 text-center">
                    <Link 
                        href="/products"
                        className="inline-block border border-[#3A302A] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-10"
                    >
                        View All Collection
                    </Link>
                </div>

            </div>
        </section>
    );
}
