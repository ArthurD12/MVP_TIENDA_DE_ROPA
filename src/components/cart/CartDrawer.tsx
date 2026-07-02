import { useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'card' | 'paypal' | 'transfer';

function PaymentModal({
  total,
  onClose,
  onSuccess,
}: {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const accountNumber = '0021 0049 88 0100674678';

  const handleCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) setExpiry(digits.slice(0, 2) + '/' + digits.slice(2));
    else setExpiry(digits);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, '')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onSuccess();
  };

  const methods: { id: PaymentMethod; label: string }[] = [
    { id: 'card', label: 'Tarjeta de Credito / Debito' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'transfer', label: 'Transferencia Bancaria' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-200">
          <div>
            <h2 className="text-lg font-semibold">Opciones de Pago</h2>
            <p className="text-sm text-primary-500 mt-0.5">Total: <span className="font-semibold text-foreground">${total.toFixed(2)}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accordion methods */}
        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {methods.map(m => (
            <div key={m.id} className="border border-primary-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveMethod(activeMethod === m.id ? m.id : m.id)}
                className={`flex items-center justify-between w-full px-4 py-3.5 text-left transition-colors ${
                  activeMethod === m.id ? 'bg-primary-50' : 'hover:bg-primary-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    activeMethod === m.id ? 'border-foreground bg-foreground' : 'border-primary-300'
                  }`}>
                    {activeMethod === m.id && (
                      <div className="w-full h-full rounded-full scale-50 bg-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{m.label}</span>
                </div>
                {activeMethod === m.id ? (
                  <ChevronUp className="w-4 h-4 text-primary-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-primary-400" />
                )}
              </button>

              {activeMethod === m.id && (
                <div className="px-4 pb-4 pt-2 border-t border-primary-100 animate-slide-down">
                  {m.id === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Numero de Tarjeta</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => handleCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="mt-1.5 w-full px-3 py-2.5 bg-primary-50 border border-primary-200 rounded-lg text-sm focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">Expiracion</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={e => handleExpiry(e.target.value)}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="mt-1.5 w-full px-3 py-2.5 bg-primary-50 border border-primary-200 rounded-lg text-sm focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-primary-500 uppercase tracking-wider">CVV</label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="mt-1.5 w-full px-3 py-2.5 bg-primary-50 border border-primary-200 rounded-lg text-sm focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {m.id === 'paypal' && (
                    <div className="py-2 flex flex-col items-center gap-3">
                      <p className="text-sm text-primary-500 text-center">Seras redirigido a PayPal para completar el pago de forma segura.</p>
                      <div className="flex items-center gap-2 px-5 py-3 bg-[#0070ba] text-white rounded-xl font-semibold text-sm shadow-md select-none w-full justify-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                        </svg>
                        Pagar con PayPal
                      </div>
                    </div>
                  )}

                  {m.id === 'transfer' && (
                    <div className="space-y-3">
                      <p className="text-sm text-primary-500">Realiza tu transferencia a la siguiente cuenta:</p>
                      <div className="bg-primary-50 rounded-lg p-4 space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-500">Banco</span>
                          <span className="font-medium">BBVA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-500">Titular</span>
                          <span className="font-medium">MUJER UNICA S.A.</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-1 border-t border-primary-200">
                          <div>
                            <span className="text-primary-500 block text-xs">Cuenta</span>
                            <span className="font-mono font-semibold">{accountNumber}</span>
                          </div>
                          <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              copied ? 'bg-green-100 text-green-700' : 'bg-white border border-primary-200 text-primary-600 hover:border-foreground hover:text-foreground'
                            }`}
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-primary-400">Envia el comprobante a pagos@mujerunica.com con tu numero de pedido.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-primary-200">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-foreground text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Confirmar Pedido · ${total.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [showPayment, setShowPayment] = useState(false);

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    onClose();
    showToast('Pago exitoso. ¡Gracias por tu compra!', 'success');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-elegant-lg z-50 animate-slide-left flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-primary-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Tu Carrito</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-primary-300 mb-4" />
              <p className="text-primary-500">Tu carrito esta vacio</p>
              <p className="text-sm text-primary-400 mt-1">Añade productos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id + item.size + item.color} className="flex gap-4 p-3 bg-primary-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-primary-500 mt-0.5">
                      {item.size}{item.color ? ` • ${item.color}` : ''}
                    </p>
                    <p className="text-sm font-semibold mt-1">${item.product.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="ml-auto text-xs text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-primary-200 p-4 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-500">IVA (16%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-primary-200 text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Proceder al Pago
            </button>
          </div>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
