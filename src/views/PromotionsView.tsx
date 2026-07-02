import { useState, useEffect, Fragment } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Star, Clock, Tag, Flame } from 'lucide-react';

export function PromotionsView() {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + 24);
    target.setMinutes(0);
    target.setSeconds(0);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        target.setHours(target.getHours() + 24);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saleProducts = products.filter(p => p.badge === 'oferta');
  const allProducts = products.filter(p => p.originalPrice);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  const discount = (original: number, current: number) =>
    Math.round(((original - current) / original) * 100);

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-red-600 to-red-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Oferta Flash 24h</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            Hasta <span className="font-bold">60% OFF</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Clock className="w-6 h-6" />
            <p className="text-lg">Termina en:</p>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-6">
            {[
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Seg' },
            ].map((item, index) => (
              <Fragment key={item.label}>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl md:text-4xl font-bold text-foreground">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-sm mt-2 opacity-80">{item.label}</span>
                </div>
                {index < 2 && (
                  <span className="text-3xl md:text-4xl font-bold mb-4">:</span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-semibold">Productos en Oferta</h2>
          <span className="ml-auto text-sm text-primary-500">{saleProducts.length} productos</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-shadow relative"
            >
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                  -{discount(product.originalPrice!, product.price)}%
                </span>
              </div>

              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-primary-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-primary-400">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-primary-400 line-through block">
                      ${product.originalPrice?.toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
