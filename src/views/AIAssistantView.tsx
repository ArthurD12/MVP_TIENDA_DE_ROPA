import { useState, useRef, useEffect } from 'react';
import { aiResponses } from '../data/aiResponses';
import { ChatMessage } from '../types';
import { Sparkles, Send, Cloud, Ruler, Palette, Shirt, X, Bot, User as UserIcon, Loader2, SlidersHorizontal } from 'lucide-react';

interface AIAssistantViewProps {
  minimal?: boolean;
  onClose?: () => void;
  onNavigate?: (view: string, tab?: string) => void;
}

export function AIAssistantView({ minimal, onClose, onNavigate }: AIAssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: aiResponses.welcome,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [sizeForm, setSizeForm] = useState({ height: '', weight: '' });
  const [colorSelection, setColorSelection] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const simulateAI = async (response: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    addMessage(response, 'assistant');
    setActivePrompt(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    addMessage(input, 'user');
    setInput('');

    const randomResponse = aiResponses.generalResponses[Math.floor(Math.random() * aiResponses.generalResponses.length)];
    await simulateAI(randomResponse);
  };

  const handleWeatherPrompt = async (city: string) => {
    setSelectedCity(city);
    const weatherData = aiResponses.weatherOutfits[city.toLowerCase() as keyof typeof aiResponses.weatherOutfits];
    if (weatherData) {
      const message = `Clima en ${weatherData.city}: ${weatherData.temperature}°C - ${weatherData.condition}. ${weatherData.recommendation}`;
      await simulateAI(message);
    }
  };

  const handleSizeCalculation = async () => {
    const height = parseFloat(sizeForm.height);
    const weight = parseFloat(sizeForm.weight);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      return;
    }

    const result = aiResponses.sizeCalculator.formula(height, weight);
    const message = `Tu talla recomendada es: ${result.size}\n\n${result.message}`;
    await simulateAI(message);
    setSizeForm({ height: '', weight: '' });
  };

  const handleColorAnalysis = async () => {
    if (colorSelection.length < 2) return;

    const message = aiResponses.colorAnalysis.analyze(colorSelection);
    await simulateAI(`Analisis de colores: ${colorSelection.join(', ')}\n\n${message}`);
    setColorSelection([]);
  };

  const handleConfigureMedidas = () => {
    addMessage('Configurar mis medidas para recomendaciones', 'user');
    if (onNavigate) {
      simulateAI('¡Perfecto! Te llevo directamente a "Mi Fit Ideal" para que configures tu Maniquí Blueprint. Una vez guardadas tus medidas, cada prenda mostrará una predicción de fit personalizada.').then(() => {
        setTimeout(() => {
          onNavigate('profile', 'fit');
          if (onClose) onClose();
        }, 600);
      });
    } else {
      simulateAI('Dirígete a tu Perfil → pestaña "Mi Fit Ideal" para ingresar tus medidas de Pecho, Cintura y Cadera. Una vez guardadas, cada prenda mostrará una predicción de fit personalizada por nuestra IA.');
    }
  };

  const getIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      cloud: <Cloud className="w-4 h-4" />,
      ruler: <Ruler className="w-4 h-4" />,
      palette: <Palette className="w-4 h-4" />,
      shirt: <Shirt className="w-4 h-4" />,
    };
    return icons[icon] || <Sparkles className="w-4 h-4" />;
  };

  const colors = ['Negro', 'Blanco', 'Beige', 'Azul Marino', 'Burdeos', 'Crema', 'Gris', 'Verde', 'Rojo'];

  const quickPrompts = [
    { id: 'weather', label: 'Recomendar outfit por clima', icon: 'cloud', action: 'weather' },
    { id: 'size',    label: 'Asistente de tallas',         icon: 'ruler', action: 'size' },
    { id: 'colors',  label: 'Analizar colores',             icon: 'palette', action: 'colors' },
    { id: 'outfit',  label: 'Crear outfit',                  icon: 'shirt', action: 'outfit' },
  ];

  return (
    <div className={`bg-white ${minimal ? 'h-[500px]' : 'min-h-screen'} flex flex-col`}>
      {!minimal && (
        <div className="bg-gradient-to-r from-foreground to-primary-800 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Inteligencia Artificial</span>
            </div>
            <h1 className="text-4xl font-light mb-4">
              Asistente de Moda <span className="font-semibold">IA</span>
            </h1>
            <p className="text-white/80">
              Tu estilista personal impulsado por IA. Recomendaciones de outfits, calculadora de tallas y analisis de colores.
            </p>
          </div>
        </div>
      )}

      {minimal && onClose && (
        <div className="flex items-center justify-between p-4 border-b border-primary-200">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-500" />
            <span className="font-medium">Asistente IA</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-primary-100 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'assistant' ? 'bg-primary-100' : 'bg-foreground'
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary-600" />
              ) : (
                <UserIcon className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'assistant'
                  ? 'bg-primary-50 rounded-tl-none'
                  : 'bg-foreground text-white rounded-tr-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <div className="bg-primary-50 p-4 rounded-2xl rounded-tl-none">
              <div className="flex items-center gap-2 text-sm text-primary-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando tus preferencias...
              </div>
            </div>
          </div>
        )}

        {activePrompt && !loading && (
          <div className="bg-white border border-primary-200 rounded-xl p-4 animate-fade-in">
            {activePrompt === 'weather' && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Selecciona tu ciudad:</p>
                <div className="flex flex-wrap gap-2">
                  {['Lima', 'Madrid', 'CDMX', 'Bogota'].map(city => (
                    <button
                      key={city}
                      onClick={() => handleWeatherPrompt(city)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedCity === city
                          ? 'bg-foreground text-white'
                          : 'bg-primary-100 hover:bg-primary-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePrompt === 'size' && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Ingresa tus medidas:</p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-primary-500 mb-1 block">Estatura (cm)</label>
                    <input
                      type="number"
                      value={sizeForm.height}
                      onChange={e => setSizeForm({ ...sizeForm, height: e.target.value })}
                      placeholder="170"
                      className="w-full px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-primary-500 mb-1 block">Peso (kg)</label>
                    <input
                      type="number"
                      value={sizeForm.weight}
                      onChange={e => setSizeForm({ ...sizeForm, weight: e.target.value })}
                      placeholder="70"
                      className="w-full px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSizeCalculation}
                  disabled={!sizeForm.height || !sizeForm.weight}
                  className="w-full py-2 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 text-sm"
                >
                  Calcular Talla
                </button>
              </div>
            )}

            {activePrompt === 'colors' && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Selecciona al menos 2 colores:</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setColorSelection(prev =>
                          prev.includes(color)
                            ? prev.filter(c => c !== color)
                            : [...prev, color]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        colorSelection.includes(color)
                          ? 'bg-foreground text-white'
                          : 'bg-primary-100 hover:bg-primary-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleColorAnalysis}
                  disabled={colorSelection.length < 2}
                  className="w-full py-2 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 text-sm"
                >
                  Analizar Combinacion
                </button>
              </div>
            )}

            {activePrompt === 'outfit' && (
              <div className="text-center py-4">
                <Shirt className="w-12 h-12 mx-auto mb-3 text-primary-400" />
                <p className="text-sm text-primary-600 mb-2">Cuentame la ocasion y tus preferencias</p>
                <input
                  type="text"
                  placeholder="Ej: Quiero un look para una boda casual"
                  onChange={e => setInput(e.target.value)}
                  value={input}
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg text-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && input.trim()) {
                      addMessage(input, 'user');
                      setInput('');
                      simulateAI('Para una boda casual te sugiero un look semi-formal: pantalon chino beige, camisa de lino en tono pastel y zapatos Oxford. Añade un blazer ligero si el evento es de noche. Echa un vistazo a nuestra coleccion de conjuntos ejecutivos para inspirarte.');
                      setActivePrompt(null);
                    }
                  }}
                />
              </div>
            )}

            <button
              onClick={() => setActivePrompt(null)}
              className="mt-4 w-full py-2 bg-primary-100 text-primary-600 font-medium rounded-lg hover:bg-primary-200 transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-primary-200 p-4 space-y-3">
        {/* Regular quick prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map(prompt => (
            <button
              key={prompt.id}
              onClick={() => setActivePrompt(prompt.action)}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                activePrompt === prompt.action
                  ? 'bg-foreground text-white'
                  : 'bg-primary-100 hover:bg-primary-200 text-primary-600'
              }`}
            >
              {getIcon(prompt.icon)}
              {prompt.label}
            </button>
          ))}
        </div>

        {/* New special prompt — configure measurements */}
        <button
          onClick={handleConfigureMedidas}
          disabled={loading}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-dashed border-primary-300 text-primary-600 hover:border-foreground hover:text-foreground hover:bg-primary-50 transition-all disabled:opacity-50"
        >
          <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
          Configurar mis medidas para recomendaciones
        </button>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-foreground text-white rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
