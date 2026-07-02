import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useStyleDNA } from '../context/StyleDNAContext';
import { Product } from '../types';
import { Sparkles, ShoppingBag, Star, ArrowRight, Cpu } from 'lucide-react';

interface HomeViewProps {
  onViewChange: (view: string) => void;
}

export function HomeView({ onViewChange }: HomeViewProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const trendingProducts = products.filter(p => p.badge === 'tendencia' || p.badge === 'nuevo');
  const saleProducts = products.filter(p => p.badge === 'oferta');

  const handleAddToCart = (product: Product) => {
    addItem(product);
    showToast(`${product.name} añadido al carrito`, 'success');
  };

  return (
    <div className="pt-16">
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a32b6b35?w=1920&q=80"
          alt="Fashion Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-2xl animate-slide-right">
            <p className="text-white/80 text-sm tracking-widest uppercase mb-4">Coleccion Primavera 2024</p>
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
              La Revolucion de la <span className="font-semibold">Moda Inteligente</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Descubre prendas que combinan elegancia atemporal con tecnologia de vanguardia.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('trending');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-foreground font-medium rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
              >
                Explorar Coleccion
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewChange('ai-assistant')}
                className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Consultar IA
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">Categorias Destacadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Damas', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37703c60?w=600&q=80', view: 'home' },
              { name: 'Caballeros', image: 'https://images.unsplash.com/photo-1507003211169-0d0da9d24fa2?w=600&q=80', view: 'home' },
              { name: 'Accesorios', image: 'https://images.unsplash.com/photo-1523275335684-cc8f0c5aa5a2?w=600&q=80', view: 'home' },
              { name: 'Conjuntos Inteligentes', image: 'https://images.unsplash.com/photo-1483985988355-763e9633e967?w=600&q=80', view: 'outfits' },
            ].map(category => (
              <button
                key={category.name}
                onClick={() => onViewChange(category.view)}
                className="relative group aspect-[4/5] rounded-xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white font-semibold text-lg md:text-xl">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="trending" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold">Productos en Tendencia</h2>
            <button
              onClick={() => onViewChange('promotions')}
              className="text-sm font-medium text-primary-500 hover:text-foreground transition-colors flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="py-20 px-4 bg-primary-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-accent-gold" />
              <h2 className="text-2xl font-semibold">Ofertas Especiales</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.slice(0, 4).map(product => (
                <div key={product.id} className="bg-white text-foreground rounded-xl overflow-hidden">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  const { getFitRecommendation, hasMeasurements } = useStyleDNA();
  const fitRecommendation = hasMeasurements ? getFitRecommendation(product.category) : null;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${
              product.badge === 'nuevo' ? 'bg-green-500 text-white' :
              product.badge === 'tendencia' ? 'bg-foreground text-white' :
              'bg-red-500 text-white'
            }`}
          >
            {product.badge === 'nuevo' ? 'NUEVO' : product.badge === 'tendencia' ? 'TENDENCIA' : 'OFERTA'}
          </span>
        )}
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

        {fitRecommendation && (
          <div className="flex items-center gap-1 mb-2 text-xs text-primary-600 bg-primary-50 rounded-md px-2 py-1">
            <Cpu className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">IA: Fit {fitRecommendation}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-primary-400 line-through mr-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="p-2.5 bg-foreground text-white rounded-lg hover:bg-primary-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
