import Link from 'next/link';
import SitePageShell, { LegalPageHero } from "../../components/Layout/SitePageShell";

export const metadata = {
    title: 'Warranty Policy | Mobile Hat',
    description: 'Learn about our warranty policy for electronics and gadgets purchased from Mobile Hat.',
};

export default function WarrantyPage() {
    return (
        <SitePageShell
            hero={
                <LegalPageHero
                    title="Warranty"
                    titleAccent="Policy"
                    subtitle="We stand behind every product we sell. Here's everything you need to know about our warranty coverage."
                />
            }
        >
            <div className="mx-auto max-w-3xl space-y-10">
                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">Warranty coverage</h2>
                    <p className="mb-4 leading-relaxed text-brand-muted">
                        All products sold through Mobile Hat come with the manufacturer's official warranty. The warranty period and coverage vary by product and brand. Warranty details are listed on each product page.
                    </p>
                    <ul className="list-disc space-y-2 pl-6 text-brand-muted">
                        <li>Smartphones: Typically 1 year manufacturer warranty</li>
                        <li>Laptops: Typically 1-2 years manufacturer warranty</li>
                        <li>Accessories: Typically 6 months to 1 year warranty</li>
                        <li>Extended warranty options may be available at checkout</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">What's covered</h2>
                    <ul className="list-disc space-y-2 pl-6 text-brand-muted">
                        <li>Manufacturing defects in materials and workmanship</li>
                        <li>Hardware failures under normal usage conditions</li>
                        <li>Software issues that are factory-related</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">What's not covered</h2>
                    <ul className="list-disc space-y-2 pl-6 text-brand-muted">
                        <li>Physical damage, water damage, or accidental drops</li>
                        <li>Damage caused by unauthorized modifications or repairs</li>
                        <li>Normal wear and tear</li>
                        <li>Damage caused by misuse or negligence</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">How to claim warranty</h2>
                    <ol className="list-decimal space-y-2 pl-6 text-brand-muted">
                        <li>Contact our support team via phone or email with your order details</li>
                        <li>Describe the issue you're experiencing</li>
                        <li>Our team will guide you through the warranty claim process</li>
                        <li>Ship the product to our service center or visit in person</li>
                        <li>We'll process the claim and repair/replace the product</li>
                    </ol>
                </section>

                <div className="border-t border-brand-gray-border/80 pt-8 text-center">
                    <p className="mb-4 text-sm text-brand-muted">Need to file a warranty claim?</p>
                    <Link
                        href="/contact"
                        className="inline-block rounded-xl bg-brand-navy px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                    >
                        Contact support
                    </Link>
                </div>
            </div>
        </SitePageShell>
    );
}
