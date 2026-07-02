import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sampleOrders } from '../data/products';
import { ProfileTabType } from '../types';
import { MiFitIdeal } from '../components/profile/MiFitIdeal';
import { MiArmario } from '../components/profile/MiArmario';
import {
  User, Mail, Phone, MapPin, ShoppingBag, Save,
  FileText, X, Package, Ruler, Archive,
} from 'lucide-react';

interface ProfileViewProps {
  onViewChange?: (view: string) => void;
  initialTab?: ProfileTabType;
}

export function ProfileView({ onViewChange: _onViewChange, initialTab }: ProfileViewProps) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileTabType>(initialTab || 'data');
  const [selectedOrder, setSelectedOrder] = useState<typeof sampleOrders[0] | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = () => {
    updateUser(formData);
    showToast('Perfil actualizado correctamente', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado':  return 'bg-green-100 text-green-700';
      case 'enviado':    return 'bg-blue-100 text-blue-700';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-700';
      default:           return 'bg-primary-100 text-primary-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'entregado':  return 'Entregado';
      case 'enviado':    return 'Enviado';
      case 'en_proceso': return 'En Proceso';
      case 'pendiente':  return 'Pendiente';
      default:           return status;
    }
  };

  const tabs: { key: ProfileTabType; label: string; icon: typeof User }[] = [
    { key: 'data',     label: 'Datos Personales', icon: User },
    { key: 'orders',   label: 'Pedidos',          icon: ShoppingBag },
    { key: 'fit',      label: 'Mi Fit Ideal',     icon: Ruler },
    { key: 'wardrobe', label: 'Mi Armario',        icon: Archive },
  ];

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-primary-100 to-[#F9F9F9] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <p className="text-primary-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-primary-200 mb-8 gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-primary-500 hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal data */}
        {activeTab === 'data' && (
          <div className="bg-white rounded-2xl shadow-elegant p-8 animate-fade-in">
            <h2 className="text-lg font-semibold mb-6">Informacion Personal</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                    <User className="w-4 h-4" /> Nombre Completo
                  </label>
                  <input type="text" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Correo Electronico
                  </label>
                  <input type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Telefono
                  </label>
                  <input type="tel" value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Direccion de Envio
                  </label>
                  <input type="text" value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20" />
                </div>
              </div>
              <div className="pt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors">
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-primary-200">
              <h2 className="text-lg font-semibold">Pedidos Recientes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    {['ID Pedido', 'Fecha', 'Estado', 'Total', 'Acciones'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-primary-500 uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-200">
                  {sampleOrders.map(order => (
                    <tr key={order.id} className="hover:bg-primary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-sm text-primary-500 hover:text-foreground transition-colors">
                          <FileText className="w-4 h-4" /> Ver Recibo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mi Fit Ideal */}
        {activeTab === 'fit' && (
          <div className="bg-white rounded-2xl shadow-elegant p-8 animate-fade-in">
            <MiFitIdeal />
          </div>
        )}

        {/* Mi Armario Virtual */}
        {activeTab === 'wardrobe' && (
          <div className="bg-white rounded-2xl shadow-elegant p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Archive className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">Mi Armario Virtual</h3>
                <p className="text-xs text-primary-500">Tus outfits guardados</p>
              </div>
            </div>
            <MiArmario />
          </div>
        )}
      </div>

      {/* Receipt modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elegant-lg max-w-lg w-full max-h-[90vh] overflow-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-primary-200">
              <div>
                <h3 className="text-lg font-semibold">Recibo de Pedido</h3>
                <p className="text-sm text-primary-500">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-500">Fecha</span>
                <span className="font-medium">{selectedOrder.date}</span>
              </div>
              <div className="border-t border-primary-200 pt-6">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Productos
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-primary-500">
                          {item.size && `Talla: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${item.product.price.toFixed(2)}</p>
                        <p className="text-xs text-primary-400">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-primary-200 pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => { showToast('Descargando recibo...', 'info'); setSelectedOrder(null); }}
                className="w-full py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
