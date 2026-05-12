"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCustomerOrders, getCustomerCoupons, trackOrder, uploadSingleFile } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Home, Package, Heart, Tag, User, LogOut, ChevronDown, Clock, CheckCircle, Truck, PackageCheck, XCircle, CheckCircle2, PauseCircle, ClipboardList, MapPin, X, Camera, Edit3, Search } from "lucide-react";

const timelineStages = [
    { id: 1, label: "Order Received", icon: ClipboardList },
    { id: 2, label: "Confirmed", icon: PackageCheck },
    { id: 3, label: "Processing", icon: Truck },
    { id: 4, label: "Delivered", icon: Home },
];

const ORDER_TABS = [
    { id: "1", label: "Processing", Icon: Clock },
    { id: "2", label: "Confirmed", Icon: CheckCircle },
    { id: "3", label: "Delivering", Icon: Truck },
    { id: "4", label: "Delivered", Icon: PackageCheck },
    { id: "5", label: "Canceled", Icon: XCircle },
];

const OrderTimeline = ({ currentStatus }) => {
    const status = Number(currentStatus);
    return (
        <div className="px-2 py-4">
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-brand-gray-border" />
                    <div
                        className="absolute left-0 top-5 h-1 rounded-full bg-gradient-to-r from-brand-navy to-brand-yellow-bright transition-all duration-500"
                        style={{ width: `${((Math.min(status, 4) - 1) / 3) * 100}%` }}
                    />
                    {timelineStages.map((stage) => {
                        const isCompleted = status >= stage.id;
                        const isCurrent = status === stage.id;
                        const StageIcon = stage.icon;
                        return (
                            <div key={stage.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white shadow-lg shadow-brand-navy/25"
                                            : "border-2 border-brand-gray-border bg-white text-brand-muted"
                                    } ${isCurrent ? "scale-110 ring-4 ring-brand-yellow/40" : ""}`}
                                >
                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-medium">{stage.id}</span>}
                                </div>
                                <div className={`mt-3 flex flex-col items-center ${isCompleted ? "text-brand-navy" : "text-brand-muted"}`}>
                                    <StageIcon className={`mb-1 h-5 w-5 ${isCompleted ? "text-brand-yellow-bright" : ""}`} />
                                    <span className={`max-w-[80px] text-center text-xs font-medium ${isCurrent ? "font-bold" : ""}`}>{stage.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-3 sm:hidden">
                {timelineStages.map((stage, index) => {
                    const isCompleted = status >= stage.id;
                    const isCurrent = status === stage.id;
                    const StageIcon = stage.icon;
                    const isLast = index === timelineStages.length - 1;
                    return (
                        <div key={stage.id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white"
                                            : "border-2 border-brand-gray-border bg-white text-brand-muted"
                                    } ${isCurrent ? "ring-2 ring-brand-yellow/50" : ""}`}
                                >
                                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{stage.id}</span>}
                                </div>
                                {!isLast && <div className={`h-6 w-0.5 ${isCompleted ? "bg-brand-navy" : "bg-brand-gray-border"}`} />}
                            </div>
                            <div className={`flex items-center gap-2 pt-1 ${isCompleted ? "text-brand-navy" : "text-brand-muted"}`}>
                                <StageIcon className={`h-4 w-4 ${isCompleted ? "text-brand-yellow-bright" : ""}`} />
                                <span className={`text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>{stage.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function ProfileDashboard() {
    const { user, logout, loading, token, updateProfile } = useAuth();
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [activeOrderTab, setActiveOrderTab] = useState("1");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", first_name: "", last_name: "", email: "", mobile_number: "", address: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    const [trackInvoiceId, setTrackInvoiceId] = useState("");
    const [trackOrderData, setTrackOrderData] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!loading && !user) router.push("/");
        else if (user) {
            let first = user.first_name || "";
            let last = user.last_name || "";
            if (!first && user.name) { const parts = user.name.split(" "); first = parts[0]; last = parts.slice(1).join(" "); }
            setFormData({ id: user.id || user.customer_id, first_name: first, last_name: last, email: user.email || "", mobile_number: user.mobile_number || user.phone || "", address: user.address || "" });
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !token || activeSection !== "orders") return;
            setOrdersLoading(true);
            try {
                const customerId = user.id || user.customer_id;
                const data = await getCustomerOrders(token, customerId, activeOrderTab);
                if (data.success) { let list = data.data?.data || data.data || []; setOrders(Array.isArray(list) ? list : []); }
                else setOrders([]);
            } catch { setOrders([]); }
            finally { setOrdersLoading(false); }
        };
        fetchOrders();
    }, [user, token, activeSection, activeOrderTab]);

    useEffect(() => {
        const fetchCoupons = async () => {
            if (!user || activeSection !== "coupons") return;
            setCouponsLoading(true);
            try {
                const data = await getCustomerCoupons(user.id || user.customer_id);
                if (data.success && data.data) setCoupons(Array.isArray(data.data) ? data.data : []);
                else setCoupons([]);
            } catch { setCoupons([]); }
            finally { setCouponsLoading(false); }
        };
        fetchCoupons();
    }, [user, activeSection]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            let imageUrl = user?.image || null;
            if (profileImage) {
                const imageFormData = new FormData();
                imageFormData.append("file_name", profileImage);
                imageFormData.append("user_id", String(process.env.NEXT_PUBLIC_USER_ID));
                const uploadRes = await uploadSingleFile(imageFormData, token);
                if (uploadRes?.success && uploadRes?.path) imageUrl = uploadRes.path;
                else { toast.error("Failed to upload image"); setIsUpdating(false); return; }
            }
            const result = await updateProfile({ id: formData.id, first_name: formData.first_name, last_name: formData.last_name, email: formData.email, phone: formData.mobile_number, address: formData.address, image: imageUrl });
            if (result.success) { toast.success("Profile updated!"); setIsEditing(false); setProfileImage(null); setProfileImagePreview(null); }
            else toast.error(result.message || "Failed to update");
        } catch { toast.error("Something went wrong"); }
        finally { setIsUpdating(false); }
    };

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!trackInvoiceId.trim()) { toast.error("Enter Invoice ID"); return; }
        setTrackLoading(true); setTrackOrderData(null);
        try {
            const response = await trackOrder({ invoice_id: trackInvoiceId });
            if (response.success && response.data?.data?.length > 0) { setTrackOrderData(response.data.data[0]); toast.success("Order found!"); }
            else { toast.error("Order not found"); }
        } catch { toast.error("Something went wrong"); }
        finally { setTrackLoading(false); }
    };

    const getStatusLabel = (s) => { s = Number(s); if (s === 1) return "Order Received"; if (s === 2) return "Confirmed"; if (s === 3) return "Processing"; if (s === 4) return "Delivered"; if (s === 5) return "Canceled"; if (s === 6) return "On Hold"; return "Pending"; };
    const getStatusColor = (s) => {
        s = Number(s);
        if (s === 1) return "border-brand-gray-border bg-brand-paper text-brand-navy";
        if (s === 2) return "border-brand-gray-border bg-brand-paper text-brand-navy";
        if (s === 3) return "border-brand-yellow/60 bg-brand-paper text-brand-navy";
        if (s === 4) return "border-green-200 bg-green-50 text-green-800";
        if (s === 5) return "border-red-200 bg-red-50 text-red-800";
        if (s === 6) return "border-amber-200 bg-amber-50 text-amber-900";
        return "border-brand-gray-border bg-brand-paper text-brand-muted";
    };

    if (loading || !user) {
        return (<div className="flex min-h-screen items-center justify-center bg-brand-paper"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-brand-navy"></div></div>);
    }

    const userName = user.first_name || user.name?.split(" ")[0] || "User";

    const sidebarItems = [
        { id: "dashboard", label: "Overview", icon: <Home className="w-4 h-4" /> },
        { id: "orders", label: "My Orders", icon: <Package className="w-4 h-4" />, group: "Orders" },
        { id: "tracking", label: "Track Order", icon: <Search className="w-4 h-4" /> },
        { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" />, group: "Credits" },
        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" />, group: "Account" },
    ];

    const handleNavClick = (id) => { setActiveSection(id); setSidebarOpen(false); };

    return (
        <div className="min-h-screen bg-brand-paper pb-20 pt-4 md:pb-6 md:pt-6">
            {sidebarOpen && <div className="fixed inset-0 z-[65] bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <div className="mx-auto max-w-[1550px] px-4 py-4 md:px-8 md:py-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4 flex items-center gap-2 rounded-lg border border-brand-gray-border bg-white px-4 py-2.5 shadow-sm hover:bg-brand-paper/80 lg:hidden">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    <span className="font-medium text-sm">Menu</span>
                </button>

                <div className="flex gap-6 items-start">
                    {/* Sidebar */}
                    <aside className={`fixed lg:static top-0 left-0 w-72 bg-white z-[70] lg:z-auto transform lg:transform-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:block flex-shrink-0 h-screen lg:h-auto`}>
                        <div className="bg-white lg:rounded-2xl shadow-lg lg:sticky lg:top-24 h-full lg:h-auto flex flex-col overflow-hidden">
                            <div className="flex flex-shrink-0 items-center justify-between bg-gradient-to-r from-brand-navy to-brand-navy-deep p-4 text-white lg:hidden">
                                <span className="font-bold">Menu</span>
                                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="hidden bg-gradient-to-r from-brand-navy to-brand-navy-deep p-5 lg:block">
                                <Link href="/" className="flex items-center"><span className="text-xl font-extrabold text-white">Mobile Hat</span></Link>
                            </div>
                            <nav className="flex-1 overflow-y-auto bg-brand-paper/50 p-4 pb-20 lg:pb-4">
                                {(() => {
                                    let lastGroup = null;
                                    return sidebarItems.map((item) => {
                                        const showGroup = item.group && item.group !== lastGroup;
                                        if (item.group) lastGroup = item.group;
                                        return (
                                            <div key={item.id}>
                                                {showGroup && <p className="mb-2 mt-6 px-4 text-[10px] font-bold uppercase tracking-wider text-brand-muted">{item.group}</p>}
                                                <button onClick={() => handleNavClick(item.id)}
                                                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${activeSection === item.id
                                                        ? (item.id === "dashboard" ? "bg-gradient-to-r from-brand-navy to-brand-navy-deep text-white shadow-lg shadow-brand-navy/30" : "border border-brand-gray-border bg-white text-brand-navy shadow-sm")
                                                        : "text-brand-navy hover:bg-white hover:shadow-md"}`}>
                                                    {item.icon}{item.label}
                                                </button>
                                            </div>
                                        );
                                    });
                                })()}
                                <div className="mt-6 border-t border-brand-gray-border pt-4">
                                    <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-brand-muted transition-all hover:bg-brand-paper hover:text-brand-navy">
                                        <LogOut className="w-4 h-4" />Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full lg:w-auto min-w-0">

                        {/* ═══ DASHBOARD ═══ */}
                        {activeSection === "dashboard" && (
                            <>
                                <div className="mb-4 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy-deep to-brand-navy p-4 shadow-xl md:mb-6 md:gap-6 md:p-6">
                                    <div className="relative">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/30 ring-offset-2 ring-offset-brand-navy md:h-20 md:w-20">
                                            {user?.image ? (<Image src={user.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />) : (
                                                <svg className="w-7 h-7 md:w-10 md:h-10 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-navy bg-green-500 md:h-4 md:w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-base md:text-xl font-bold text-white truncate">{userName}</h1>
                                        <p className="text-white/60 text-xs md:text-sm truncate">{user?.email || user?.mobile_number || ""}</p>
                                        <span className="mt-1 inline-block rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold text-brand-navy md:text-xs">MEMBER</span>
                                    </div>
                                    <button onClick={() => { setActiveSection("profile"); setIsEditing(true); }} className="flex-shrink-0 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-lg transition-colors hover:bg-brand-paper md:px-5 md:py-2.5 md:text-sm">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                                    {[
                                        { id: "orders", label: "Orders", desc: "Check order status", gradient: "from-brand-navy to-brand-navy-deep", shadow: "shadow-brand-navy/30", icon: <Package className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "tracking", label: "Track Order", desc: "Track shipments", gradient: "from-brand-navy-deep to-brand-navy", shadow: "shadow-brand-navy/30", icon: <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "coupons", label: "Coupons", desc: "Available discounts", gradient: "from-brand-yellow to-brand-navy-deep", shadow: "shadow-brand-yellow/30", icon: <Tag className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                        { id: "profile", label: "Profile", desc: "Edit your account", gradient: "from-brand-navy-deep to-brand-navy", shadow: "shadow-brand-navy/30", icon: <User className="w-6 h-6 md:w-7 md:h-7 text-white" /> },
                                    ].map(card => (
                                        <button key={card.id} onClick={() => setActiveSection(card.id)} className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                            <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform`}>
                                                {card.icon}
                                            </div>
                                            <h3 className="mb-0.5 text-sm font-bold text-brand-navy md:text-base">{card.label}</h3>
                                            <p className="text-[10px] text-brand-muted md:text-xs">{card.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ═══ ORDERS ═══ */}
                        {activeSection === "orders" && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-navy-deep">
                                    <h2 className="text-2xl font-bold text-white">My Orders</h2>
                                    <p className="text-white/60 text-sm mt-1">Track and manage your orders</p>
                                </div>
                                <div className="border-b overflow-x-auto bg-brand-paper/80">
                                    <div className="flex">
                                        {ORDER_TABS.map(tab => {
                                            const TabIcon = tab.Icon;
                                            return (<button key={tab.id} onClick={() => setActiveOrderTab(tab.id)} className={`flex items-center gap-2 px-4 md:px-6 py-4 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeOrderTab === tab.id ? "border-brand-navy text-brand-navy bg-white" : "border-transparent text-brand-muted hover:text-brand-navy"}`}><TabIcon size={16} />{tab.label}</button>);
                                        })}
                                    </div>
                                </div>
                                <div className="p-4 md:p-6">
                                    {ordersLoading ? (
                                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-navy" /></div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map(order => (
                                                <div key={order.id} className="rounded-xl border border-brand-gray-border bg-white p-4 transition-all hover:shadow-lg group">
                                                    <div className="flex gap-4">
                                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-brand-gray-border bg-brand-paper/80 md:h-24 md:w-24">
                                                            {order.sales_details?.[0]?.product_info?.image_path ? (
                                                                <Image src={order.sales_details[0].product_info.image_path} alt="Product" fill className="object-cover" unoptimized />
                                                            ) : (<div className="flex h-full w-full items-center justify-center text-brand-muted/50"><Package className="h-8 w-8" /></div>)}
                                                            {order.sales_details?.length > 1 && (<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center">+{order.sales_details.length - 1} more</div>)}
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                            <div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <div>
                                                                        <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-brand-navy">{order.sales_details?.[0]?.product_info?.name || `Order #${order.invoice_id}`}</h3>
                                                                        <p className="font-mono text-xs text-brand-muted">#{order.invoice_id}</p>
                                                                    </div>
                                                                    <div className="text-right flex-shrink-0">
                                                                        <p className="text-lg md:text-xl font-bold text-brand-navy">৳{(Number(order.sub_total ?? order.total ?? 0) + Number(order.delivery_fee ?? 0))}</p>
                                                                        <p className="mt-1 text-xs text-brand-muted">{new Date(order.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'short' })}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-muted">
                                                                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-muted" />
                                                                <p className="truncate">{order.delivery_customer_address || "No address"}</p>
                                                            </div>
                                                            <button onClick={() => setSelectedOrder(order)} className="mt-3 w-full rounded-lg bg-brand-paper px-3 py-2 text-xs font-semibold text-brand-navy transition-all hover:bg-brand-navy hover:text-white">View Details</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-gradient-to-br from-brand-navy to-brand-navy-deep rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Package className="w-10 h-10 text-white" /></div>
                                            <h3 className="font-bold text-brand-navy text-lg mb-2">No orders found</h3>
                                            <p className="text-sm text-brand-muted">Orders will appear here once you make a purchase</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order Details Modal */}
                                {selectedOrder && (
                                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                                            <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-navy-deep sticky top-0 z-10">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Order Details</h3>
                                                        <p className="text-white/60 text-sm mt-1">#{selectedOrder.invoice_id}</p>
                                                    </div>
                                                    <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-6">
                                                <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-brand-paper/80 rounded-xl">
                                                    <div>
                                                        <p className="text-xs text-brand-muted mb-1">Order Date</p>
                                                        <p className="font-semibold text-brand-navy">{new Date(selectedOrder.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.tran_status || selectedOrder.status)}`}>{getStatusLabel(selectedOrder.tran_status || selectedOrder.status)}</div>
                                                </div>
                                                {![5, 6].includes(Number(selectedOrder.tran_status || selectedOrder.status)) && <OrderTimeline currentStatus={selectedOrder.tran_status || selectedOrder.status} />}
                                                <div>
                                                    <h4 className="font-bold text-brand-navy mb-4 flex items-center gap-2"><Package size={18} />Products ({selectedOrder.sales_details?.length || 0})</h4>
                                                    <div className="space-y-3">
                                                        {selectedOrder.sales_details?.map((item, i) => (
                                                            <div key={i} className="flex gap-4 p-3 bg-brand-paper/80 rounded-xl">
                                                                <div className="h-16 w-16 flex-shrink-0 bg-brand-paper rounded-lg overflow-hidden relative">
                                                                    {item.product_info?.image_path ? <Image src={item.product_info.image_path} alt="Product" fill className="object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-brand-muted"><Package size={20} /></div>}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-brand-navy text-sm line-clamp-1">{item.product_info?.name || "Product"}</p>
                                                                    <p className="mt-1 text-xs text-brand-muted">Qty: {item.qty}{item.size ? ` • Size: ${item.size}` : ""}</p>
                                                                </div>
                                                                <div className="text-right"><p className="font-bold text-brand-navy">৳{item.price * item.qty}</p></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-brand-paper/80 rounded-xl space-y-2 text-sm">
                                                    <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span className="font-medium">৳{selectedOrder.sub_total || selectedOrder.total || 0}</span></div>
                                                    <div className="flex justify-between"><span className="text-brand-muted">Delivery</span><span className="font-medium">৳{selectedOrder.delivery_fee || 0}</span></div>
                                                    {Number(selectedOrder.coupon_discount || 0) > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>-৳{selectedOrder.coupon_discount}</span></div>}
                                                    <div className="flex justify-between border-t border-brand-gray-border pt-2 text-lg font-bold"><span className="text-brand-navy">Total</span><span className="text-brand-navy">৳{(Number(selectedOrder.sub_total ?? selectedOrder.total ?? 0) + Number(selectedOrder.delivery_fee ?? 0) - Number(selectedOrder.coupon_discount ?? 0))}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ TRACKING ═══ */}
                        {activeSection === "tracking" && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-navy-deep">
                                    <h2 className="text-2xl font-bold text-white">Track Order</h2>
                                    <p className="text-white/60 text-sm mt-1">Enter your invoice ID to track</p>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleTrackOrder} className="flex gap-3 mb-6">
                                        <input type="text" value={trackInvoiceId} onChange={e => setTrackInvoiceId(e.target.value)} placeholder="Enter Invoice ID (e.g. INV-12345)" className="flex-1 px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base" />
                                        <button type="submit" disabled={trackLoading} className="px-6 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy-deep transition-colors disabled:opacity-70">
                                            {trackLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : "Track"}
                                        </button>
                                    </form>
                                    {trackOrderData && (
                                        <div className="border border-brand-gray-border rounded-xl p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="font-bold text-brand-navy">#{trackOrderData.invoice_id}</h3>
                                                    <p className="text-sm text-brand-muted">{new Date(trackOrderData.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackOrderData.tran_status || trackOrderData.status)}`}>{getStatusLabel(trackOrderData.tran_status || trackOrderData.status)}</div>
                                            </div>
                                            <OrderTimeline currentStatus={trackOrderData.tran_status || trackOrderData.status} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ COUPONS ═══ */}
                        {activeSection === "coupons" && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-navy-deep">
                                    <h2 className="text-2xl font-bold text-white">My Coupons</h2>
                                    <p className="text-white/60 text-sm mt-1">Your available discount codes</p>
                                </div>
                                <div className="p-6">
                                    {couponsLoading ? (
                                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-navy" /></div>
                                    ) : coupons.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {coupons.map((coupon, i) => (
                                                <div key={i} className="border border-dashed border-brand-yellow/50 rounded-xl bg-brand-paper/80 p-4 transition-all hover:shadow-md">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="px-3 py-1 bg-brand-navy text-white text-xs font-bold rounded-full">{coupon.coupon_code || coupon.code}</span>
                                                        <span className="text-lg font-extrabold text-brand-navy">{coupon.discount_type === "percentage" ? `${coupon.discount}%` : `৳${coupon.discount}`}</span>
                                                    </div>
                                                    <p className="text-sm text-brand-muted mt-2">{coupon.description || "Use this code at checkout"}</p>
                                                    {coupon.min_order && <p className="text-xs text-brand-muted mt-1">Min order: ৳{coupon.min_order}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-gradient-to-br from-brand-yellow to-brand-navy-deep rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Tag className="w-10 h-10 text-white" /></div>
                                            <h3 className="font-bold text-brand-navy text-lg mb-2">No coupons yet</h3>
                                            <p className="text-sm text-brand-muted">Collected coupons will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ PROFILE ═══ */}
                        {activeSection === "profile" && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-navy-deep flex items-center justify-between">
                                    <div><h2 className="text-2xl font-bold text-white">My Profile</h2><p className="text-white/60 text-sm mt-1">Manage your account details</p></div>
                                    {!isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-brand-navy hover:bg-brand-paper rounded-lg text-sm font-semibold flex items-center gap-2"><Edit3 className="w-4 h-4" />Edit</button>}
                                </div>
                                <div className="p-6">
                                    {isEditing ? (
                                        <form onSubmit={handleProfileUpdate} className="space-y-5">
                                            <div className="flex justify-center mb-4">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full bg-brand-paper overflow-hidden ring-4 ring-brand-navy/20">
                                                        {profileImagePreview || user?.image ? (
                                                            <Image src={profileImagePreview || user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-brand-muted"><User className="w-10 h-10" /></div>
                                                        )}
                                                    </div>
                                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-navy text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-brand-navy-deep transition-colors">
                                                        <Camera className="w-4 h-4" />
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { setProfileImage(file); setProfileImagePreview(URL.createObjectURL(file)); } }} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-brand-muted mb-1.5 uppercase tracking-wider">First Name</label>
                                                    <input type="text" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-brand-muted mb-1.5 uppercase tracking-wider">Last Name</label>
                                                    <input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-brand-muted mb-1.5 uppercase tracking-wider">Email</label>
                                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-brand-muted mb-1.5 uppercase tracking-wider">Phone</label>
                                                <input type="tel" value={formData.mobile_number} onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} className="w-full px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-brand-muted mb-1.5 uppercase tracking-wider">Address</label>
                                                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full px-4 py-3 bg-brand-paper/80 border border-brand-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/15 focus:border-brand-navy text-base resize-none" />
                                            </div>
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => { setIsEditing(false); setProfileImage(null); setProfileImagePreview(null); }} className="flex-1 rounded-xl border border-brand-gray-border py-3 font-semibold text-brand-navy transition-colors hover:bg-brand-paper/80">Cancel</button>
                                                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-brand-navy text-white font-bold rounded-xl shadow-lg shadow-brand-navy/30 hover:bg-brand-navy-deep transition-all disabled:opacity-70">
                                                    {isUpdating ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-brand-paper overflow-hidden ring-4 ring-brand-navy/20 flex-shrink-0">
                                                    {user?.image ? <Image src={user.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-brand-muted"><User className="w-8 h-8" /></div>}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-brand-navy">{user.first_name || user.name} {user.last_name || ""}</h3>
                                                    <p className="text-sm text-brand-muted">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: "Phone", value: user.mobile_number || user.phone || "Not set" },
                                                    { label: "Email", value: user.email || "Not set" },
                                                    { label: "Address", value: user.address || "Not set", full: true },
                                                ].map((field, i) => (
                                                    <div key={i} className={`p-4 bg-brand-paper/80 rounded-xl ${field.full ? "md:col-span-2" : ""}`}>
                                                        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">{field.label}</p>
                                                        <p className="text-brand-navy font-medium">{field.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
