import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanners({ banners = [] }) {
    if (!banners || banners.length === 0) return null;

    const isSingle = banners.length === 1;

    return (
        <section className="w-full bg-brand-paper pb-10 md:pb-14 pt-2 border-b border-brand-gray-border/40">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                <div className={`grid gap-4 md:gap-8 ${isSingle ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {banners.map((banner, idx) => (
                        <Link
                            key={banner.id || idx}
                            href={banner.link || '#'}
                            className={`relative overflow-hidden rounded-[2rem] group shadow-2xl shadow-brand-navy/10 border border-brand-gray-border bg-white transition-all duration-500 hover:shadow-brand-navy/15 hover:-translate-y-1 ${
                                isSingle ? 'aspect-[21/9] md:aspect-[25/7]' : 'aspect-[16/9] md:aspect-[4/3] lg:aspect-[21/9]'
                            }`}
                        >
                            {banner.image && banner.image !== "/no-image.svg" ? (
                                <Image
                                    src={banner.image}
                                    alt={banner.title || 'Special Promotion'}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    unoptimized
                                />
                            ) : (
                                <div className={`w-full h-full flex flex-col justify-center p-8 md:p-12 ${
                                    idx % 2 === 0 
                                    ? 'bg-gradient-to-br from-[#1d1d1f] to-[#434345]' 
                                    : 'bg-gradient-to-br from-brand-navy to-brand-navy-deep'
                                }`}>
                                    <span className="text-white/60 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] mb-3">Limited Offer</span>
                                    <h3 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-md">
                                        {banner.title || 'Upgrade Your Digital Life'}
                                    </h3>
                                    <div className="mt-6 md:mt-8">
                                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[12px] md:text-[14px] font-black rounded-full hover:bg-gray-100 transition-colors">
                                            Learn More
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {/* Subtle Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
