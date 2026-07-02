import { useStyleDNA } from '../../context/StyleDNAContext';
import { useToast } from '../../context/ToastContext';
import { SavedOutfit } from '../../types';
import { Bookmark, Trash2, ShoppingBag, Calendar, Archive } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function MiArmario() {
  const { savedOutfits, removeOutfit } = useStyleDNA();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleBuyOutfit = (saved: SavedOutfit) => {
    saved.outfit.items.forEach(item => addItem(item));
    showToast(`"${saved.outfit.name}" añadido al carrito`, 'success');
  };

  const handleRemove = (outfitId: string, name: string) => {
    removeOutfit(outfitId);
    showToast(`"${name}" eliminado del armario`, 'info');
  };

  if (savedOutfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Archive className="w-10 h-10 text-primary-300" />
        </div>
        <h4 className="text-lg font-semibold mb-2">Tu armario está vacío</h4>
        <p className="text-sm text-primary-500 max-w-xs">
          Guarda tus conjuntos favoritos desde la sección de Conjuntos o desde las recomendaciones del Asistente IA.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-primary-500">{savedOutfits.length} conjunto{savedOutfits.length !== 1 ? 's' : ''} guardado{savedOutfits.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {savedOutfits.map(saved => (
          <div key={saved.outfit.id} className="group bg-primary-50 rounded-xl overflow-hidden border border-primary-100 hover:border-primary-300 hover:shadow-elegant transition-all">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={saved.outfit.image}
                alt={saved.outfit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                  {saved.outfit.style}
                </span>
              </div>
              <button
                onClick={() => handleRemove(saved.outfit.id, saved.outfit.name)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Eliminar del armario"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-sm mb-1 line-clamp-1">{saved.outfit.name}</h4>
              <div className="flex items-center gap-1 text-xs text-primary-400 mb-3">
                <Calendar className="w-3 h-3" />
                <span>Guardado el {new Date(saved.savedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-primary-400 line-through mr-1">${saved.outfit.originalPrice.toFixed(2)}</span>
                  <span className="font-bold text-sm">${saved.outfit.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleBuyOutfit(saved)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-white text-xs font-medium rounded-lg hover:bg-primary-800 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
