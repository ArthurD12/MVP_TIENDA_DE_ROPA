import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { accessoryProducts } from '../data/products';
import { AccessoryProduct, Product } from '../types';
import { ShoppingBag, Star, Gem } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  bolso: 'Bolsos',
  cinturon: 'Cinturones',
  gafas: 'Gafas',
  joyeria: 'Joyeria',
};

export function AccesoriosView() {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (p: AccessoryProduct) => {
    const asProduct: Product = {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: 'accesorios',
      badge: p.badge,
      rating: p.rating,
      reviews: p.reviews,
      sizes: ['Unico'],
      colors: [],
    };
    addItem(asProduct);
    showToast(`${p.name} añadido al carrito`, 'success');
  };

  const grouped = accessoryProducts.reduce<Record<string, AccessoryProduct[]>>((acc, p) => {
    if (!acc[p.accessoryCategory]) acc[p.accessoryCategory] = [];
    acc[p.accessoryCategory].push(p);
    return acc;
  }, {});

  return (
    <div className="pt-16 min-h-screen bg-[#F9F9F9]">
      <div className="bg-white border-b border-primary-200 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest text-primary-400 uppercase mb-2">Mujer Unica</p>
          <h1 className="text-4xl font-light">
            Accesorios <span className="font-semibold">Exclusivos</span>
          </h1>
          <p className="text-primary-500 mt-2 max-w-lg">
            Los detalles definen el estilo. Descubre nuestra coleccion de accesorios curados para completar cualquier look.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Gem className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-2xl font-light">
                <span className="font-semibold">{CATEGORY_LABELS[category] ?? category}</span>
              </h2>
              <div className="flex-1 h-px bg-primary-200" />
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {items.map((product, index) => (
                <AccessoryCard
                  key={product.id}
                  product={product}
                  tall={index % 3 === 0}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AccessoryCard({
  product,
  tall,
  onAddToCart,
}: {
  product: AccessoryProduct;
  tall: boolean;
  onAddToCart: (p: AccessoryProduct) => void;
}) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="break-inside-avoid group bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-shadow mb-4">
      <div className={`relative overflow-hidden ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.badge && (
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${
            product.badge === 'nuevo' ? 'bg-green-500 text-white' :
            product.badge === 'tendencia' ? 'bg-foreground text-white' :
            'bg-red-500 text-white'
          }`}>
            {product.badge === 'nuevo' ? 'NUEVO' : product.badge === 'tendencia' ? 'TENDENCIA' : 'OFERTA'}
          </span>
        )}

        {discount && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
            -{discount}%
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2 px-4 py-2.5 bg-white text-foreground text-sm font-medium rounded-full shadow-elegant whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          Añadir al carrito
        </button>
      </div>

      <div className="p-4">
        <h4 className="font-medium text-sm line-clamp-2 mb-1.5">{product.name}</h4>

        <div className="flex items-center gap-1 mb-3">
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
            {product.originalPrice && (
              <span className="text-xs text-primary-400 line-through block">S/ {product.originalPrice.toFixed(2)}</span>
            )}
            <span className={`font-bold text-sm ${product.originalPrice ? 'text-red-600' : 'text-foreground'}`}>
              S/ {product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 bg-foreground text-white rounded-lg hover:bg-primary-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
