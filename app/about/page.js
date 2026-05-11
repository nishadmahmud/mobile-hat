import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'About Us | Applex',
    description: 'Learn about Applex — Bangladesh\'s premier destination for genuine tech gear, smart gadgets, and digital lifestyle accessories.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/store_img.jpg"
                        alt="Background"
                        fill
                        className="object-cover blur-sm"
                        priority
                    />
                </div>
                <div className="max-w-[1550px] mx-auto px-4 md:px-8 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-brand-purple/20 text-brand-purple text-xs font-bold rounded-full mb-4 border border-brand-purple/20">OUR STORY</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">About <span className="text-brand-purple">Applex</span></h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Bangladesh's premier destination for genuine tech gear, smart gadgets, and digital lifestyle accessories.
                    </p>
                </div>
            </div>

            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-24 md:space-y-32">

                {/* Who We Are Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
                            <span className="text-sm font-bold tracking-wider uppercase">Authenticity First</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Who We Are</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Applex is a leading electronics and gadget retailer in Bangladesh. We are passionate about bringing the latest technology to your doorstep at the most competitive prices. From smartphones and laptops to accessories and smart home devices, we curate only the best products from top global brands.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex-1 min-w-[160px]">
                                <span className="block text-2xl font-black text-brand-purple">100%</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Genuine Gear</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 flex-1 min-w-[160px]">
                                <span className="block text-2xl font-black text-brand-purple">Best</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Market Prices</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-purple/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                            <Image
                                src="/store_img.jpg"
                                alt="Applex Store Location"
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Customer Happiness Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 lg:order-1 group">
                        <div className="absolute -inset-4 bg-gradient-to-bl from-yellow-400/20 to-brand-purple/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] max-h-[600px] lg:max-h-none">
                            <Image
                                src="/happy customer.jpg"
                                alt="Happy Applex Customer"
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <div className="inline-block p-3 bg-purple-50 rounded-2xl text-brand-purple mb-2">
                            <span className="text-sm font-bold tracking-wider uppercase">Customer Experience</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Your Smile, Our Success</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our mission is to make premium technology accessible to everyone in Bangladesh. We believe that everyone deserves access to genuine, high-quality tech products with reliable after-sales support and warranty coverage.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We don't just sell gadgets; we build relationships. Every customer walk-in is a chance for us to show why Applex is the most trusted name in the industry.
                        </p>
                    </div>
                </section>

                {/* Built with Love Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block p-3 bg-red-50 rounded-2xl text-red-500 mb-2">
                            <span className="text-sm font-bold tracking-wider uppercase">Built with heart</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">A Community We Cherish</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            From the youngest tech enthusiasts to experienced professionals, we cater to every generation. Our interactions go beyond transactions—we love hearing your stories and helping you find the perfect companion for your digital lifestyle.
                        </p>
                        <div className="pt-4">
                            <blockquote className="border-l-4 border-brand-purple pl-6 py-2 italic text-gray-500 text-lg">
                                "Technology is most powerful when it empowers everyone, regardless of age."
                            </blockquote>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-br from-red-400/20 to-brand-purple/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] max-h-[600px] lg:max-h-none">
                            <Image
                                src="/cute_intaraction.jpg"
                                alt="Technology for everyone"
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Dedicated Team Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 lg:order-1 group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-purple/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] max-h-[600px] lg:max-h-none">
                            <Image
                                src="/employe.jpeg"
                                alt="Applex Team Expert"
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <div className="inline-block p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
                            <span className="text-sm font-bold tracking-wider uppercase">EXPERT SUPPORT</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Expert Support, Genuine Care</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our team is the heart of Applex. We don't just know gadgets; we understand how they fit into your life. Every member of our staff is trained to provide expert advice, ensuring you make the best choice for your needs.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Whether it's choosing your first smartwatch or setting up a professional workstation, we're here to guide you with technical expertise and a friendly smile.
                        </p>
                    </div>
                </section>

                {/* Core Values / Features Grid */}
                <section className="py-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Why Choose Applex?</h2>
                        <div className="w-24 h-2 bg-brand-purple mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: '100% Genuine Products', desc: 'Every product we sell is sourced directly from authorized distributors and manufacturers.', bg: 'bg-blue-50', text: 'text-blue-700' },
                            { title: 'Best Prices Guaranteed', desc: 'We offer competitive pricing with regular discounts, deals, and special promotions.', bg: 'bg-brand-purple/5', text: 'text-brand-purple' },
                            { title: 'Fast Delivery', desc: 'We deliver across Bangladesh with express shipping options available for urgent orders.', bg: 'bg-green-50', text: 'text-green-700' },
                            { title: 'After-Sales Support', desc: 'Our dedicated support team is always ready to help you with any queries or issues.', bg: 'bg-orange-50', text: 'text-orange-700' },
                        ].map((item, i) => (
                            <div key={i} className="group bg-white p-8 rounded-[2rem] border-2 border-gray-50 hover:border-brand-purple/20 hover:shadow-xl transition-all duration-300">
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                                    <span className={`${item.text} font-black text-xl`}>{i + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <div className="text-center bg-gray-50 rounded-[3rem] p-12 md:p-20 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-purple via-blue-600 to-purple-800"></div>
                    <p className="text-brand-purple font-black tracking-[0.2em] mb-4">WANT TO KNOW MORE?</p>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 max-w-2xl mx-auto">We're here to help you upgrade your digital world.</h2>
                    <Link href="/contact" className="inline-block bg-gray-900 text-white font-black px-12 py-5 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all shadow-2xl text-lg uppercase tracking-wider relative z-10">
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}
