"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { saveSalesOrder, getCouponList, applyCoupon } from "../../lib/api";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    Shield,
    Truck,
    User,
    Phone,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../components/Checkout/AddressSelect";

const courierOptions = [
    { id: "steadfast", name: "Steadfast", logo: "https://cdn.brandfetch.io/idVIARrbJa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1767913017056", scale: 1 },
    { id: "pathao", name: "Pathao", logo: "https://cdn.brandfetch.io/id7IYUlTKr/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1771516344575", scale: 1 },
    { id: "redx", name: "RedX", logo: "https://redx.com.bd/images/new-redx-logo.svg", scale: 1 },
    { id: "gogobangla", name: "Gogo Bangla", logo: "https://play-lh.googleusercontent.com/zZQ1U5hhpFE69BBlOwztaMjbMze-t0FTWmpwpgFAXQYdQpIFK5_znB7kqEBOUnzFExs", scale: 2.2 },
    { id: "sundarban", name: "Sundarban Courier", scale: 1 },
    { id: "saparibahan", name: "S.A Paribahan", logo: "https://www.satv.tv/wp-content/uploads/2021/09/SA-Paribahan-1.jpg", scale: 1.4 },
    { id: "postoffice", name: "Post Office", logo: "https://ecdn.dhakatribune.net/contents/cache/images/1200x630x1xxxxx1/uploads/dten/2020/04/bangladesh-post-office-1587482379713.gif", scale: 1.2 },
    { id: "dhl", name: "DHL (International)", logo: "https://cdn.brandfetch.io/idv0ZbfQqf/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667569261953", scale: 1 },
];

export default function CheckoutPage() {
    const { cartItems, getSubtotal, deliveryFee, updateDeliveryFee, clearCart } =
        useCart();

    const router = useRouter();
    const subTotal = getSubtotal();

    // Format price helper function
    const formatPrice = (amount) => {
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    // District & City state
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [selectedCourier, setSelectedCourier] = useState(courierOptions[0].id);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [isAccepted, setIsAccepted] = useState(false);

    const formRef = useRef(null);

    // Load saved details on mount
    useEffect(() => {
        const savedDetails = localStorage.getItem("mobile_hat_checkout_details");
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails);
                setFormData(prev => ({
                    ...prev,
                    firstName: parsed.firstName || prev.firstName,
                    phone: parsed.phone || prev.phone,
                    email: parsed.email || prev.email,
                    address: parsed.address || prev.address,
                }));
                if (parsed.district) setSelectedDistrict(parsed.district);
                if (parsed.city) setSelectedCity(parsed.city);
                if (parsed.courier) setSelectedCourier(parsed.courier);
            } catch (e) {
                console.error("Failed to parse saved checkout details", e);
            }
        }
    }, []);

    // Update delivery fee based on selection
    const updateDeliveryFeeCallback = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            updateDeliveryFee(0);
            return;
        }

        let fee = 130; // Default: Outside Dhaka

        if (
            selectedCity === "Demra" ||
            selectedCity?.includes("Savar") ||
            selectedDistrict === "Gazipur" ||
            selectedCity?.includes("Keraniganj")
        ) {
            fee = 90;
        } else if (selectedDistrict === "Dhaka") {
            fee = 70;
        } else {
            fee = 130;
        }
        updateDeliveryFee(fee);
    }, [selectedDistrict, selectedCity, updateDeliveryFee]);

    useEffect(() => {
        updateDeliveryFeeCallback();
    }, [updateDeliveryFeeCallback]);

    const grandTotal = subTotal + deliveryFee - couponDiscount;

    // Coupon handling
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await getCouponList(true);

            if (response.success && response.data) {
                const matchingCoupon = response.data.find(
                    coupon => coupon.coupon_code.toUpperCase() === couponCode.trim().toUpperCase()
                );

                if (matchingCoupon) {
                    const now = new Date();
                    const expireDate = new Date(matchingCoupon.expire_date);
                    expireDate.setHours(23, 59, 59, 999);

                    if (expireDate < now) {
                        setCouponError("This coupon has expired");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const usageLimit = parseInt(matchingCoupon.usage_limit, 10) || 0;
                    const usedCount = parseInt(matchingCoupon.used_count, 10) || 0;
                    if (usageLimit > 0 && usedCount >= usageLimit) {
                        setCouponError("This coupon usage limit has been reached");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const minOrderAmount = parseFloat(matchingCoupon.minimum_order_amount) || 0;
                    if (minOrderAmount > 0 && subTotal < minOrderAmount) {
                        setCouponError(`Minimum order amount is ${formatPrice(minOrderAmount)}`);
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const couponAmount = parseFloat(matchingCoupon.amount) || 0;
                    const amountLimit = parseFloat(matchingCoupon.amount_limit) || 0;
                    let discount = 0;

                    if (matchingCoupon.coupon_amount_type === "percentage") {
                        discount = Math.round(subTotal * (couponAmount / 100));
                    } else {
                        discount = couponAmount;
                    }

                    if (amountLimit > 0 && discount > amountLimit) {
                        discount = amountLimit;
                    }

                    discount = Math.min(discount, subTotal);

                    setCouponDiscount(discount);
                    setAppliedCoupon(matchingCoupon);
                    toast.success(`Coupon applied! You saved ${formatPrice(discount)}`);
                } else {
                    setCouponError("Invalid coupon code");
                    setCouponDiscount(0);
                    setAppliedCoupon(null);
                }
            } else {
                setCouponError("Unable to validate coupon");
                setCouponDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError("Failed to apply coupon");
            setCouponDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleCouponEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleApplyCoupon();
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDistrict || !selectedCity) {
            toast.error("Please select both District and Area");
            return;
        }

        if (!isAccepted) {
            toast.error("Please accept the Terms, Warranty, and Refund Policy to proceed.");
            return;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 11-digit Bangladeshi phone number");
            return;
        }

        setIsSubmitting(true);
        const selectedCourierObj = courierOptions.find((c) => c.id === selectedCourier) || courierOptions[0];
        const courierSuffix = ` (Courier - ${selectedCourierObj.name})`;

        // Save details to localStorage
        try {
            const detailsToSave = {
                firstName: formData.firstName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                district: selectedDistrict,
                city: selectedCity,
                courier: selectedCourier,
            };
            localStorage.setItem("mobile_hat_checkout_details", JSON.stringify(detailsToSave));
        } catch (error) {
            console.error("Failed to save checkout details to local storage", error);
        }

        const orderPayload = {
            pay_mode: paymentMethod,
            paid_amount: 0,
            user_id: process.env.NEXT_PUBLIC_USER_ID,
            sub_total: subTotal,
            vat: 0,
            tax: 0,
            discount: couponDiscount,
            product: cartItems.map((item) => ({
                product_id: item.id,
                qty: item.quantity,
                price: item.numericPrice,
                mode: 1,
                size: item.variants?.storage || "Free Size",
                sales_id: process.env.NEXT_PUBLIC_USER_ID,
            })),
            delivery_method_id: 1,
            delivery_info_id: 1,
            delivery_customer_name: formData.firstName,
            delivery_customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict}${courierSuffix}`,
            delivery_customer_phone: formData.phone,
            delivery_fee: deliveryFee,
            variants: [],
            imeis: [null],
            created_at: new Date().toISOString(),
            customer_name: formData.firstName,
            customer_phone: formData.phone,
            sales_id: process.env.NEXT_PUBLIC_USER_ID,
            wholeseller_id: 1,
            status: 1,
            delivery_city: selectedCity,
            delivery_district: selectedDistrict,
            detailed_address: `${formData.address}${courierSuffix}`,
            courier: selectedCourierObj.id,
            courier_name: selectedCourierObj.name,
        };

        try {
            if (appliedCoupon && couponCode) {
                try {
                    await applyCoupon(couponCode);
                } catch (couponError) {
                    console.warn("Error tracking coupon usage:", couponError);
                }
            }

            const response = await saveSalesOrder(orderPayload);

            if (response.success) {
                clearCart();
                toast.success("Order placed successfully!");
                const invoiceId = response.data?.invoice_id || response.invoice_id || "INV-" + Date.now();
                router.push(`/order-success?invoice=${invoiceId}`);
            } else {
                toast.error("Failed to place order. Please try again.");
                console.error("Order failed:", response);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-paper">
                <div className="text-center px-4">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-brand-gray-border bg-white">
                        <ShoppingBag className="h-12 w-12 text-brand-muted/60" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-brand-navy">
                        Your cart is empty
                    </h2>
                    <p className="mt-2 max-w-xs mx-auto text-brand-muted">
                        Add some products to your cart before checking out.
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-brand-navy px-8 py-3.5 font-bold text-white shadow-lg shadow-brand-navy/25 transition-colors hover:bg-brand-navy-deep"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-paper pb-20">
            <div className="border-b border-brand-gray-border bg-white py-8">
                <div className="mx-auto max-w-[1550px] px-4 md:px-8">
                    <h1 className="text-3xl font-black tracking-tight text-brand-navy">Checkout</h1>
                    <p className="mt-1 font-medium text-brand-muted">Complete your order by providing delivery and payment info.</p>
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-[1550px] px-4 md:px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-12">

                    {/* ═══ Left Column: Shipping & Payment ═══ */}
                    <div className="space-y-10">
                        {/* Delivery Address Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-brand-yellow/15 p-2 text-brand-navy">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-brand-navy">Delivery Address</h2>
                            </div>

                            <div className="rounded-2xl border border-brand-gray-border bg-white p-5">
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-navy">
                                    <Truck size={16} className="text-brand-yellow-bright" /> Estimated Delivery Time
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-brand-muted">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Inside Dhaka</span>
                                        <span className="font-bold text-brand-navy">1-3 Working Days</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Outside Dhaka</span>
                                        <span className="font-bold text-brand-navy">3-5 Working Days</span>
                                    </div>
                                </div>
                            </div>

                            <form id="checkout-form" ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-brand-muted">Full Name</label>
                                    <div className="group relative">
                                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-navy" />
                                        <input
                                            required
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 py-3 pl-12 pr-4 font-medium text-brand-navy transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-brand-muted">Phone Number</label>
                                    <div className="group relative">
                                        <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted transition-colors group-focus-within:text-brand-navy" />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full rounded-xl border bg-brand-paper/50 py-3 pl-12 pr-4 font-medium text-brand-navy transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-navy/10 ${formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone) ? "border-red-500" : "border-brand-gray-border focus:border-brand-navy"}`}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-brand-muted">Email (Optional)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 py-3 px-4 font-medium text-brand-navy transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <AddressSelect
                                        selectedDistrict={selectedDistrict}
                                        setSelectedDistrict={setSelectedDistrict}
                                        selectedCity={selectedCity}
                                        setSelectedCity={setSelectedCity}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-brand-muted">Detailed Address</label>
                                    <textarea
                                        required
                                        name="address"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House no, Flat, Road, Area..."
                                        className="w-full resize-none rounded-xl border border-brand-gray-border bg-brand-paper/50 p-4 font-medium text-brand-navy transition-all focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method Section */}
                        <div className="space-y-6 border-t border-brand-gray-border/80 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-brand-yellow/15 p-2 text-brand-navy">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-brand-navy">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className={`group relative flex cursor-pointer items-center rounded-2xl border-2 p-4 transition-all ${paymentMethod === "Cash" ? "border-brand-navy bg-brand-paper/80" : "border-brand-gray-border bg-white hover:border-brand-yellow/60"}`}>
                                    <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === "Cash"} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                                    <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${paymentMethod === "Cash" ? "border-brand-navy bg-brand-navy" : "border-brand-gray-border"}`}>
                                        {paymentMethod === "Cash" && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-brand-navy">Cash on Delivery</span>
                                        <span className="text-[11px] font-medium text-brand-muted">Pay when you receive the order</span>
                                    </div>
                                    <Truck className={`ml-auto h-6 w-6 transition-colors ${paymentMethod === "Cash" ? "text-brand-yellow-bright" : "text-brand-muted/40"}`} />
                                </label>

                                <div className="group relative flex items-center rounded-2xl border border-brand-gray-border bg-brand-paper/50 p-4 opacity-60">
                                    <div className="mr-4 h-5 w-5 rounded-full border-2 border-brand-gray-border"></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-brand-muted">Online Payment</span>
                                        <span className="mt-1 w-fit rounded-full bg-brand-gray-border px-2 py-0.5 text-[10px] font-bold text-brand-muted">COMING SOON</span>
                                    </div>
                                    <CreditCard className="ml-auto h-6 w-6 text-brand-muted/40" />
                                </div>
                            </div>
                        </div>

                        {/* Courier Section */}
                        <div className="space-y-6 border-t border-brand-gray-border/80 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-brand-yellow/15 p-2 text-brand-navy">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-brand-navy">Courier Service</h2>
                            </div>
                            <p className="-mt-2 text-sm text-brand-muted">Choose your preferred courier partner.</p>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {courierOptions.map((courier) => {
                                    const isSelected = selectedCourier === courier.id;
                                    return (
                                        <button
                                            key={courier.id}
                                            type="button"
                                            onClick={() => setSelectedCourier(courier.id)}
                                            className={`relative h-24 overflow-hidden rounded-2xl border bg-white transition-all ${isSelected
                                                ? "border-brand-navy shadow-sm ring-2 ring-brand-navy/15"
                                                : "border-brand-gray-border hover:border-brand-yellow/50"
                                                }`}
                                        >
                                            {isSelected && (
                                                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-navy text-[10px] text-white">
                                                    •
                                                </span>
                                            )}
                                            <div className="h-full w-full flex items-center justify-center px-3">
                                                {courier.logo ? (
                                                    <Image
                                                        src={courier.logo}
                                                        alt={courier.name}
                                                        width={140}
                                                        height={50}
                                                        className="object-contain max-h-[56px]"
                                                        style={{ transform: `scale(${courier.scale || 1})` }}
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <span className="text-center text-sm font-semibold text-brand-navy">{courier.name}</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Courier Partners - Brief */}
                        <div className="flex items-center gap-6 border-t border-brand-gray-border/80 pt-6 opacity-30 grayscale">
                            <span className="text-[10px] font-bold tracking-widest uppercase">Our Delivery Partners:</span>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-black italic">PATHAO</span>
                                <span className="text-[10px] font-black italic">STEADFAST</span>
                                <span className="text-[10px] font-black italic">REDX</span>
                            </div>
                        </div>
                    </div>

                    {/* ═══ Right Column: Order Summary ═══ */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="rounded-3xl border border-brand-gray-border bg-white p-6 shadow-2xl shadow-brand-navy/5">
                            <h3 className="mb-6 text-xl font-bold text-brand-navy">Order Summary</h3>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-brand-gray-border bg-brand-paper/50">
                                            <Image 
                                                src={item.imageUrl || item.image || "/no-image.svg"} 
                                                alt={item.name} 
                                                fill 
                                                className="object-contain p-2" 
                                                unoptimized 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="line-clamp-1 text-sm font-bold text-brand-navy">{item.name}</h4>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-brand-muted">Qty: {item.quantity}</span>
                                                <span className="text-[11px] font-black text-brand-navy">{formatPrice(item.numericPrice * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Section */}
                            <div className="mb-6 border-b border-brand-gray-border/80 pb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value);
                                            if (couponError) setCouponError("");
                                        }}
                                        onKeyDown={handleCouponEnter}
                                        placeholder="Coupon code"
                                        className="flex-1 rounded-xl border border-brand-gray-border bg-brand-paper/50 px-3 py-2 text-sm font-bold uppercase text-brand-navy transition-all placeholder:text-brand-muted focus:border-brand-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                    />
                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="rounded-xl px-4 py-2 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-navy-deep disabled:opacity-50"
                                        >
                                            {couponLoading ? "..." : "Apply"}
                                        </button>
                                    )}
                                </div>
                                {couponError && <p className="mt-2 text-[11px] font-bold text-red-500 ml-1">{couponError}</p>}
                                {appliedCoupon && (
                                    <p className="mt-2 text-[11px] font-bold text-green-600 ml-1">
                                        Coupon "{appliedCoupon.coupon_code}" Applied!
                                    </p>
                                )}
                            </div>

                            {/* Costs Breakdown */}
                            <div className="mb-8 space-y-3">
                                <div className="flex justify-between text-sm font-medium text-brand-muted">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-brand-navy">{formatPrice(subTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-brand-muted">
                                    <span>Delivery Charge</span>
                                    <span className="font-bold text-brand-navy">{formatPrice(deliveryFee)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm font-bold text-green-700">
                                        <span>Discount</span>
                                        <span>-{formatPrice(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex items-end justify-between border-t border-brand-gray-border/80 pt-4">
                                    <span className="text-base font-bold uppercase tracking-tight text-brand-navy">Total Bill</span>
                                    <span className="text-2xl font-black text-brand-navy">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Policies & Confirm */}
                            <div className="space-y-6">
                                <label className="flex items-start gap-3 cursor-pointer select-none group">
                                    <div className="relative mt-0.5">
                                        <input 
                                            type="checkbox" 
                                            checked={isAccepted} 
                                            onChange={(e) => setIsAccepted(e.target.checked)} 
                                            className="peer sr-only" 
                                        />
                                        <div className="h-5 w-5 rounded-md border-2 border-brand-gray-border transition-all peer-checked:border-brand-navy peer-checked:bg-brand-navy"></div>
                                        <CheckCircle2 className="absolute left-0 top-0 h-5 w-5 scale-0 p-0.5 text-white transition-all peer-checked:scale-100" />
                                    </div>
                                    <span className="text-xs font-medium leading-tight text-brand-muted">
                                        I agree to the <Link href="/terms" className="font-bold text-brand-navy hover:underline">Terms</Link>, <Link href="/warranty" className="font-bold text-brand-navy hover:underline">Warranty</Link> & <Link href="/refund" className="font-bold text-brand-navy hover:underline">Refund Policy</Link>
                                    </span>
                                </label>

                                <button 
                                    type="submit" 
                                    form="checkout-form" 
                                    disabled={isSubmitting} 
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-navy py-4 text-base font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-navy/25 transition-all hover:bg-brand-navy-deep active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? "Processing..." : "Confirm My Order"}
                                    {!isSubmitting && <ArrowRight size={20} />}
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 text-brand-muted opacity-60">
                                    <Shield size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
