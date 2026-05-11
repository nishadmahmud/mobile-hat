import { FiShield, FiTruck, FiAward, FiHeadphones } from 'react-icons/fi';

export default function TrustStats() {
    const pillars = [
        { icon: FiShield, label: "100% Authentic", sublabel: "Genuine devices only" },
        { icon: FiTruck, label: "Free Delivery", sublabel: "All over Bangladesh" },
        { icon: FiAward, label: "1 Year Warranty", sublabel: "Official guarantee" },
        { icon: FiHeadphones, label: "24/7 Support", sublabel: "Always here for you" },
    ];

    return (
        <section className="w-full bg-white border-b border-gray-100">
            <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-5 md:py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {pillars.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="flex items-center gap-3 md:gap-4 justify-center md:justify-start group">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/15 transition-colors">
                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-gray-900 text-xs md:text-sm font-bold leading-tight">{item.label}</p>
                                    <p className="text-gray-500 text-[10px] md:text-xs mt-0.5">{item.sublabel}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}