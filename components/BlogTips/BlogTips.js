import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

export default function BlogTips({ posts = [] }) {
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.1em] text-brand-navy">Guides & tips</h2>
                    <p className="text-brand-muted text-sm md:text-base mt-2 max-w-lg">Latest updates, buying guides, and care tips for your gadgets.</p>
                    <Link href="/blogs" className="mt-4 text-sm font-bold text-brand-navy hover:text-brand-yellow-bright inline-flex items-center gap-1 transition-colors">
                        All posts <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Blog grid — empty state keeps the band visible when there are no cards */}
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.id}`}
                                className="group rounded-2xl bg-white border border-brand-gray-border overflow-hidden hover:border-brand-yellow hover:shadow-md hover:shadow-brand-navy/10 transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-video relative bg-gray-100 overflow-hidden">
                                    <Image
                                        src={post.image || "/no-image.svg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>

                                <div className="p-5 md:p-6 flex flex-col justify-center flex-1">
                                    <h3 className="text-base md:text-lg font-bold text-brand-navy line-clamp-2 leading-snug group-hover:text-brand-yellow-bright transition-colors text-center">
                                        {post.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mx-auto max-w-md rounded-2xl border border-dashed border-brand-gray-border bg-brand-paper/80 px-6 py-10 text-center text-sm text-brand-muted">
                        New guides and tips will appear here soon. You can still browse the blog archive anytime.
                    </p>
                )}
            </div>
        </section>
    );
}
