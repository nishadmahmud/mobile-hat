import Link from 'next/link';
import { Store, Users, HeartHandshake, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'About Us | Mobile Hat',
    description:
        "Learn about Mobile Hat — genuine tech, smart gadgets, and accessories for your digital lifestyle.",
};

function VisualPanel({ children, className = '' }) {
    return (
        <div
            className={`relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-deep to-brand-navy" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,92,0.35),transparent_50%)]" />
            <div className="relative flex min-h-[280px] items-center justify-center p-10 md:min-h-[320px]">
                {children}
            </div>
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-brand-paper">
            <div className="relative overflow-hidden bg-brand-navy py-20 md:py-24">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,92,0.2),transparent_55%)]" aria-hidden />
                <div className="absolute inset-0 bg-brand-navy/90" aria-hidden />
                <div className="relative z-10 mx-auto max-w-[1550px] px-4 text-center md:px-8">
                    <span className="mb-4 inline-block rounded-full border border-brand-yellow/40 bg-brand-yellow/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-yellow-bright">
                        Our story
                    </span>
                    <h1 className="mb-6 text-4xl font-black uppercase tracking-[0.06em] text-white md:text-6xl md:tracking-[0.08em]">
                        About <span className="text-brand-yellow-bright">Mobile Hat</span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/85 md:text-xl">
                        Your destination for genuine tech gear, smart gadgets, and digital lifestyle accessories.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1550px] space-y-20 px-4 py-16 md:space-y-28 md:px-8 md:py-24">
                <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="mb-2 inline-block rounded-2xl border border-brand-gray-border bg-brand-paper px-3 py-2">
                            <span className="text-xs font-black uppercase tracking-widest text-brand-navy">Authenticity first</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-brand-navy md:text-4xl">Who we are</h2>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            We are an electronics and gadget retailer focused on bringing reliable technology to you at fair prices. From smartphones and laptops to accessories and smart home devices, we curate products from trusted global brands.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="min-w-[160px] flex-1 rounded-2xl border border-brand-gray-border bg-white px-6 py-4 shadow-sm">
                                <span className="block text-2xl font-black text-brand-navy">100%</span>
                                <span className="text-xs font-black uppercase tracking-widest text-brand-muted">Genuine gear</span>
                            </div>
                            <div className="min-w-[160px] flex-1 rounded-2xl border border-brand-gray-border bg-white px-6 py-4 shadow-sm">
                                <span className="block text-2xl font-black text-brand-navy">Best</span>
                                <span className="text-xs font-black uppercase tracking-widest text-brand-muted">Market prices</span>
                            </div>
                        </div>
                    </div>
                    <div className="group relative">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand-navy/15 to-brand-yellow/15 opacity-70 blur-2xl transition duration-700 group-hover:opacity-100" />
                        <VisualPanel>
                            <Store className="h-28 w-28 text-brand-yellow-bright/90 md:h-32 md:w-32" strokeWidth={1.25} aria-hidden />
                        </VisualPanel>
                    </div>
                </section>

                <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="relative order-2 group lg:order-1">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-bl from-brand-yellow/20 to-brand-navy/15 opacity-60 blur-2xl transition duration-700 group-hover:opacity-100" />
                        <VisualPanel>
                            <HeartHandshake className="h-28 w-28 text-brand-yellow-bright/90 md:h-32 md:w-32" strokeWidth={1.25} aria-hidden />
                        </VisualPanel>
                    </div>
                    <div className="order-1 space-y-6 lg:order-2">
                        <div className="mb-2 inline-block rounded-2xl border border-brand-gray-border bg-brand-paper px-3 py-2">
                            <span className="text-xs font-black uppercase tracking-widest text-brand-navy">Customer experience</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-brand-navy md:text-4xl">Your satisfaction, our priority</h2>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            Our mission is to make quality technology accessible. We believe everyone deserves genuine products with dependable after-sales support and warranty coverage.
                        </p>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            We don&apos;t just sell gadgets; we build relationships. Every interaction is a chance to earn your trust with honest advice and dependable service.
                        </p>
                    </div>
                </section>

                <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="mb-2 inline-block rounded-2xl border border-brand-gray-border bg-brand-paper px-3 py-2">
                            <span className="text-xs font-black uppercase tracking-widest text-brand-navy">Built with care</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-brand-navy md:text-4xl">A community we value</h2>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            From first-time buyers to power users, we aim to serve every customer with respect. We enjoy helping you find the right device for work, study, and everyday life.
                        </p>
                        <div className="pt-4">
                            <blockquote className="border-l-4 border-brand-navy py-2 pl-6 text-lg italic text-brand-muted">
                                &quot;Technology is most powerful when it empowers everyone, regardless of experience.&quot;
                            </blockquote>
                        </div>
                    </div>
                    <div className="group relative">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-navy/15 to-brand-yellow/15 opacity-60 blur-2xl transition duration-700 group-hover:opacity-100" />
                        <VisualPanel>
                            <Sparkles className="h-28 w-28 text-brand-yellow-bright/90 md:h-32 md:w-32" strokeWidth={1.25} aria-hidden />
                        </VisualPanel>
                    </div>
                </section>

                <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="relative order-2 group lg:order-1">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand-navy/15 to-brand-yellow/15 opacity-60 blur-2xl transition duration-700 group-hover:opacity-100" />
                        <VisualPanel>
                            <Users className="h-28 w-28 text-brand-yellow-bright/90 md:h-32 md:w-32" strokeWidth={1.25} aria-hidden />
                        </VisualPanel>
                    </div>
                    <div className="order-1 space-y-6 lg:order-2">
                        <div className="mb-2 inline-block rounded-2xl border border-brand-gray-border bg-brand-paper px-3 py-2">
                            <span className="text-xs font-black uppercase tracking-widest text-brand-navy">Expert support</span>
                        </div>
                        <h2 className="text-3xl font-black leading-tight text-brand-navy md:text-4xl">Expert support, genuine care</h2>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            Our team is here to help you choose with confidence. We focus on clear guidance so you get the right product for your budget and needs.
                        </p>
                        <p className="text-lg leading-relaxed text-brand-muted">
                            Whether it&apos;s your first smartwatch or a full workstation setup, we&apos;re ready to help with practical advice and a friendly experience.
                        </p>
                    </div>
                </section>

                <section className="py-12">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-black tracking-tight text-brand-navy md:text-5xl">Why shop with us?</h2>
                        <div className="mx-auto h-1.5 w-24 rounded-full bg-brand-yellow" />
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: '100% Genuine Products',
                                desc: 'Products sourced through authorized channels whenever applicable, with clear warranty information.',
                                tone: 'bg-brand-paper text-brand-navy',
                            },
                            {
                                title: 'Competitive Pricing',
                                desc: 'Fair pricing with regular promotions and seasonal deals.',
                                tone: 'bg-brand-navy/5 text-brand-navy',
                            },
                            {
                                title: 'Delivery nationwide',
                                desc: 'Shipping options across Bangladesh, with express choices where available.',
                                tone: 'bg-brand-paper text-brand-navy',
                            },
                            {
                                title: 'After-sales support',
                                desc: 'Our support team is here to help with order and product questions.',
                                tone: 'bg-brand-paper text-brand-navy',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group rounded-[2rem] border-2 border-brand-gray-border bg-white p-8 transition-all duration-300 hover:border-brand-navy/30 hover:shadow-xl"
                            >
                                <div
                                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-gray-border transition duration-300 group-hover:scale-110 ${item.tone}`}
                                >
                                    <span className="text-xl font-black">{i + 1}</span>
                                </div>
                                <h3 className="mb-4 text-xl font-bold leading-tight text-brand-navy">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-brand-muted">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="relative overflow-hidden rounded-[2rem] border border-brand-gray-border bg-white p-12 text-center shadow-[0_12px_40px_rgba(30,45,74,0.08)] md:p-20">
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-brand-navy via-brand-yellow to-brand-navy-deep" />
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-brand-navy">Want to know more?</p>
                    <h2 className="mx-auto mb-8 max-w-2xl text-3xl font-black text-brand-navy md:text-5xl">
                        We&apos;re here to help you upgrade your digital world.
                    </h2>
                    <Link
                        href="/contact"
                        className="relative z-10 inline-block rounded-2xl bg-brand-navy px-12 py-5 text-lg font-black uppercase tracking-wider text-white shadow-xl shadow-brand-navy/30 transition-colors hover:bg-brand-navy-deep active:scale-[0.98]"
                    >
                        Get in touch
                    </Link>
                </div>
            </div>
        </div>
    );
}
