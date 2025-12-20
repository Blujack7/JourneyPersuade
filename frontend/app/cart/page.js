"use client";
import { useState, useEffect } from 'react';
import { Trash2, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [persuasionMessages, setPersuasionMessages] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Load cart from LocalStorage
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCart);

        // Analyze Cart only if items exist
        if (storedCart.length > 0) {
            analyzeCart(storedCart);
            fetchRecommendations(storedCart);
        }
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price * 950);
    };

    const addToCart = (product) => {
        const newCart = [...cartItems, { ...product, quantity: 1 }];
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
        analyzeCart(newCart);
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

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Carrito de Compras ({cartItems.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">

                    {cartItems.map((item, idx) => (
                        <div key={idx} className="glass-panel p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-200 rounded-md overflow-hidden">
                                    {/* Placeholder Img */}
                                    <div className="w-full h-full bg-slate-300"></div>
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
                                        <div>
                                            <div className="font-bold text-slate-800">{rec.name}</div>
                                            <div className="text-slate-500">{formatPrice(rec.price)}</div>
                                        </div>
                                        <button
                                            onClick={() => addToCart(rec)}
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
                                <span className="text-slate-800">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Envío</span>
                                <span className="text-slate-800">{formatPrice(0)}</span>
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

                        <button className="w-full btn-primary py-3 text-lg shadow-lg shadow-purple-900/50">
                            Proceder al Pago
                        </button>

                        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-500">
                            <ShieldCheck size={14} />
                            <span>Pago Seguro SSL Encriptado</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
