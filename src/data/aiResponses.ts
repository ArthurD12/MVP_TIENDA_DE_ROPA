export const aiResponses = {
  welcome: '¡Hola! Soy tu Asistente de Moda IA de MUJER UNICA. Estoy aqui para ayudarte a encontrar el outfit perfecto y resolver todas tus dudas sobre estilo y tallas. ¿En que puedo ayudarte hoy?',

  weatherOutfits: {
    lima: {
      city: 'Lima',
      temperature: 18,
      condition: 'templado',
      recommendation: 'Detectamos un clima templado de 18°C con cielo parcialmente nublado. Te sugerimos nuestro Conjunto Casual Urbano: una chaqueta denim con camiseta premium blanca y jeans slim fit. Este look te mantendra comodo durante todo el dia.',
      outfit: 'outfit-3',
    },
    madrid: {
      city: 'Madrid',
      temperature: 22,
      condition: 'soleado',
      recommendation: 'En Madrid tenemos 22°C y sol radiante. Perfecto para un look Boho Chic: el vestido midi floral con bufanda de cachemira ligera y nuestro bolso estructurado de cuero. Ideal para pasear por el Retiro.',
      outfit: 'outfit-2',
    },
    cdmx: {
      city: 'Ciudad de Mexico',
      temperature: 16,
      condition: 'fresco',
      recommendation: 'Clima fresco de 16°C en CDMX. Recomendamos el Look Ejecutivo Urbano: blazer negro estructurado sobre camiseta premium y jeans. Añade una bufanda de cachemira para las mananas frescas.',
      outfit: 'outfit-1',
    },
    bogota: {
      city: 'Bogota',
      temperature: 14,
      condition: 'frio moderado',
      recommendation: 'Bogota reporta 14°C. Nuestra sugerencia es el Look Ejecutivo con capa adicional: blazer estructurado, jeans slim, y la bufanda de cachemira en tono camel. Elegante y abrigado.',
      outfit: 'outfit-1',
    },
  },

  sizeCalculator: {
    formula: (height: number, weight: number): { size: string; message: string } => {
      let size = 'M';
      let message = '';

      const bmi = weight / ((height / 100) ** 2);

      if (bmi < 18.5) {
        size = 'XS';
        message = 'Tu复杂 indica que la talla XS se ajustara perfectamente a tu figura. Para prendas con elasticidad, considera tambien la talla S para un look mas relajado.';
      } else if (bmi >= 18.5 && bmi < 25) {
        size = 'M';
        message = 'Perfecto equilibrio. La talla M es ideal para ti. Nuestros cortes slim fit y regular fit te sentaran de maravilla. Para blazers, considera talla L si prefieres mas comodidad en los hombros.';
      } else if (bmi >= 25 && bmi < 30) {
        size = 'L';
        message = 'Basado en tus medidas, la talla L te brindara el ajuste comodo que buscas. Para pantalones, considera nuestra linea wide-leg para un look contemporaneo y confortable.';
      } else {
        size = 'XL';
        message = 'Recomendamos la talla XL para un ajuste comodo y elegante. Nuestra coleccion incluye tallas XL con diseños que favorecen tu figura. Evita prendas muy ajustadas y opta por cortes regular fit.';
      }

      return { size, message };
    },
  },

  colorAnalysis: {
    validCombos: [
      { colors: ['Negro', 'Blanco'], message: 'Clasico y atemporal. Negro con blanco es una combinacion infalible para cualquier ocasion - desde reuniones hasta eventos nocturnos.' },
      { colors: ['Azul Marino', 'Beige'], message: 'Elegancia casual. Azul marino con beige tonos neutrales es perfecto para un look de oficina moderno o fines de semana sofisticados.' },
      { colors: ['Negro', 'Beige'], message: 'Sofisticacion minimalista. Negro con beige crea contraste elegante, ideal para eventos formales o cenas elegantes.' },
      { colors: ['Burdeos', 'Negro'], message: 'Intensidad refinada. Burdeos con negro añade profundidad y drama, perfecto para salidas nocturnas.' },
      { colors: ['Blanco', 'Crema'], message: 'Tonalidad armoniosa. Blanco con crema crea un look monacromatico suave y elegante para eventos diurnos.' },
    ],
    analyze: (colors: string[]): string => {
      const colorSet = new Set(colors.map(c => c.toLowerCase()));

      for (const combo of aiResponses.colorAnalysis.validCombos) {
        const comboSet = new Set(combo.colors.map(c => c.toLowerCase()));
        const intersection = [...colorSet].filter(c => comboSet.has(c));
        if (intersection.length >= 2) {
          return combo.message;
        }
      }

      return 'Tu seleccion de colores es unica. Te recomendamos equilibrar tonos oscuros con claros para crear contraste visual atractivo. Si necesitas mas ayuda, puedo sugerir paletas completas para tu outfit.';
    },
  },

  generalResponses: [
    'Entiendo tu consulta. Basandome en las tendencias actuales de moda, te sugiero explorar nuestra coleccion de conjuntos ejecutivos para un look profesional moderno.',
    'Excelente eleccion. Ese estilo es muy versatil y combina bien con multiples accesorios de nuestra tienda.',
    'Segun tu historial de compras, te recomiendo considerar nuestra nueva linea de primavera que complementa tu estilo preferido.',
    'Puedo ayudarte a crear un armario capsula. Comienza con piezas basicas de colores neutros: negro, blanco, beige y añade gradualmente acentos de color.',
  ],
};

export const quickPrompts = [
  {
    id: 'weather',
    label: 'Recomendar outfit por clima',
    icon: 'cloud',
    action: 'weather',
  },
  {
    id: 'size',
    label: 'Asistente de tallas inteligente',
    icon: 'ruler',
    action: 'size',
  },
  {
    id: 'colors',
    label: 'Analizar combinacion de colores',
    icon: 'palette',
    action: 'colors',
  },
  {
    id: 'outfit',
    label: 'Crear outfit personalizado',
    icon: 'shirt',
    action: 'outfit',
  },
];
