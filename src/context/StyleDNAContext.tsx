import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BodyMeasurements, SavedOutfit, Outfit, FitType } from '../types';

interface StyleDNAContextType {
  measurements: BodyMeasurements;
  setMeasurements: (m: BodyMeasurements) => void;
  hasMeasurements: boolean;
  getFitRecommendation: (productCategory: string) => FitType | null;
  savedOutfits: SavedOutfit[];
  saveOutfit: (outfit: Outfit) => void;
  removeOutfit: (outfitId: string) => void;
  isOutfitSaved: (outfitId: string) => boolean;
}

const StyleDNAContext = createContext<StyleDNAContextType | undefined>(undefined);

const MEASUREMENTS_KEY = 'vertice_measurements';
const WARDROBE_KEY = 'vertice_wardrobe';

function computeFit(chest: number, category: string): FitType {
  if (category === 'accesorios') return 'Regular';
  if (chest < 82) return 'Ajustado (Slim)';
  if (chest < 96) return 'Regular';
  if (chest < 110) return 'Holgado (Relaxed)';
  return 'Oversize';
}

export function StyleDNAProvider({ children }: { children: ReactNode }) {
  const [measurements, setMeasurementsState] = useState<BodyMeasurements>({
    chest: null,
    waist: null,
    hips: null,
  });
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MEASUREMENTS_KEY);
    if (stored) {
      try { setMeasurementsState(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const wardrobe = localStorage.getItem(WARDROBE_KEY);
    if (wardrobe) {
      try { setSavedOutfits(JSON.parse(wardrobe)); } catch { /* ignore */ }
    }
  }, []);

  const setMeasurements = useCallback((m: BodyMeasurements) => {
    setMeasurementsState(m);
    localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(m));
  }, []);

  const hasMeasurements = measurements.chest !== null && measurements.waist !== null && measurements.hips !== null;

  const getFitRecommendation = useCallback((productCategory: string): FitType | null => {
    if (!hasMeasurements || measurements.chest === null) return null;
    return computeFit(measurements.chest, productCategory);
  }, [hasMeasurements, measurements.chest]);

  const saveOutfit = useCallback((outfit: Outfit) => {
    setSavedOutfits(prev => {
      if (prev.some(s => s.outfit.id === outfit.id)) return prev;
      const next = [...prev, { outfit, savedAt: new Date().toISOString() }];
      localStorage.setItem(WARDROBE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeOutfit = useCallback((outfitId: string) => {
    setSavedOutfits(prev => {
      const next = prev.filter(s => s.outfit.id !== outfitId);
      localStorage.setItem(WARDROBE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isOutfitSaved = useCallback((outfitId: string) => {
    return savedOutfits.some(s => s.outfit.id === outfitId);
  }, [savedOutfits]);

  return (
    <StyleDNAContext.Provider value={{
      measurements,
      setMeasurements,
      hasMeasurements,
      getFitRecommendation,
      savedOutfits,
      saveOutfit,
      removeOutfit,
      isOutfitSaved,
    }}>
      {children}
    </StyleDNAContext.Provider>
  );
}

export function useStyleDNA() {
  const ctx = useContext(StyleDNAContext);
  if (!ctx) throw new Error('useStyleDNA must be used within StyleDNAProvider');
  return ctx;
}
