"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Search } from 'lucide-react';

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?q=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/');
        }
    };

    useEffect(() => {
        // Function to update count
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };

        // Initial check
        updateCount();

        // Listen for custom storage events (from add/remove actions)
        window.addEventListener('storage', updateCount);

        // Also listen for native storage events (tabs)
        // Note: 'storage' event only triggers on other tabs usually, but we dispatched it manually in same tab too.

        return () => window.removeEventListener('storage', updateCount);
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full glass" style={{ height: '70px' }}>
            <div className="container h-full flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Zap size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        JourneyPersuade
                    </span>
                </Link>

                <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                </form>

                <Link href="/cart" className="relative group">
                    <div style={{ position: 'relative', padding: '0.5rem' }}>
                        <ShoppingCart size={28} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: '#ec4899',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </div>
                </Link>
            </div>
        </nav>
    );
}
