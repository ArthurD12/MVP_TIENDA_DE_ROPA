import { useState } from 'react';
import { outfits } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useStyleDNA } from '../context/StyleDNAContext';
import { ShoppingBag, ChevronDown, ChevronUp, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';

export function OutfitsView() {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { saveOutfit, removeOutfit, isOutfitSaved } = useStyleDNA();
  const [expandedOutfit, setExpandedOutfit] = useState<string | null>(null);

  const handleBuyOutfit = (outfit: typeof outfits[0]) => {
    outfit.items.forEach(item => {
      addItem(item);
    });
    showToast(`Outfit "${outfit.name}" añadido al carrito`, 'success');
  };

  const handleToggleSave = (outfit: typeof outfits[0]) => {
    if (isOutfitSaved(outfit.id)) {
      removeOutfit(outfit.id);
      showToast(`"${outfit.name}" eliminado del armario`, 'info');
    } else {
      saveOutfit(outfit);
      showToast(`"${outfit.name}" guardado en Mi Armario`, 'success');
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-primary-100 to-[#F9F9F9] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-elegant mb-4">
            <Sparkles className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-medium">Coleccion Curada</span>
          </div>
          <h1 className="text-4xl font-light mb-4">
            Estilos <span className="font-semibold">Inteligentes</span>
          </h1>
          <p className="text-primary-500 max-w-xl mx-auto">
            Looks completos diseñados por nuestros estilistas. Compra el estilo entero con un solo clic y ahorra.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {outfits.map(outfit => {
            const saved = isOutfitSaved(outfit.id);
            return (
              <div key={outfit.id} className="bg-white rounded-2xl shadow-elegant overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative">
                    <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium shadow-elegant">
                        {outfit.style}
                      </span>
                    </div>
                    {/* Save outfit button on image */}
                    <button
                      onClick={() => handleToggleSave(outfit)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full shadow-elegant transition-all ${
                        saved
                          ? 'bg-foreground text-white'
                          : 'bg-white/90 backdrop-blur-sm text-primary-500 hover:bg-white hover:text-foreground'
                      }`}
                      title={saved ? 'Eliminar del armario' : 'Guardar en Mi Armario'}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="lg:w-3/5 p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-2xl font-semibold">{outfit.name}</h3>
                      {/* Duplicate save button for larger screen visibility */}
                      <button
                        onClick={() => handleToggleSave(outfit)}
                        className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                          saved
                            ? 'bg-foreground text-white'
                            : 'border border-primary-200 text-primary-500 hover:border-foreground hover:text-foreground'
                        }`}
                      >
                        {saved ? (
                          <>
                            <BookmarkCheck className="w-4 h-4" />
                            Guardado
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            Guardar Outfit
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-primary-500 mb-6">{outfit.description}</p>

                    <div className="mb-6">
                      <button
                        onClick={() => setExpandedOutfit(expandedOutfit === outfit.id ? null : outfit.id)}
                        className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-foreground transition-colors"
                      >
                        Ver piezas incluidas ({outfit.items.length})
                        {expandedOutfit === outfit.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedOutfit === outfit.id && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 animate-slide-down">
                          {outfit.items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{item.name}</p>
                                <p className="text-xs text-primary-500">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-primary-200">
                      <div>
                        <span className="text-sm text-primary-400 line-through">
                          ${outfit.originalPrice.toFixed(2)}
                        </span>
                        <span className="ml-2 text-2xl font-semibold">${outfit.price.toFixed(2)}</span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          Ahorras ${(outfit.originalPrice - outfit.price).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuyOutfit(outfit)}
                        className="flex items-center gap-2 px-6 py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Comprar Outfit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
