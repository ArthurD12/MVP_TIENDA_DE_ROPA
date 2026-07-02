import { useState } from 'react';
import { useStyleDNA } from '../../context/StyleDNAContext';
import { useToast } from '../../context/ToastContext';
import { BodyMeasurements } from '../../types';
import { Ruler, Save, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

type ActiveZone = 'chest' | 'waist' | 'hips' | null;

export function MiFitIdeal() {
  const { measurements, setMeasurements, hasMeasurements } = useStyleDNA();
  const { showToast } = useToast();
  const [activeZone, setActiveZone] = useState<ActiveZone>(null);
  const [form, setForm] = useState<{ chest: string; waist: string; hips: string }>({
    chest: measurements.chest !== null ? String(measurements.chest) : '',
    waist: measurements.waist !== null ? String(measurements.waist) : '',
    hips: measurements.hips !== null ? String(measurements.hips) : '',
  });

  const handleSave = () => {
    const chest = parseFloat(form.chest);
    const waist = parseFloat(form.waist);
    const hips = parseFloat(form.hips);

    if (isNaN(chest) || isNaN(waist) || isNaN(hips) || chest <= 0 || waist <= 0 || hips <= 0) {
      showToast('Por favor ingresa medidas válidas en centímetros', 'error');
      return;
    }
    if (chest < 50 || chest > 200 || waist < 40 || waist > 200 || hips < 50 || hips > 200) {
      showToast('Verifica que las medidas estén en un rango razonable (cm)', 'error');
      return;
    }

    const updated: BodyMeasurements = { chest, waist, hips };
    setMeasurements(updated);
    showToast('Medidas guardadas — ¡tu ADN de estilo está listo!', 'success');
    setActiveZone(null);
  };

  const chestVal = parseFloat(form.chest) || 0;
  const waistVal = parseFloat(form.waist) || 0;
  const hipsVal = parseFloat(form.hips) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Ruler className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold">Mi Fit Ideal</h3>
          <p className="text-xs text-primary-500">Maniquí Blueprint — ADN de Estilo</p>
        </div>
        {hasMeasurements && (
          <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Configurado
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SVG Wireframe Mannequin */}
        <div className="flex-shrink-0 mx-auto">
          <MannequinSVG activeZone={activeZone} chest={chestVal} waist={waistVal} hips={hipsVal} />
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4 w-full">
          <p className="text-sm text-primary-500 leading-relaxed">
            Ingresa tus medidas reales para que nuestra IA personalice las recomendaciones de talla en cada prenda.
          </p>

          <MeasurementInput
            label="Pecho"
            zone="chest"
            value={form.chest}
            onChange={v => setForm(f => ({ ...f, chest: v }))}
            onFocus={() => setActiveZone('chest')}
            onBlur={() => setActiveZone(null)}
            active={activeZone === 'chest'}
            hint="Mide alrededor de la parte más amplia del pecho."
          />
          <MeasurementInput
            label="Cintura"
            zone="waist"
            value={form.waist}
            onChange={v => setForm(f => ({ ...f, waist: v }))}
            onFocus={() => setActiveZone('waist')}
            onBlur={() => setActiveZone(null)}
            active={activeZone === 'waist'}
            hint="Mide en el punto más estrecho, encima del ombligo."
          />
          <MeasurementInput
            label="Cadera"
            zone="hips"
            value={form.hips}
            onChange={v => setForm(f => ({ ...f, hips: v }))}
            onFocus={() => setActiveZone('hips')}
            onBlur={() => setActiveZone(null)}
            active={activeZone === 'hips'}
            hint="Mide alrededor de la parte más ancha de la cadera."
          />

          {hasMeasurements && (
            <div className="bg-primary-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-semibold text-primary-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Medidas actuales
              </p>
              <div className="flex gap-4 text-sm">
                <span><span className="text-primary-400">Pecho:</span> <span className="font-medium">{measurements.chest} cm</span></span>
                <span><span className="text-primary-400">Cintura:</span> <span className="font-medium">{measurements.waist} cm</span></span>
                <span><span className="text-primary-400">Cadera:</span> <span className="font-medium">{measurements.hips} cm</span></span>
              </div>
            </div>
          )}

          {!hasMeasurements && (
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Sin medidas guardadas. Las tarjetas de producto no mostrarán la predicción de fit hasta que guardes tus datos.</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Medidas
          </button>
        </div>
      </div>
    </div>
  );
}

function MeasurementInput({
  label, value, onChange, onFocus, onBlur, active, hint,
}: {
  label: string;
  zone: ActiveZone;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  active: boolean;
  hint: string;
}) {
  return (
    <div className={`rounded-xl border transition-all ${active ? 'border-foreground bg-primary-50 shadow-elegant' : 'border-primary-200 bg-white'}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${active ? 'bg-foreground' : 'bg-primary-300'}`} />
        <label className="text-sm font-medium w-20 flex-shrink-0">{label}</label>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="cm"
          min={1}
          max={300}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder-primary-300"
        />
        <span className="text-xs text-primary-400">cm</span>
      </div>
      {active && (
        <div className="px-4 pb-3 pt-0">
          <p className="text-xs text-primary-500">{hint}</p>
        </div>
      )}
    </div>
  );
}

function MannequinSVG({ activeZone, chest, waist, hips }: {
  activeZone: ActiveZone;
  chest: number;
  waist: number;
  hips: number;
}) {
  const pulse = (zone: ActiveZone) => zone === activeZone;

  const chestWidth = chest > 0 ? Math.min(Math.max((chest / 120) * 60, 30), 70) : 48;
  const waistWidth = waist > 0 ? Math.min(Math.max((waist / 120) * 46, 22), 55) : 34;
  const hipsWidth = hips > 0 ? Math.min(Math.max((hips / 120) * 62, 30), 72) : 50;

  const cx = 80;

  return (
    <svg
      viewBox="0 0 160 280"
      width="160"
      height="280"
      className="select-none"
      aria-label="Maniqui con zonas resaltadas"
    >
      {/* Head */}
      <circle
        cx={cx} cy={22} r={16}
        fill="none"
        stroke={activeZone ? '#d1d5db' : '#374151'}
        strokeWidth="1.5"
      />
      {/* Neck */}
      <rect x={cx - 7} y={36} width={14} height={12} rx={3}
        fill="none"
        stroke={activeZone ? '#d1d5db' : '#374151'}
        strokeWidth="1.5"
      />

      {/* Shoulders */}
      <path
        d={`M${cx - chestWidth / 2 - 6},54 Q${cx - chestWidth / 2 - 14},50 ${cx - chestWidth / 2 - 18},62`}
        fill="none" stroke={pulse('chest') ? '#111111' : '#9ca3af'} strokeWidth={pulse('chest') ? 2.5 : 1.5}
        strokeLinecap="round"
      />
      <path
        d={`M${cx + chestWidth / 2 + 6},54 Q${cx + chestWidth / 2 + 14},50 ${cx + chestWidth / 2 + 18},62`}
        fill="none" stroke={pulse('chest') ? '#111111' : '#9ca3af'} strokeWidth={pulse('chest') ? 2.5 : 1.5}
        strokeLinecap="round"
      />

      {/* Arms */}
      <path
        d={`M${cx - chestWidth / 2 - 18},62 L${cx - chestWidth / 2 - 22},110 L${cx - chestWidth / 2 - 18},130`}
        fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d={`M${cx + chestWidth / 2 + 18},62 L${cx + chestWidth / 2 + 22},110 L${cx + chestWidth / 2 + 18},130`}
        fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"
      />

      {/* Chest zone — torso upper */}
      <path
        d={`M${cx - chestWidth / 2 - 6},54
           C${cx - chestWidth / 2},48 ${cx + chestWidth / 2},48 ${cx + chestWidth / 2 + 6},54
           L${cx + waistWidth / 2},110
           C${cx + waistWidth / 4},112 ${cx - waistWidth / 4},112 ${cx - waistWidth / 2},110
           Z`}
        fill={pulse('chest') ? 'rgba(17,17,17,0.06)' : 'rgba(0,0,0,0.02)'}
        stroke={pulse('chest') ? '#111111' : '#9ca3af'}
        strokeWidth={pulse('chest') ? 2 : 1.5}
        className="transition-all duration-200"
      />

      {/* Waist zone */}
      <path
        d={`M${cx - waistWidth / 2},110
           C${cx - waistWidth / 4},112 ${cx + waistWidth / 4},112 ${cx + waistWidth / 2},110
           L${cx + hipsWidth / 2},142
           C${cx + hipsWidth / 4},144 ${cx - hipsWidth / 4},144 ${cx - hipsWidth / 2},142
           Z`}
        fill={pulse('waist') ? 'rgba(17,17,17,0.06)' : 'rgba(0,0,0,0.02)'}
        stroke={pulse('waist') ? '#111111' : '#9ca3af'}
        strokeWidth={pulse('waist') ? 2 : 1.5}
        className="transition-all duration-200"
      />

      {/* Hips zone */}
      <path
        d={`M${cx - hipsWidth / 2},142
           C${cx - hipsWidth / 4},144 ${cx + hipsWidth / 4},144 ${cx + hipsWidth / 2},142
           L${cx + hipsWidth / 2 - 2},168
           C${cx + 12},170 ${cx - 12},170 ${cx - hipsWidth / 2 + 2},168
           Z`}
        fill={pulse('hips') ? 'rgba(17,17,17,0.06)' : 'rgba(0,0,0,0.02)'}
        stroke={pulse('hips') ? '#111111' : '#9ca3af'}
        strokeWidth={pulse('hips') ? 2 : 1.5}
        className="transition-all duration-200"
      />

      {/* Legs */}
      <path
        d={`M${cx - hipsWidth / 2 + 2},168 C${cx - 12},170 ${cx - 4},170 ${cx - 5},178 L${cx - 8},240`}
        fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d={`M${cx + hipsWidth / 2 - 2},168 C${cx + 12},170 ${cx + 4},170 ${cx + 5},178 L${cx + 8},240`}
        fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"
      />

      {/* Feet */}
      <ellipse cx={cx - 9} cy={242} rx={9} ry={4} fill="none" stroke="#d1d5db" strokeWidth="1.5" />
      <ellipse cx={cx + 9} cy={242} rx={9} ry={4} fill="none" stroke="#d1d5db" strokeWidth="1.5" />

      {/* Zone labels */}
      {pulse('chest') && (
        <text x={cx + chestWidth / 2 + 10} y={82} fontSize="8" fill="#111111" fontWeight="600">Pecho</text>
      )}
      {pulse('waist') && (
        <text x={cx + waistWidth / 2 + 8} y={126} fontSize="8" fill="#111111" fontWeight="600">Cintura</text>
      )}
      {pulse('hips') && (
        <text x={cx + hipsWidth / 2 + 8} y={156} fontSize="8" fill="#111111" fontWeight="600">Cadera</text>
      )}

      {/* Dot indicators when no zone is active */}
      {!activeZone && (
        <>
          <circle cx={cx} cy={82} r={3} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx={cx} cy={125} r={3} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx={cx} cy={155} r={3} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
        </>
      )}
    </svg>
  );
}
