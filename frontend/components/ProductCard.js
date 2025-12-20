import Link from 'next/link';

export default function ProductCard({ product, onAdd }) {
    return (
        <div className="glass-panel p-4 flex flex-col h-full transition-all hover:scale-105"
            style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', transition: 'transform 0.2s' }}>

            <div style={{ height: '200px', background: '#e2e8f0', borderRadius: '0.5rem', marginBottom: '1rem', overflow: 'hidden' }}>
                {/* Placeholder image logic since we don't have real images */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                        <span>Sin Imagen</span>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-bold mb-2 text-slate-800">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>

            <div className="flex justify-between items-center mt-auto gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '1rem' }}>
                <span className="text-xl font-bold text-success">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.price * 950)}
                </span>
                <button
                    onClick={() => onAdd(product)}
                    className="btn-primary"
                >
                    Agregar al Carrito
                </button>
            </div>
        </div>
    );
}
