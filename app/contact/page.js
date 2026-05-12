export const metadata = {
    title: 'Contact Us | Mobile Hat',
    description: 'Get in touch with Mobile Hat. We are here to help with orders, products, and support.',
};

import { MessageCircle, Headphones, Clock } from "lucide-react";
import SitePageShell, { LegalPageHero } from "../../components/Layout/SitePageShell";

export default function ContactPage() {
    return (
        <SitePageShell
            hero={
                <LegalPageHero
                    title="Contact"
                    titleAccent="Us"
                    subtitle="Have a question or need help? Reach out to us and we'll get back to you as soon as possible."
                />
            }
        >
            <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="space-y-8">
                        <div>
                            <h2 className="mb-6 text-xl font-black uppercase tracking-[0.1em] text-brand-navy md:text-2xl">Get in touch</h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        label: 'Contact',
                                        value: 'Use the form — we respond as soon as we can.',
                                        icon: MessageCircle,
                                    },
                                    {
                                        label: 'Support',
                                        value: 'Include your order ID if your question is about a purchase.',
                                        icon: Headphones,
                                    },
                                    {
                                        label: 'Hours',
                                        value: 'We read messages throughout the week.',
                                        icon: Clock,
                                    },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-start gap-4 rounded-2xl border border-brand-gray-border bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-gray-border bg-brand-paper text-brand-navy">
                                                <Icon className="size-5" strokeWidth={2} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">{item.label}</p>
                                                <p className="mt-1 font-semibold text-brand-navy">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-brand-gray-border bg-white p-6 shadow-[0_12px_40px_rgba(30,45,74,0.06)] md:p-8">
                        <h3 className="mb-6 text-lg font-black uppercase tracking-[0.1em] text-brand-navy">Send us a message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-muted">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 text-base text-brand-navy transition-all placeholder:text-brand-muted/70 focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-muted">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 text-base text-brand-navy transition-all placeholder:text-brand-muted/70 focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-muted">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="+880 XXXX XXXXXX"
                                    className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 text-base text-brand-navy transition-all placeholder:text-brand-muted/70 focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-brand-muted">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help you?"
                                    className="w-full resize-none rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 text-base text-brand-navy transition-all placeholder:text-brand-muted/70 focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-brand-navy py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                            >
                                Send message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </SitePageShell>
    );
}
