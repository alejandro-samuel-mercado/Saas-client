"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { configService } from "@/services/config";

export function DecorFooterCTA() {
    const { data: config } = useQuery({
        queryKey: ["publicConfig"],
        queryFn: configService.getPublicConfig,
        staleTime: 1000 * 60 * 60,
    });

    return (
        <section className="w-full bg-[#F0E5D8] flex flex-col items-center pt-24 pb-0 overflow-hidden relative">
            
            {/* The giant half-circle CTA */}
            <div className="w-full max-w-4xl bg-[#E1CDBF] rounded-t-full pt-20 pb-16 px-6 md:px-16 text-center mt-auto border-b-0">
                <h2 className="text-3xl md:text-4xl font-serif text-[#3A302A] mb-6">
                    Talk To Our Staff
                </h2>
                <p className="text-[#3A302A]/80 font-sans text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
                    Trouble choosing your bouquet? Talk to our friendly customer service who can help you along your journey to finding your dream bouquet. We are a team of passionate florists and believe that everyone has their right bouquet.
                </p>
                <Link 
                    href="/contact"
                    className="inline-block bg-[#F0E5D8] text-[#3A302A] hover:bg-[#3A302A] hover:text-[#F0E5D8] transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase py-4 px-10"
                >
                    Let&apos;s Talk
                </Link>
            </div>

            {/* Bottom divider line before footer */}
            <div className="w-full h-[1px] bg-[#3A302A]/10 mt-0"></div>
        </section>
    );
}
