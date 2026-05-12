import SitePageShell, { LegalPageHero } from "../../components/Layout/SitePageShell";

export const metadata = {
    title: "Privacy Policy | Mobile Hat",
    description: "Mobile Hat privacy policy — how we collect, use, and protect your personal information.",
};

const sections = [
    {
        title: "1. Information We Collect",
        content: [
            "**Personal Information:** When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment information.",
            "**Device Information:** We automatically collect information about the device and browser you use to access our website, including your IP address, browser type, operating system, and referring URLs.",
            "**Order Information:** Details of products you purchase, installation or maintenance services you request, order history, and delivery preferences.",
            "**Communication Data:** Records of correspondence when you contact our support team via email, phone, or social media.",
        ],
    },
    {
        title: "2. How We Use Your Information",
        content: [
            "To process and fulfill your orders and installation service requests.",
            "To communicate with you about your orders, deliveries, and service updates.",
            "To create and manage your customer account.",
            "To provide customer support and respond to inquiries.",
            "To send promotional offers, discounts, and newsletters (with your consent).",
            "To improve our website, products, and services based on usage patterns.",
            "To detect and prevent fraud or unauthorized activities.",
        ],
    },
    {
        title: "3. Information Sharing",
        content: [
            "We do **not** sell, trade, or rent your personal information to third parties.",
            "We may share your information with trusted delivery partners (e.g., Pathao, Steadfast) solely for order fulfillment.",
            "We may share information with payment processors to complete transactions securely.",
            "We may disclose information if required by law, regulation, or legal process.",
        ],
    },
    {
        title: "4. Data Security",
        content: [
            "We implement industry-standard security measures to protect your personal information.",
            "All payment transactions are encrypted using SSL/TLS technology.",
            "Access to personal data is restricted to authorized employees only.",
            "While we strive to protect your information, no method of electronic transmission is 100% secure.",
        ],
    },
    {
        title: "5. Cookies",
        content: [
            "We use cookies and similar technologies to enhance your browsing experience.",
            "Cookies help us remember your preferences, keep you logged in, and understand how you use our site.",
            "You can modify your browser settings to decline cookies, though some features may not function properly.",
        ],
    },
    {
        title: "6. Your Rights",
        content: [
            "You have the right to access, update, or delete your personal information through your account settings.",
            "You may opt out of marketing communications at any time by unsubscribing from our emails.",
            "You may request a copy of the data we hold about you by contacting us through the Contact page on this website.",
        ],
    },
    {
        title: "7. Changes to This Policy",
        content: [
            "We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date.",
            "Continued use of our website after changes constitutes acceptance of the updated policy.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <SitePageShell
            hero={
                <LegalPageHero
                    eyebrow={
                        <span className="inline-block rounded-full border border-brand-gray-border bg-brand-paper px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-navy">
                            Legal
                        </span>
                    }
                    title="Privacy Policy"
                    subtitle="Last updated: February 2026"
                />
            }
        >
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-brand-gray-border bg-white p-6 shadow-[0_12px_40px_rgba(30,45,74,0.06)] md:p-10">
                    <p className="mb-8 text-sm leading-relaxed text-brand-muted">
                        At Mobile Hat, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                    </p>

                    <div className="space-y-8">
                        {sections.map((section, i) => (
                            <div key={i}>
                                <h2 className="mb-3 text-base font-black uppercase tracking-[0.06em] text-brand-navy md:text-lg">{section.title}</h2>
                                <ul className="space-y-2">
                                    {section.content.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-brand-muted">
                                            <span className="mt-1.5 flex-shrink-0 font-black text-brand-navy">•</span>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-navy">$1</strong>'),
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 rounded-xl border border-brand-gray-border bg-brand-paper/80 p-5">
                        <p className="text-sm text-brand-muted">
                            If you have any questions about this Privacy Policy, please contact us through our Contact Us page or call{" "}
                            <a href="tel:01980803060" className="font-semibold text-brand-navy underline-offset-2 hover:underline">
                                01980-803060
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </SitePageShell>
    );
}
