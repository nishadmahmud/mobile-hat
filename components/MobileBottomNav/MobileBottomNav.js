"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome, MdViewList, MdShoppingCart, MdLocalOffer, MdPerson } from "react-icons/md";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount, toggleCart, closeCart } = useCart();
    const { user, openAuthModal } = useAuth();
    const router = useRouter();

    const handleProfileClick = (e) => {
        if (e) e.preventDefault();
        closeCart();
        if (user) {
            router.push("/profile");
        } else {
            openAuthModal("login");
        }
    };

    const navItems = [
        { Icon: MdHome, label: "Home", path: "/", onClick: closeCart },
        { Icon: MdViewList, label: "Shop", path: "/categories", onClick: closeCart },
        { Icon: MdShoppingCart, label: "Cart", path: null, badge: cartCount, onClick: toggleCart },
        { Icon: MdLocalOffer, label: "Offers", path: "/offers", onClick: closeCart },
        { Icon: MdPerson, label: "Account", path: null, onClick: handleProfileClick },
    ];

    return (
        <nav
            className="pointer-events-none fixed bottom-0 left-0 right-0 z-[60] md:hidden"
            aria-label="Primary mobile"
        >
            <div className="pointer-events-auto border-t border-brand-gray-border/90 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(30,45,74,0.08)] backdrop-blur-xl">
                <div className="mx-auto h-1 w-[40%] max-w-[200px] rounded-full bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-90" aria-hidden />

                <div className="grid grid-cols-5 px-1 pt-1">
                    {navItems.map((item) => {
                        const { Icon } = item;
                        const isOffers = item.label === "Offers";

                        const isActive = item.path
                            ? pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
                            : item.label === "Account" && pathname === "/profile";

                        const iconTone = isActive
                            ? "text-brand-navy scale-105"
                            : isOffers
                              ? "text-brand-yellow drop-shadow-[0_0_6px_rgba(255,178,51,0.45)]"
                              : "text-brand-muted";

                        const inner = (
                            <>
                                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors">
                                    {isActive && (
                                        <span
                                            className="absolute inset-0 rounded-xl bg-brand-cream/90 ring-1 ring-brand-yellow/50"
                                            aria-hidden
                                        />
                                    )}
                                    <Icon
                                        className={`relative z-10 text-[22px] transition-transform ${iconTone}`}
                                        aria-hidden
                                    />
                                    {item.badge > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 z-20 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-brand-navy px-0.5 text-[8px] font-black text-brand-yellow ring-2 ring-white">
                                            {item.badge > 9 ? "9+" : item.badge}
                                        </span>
                                    )}
                                </span>
                                <span
                                    className={`mt-0.5 max-w-[4.5rem] truncate text-[9px] font-bold uppercase tracking-wide ${isActive ? "text-brand-navy" : "text-brand-muted"}`}
                                >
                                    {item.label}
                                </span>
                            </>
                        );

                        if (item.path) {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.path}
                                    onClick={item.onClick}
                                    className="flex flex-col items-center justify-center py-2 active:scale-[0.98]"
                                    aria-label={item.label}
                                >
                                    {inner}
                                </Link>
                            );
                        }

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={item.onClick}
                                className="flex flex-col items-center justify-center py-2 active:scale-[0.98]"
                                aria-label={item.label}
                            >
                                {inner}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
