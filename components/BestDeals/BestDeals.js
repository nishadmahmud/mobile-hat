import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';

export default function BestDeals({ deals = [] }) {
    return (
        <section className="w-full bg-white py-12 md:py-16 border-y border-brand-gray-border/60">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.12em] text-brand-navy md:tracking-[0.18em]">
                        Trending
                    </h2>
                    <p className="mt-2 text-sm text-brand-muted max-w-md">Top picks customers are adding to cart right now.</p>
                    <Link href="/special-offers" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                        View all deals <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-5">
                    {deals.map((deal) => (
                        <ProductCard key={deal.id} product={deal} />
                    ))}
                </div>
            </div>
        </section>
    );
}
