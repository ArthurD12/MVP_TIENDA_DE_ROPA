import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ViewType } from '../../types';
import {
  Sparkles,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Shirt,
  Tag,
  Truck,
  MapPin,
  Info,
  Bot,
  ShoppingBag,
  Gem,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCartClick: () => void;
}

export function Navbar({ currentView, onViewChange, onCartClick }: NavbarProps) {
  const { logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    onViewChange('login');
  };

  const ropaItems = [
    { label: 'Productos',   view: 'products'    as ViewType, icon: ShoppingBag },
    { label: 'Accesorios',  view: 'accesorios'  as ViewType, icon: Gem },
    { label: 'Estilos',     view: 'outfits'     as ViewType, icon: Shirt },
    { label: 'Promociones', view: 'promotions'  as ViewType, icon: Tag },
  ];

  const ropaViews: ViewType[] = ['products', 'accesorios', 'outfits', 'promotions'];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-primary-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo + desktop nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onViewChange('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-light tracking-widest">MUJER UNICA</span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onViewChange('home')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  currentView === 'home' ? 'text-foreground' : 'text-primary-500 hover:text-foreground'
                }`}
              >
                <Home className="w-4 h-4" />
                Inicio
              </button>

              {/* Ropa dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    ropaViews.includes(currentView)
                      ? 'text-foreground'
                      : 'text-primary-500 hover:text-foreground'
                  }`}
                >
                  <Shirt className="w-4 h-4" />
                  Ropa
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-elegant-lg border border-primary-200 overflow-hidden animate-slide-down">
                    {ropaItems.map(item => (
                      <button
                        key={item.view}
                        onClick={() => {
                          onViewChange(item.view);
                          setDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition-colors ${
                          currentView === item.view
                            ? 'bg-primary-50 font-medium'
                            : 'hover:bg-primary-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-primary-400" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onViewChange('about')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  currentView === 'about' ? 'text-foreground' : 'text-primary-500 hover:text-foreground'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Nosotros y Sedes
              </button>

              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  currentView === 'profile' ? 'text-foreground' : 'text-primary-500 hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                Perfil
              </button>

              <button
                onClick={() => onViewChange('ai-assistant')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  currentView === 'ai-assistant' ? 'text-foreground' : 'text-primary-500 hover:text-foreground'
                }`}
              >
                <Bot className="w-4 h-4" />
                IA Asistente
              </button>
            </div>
          </div>

          {/* Right: shipping icon + cart + logout + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Shipping shortcut */}
            <button
              onClick={() => onViewChange('shipping')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'shipping'
                  ? 'bg-primary-100 text-foreground'
                  : 'text-primary-500 hover:bg-primary-50 hover:text-foreground'
              }`}
              title="Seguimiento de Envio"
            >
              <Truck className="w-4 h-4" />
              <span className="hidden lg:inline">Envio</span>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-500 hover:text-foreground hover:bg-primary-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-primary-200 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => { onViewChange('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Home className="w-5 h-5 text-primary-400" />
              <span className="font-medium">Inicio</span>
            </button>

            <div className="px-4 py-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Ropa</div>

            {ropaItems.map(item => (
              <button
                key={item.view}
                onClick={() => { onViewChange(item.view); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-primary-400" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            <button
              onClick={() => { onViewChange('shipping'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Truck className="w-5 h-5 text-primary-400" />
              <span className="font-medium">Envio</span>
            </button>

            <button
              onClick={() => { onViewChange('about'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Info className="w-5 h-5 text-primary-400" />
              <span className="font-medium">Nosotros y Sedes</span>
            </button>

            <button
              onClick={() => { onViewChange('profile'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
            >
              <User className="w-5 h-5 text-primary-400" />
              <span className="font-medium">Perfil</span>
            </button>

            <button
              onClick={() => { onViewChange('ai-assistant'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Bot className="w-5 h-5 text-primary-400" />
              <span className="font-medium">IA Asistente</span>
            </button>

            <div className="pt-2 border-t border-primary-200">
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
