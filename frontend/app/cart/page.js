"use client";
import { useState, useEffect } from 'react';
import { Trash2, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [persuasionMessages, setPersuasionMessages] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    // Exit Intent Logic
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [hasShownPopup, setHasShownPopup] = useState(false);
    const [isFreeShipping, setIsFreeShipping] = useState(false);

    const trackEvent = async (eventType, eventData = {}) => {
        try {
            await fetch('http://localhost:8000/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: eventType,
                    event_data: JSON.stringify(eventData)
                })
            });
        } catch (e) {
            console.error("Tracking error:", e);
        }
    };

    useEffect(() => {
        // Load cart from LocalStorage
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCart);

        // Analyze Cart only if items exist
        if (storedCart.length > 0) {
            analyzeCart(storedCart);
            fetchRecommendations(storedCart);
            trackEvent('cart_view', { cart_size: storedCart.length });
        }
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price * 950);
    };

    const addToCart = (product, isRecommendation = false) => {
        const newCart = [...cartItems, { ...product, quantity: 1 }];
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
        analyzeCart(newCart);

        if (isRecommendation) {
            trackEvent('recommendation_click', { product_id: product.id, product_name: product.name });
        }
    };

    const analyzeCart = async (items) => {
        // Calculate total
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Call AI Backend Analysis
        try {
            const res = await fetch('http://localhost:8000/api/cart/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_total: total, items: items })
            });
            const data = await res.json();
            setPersuasionMessages(data.persuasion_messages || []);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchRecommendations = async (items) => {
        const itemIds = items.map(i => i.id);
        try {
            const res = await fetch('http://localhost:8000/api/recommend/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemIds)
            });
            const data = await res.json();
            setRecommendations(data.recommended_products || []);
        } catch (e) {
            console.error(e);
        }
    }

    const removeFromCart = (index) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
        analyzeCart(newCart); // Re-analyze
    };

    const handleCheckout = () => {
        trackEvent('checkout_start', { total_value: total, item_count: cartItems.length });
        alert("¡Checkout iniciado! (Simulación)");
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const shippingBase = 5; // $5 USD base
    const currentShipping = isFreeShipping ? 0 : shippingBase;
    const total = subtotal + currentShipping;

    useEffect(() => {
        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && !hasShownPopup && cartItems.length > 0) {
                setShowExitPopup(true);
                setHasShownPopup(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShownPopup, cartItems]);

    const closePopup = () => setShowExitPopup(false);

    const applyFreeShipping = () => {
        setIsFreeShipping(true);
        setShowExitPopup(false);
        trackEvent('free_shipping_accepted');
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-400 mb-8">Parece que aún no has descubierto nuestras mejores ofertas.</p>
                <Link href="/" className="btn-primary">
                    Volver a la Tienda
                </Link>
            </div>
        )
    }

    return (<div className="space-y-8 relative">
        <h2 className="text-3xl font-bold text-center">Carrito de Compras ({cartItems.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">

                {cartItems.map((item, idx) => (
                    <div key={idx} className="glass-panel p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-200 rounded-md overflow-hidden flex items-center justify-center">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <div className="w-full h-full bg-slate-300"></div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                <p className="text-sm text-slate-500">{formatPrice(item.price)}</p>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-600">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                {/* Persuasion / Upsell Section */}
                {recommendations.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 text-purple-600">También te podría gustar...</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recommendations.map(rec => (
                                <div key={rec.id} className="glass p-3 rounded-lg text-sm bg-white/50 flex flex-col justify-between gap-2">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center">
                                            {rec.image ? (
                                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-300"></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{rec.name}</div>
                                            <div className="text-slate-500">{formatPrice(rec.price)}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(rec, true)}
                                        className="text-xs btn-primary py-1 px-2 w-full"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:col-span-1">
                <div className="glass-panel p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-4 text-slate-800">Resumen del Pedido</h3>

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="text-slate-800">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Envío</span>
                            <div className="text-right">
                                {isFreeShipping ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-400 line-through">{formatPrice(shippingBase)}</span>
                                        <span className="text-green-600 font-bold animate-pulse">¡GRATIS!</span>
                                    </div>
                                ) : (
                                    <span className="text-slate-800">{formatPrice(shippingBase)}</span>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    {/* AI PERSUASION MESSAGES */}
                    {persuasionMessages.length > 0 && (
                        <div className="mb-6 space-y-2">
                            {persuasionMessages.map((msg, i) => (
                                <div key={i} className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-md flex items-start gap-2 border border-purple-200">
                                    <TrendingUp size={16} className="text-purple-600 mt-1 shrink-0" />
                                    <span className="text-sm font-semibold text-purple-800">{msg}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleCheckout} className="w-full btn-primary py-3 text-lg shadow-lg shadow-purple-900/50">
                        Proceder al Pago
                    </button>

                    <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-500">
                        <ShieldCheck size={14} />
                        <span>Pago Seguro SSL Encriptado</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Exit Intent Modal */}
        {showExitPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center relative animate-bounce-in">
                    <button
                        onClick={closePopup}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                    <div className="mb-6">
                        <span className="text-6xl">🎁</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-800 mb-2">¡Espera! No te vayas aún</h3>
                    <p className="text-lg text-slate-600 mb-6">
                        Completa tu compra ahora y te regalamos <span className="font-bold text-pink-600">ENVÍO GRATIS</span> en tu pedido.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={applyFreeShipping}
                            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg text-lg shadow-lg transform transition hover:-translate-y-1"
                        >
                            ¡Quiero mi Envío Gratis!
                        </button>
                        <button
                            onClick={closePopup}
                            className="text-slate-400 text-sm hover:underline"
                        >
                            No, gracias, prefiero pagar envío
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
