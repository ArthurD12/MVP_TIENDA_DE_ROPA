import { useState, useMemo } from 'react';
import { catalogProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useStyleDNA } from '../context/StyleDNAContext';
import { CatalogProduct, CatalogCategoryFilter, CatalogSizeFilter, Product } from '../types';
import { ShoppingBag, Star, SlidersHorizontal, X, Cpu, Filter } from 'lucide-react';

const CATEGORIES: { value: CatalogCategoryFilter; label: string }[] = [
  { value: 'calzado',  label: 'Calzado' },
  { value: 'pantalon', label: 'Pantalon' },
  { value: 'blusa',    label: 'Blusa' },
  { value: 'falda',    label: 'Falda' },
];

const SIZES: CatalogSizeFilter[] = ['XS', 'S', 'M', 'L', 'XL'];

export function ProductsView() {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { getFitRecommendation, hasMeasurements } = useStyleDNA();

  const [selectedCategories, setSelectedCategories] = useState<Set<CatalogCategoryFilter>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<CatalogSizeFilter>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter(p => {
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(p.catalogCategory);
      const sizeMatch =
        selectedSizes.size === 0 ||
        p.sizes.some(s => selectedSizes.has(s as CatalogSizeFilter));
      return categoryMatch && sizeMatch;
    });
  }, [selectedCategories, selectedSizes]);

  const activeFilterCount = selectedCategories.size + selectedSizes.size;

  const toggleCategory = (cat: CatalogCategoryFilter) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleSize = (size: CatalogSizeFilter) => {
    setSelectedSizes(prev => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedSizes(new Set());
  };

  const handleAddToCart = (p: CatalogProduct) => {
    const asProduct: Product = {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: 'damas',
      badge: p.badge,
      rating: p.rating,
      reviews: p.reviews,
      sizes: p.sizes,
      colors: p.colors,
    };
    addItem(asProduct);
    showToast(`${p.name} añadido al carrito`, 'success');
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F9F9F9]">
      {/* Page header */}
      <div className="bg-white border-b border-primary-200 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest text-primary-400 uppercase mb-2">Mujer Unica</p>
          <h1 className="text-4xl font-light">
            Coleccion <span className="font-semibold">Productos</span>
          </h1>
          <p className="text-primary-500 mt-2 max-w-lg">
            Explora nuestra seleccion de moda femenina. Filtra por categoria y talla para encontrar tu pieza perfecta.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-primary-200 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-foreground text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="text-sm text-primary-500">{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`
            lg:w-60 lg:flex-shrink-0
            ${sidebarOpen ? 'block' : 'hidden'} lg:block
            fixed lg:static inset-0 lg:inset-auto z-30 lg:z-auto
            bg-white lg:bg-transparent
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}>
            {/* Mobile close */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <span className="font-semibold">Filtros</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-primary-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Header with clear */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold">Filtros</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-foreground text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary-500 hover:text-foreground underline">
                    Limpiar
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div>
                <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3">Categoria</p>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                          selectedCategories.has(cat.value)
                            ? 'bg-foreground border-foreground'
                            : 'border-primary-300 group-hover:border-primary-500'
                        }`}
                        onClick={() => toggleCategory(cat.value)}
                      >
                        {selectedCategories.has(cat.value) && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          selectedCategories.has(cat.value) ? 'font-medium text-foreground' : 'text-primary-600 group-hover:text-foreground'
                        }`}
                        onClick={() => toggleCategory(cat.value)}
                      >
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary-200" />

              {/* Size filter */}
              <div>
                <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3">Talla</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedSizes.has(size)
                          ? 'bg-foreground text-white border-foreground'
                          : 'border-primary-200 text-primary-600 hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile apply */}
              <div className="lg:hidden pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
                >
                  Ver {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="w-full mt-2 py-2 text-sm text-primary-500 hover:text-foreground">
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Mobile sidebar overlay backdrop */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 z-20"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-primary-500">{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}</p>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {[...selectedCategories].map(c => (
                    <span key={c} className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {CATEGORIES.find(x => x.value === c)?.label}
                      <button onClick={() => toggleCategory(c)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {[...selectedSizes].map(s => (
                    <span key={s} className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      Talla {s}
                      <button onClick={() => toggleSize(s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <button onClick={clearFilters} className="text-xs text-primary-400 hover:text-foreground underline">
                    Limpiar todo
                  </button>
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <SlidersHorizontal className="w-12 h-12 text-primary-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin resultados</h3>
                <p className="text-primary-500 text-sm mb-4">Prueba ajustando los filtros seleccionados.</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-foreground text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => {
                  const fitRecommendation = hasMeasurements ? getFitRecommendation('damas') : null;
                  return (
                    <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-shadow">
                      <div className="relative aspect-[3/4] overflow-hidden">
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
                        <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full text-primary-600 capitalize">
                          {CATEGORIES.find(c => c.value === product.catalogCategory)?.label}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-primary-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-primary-400">({product.reviews})</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.sizes.map(s => (
                            <span key={s} className="px-1.5 py-0.5 bg-primary-50 text-primary-500 text-xs rounded">{s}</span>
                          ))}
                        </div>

                        {fitRecommendation && (
                          <div className="flex items-center gap-1 mb-2 text-xs text-primary-600 bg-primary-50 rounded-md px-2 py-1">
                            <Cpu className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">IA: Fit {fitRecommendation}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <div>
                            {product.originalPrice && (
                              <span className="text-xs text-primary-400 line-through mr-1">${product.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2.5 bg-foreground text-white rounded-lg hover:bg-primary-800 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
