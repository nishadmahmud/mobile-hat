export const metadata = {
    title: 'Terms & Conditions | Applex',
    description: 'Read our terms and conditions, privacy policy, and usage guidelines for Applex.',
};

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-br from-brand-purple/10 via-purple-50 to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Terms & <span className="text-brand-purple">Conditions</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Please read these terms and conditions carefully before using our services.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        By accessing and placing an order with Applex, you confirm that you agree to and are bound by the terms and conditions contained herein. These terms apply to the entire website and any email or other communication between you and Applex.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Products & Pricing</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>All prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise</li>
                        <li>Prices are subject to change without prior notice</li>
                        <li>Product images are for illustration purposes and may differ slightly from the actual product</li>
                        <li>We reserve the right to limit order quantities</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders & Payment</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>All orders are subject to acceptance and availability</li>
                        <li>We accept Cash on Delivery, bank transfers, and mobile banking payments</li>
                        <li>We reserve the right to refuse or cancel any order for any reason</li>
                        <li>Order confirmation does not guarantee product availability</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Delivery</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We deliver across Bangladesh. Delivery times vary depending on your location and product availability. Estimated delivery times are provided at checkout. We are not responsible for delays caused by courier services or force majeure events.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacy Policy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We value your privacy. Personal information collected during the ordering process is used solely for order fulfillment and customer service. We do not sell or share your personal data with third parties except as necessary for order delivery and payment processing.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                    <p className="text-gray-600 leading-relaxed">
                        All content on this website, including but not limited to text, images, graphics, logos, and software, is the property of Applex or its content suppliers and is protected by intellectual property laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Applex shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or products purchased through our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you have any questions about these Terms & Conditions, please visit our Contact Us page.
                    </p>
                </section>
            </div>
        </div>
    );
}
