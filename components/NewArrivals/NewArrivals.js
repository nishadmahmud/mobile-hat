import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/PremiumProductCard';

export default function NewArrivals({ products = [] }) {
    return (
        <section className="w-full bg-brand-paper py-12 md:py-16 border-b border-brand-gray-border/50">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.12em] text-brand-navy md:tracking-[0.18em]">
                            New arrival
                        </h2>
                        <span className="rounded-full bg-brand-yellow px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-navy">
                            New
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-brand-muted max-w-md">Fresh stock — verified listings and fast dispatch.</p>
                    <Link href="/categories" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-navy hover:text-brand-yellow-bright transition-colors">
                        View all <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5">
                    {products.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
