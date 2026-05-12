import SitePageShell, { LegalPageHero } from "../../components/Layout/SitePageShell";

export const metadata = {
    title: 'Terms & Conditions | Mobile Hat',
    description: 'Read our terms and conditions, privacy policy, and usage guidelines for Mobile Hat.',
};

export default function TermsPage() {
    return (
        <SitePageShell
            hero={
                <LegalPageHero
                    title="Terms &"
                    titleAccent="Conditions"
                    subtitle="Please read these terms and conditions carefully before using our services."
                />
            }
        >
            <div className="mx-auto max-w-3xl space-y-10">
                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">1. General terms</h2>
                    <p className="leading-relaxed text-brand-muted">
                        By accessing and placing an order with Mobile Hat, you confirm that you agree to and are bound by the terms and conditions contained herein. These terms apply to the entire website and any email or other communication between you and Mobile Hat.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">2. Products & pricing</h2>
                    <ul className="list-disc space-y-2 pl-6 text-brand-muted">
                        <li>All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise</li>
                        <li>Prices are subject to change without prior notice</li>
                        <li>Product images are for illustration purposes and may differ slightly from the actual product</li>
                        <li>We reserve the right to limit order quantities</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">3. Orders & payment</h2>
                    <ul className="list-disc space-y-2 pl-6 text-brand-muted">
                        <li>All orders are subject to acceptance and availability</li>
                        <li>We accept Cash on Delivery, bank transfers, and mobile banking payments</li>
                        <li>We reserve the right to refuse or cancel any order for any reason</li>
                        <li>Order confirmation does not guarantee product availability</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">4. Delivery</h2>
                    <p className="leading-relaxed text-brand-muted">
                        We deliver across Bangladesh. Delivery times vary depending on your location and product availability. Estimated delivery times are provided at checkout. We are not responsible for delays caused by courier services or force majeure events.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">5. Privacy policy</h2>
                    <p className="leading-relaxed text-brand-muted">
                        We value your privacy. Personal information collected during the ordering process is used solely for order fulfillment and customer service. We do not sell or share your personal data with third parties except as necessary for order delivery and payment processing.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">6. Intellectual property</h2>
                    <p className="leading-relaxed text-brand-muted">
                        All content on this website, including but not limited to text, images, graphics, logos, and software, is the property of Mobile Hat or its content suppliers and is protected by intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">7. Limitation of liability</h2>
                    <p className="leading-relaxed text-brand-muted">
                        Mobile Hat shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products purchased through our platform.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-black uppercase tracking-[0.08em] text-brand-navy">8. Contact</h2>
                    <p className="leading-relaxed text-brand-muted">
                        If you have any questions about these Terms & Conditions, please visit our Contact Us page.
                    </p>
                </section>
            </div>
        </SitePageShell>
    );
}
