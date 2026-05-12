"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, Eye, EyeOff } from "lucide-react";

const AuthModal = () => {
    const {
        authModalOpen,
        authModalMode,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
    } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form states
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    // Reset state when modal opens/closes or mode changes
    useEffect(() => {
        if (!authModalOpen) {
            setLoginData({ email: "", password: "" });
            setRegisterData({
                first_name: "",
                last_name: "",
                phone: "",
                email: "",
                password: "",
                confirm_password: "",
            });
            setError("");
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    }, [authModalOpen]);

    useEffect(() => {
        setError("");
    }, [authModalMode]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (authModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [authModalOpen]);

    // Handlers
    const handleLoginChange = (e) =>
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) =>
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(loginData.email, loginData.password);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (registerData.password !== registerData.confirm_password) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (registerData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(registerData.phone)) {
            setError("Please enter a valid 11-digit phone number");
            setLoading(false);
            return;
        }

        const { confirm_password, ...dataToSend } = registerData;
        const result = await register(dataToSend);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
        }
    };

    if (!authModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeAuthModal}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-gray-border bg-white shadow-2xl shadow-brand-navy/10"
                style={{ animation: "fadeInUp 0.3s ease-out" }}
            >
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-brand-muted transition-all hover:bg-brand-paper hover:text-brand-navy"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header / Tabs */}
                <div className="px-6 pt-8 text-center">
                    <h2 className="mb-1 text-2xl font-extrabold text-brand-navy">
                        {authModalMode === "login"
                            ? "Welcome Back"
                            : "Create Account"}
                    </h2>
                    <p className="mb-6 text-sm text-brand-muted">
                        {authModalMode === "login"
                            ? "Sign in to access your account"
                            : "Create your account"}
                    </p>

                    <div className="mb-6 flex border-b border-brand-gray-border">
                        <button
                            className={`relative flex-1 pb-3 text-sm font-semibold transition-all ${authModalMode === "login"
                                ? "text-brand-navy"
                                : "text-brand-muted hover:text-brand-navy"
                                }`}
                            onClick={() => setAuthModalMode("login")}
                        >
                            Login
                            {authModalMode === "login" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-brand-navy" />
                            )}
                        </button>
                        <button
                            className={`relative flex-1 pb-3 text-sm font-semibold transition-all ${authModalMode === "register"
                                ? "text-brand-navy"
                                : "text-brand-muted hover:text-brand-navy"
                                }`}
                            onClick={() => setAuthModalMode("register")}
                        >
                            Register
                            {authModalMode === "register" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-brand-navy" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
                    {/* Error */}
                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                            <svg
                                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* ═══ LOGIN FORM ═══ */}
                    {authModalMode === "login" ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                    style={{ fontSize: "16px" }}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        required
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-3 pr-11 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-brand-navy py-3.5 font-extrabold text-white shadow-lg shadow-brand-navy/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-navy-deep active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    "Continue"
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-brand-muted">
                                    Don&apos;t have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthModalMode("register")}
                                        className="font-bold text-brand-navy hover:underline"
                                    >
                                        Register Now
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* ═══ REGISTER FORM ═══ */
                        <form onSubmit={handleRegisterSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={registerData.first_name}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="First"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={registerData.last_name}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="Last"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    required
                                    placeholder="email@example.com"
                                    className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                    style={{ fontSize: "16px" }}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Phone
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-brand-gray-border bg-brand-paper px-3 text-sm font-medium text-brand-muted">
                                        +88
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={registerData.phone}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="01XXXXXXXXX"
                                        className="w-full rounded-r-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="Min. 6 characters"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 pr-11 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={registerData.confirm_password}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="Re-enter password"
                                        className="w-full rounded-xl border border-brand-gray-border bg-brand-paper/50 px-4 py-2.5 pr-11 text-brand-navy transition-all focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full rounded-xl bg-brand-navy py-3.5 font-extrabold text-white shadow-lg shadow-brand-navy/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-navy-deep active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Register"
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-brand-muted">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setAuthModalMode("login")}
                                        className="font-bold text-brand-navy hover:underline"
                                    >
                                        Log In
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Animation keyframes */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthModal;
