import React from 'react';
import { motion } from 'motion/react';

interface BackVisualizerProps {
  selectedRegion: 'cervicale' | 'dorsale' | 'lombare' | 'tutta';
  onSelectRegion: (region: 'cervicale' | 'dorsale' | 'lombare' | 'tutta') => void;
  language?: 'it' | 'en';
}

const REGION_INFO = {
  it: {
    tutta: {
      title: 'La Tua Colonna Vertebrale',
      desc: 'Un capolavoro biologico di 33 vertebre. Mantenerla mobile, forte e allungata previene dolori e migliora la postura quotidiana.',
      tips: 'Abbina sempre esercizi di mobilità a esercizi di rinforzo del core per un supporto ottimale.'
    },
    cervicale: {
      title: 'Tratto Cervicale (7 Vertebre)',
      desc: 'Sostiene la testa e consente la rotazione. Spesso teso per via della postura "testa in avanti" causata da smartphone e PC.',
      tips: 'Rilassa le spalle, evita di irrigidire la mascella e fai allungamenti controllati e lenti.'
    },
    dorsale: {
      title: 'Tratto Dorsale / Toracico (12 Vertebre)',
      desc: 'La porzione collegata alla gabbia toracica. Tende ad irrigidirsi in "ipercifosi" (spalle curve) dopo ore di sedia.',
      tips: 'Esegui rotazioni e aperture del petto per migliorare la respirazione e scaricare la cervicale.'
    },
    lombare: {
      title: 'Tratto Lombare (5 Vertebre)',
      desc: 'La base portante della schiena, soggetta al maggior carico. È la zona più colpita da lombalgia, ernie e tensioni.',
      tips: 'Rinforza i glutei e l\'addome profondo per creare un corsetto naturale che scarichi il peso.'
    }
  },
  en: {
    tutta: {
      title: 'Your Spine',
      desc: 'A biological masterpiece of 33 vertebrae. Keeping it mobile, strong, and stretched prevents pain and improves daily posture.',
      tips: 'Always pair mobility exercises with deep core strengthening for optimal support.'
    },
    cervicale: {
      title: 'Cervical Spine (7 Vertebrae)',
      desc: 'Supports the head and allows rotation. Often tense due to the "forward head" posture caused by smartphones and PCs.',
      tips: 'Relax your shoulders, avoid clenching your jaw, and perform slow, controlled stretches.'
    },
    dorsale: {
      title: 'Thoracic Spine (12 Vertebrae)',
      desc: 'The section connected to the rib cage. Tends to stiffen into rounded shoulders after hours of sitting.',
      tips: 'Perform rotations and chest openers to improve breathing and relieve neck pressure.'
    },
    lombare: {
      title: 'Lumbar Spine (5 Vertebrae)',
      desc: 'The main load-bearing base of the back, subject to the most strain. It is the area most affected by lower back pain and disc issues.',
      tips: 'Strengthen your glutes and deep abdomen to create a natural corset that unloads weight.'
    }
  }
};

export default function BackVisualizer({ selectedRegion, onSelectRegion, language = 'it' }: BackVisualizerProps) {
  const currentInfo = REGION_INFO[language][selectedRegion];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
      {/* SVG Container */}
      <div className="relative w-48 h-80 flex-shrink-0 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100/60">
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full select-none"
          id="spine-visualizer"
        >
          {/* Subtle Torso Outline */}
          <path
            d="M 50 15 
               C 35 15, 30 25, 30 35 
               C 30 45, 25 55, 20 65 
               C 15 75, 18 100, 22 120 
               C 26 140, 24 165, 28 185
               C 30 190, 70 190, 72 185
               C 76 165, 74 140, 78 120
               C 82 100, 85 75, 80 65
               C 75 55, 70 45, 70 35
               C 70 25, 65 15, 50 15 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Spine Column Background */}
          <line x1="50" y1="35" x2="50" y2="175" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

          {/* Cervicale Region (Top) */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectRegion(selectedRegion === 'cervicale' ? 'tutta' : 'cervicale')}
          >
            {/* Cervical vertebrae representational path */}
            <path
              d="M 45 35 Q 50 33 55 35 M 43 45 Q 50 43 57 45 M 44 55 Q 50 53 56 55"
              fill="none"
              stroke={selectedRegion === 'cervicale' ? '#3b82f6' : '#94a3b8'}
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-colors duration-200"
            />
            {/* Hotspot Box */}
            <rect
              x="35"
              y="28"
              width="30"
              height="32"
              fill="transparent"
              className="group-hover:fill-blue-500/10 transition-colors duration-200"
              rx="4"
            />
            <text x="15" y="47" className="text-[7px] font-medium fill-slate-400 group-hover:fill-blue-500 transition-colors pointer-events-none">
              {language === 'it' ? 'Cervicale' : 'Cervical'}
            </text>
          </g>

          {/* Dorsale Region (Middle) */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectRegion(selectedRegion === 'dorsale' ? 'tutta' : 'dorsale')}
          >
            {/* Thoracic vertebrae representational path */}
            <path
              d="M 43 68 Q 50 66 57 68 M 42 80 Q 50 78 58 80 M 41 92 Q 50 90 59 92 M 42 104 Q 50 102 58 104 M 43 116 Q 50 114 57 116"
              fill="none"
              stroke={selectedRegion === 'dorsale' ? '#10b981' : '#94a3b8'}
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-colors duration-200"
            />
            {/* Hotspot Box */}
            <rect
              x="35"
              y="62"
              width="30"
              height="58"
              fill="transparent"
              className="group-hover:fill-emerald-500/10 transition-colors duration-200"
              rx="4"
            />
            <text x="15" y="93" className="text-[7px] font-medium fill-slate-400 group-hover:fill-emerald-500 transition-colors pointer-events-none">
              {language === 'it' ? 'Dorsale' : 'Thoracic'}
            </text>
          </g>

          {/* Lombare Region (Bottom) */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectRegion(selectedRegion === 'lombare' ? 'tutta' : 'lombare')}
          >
            {/* Lumbar vertebrae representational path */}
            <path
              d="M 41 128 Q 50 126 59 128 M 40 140 Q 50 138 60 140 M 41 152 Q 50 150 59 152 M 43 164 Q 50 162 57 164"
              fill="none"
              stroke={selectedRegion === 'lombare' ? '#f59e0b' : '#94a3b8'}
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-colors duration-200"
            />
            {/* Hotspot Box */}
            <rect
              x="35"
              y="122"
              width="30"
              height="48"
              fill="transparent"
              className="group-hover:fill-amber-500/10 transition-colors duration-200"
              rx="4"
            />
            <text x="15" y="148" className="text-[7px] font-medium fill-slate-400 group-hover:fill-amber-500 transition-colors pointer-events-none">
              {language === 'it' ? 'Lombare' : 'Lumbar'}
            </text>
          </g>

          {/* Reset/Whole Spine button */}
          <circle
            cx="50"
            cy="188"
            r="5"
            fill={selectedRegion === 'tutta' ? '#6366f1' : '#cbd5e1'}
            className="cursor-pointer hover:fill-indigo-500 transition-colors"
            onClick={() => onSelectRegion('tutta')}
          />
          <text
            x="50"
            y="198"
            textAnchor="middle"
            className="text-[6px] font-semibold fill-slate-400 cursor-pointer hover:fill-indigo-500 transition-colors"
            onClick={() => onSelectRegion('tutta')}
          >
            {language === 'it' ? 'TUTTA LA SCHIENA' : 'WHOLE SPINE'}
          </text>
        </svg>

        {/* Floating Indicator */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] text-slate-500 px-2 py-0.5 rounded-full border border-slate-100 shadow-2xs font-medium">
          {language === 'it' ? 'Seleziona zona' : 'Select region'}
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${
            selectedRegion === 'cervicale' ? 'bg-blue-500' :
            selectedRegion === 'dorsale' ? 'bg-emerald-500' :
            selectedRegion === 'lombare' ? 'bg-amber-500' : 'bg-indigo-500'
          }`} />
          <h3 className="font-display text-xl font-bold text-slate-800">
            {currentInfo.title}
          </h3>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed">
          {currentInfo.desc}
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'it' ? 'Consiglio Posturale' : 'Posture Tip'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {currentInfo.tips}
            </p>
          </div>
        </div>

        {selectedRegion !== 'tutta' && (
          <button
            id="reset-filter-btn"
            onClick={() => onSelectRegion('tutta')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors mt-2"
          >
            {language === 'it' ? '← Mostra tutti gli esercizi' : '← Show all exercises'}
          </button>
        )}
      </div>
    </div>
  );
}
