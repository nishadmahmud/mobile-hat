export const metadata = {
    title: 'Contact Us | Applex',
    description: 'Get in touch with Applex. We are here to help you with your tech needs.',
};

import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-purple/10 via-purple-50 to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Contact <span className="text-brand-purple">Us</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Have a question or need help? Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                            <div className="space-y-5">
                                {[
                                    { label: 'Address', value: 'Shop: 4D-018B1, Block D, Level 4, Jamuna Future Park, Dhaka, Bangladesh, 1229', icon: <MapPin className="w-6 h-6" /> },
                                    { label: 'Phone', value: '01980-803060', icon: <Phone className="w-6 h-6" /> },
                                    { label: 'Working Hours', value: 'Sat - Thu: 10AM - 8PM', icon: <Clock className="w-6 h-6" /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-brand-purple bg-purple-100/50 p-2.5 rounded-lg border border-purple-100 flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="font-semibold text-gray-800">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-brand-purple" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-brand-purple" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                <input type="tel" placeholder="+880 XXXX XXXXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-brand-purple" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                                <textarea rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-brand-purple resize-none" />
                            </div>
                            <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
