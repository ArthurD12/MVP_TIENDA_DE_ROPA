import { useState } from 'react';
import { locations } from '../data/products';
import { MapPin, Phone, Clock, ChevronDown, ChevronUp, Heart, Leaf, Sparkles, Globe } from 'lucide-react';

export function AboutView() {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Nuestra Historia</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            MUJER UNICA <span className="font-semibold">Moda Inteligente</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Fundada con la vision de fusionar la elegancia atemporal con la innovacion tecnologica.
            Cada prenda cuenta una historia de arte, sostenibilidad y funcionalidad.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Sparkles,
              title: 'Mision',
              content:
                'Crear experiencias de moda que trasciendan lo tradicional. Integrar inteligencia artificial para ofrecer recomendaciones personalizadas, tallas perfectas y combinaciones de estilo unicas.',
            },
            {
              icon: Leaf,
              title: 'Sostenibilidad',
              content:
                'Comprometidos con el planeta, utilizamos materiales ecologicos y procesos de produccion responsables. Cada prenda esta diseñada para durar, reduciendo el desperdicio de moda rapida.',
            },
            {
              icon: Globe,
              title: 'Alcance Global',
              content:
                'Con presencia en America Latina y Europa, conectamos culturas a traves del estilo. Nuestras tiendas fisicas son espacios de inmersion y descubrimiento.',
            },
          ].map(item => (
            <div key={item.title} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <item.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-primary-500 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">
              Nuestras <span className="font-semibold">Sedes</span>
            </h2>
            <p className="text-primary-500">Visitanos en cualquiera de nuestras tiendas exclusivas</p>
          </div>

          <div className="space-y-4">
            {locations.map(location => (
              <div
                key={location.id}
                className="bg-white rounded-xl shadow-elegant overflow-hidden"
              >
                <button
                  onClick={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{location.city}</h3>
                      <p className="text-sm text-primary-500">{location.country}</p>
                    </div>
                  </div>
                  {expandedLocation === location.id ? (
                    <ChevronUp className="w-5 h-5 text-primary-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-400" />
                  )}
                </button>

                {expandedLocation === location.id && (
                  <div className="px-6 pb-6 animate-slide-down">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/2">
                        <div className="aspect-video rounded-lg overflow-hidden shadow-elegant">
                          <img
                            src={location.image}
                            alt={`${location.city} store`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="md:w-1/2 space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-primary-400">Direccion</p>
                            <p className="font-medium">{location.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-primary-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-primary-400">Telefono</p>
                            <p className="font-medium">{location.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-primary-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-primary-400">Horario</p>
                            <p className="font-medium">{location.hours}</p>
                          </div>
                        </div>

                        <button className="w-full mt-4 py-3 bg-primary-100 text-foreground font-medium rounded-lg hover:bg-primary-200 transition-colors">
                          Obtener Direcciones
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
