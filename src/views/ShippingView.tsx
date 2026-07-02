import { useState } from 'react';
import { trackingStatuses } from '../data/products';
import { Truck, Package, MapPin, CheckCircle, Search, Truck as TruckIcon, Home } from 'lucide-react';

export function ShippingView() {
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<typeof trackingStatuses[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = () => {
    if (!trackingCode.trim()) return;

    let found = trackingStatuses.find(t => t.code.toLowerCase() === trackingCode.toLowerCase());
    if (!found) {
      found = {
        code: trackingCode.toUpperCase(),
        status: 'en_camino',
        date: new Date().toISOString().split('T')[0],
      };
    }
    setTrackingResult(found);
    setSearched(true);
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { id: 'confirmado', label: 'Pedido Confirmado', icon: CheckCircle },
      { id: 'almacen', label: 'En Almacen', icon: Package },
      { id: 'en_camino', label: 'En Camino', icon: TruckIcon },
      { id: 'entregado', label: 'Entregado', icon: Home },
    ];

    const currentIndex = steps.findIndex(s => s.id === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-primary-100 to-[#F9F9F9] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-elegant mb-4">
            <Truck className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Seguimiento de Pedidos</span>
          </div>
          <h1 className="text-4xl font-light mb-4">
            Rastrea tu <span className="font-semibold">Pedido</span>
          </h1>
          <p className="text-primary-500 max-w-xl mx-auto">
            Ingresa tu codigo de seguimiento para ver el estado en tiempo real de tu envio.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-elegant p-8 mb-12">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-400" />
            Buscar Pedido
          </h3>

          <div className="flex gap-4">
            <input
              type="text"
              value={trackingCode}
              onChange={e => setTrackingCode(e.target.value)}
              placeholder="Ej: TRK-102030"
              className="flex-1 px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
              onKeyDown={e => {
                if (e.key === 'Enter') handleTrack();
              }}
            />
            <button
              onClick={handleTrack}
              className="px-8 py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
            >
              Rastrear
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-primary-400">Codigos de prueba:</span>
            {trackingStatuses.slice(0, 4).map(t => (
              <button
                key={t.code}
                onClick={() => {
                  setTrackingCode(t.code);
                }}
                className="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded hover:bg-primary-200 transition-colors"
              >
                {t.code}
              </button>
            ))}
          </div>
        </div>

        {searched && trackingResult && (
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-primary-400">Codigo de Seguimiento</p>
                  <p className="text-xl font-semibold">{trackingResult.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-400">Fecha de Actualizacion</p>
                  <p className="text-sm font-medium">{trackingResult.date}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="relative">
                {getStatusSteps(trackingResult.status).map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 relative">
                    {index < 3 && (
                      <div
                        className={`absolute left-5 top-10 bottom-0 w-0.5 ${step.completed ? 'bg-green-500' : 'bg-primary-200'
                          }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${step.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-primary-200 text-primary-400'
                        } ${step.current ? 'ring-4 ring-green-100' : ''}`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 pb-8">
                      <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-primary-400'}`}>
                        {step.label}
                      </p>
                      {step.current && (
                        <p className="text-sm text-primary-500 mt-1">
                          {step.id === 'confirmado' && 'Tu pedido ha sido recibido y confirmado'}
                          {step.id === 'almacen' && 'Tu pedido esta siendo preparado en nuestro almacen'}
                          {step.id === 'en_camino' && 'Tu pedido esta en camino a tu direccion'}
                          {step.id === 'entregado' && 'Tu pedido ha sido entregado con exito'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Package,
              title: 'Envio Gratis',
              description: 'En pedidos superiores a S/ 150',
              detail: '5-7 dias habiles',
            },
            {
              icon: Truck,
              title: 'Envio Express',
              description: 'Disponible en ciudades principales',
              detail: '2-3 dias habiles - S/ 15.99',
            },
            {
              icon: MapPin,
              title: 'Recoger en Tienda',
              description: 'Gratis en cualquiera de nuestras sedes',
              detail: 'Disponible en 24-48 horas',
            },
          ].map(policy => (
            <div key={policy.title} className="bg-white rounded-xl shadow-elegant p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
                <policy.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold mb-2">{policy.title}</h4>
              <p className="text-sm text-primary-500 mb-2">{policy.description}</p>
              <p className="text-xs text-primary-400">{policy.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
