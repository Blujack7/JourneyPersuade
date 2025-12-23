"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Cargando...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from FastAPI
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    // MVP: For now just alert or log
    console.log("Added to cart:", product);
    alert(`¡${product.name} agregado al carrito! (Ver Carrito)`);
    // detailed cart logic would go to localStorage or Context
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    currentCart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(currentCart));
    // Trigger event/reload for navbar?
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) return <div className="text-center mt-20 text-2xl animate-pulse">Cargando productos increíbles...</div>;

  return (
    <div className="pt-32 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          El Futuro de las Compras
        </h1>
        <p className="text-xl text-gray-400">Experimenta el comercio conceptual impulsado por IA.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductList products={products} onAdd={addToCart} />
      </div>
    </div>
  );
}

function ProductList({ products, onAdd }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const filteredProducts = query
    ? products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <h3 className="text-xl text-gray-400">No se encontraron productos para "{query}"</h3>
      </div>
    );
  }

  return (
    <>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </>
  );
}

