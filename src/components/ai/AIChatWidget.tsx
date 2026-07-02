import { useState } from 'react';
import { AIAssistantView } from '../../views/AIAssistantView';
import { Bot, Sparkles } from 'lucide-react';

interface AIChatWidgetProps {
  onNavigate: (view: string, tab?: string) => void;
}

export function AIChatWidget({ onNavigate }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-foreground text-white rounded-full shadow-elegant-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-elegant-lg overflow-hidden animate-slide-up">
          <AIAssistantView
            minimal
            onClose={() => setIsOpen(false)}
            onNavigate={(view, tab) => {
              setIsOpen(false);
              onNavigate(view, tab);
            }}
          />
        </div>
      )}
    </>
  );
}
