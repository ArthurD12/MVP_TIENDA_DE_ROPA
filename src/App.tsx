import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { StyleDNAProvider } from './context/StyleDNAContext';
import { ViewType, ProfileTabType } from './types';
import { AuthContainer } from './components/auth/AuthViews';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { AIChatWidget } from './components/ai/AIChatWidget';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { AccesoriosView } from './views/AccesoriosView';
import { OutfitsView } from './views/OutfitsView';
import { PromotionsView } from './views/PromotionsView';
import { ShippingView } from './views/ShippingView';
import { AboutView } from './views/AboutView';
import { ProfileView } from './views/ProfileView';
import { AIAssistantView } from './views/AIAssistantView';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [profileTab, setProfileTab] = useState<ProfileTabType>('data');
  const [cartOpen, setCartOpen] = useState(false);

  const handleNavigate = (view: string, tab?: string) => {
    setCurrentView(view as ViewType);
    if (view === 'profile' && tab) {
      setProfileTab(tab as ProfileTabType);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthContainer onSuccess={() => setCurrentView('home')} />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Navbar
        currentView={currentView}
        onViewChange={v => { setCurrentView(v); }}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        {currentView === 'home' && (
          <HomeView onViewChange={v => setCurrentView(v as ViewType)} />
        )}
        {currentView === 'outfits' && <OutfitsView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'accesorios' && <AccesoriosView />}
        {currentView === 'promotions' && <PromotionsView />}
        {currentView === 'shipping' && <ShippingView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'profile' && (
          <ProfileView
            key={profileTab}
            initialTab={profileTab}
            onViewChange={handleNavigate}
          />
        )}
        {currentView === 'ai-assistant' && (
          <AIAssistantView onNavigate={handleNavigate} />
        )}
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AIChatWidget onNavigate={handleNavigate} />
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <StyleDNAProvider>
            <MainApp />
          </StyleDNAProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
