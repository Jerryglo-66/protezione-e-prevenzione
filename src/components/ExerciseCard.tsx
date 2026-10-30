import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Check, ChevronDown, ChevronUp, AlertCircle, HelpCircle, Flame, Clock, Volume2, VolumeX } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseCardProps {
  key?: string;
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  isCompletedToday: boolean;
  language?: 'it' | 'en';
}

// Curated Category styling
const CATEGORY_STYLES = {
  allungamento: {
    bg: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    labelIt: 'Allungamento',
    labelEn: 'Stretching'
  },
  rinforzo: {
    bg: 'bg-red-50 border-red-100 text-red-700',
    labelIt: 'Rinforzo',
    labelEn: 'Strengthening'
  },
  mobilita: {
    bg: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    labelIt: 'Mobilità',
    labelEn: 'Mobility'
  }
};

const DIFFICULTY_COLORS: { [key: string]: string } = {
  Principiante: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  Beginner: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  Intermedio: 'text-amber-600 bg-amber-50 border-amber-100',
  Intermediate: 'text-amber-600 bg-amber-50 border-amber-100',
  Avanzato: 'text-rose-600 bg-rose-50 border-rose-100',
  Advanced: 'text-rose-600 bg-rose-50 border-rose-100'
};

export default function ExerciseCard({ exercise, onComplete, isCompletedToday, language = 'it' }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [breathPhase, setBreathPhase] = useState<'inspira' | 'espira' | 'trattieni'>('inspira');
  const [breathTimer, setBreathTimer] = useState(4); // 4 seconds inhale, 4 exhale, etc.
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceAutoPlay, setVoiceAutoPlay] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Synchronize timer reset when exercise changes or collapses
  useEffect(() => {
    if (!isExpanded) {
      stopTimer();
      setTimeLeft(exercise.durationSeconds);
    }
  }, [isExpanded, exercise.durationSeconds]);

  // Breathing Guide Loop
  useEffect(() => {
    if (isTimerActive) {
      breathIntervalRef.current = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Cycle through: Inhale (4s) -> Hold (2s, optional but let's keep it simple: Inhale 4s -> Exhale 4s)
            setBreathPhase((current) => {
              if (current === 'inspira') {
                return 'espira';
              } else {
                return 'inspira';
              }
            });
            return 4; // Reset phase to 4s
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      setBreathPhase('inspira');
      setBreathTimer(4);
    }

    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [isTimerActive]);

  // Main Countdown Timer
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Completed!
      stopTimer();
      onComplete(exercise.id);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(exercise.durationSeconds);
  };

  const handleSpeakExercise = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const stepsText = exercise.steps.join('. ');
    const shortTips = exercise.tips.join('. ');
    const announcement = language === 'it'
      ? `Esercizio ${exercise.title}. ${stepsText}. ${shortTips}`
      : `Exercise ${exercise.title}. ${stepsText}. ${shortTips}`;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = language === 'it' ? 'it-IT' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    synth.speak(utterance);
  };

  useEffect(() => {
    if (!isExpanded || !voiceAutoPlay || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const stepsText = exercise.steps.join('. ');
    const shortTips = exercise.tips.join('. ');
    const announcement = language === 'it'
      ? `Esercizio ${exercise.title}. ${stepsText}. ${shortTips}`
      : `Exercise ${exercise.title}. ${stepsText}. ${shortTips}`;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = language === 'it' ? 'it-IT' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechUtteranceRef.current = utterance;
    synth.speak(utterance);

    return () => {
      synth.cancel();
      setIsSpeaking(false);
    };
  }, [isExpanded, voiceAutoPlay, exercise, language]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Inline representational animated SVG for exercises
  const renderVisualAnimation = (type: string) => {
    switch (type) {
      case 'cat-camel':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            {/* Floor */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Hands and Knees */}
            <circle cx="35" cy="50" r="3" fill="#64748b" />
            <circle cx="65" cy="50" r="3" fill="#64748b" />
            
            {/* Animated spine/body line representing cat-camel */}
            <path
              d="M 35 50 L 35 38 Q 50 35, 65 38 L 65 50"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
              style={{
                animation: 'catCamelSpine 6s infinite ease-in-out'
              }}
            />
            {/* Head */}
            <circle
              cx="30"
              cy="34"
              r="4"
              fill="#4f46e5"
              style={{
                animation: 'catCamelHead 6s infinite ease-in-out'
              }}
            />
            
            <style>{`
              @keyframes catCamelSpine {
                0%, 100% { d: path("M 35 50 L 35 38 Q 50 24, 65 38 L 65 50"); } /* Cat (curved up) */
                50% { d: path("M 35 50 L 35 38 Q 50 44, 65 38 L 65 50"); } /* Camel (curved down) */
              }
              @keyframes catCamelHead {
                0%, 100% { transform: translateY(3px) translateX(2px); }
                50% { transform: translateY(-3px) translateX(-2px); }
              }
            `}</style>
          </svg>
        );

      case 'childs-pose':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Knees and feet folded */}
            <path
              d="M 75 50 C 70 50, 65 42, 60 42 C 55 42, 45 48, 30 48"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'childsPoseStretch 4s infinite ease-in-out'
              }}
            />
            {/* Head touching ground */}
            <circle
              cx="25"
              cy="48"
              r="4"
              fill="#4f46e5"
              style={{
                animation: 'childsPoseHead 4s infinite ease-in-out'
              }}
            />
            <style>{`
              @keyframes childsPoseStretch {
                0%, 100% { d: path("M 75 50 C 70 50, 65 44, 60 44 C 55 44, 45 49, 30 49"); }
                50% { d: path("M 75 50 C 70 50, 65 43, 60 43 C 55 43, 40 47, 28 47"); }
              }
              @keyframes childsPoseHead {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(-2px); }
              }
            `}</style>
          </svg>
        );

      case 'cobra':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Leg & Thigh lying on floor */}
            <path
              d="M 80 50 Q 60 48 45 46 Q 32 38 34 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'cobraArch 5s infinite ease-in-out'
              }}
            />
            {/* Hands supporting */}
            <line x1="45" y1="50" x2="42" y2="40" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
            {/* Head looking up */}
            <circle
              cx="36"
              cy="20"
              r="4.5"
              fill="#4f46e5"
              style={{
                animation: 'cobraHead 5s infinite ease-in-out'
              }}
            />
            <style>{`
              @keyframes cobraArch {
                0%, 100% { d: path("M 80 50 Q 60 48 45 47 Q 34 44 34 35"); }
                50% { d: path("M 80 50 Q 60 48 45 45 Q 30 32 32 18"); }
              }
              @keyframes cobraHead {
                0%, 100% { transform: translateY(12px) translateX(2px); }
                50% { transform: translateY(0px) translateX(-1px); }
              }
            `}</style>
          </svg>
        );

      case 'bird-dog':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Supporting knee and hand */}
            <line x1="55" y1="38" x2="55" y2="50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="38" x2="42" y2="50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            
            {/* Torso */}
            <line x1="38" y1="38" x2="62" y2="38" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
            
            {/* Animated Raised Leg & Arm */}
            <path
              d="M 38 38 L 22 38"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                animation: 'birdDogLeg 4s infinite ease-in-out'
              }}
            />
            <path
              d="M 62 38 L 78 38"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                animation: 'birdDogArm 4s infinite ease-in-out'
              }}
            />
            
            {/* Head */}
            <circle cx="66" cy="32" r="4" fill="#4f46e5" />
            <style>{`
              @keyframes birdDogLeg {
                0%, 100% { d: path("M 38 38 L 32 46"); }
                50% { d: path("M 38 38 L 20 36"); }
              }
              @keyframes birdDogArm {
                0%, 100% { d: path("M 62 38 L 58 46"); }
                50% { d: path("M 62 38 L 78 36"); }
              }
            `}</style>
          </svg>
        );

      case 'bridge':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Feet and Shoulders touching ground */}
            <circle cx="70" cy="50" r="3.5" fill="#64748b" />
            <path
              d="M 28 50 C 35 50, 48 50, 70 38"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'bridgeLift 5s infinite ease-in-out'
              }}
            />
            {/* Head resting */}
            <circle cx="23" cy="48" r="4" fill="#4f46e5" />
            <style>{`
              @keyframes bridgeLift {
                0%, 100% { d: path("M 28 49 C 35 49, 48 49, 70 49"); } /* Flat on floor */
                50% { d: path("M 28 49 C 40 40, 56 22, 70 42"); } /* Hip lifted */
              }
            `}</style>
          </svg>
        );

      case 'plank':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Elbow supporting */}
            <path d="M 68 50 L 68 40 L 64 40" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            {/* Body line - vibrating slightly representing isometric effort */}
            <line
              x1="22"
              y1="48"
              x2="68"
              y2="40"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'plankShake 0.15s infinite alternate'
              }}
            />
            {/* Head */}
            <circle
              cx="74"
              cy="36"
              r="4"
              fill="#4f46e5"
              style={{
                animation: 'plankShake 0.15s infinite alternate'
              }}
            />
            <style>{`
              @keyframes plankShake {
                0% { transform: translateY(0.3px); }
                100% { transform: translateY(-0.3px); }
              }
            `}</style>
          </svg>
        );

      case 'spinal-twist':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            {/* Spine and flat torso representational perspective */}
            <line x1="30" y1="42" x2="70" y2="42" stroke="#cbd5e1" strokeWidth="3" />
            {/* Rotating knees */}
            <path
              d="M 50 42 C 50 42, 52 35, 52 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'spinalTwist 6s infinite ease-in-out'
              }}
            />
            <circle cx="30" cy="40" r="4.5" fill="#4f46e5" />
            <style>{`
              @keyframes spinalTwist {
                0%, 100% { d: path("M 50 42 C 55 42, 58 48, 62 50"); } /* Knee right */
                50% { d: path("M 50 42 C 45 42, 42 48, 38 50"); } /* Knee left */
              }
            `}</style>
          </svg>
        );

      case 'chest-opener':
      default:
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100">
            {/* Wall / Sedia indicator */}
            <line x1="75" y1="10" x2="75" y2="50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#cbd5e1" strokeWidth="2" />
            
            {/* Feet */}
            <circle cx="35" cy="50" r="3" fill="#64748b" />
            
            {/* Back, Torso, Arms to Wall */}
            <path
              d="M 35 50 L 38 32 Q 52 28, 68 28"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                animation: 'chestOpener 5s infinite ease-in-out'
              }}
            />
            {/* Head */}
            <circle
              cx="45"
              cy="20"
              r="4"
              fill="#4f46e5"
              style={{
                animation: 'chestOpenerHead 5s infinite ease-in-out'
              }}
            />
            <style>{`
              @keyframes chestOpener {
                0%, 100% { d: path("M 35 50 L 36 25 Q 52 25, 75 25"); } /* Standing close */
                50% { d: path("M 35 50 L 38 36 Q 54 38, 75 36"); } /* Hips back, chest down */
              }
              @keyframes chestOpenerHead {
                0%, 100% { transform: translateY(0px) translateX(-5px); }
                50% { transform: translateY(11px) translateX(0px); }
              }
            `}</style>
          </svg>
        );
    }
  };

  const progressPercent = (timeLeft / exercise.durationSeconds) * 100;

  return (
    <div
      id={`exercise-card-${exercise.id}`}
      className={`bg-white rounded-3xl border transition-all duration-300 ${
        isExpanded ? 'border-indigo-100 shadow-md ring-1 ring-indigo-50/50' : 'border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      {/* CARD HEADER */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src={`/exercise-gifs/${exercise.visualType}.gif`}
            alt=""
            aria-hidden="true"
            className="w-16 h-12 rounded-xl border border-slate-100 bg-slate-50 object-cover flex-shrink-0"
            loading="lazy"
          />
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
            exercise.category === 'allungamento' ? 'bg-indigo-50 text-indigo-600' :
            exercise.category === 'rinforzo' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {exercise.category === 'allungamento' ? '🧘' :
             exercise.category === 'rinforzo' ? '💪' : '🔄'}
          </div>

          <div className="truncate pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                CATEGORY_STYLES[exercise.category].bg
              }`}>
                {language === 'it' ? CATEGORY_STYLES[exercise.category].labelIt : CATEGORY_STYLES[exercise.category].labelEn}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                DIFFICULTY_COLORS[exercise.difficulty]
              }`}>
                {exercise.difficulty}
              </span>
            </div>
            <h4 className="font-display font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
              {exercise.title}
              {isCompletedToday && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                  ✓
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
            <span className="font-medium text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {exercise.durationSeconds}s
            </span>
            <span className="capitalize">
              {exercise.targetRegion === 'tutta' ? (language === 'it' ? 'tutta' : 'whole') : (language === 'it' ? exercise.targetRegion : (exercise.targetRegion === 'lombare' ? 'lumbar' : exercise.targetRegion === 'cervicale' ? 'cervical' : 'thoracic'))}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* CARD CONTENT EXPANDED */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-50"
          >
            <div className="p-5 space-y-6">
              {/* Top Description and Graphic */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-8 space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{exercise.description}"
                  </p>
                  
                  {/* Target details */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="text-xs bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1 rounded-xl">
                      <strong>{language === 'it' ? 'Zona:' : 'Region:'}</strong> {exercise.targetRegion === 'tutta' ? (language === 'it' ? 'Colonna Intera' : 'Whole Spine') : (language === 'it' ? exercise.targetRegion : (exercise.targetRegion === 'lombare' ? 'Lower Back' : exercise.targetRegion === 'cervicale' ? 'Neck' : 'Mid Back')).toUpperCase()}
                    </div>
                    <div className="text-xs bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1 rounded-xl">
                      <strong>{language === 'it' ? 'Tempo consigliato:' : 'Recommended time:'}</strong> {exercise.durationSeconds} {language === 'it' ? 'secondi' : 'seconds'}
                    </div>
                  </div>
                </div>

                {/* Micro animation illustration */}
                <div className="md:col-span-4 w-full min-w-0 overflow-hidden isolate">
                  <div className="text-center text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">
                    {language === 'it' ? 'Dimostrazione Movimento' : 'Movement Demonstration'}
                  </div>
                  <div className="relative isolate w-full h-24 min-h-24 overflow-hidden rounded-xl">
                    <img
                      src={`/exercise-gifs/${exercise.visualType}.gif`}
                      alt={language === 'it' ? `Animazione ${exercise.title}` : `${exercise.title} animation`}
                      className="block h-24 w-full rounded-xl border border-slate-100 bg-slate-50 object-cover"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        const fallback = event.currentTarget.nextElementSibling;
                        if (fallback instanceof HTMLElement) fallback.style.display = 'block';
                      }}
                    />
                    <div className="hidden h-24 w-full">
                      {renderVisualAnimation(exercise.visualType)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <span>📌</span> {language === 'it' ? "Come eseguire l'esercizio" : "How to perform the exercise"}
                  </h5>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVoiceAutoPlay((value) => !value)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold text-slate-600"
                    >
                      {voiceAutoPlay ? (language === 'it' ? 'Auto on' : 'Auto on') : (language === 'it' ? 'Auto off' : 'Auto off')}
                    </button>

                    <button
                      type="button"
                      onClick={handleSpeakExercise}
                      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isSpeaking
                        ? (language === 'it' ? 'Stop' : 'Stop')
                        : (language === 'it' ? 'Voce' : 'Voice')}
                    </button>
                  </div>
                </div>
                <ol className="space-y-2 text-slate-600 text-sm pl-2">
                  {exercise.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips & Mistakes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Consigli */}
                <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/30">
                  <h6 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> {language === 'it' ? 'Consigli Utili' : 'Useful Tips'}
                  </h6>
                  <ul className="space-y-1.5 text-xs text-emerald-700/90 pl-1 list-disc list-inside">
                    {exercise.tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Errori */}
                <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100/30">
                  <h6 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> {language === 'it' ? 'Errori da evitare' : 'Common Mistakes'}
                  </h6>
                  <ul className="space-y-1.5 text-xs text-rose-700/90 pl-1 list-disc list-inside">
                    {exercise.mistakes.map((mistake, idx) => (
                      <li key={idx} className="leading-relaxed">{mistake}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ACTIVE TRAINING SECTION */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Circular visual progress and button */}
                  <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                    {/* SVG progress circle */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="4"
                        strokeDasharray={176}
                        strokeDashoffset={176 - (176 * progressPercent) / 100}
                        className="transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Inner Action Button */}
                    <button
                      id={`timer-toggle-${exercise.id}`}
                      onClick={isTimerActive ? stopTimer : startTimer}
                      className="relative z-10 w-12 h-12 bg-white hover:bg-indigo-50 text-indigo-600 rounded-full shadow-xs flex items-center justify-center transition-colors border border-indigo-50"
                    >
                      {isTimerActive ? <Pause className="w-5 h-5 fill-indigo-600" /> : <Play className="w-5 h-5 fill-indigo-600 ml-0.5" />}
                    </button>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {language === 'it' ? 'Timer Allenamento' : 'Workout Timer'}
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-800">
                      {timeLeft} <span className="text-xs font-sans text-slate-500 font-normal">{language === 'it' ? 'secondi rimasti' : 'seconds remaining'}</span>
                    </div>
                  </div>
                </div>

                {/* Breathing Guide Animation */}
                {isTimerActive && (
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-indigo-50 shadow-3xs max-w-xs w-full justify-center md:justify-start">
                    <div className="relative flex items-center justify-center w-8 h-8">
                      {/* Breathing Expanding bubble */}
                      <span className={`absolute w-full h-full rounded-full transition-all duration-1000 ease-in-out opacity-20 ${
                        breathPhase === 'inspira' ? 'bg-indigo-500 scale-[1.8]' : 'bg-indigo-300 scale-[0.8]'
                      }`} />
                      <span className={`w-4 h-4 rounded-full transition-all duration-1000 ${
                        breathPhase === 'inspira' ? 'bg-indigo-600' : 'bg-indigo-400'
                      }`} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                        {language === 'it' ? 'Respiro guidato' : 'Guided breathing'}
                      </div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {breathPhase === 'inspira' ? (language === 'it' ? '💨 INSPIRO profondamente...' : '💨 INHALE deeply...') : (language === 'it' ? '🌬️ ESPIRO lentamente...' : '🌬️ EXHALE slowly...')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Control Actions */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    id={`timer-reset-${exercise.id}`}
                    onClick={resetTimer}
                    className="flex-1 md:flex-initial text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 px-3 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> {language === 'it' ? 'Ripristina' : 'Reset'}
                  </button>

                  <button
                    id={`complete-btn-${exercise.id}`}
                    onClick={() => {
                      stopTimer();
                      onComplete(exercise.id);
                    }}
                    className={`flex-1 md:flex-initial text-xs px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isCompletedToday
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {isCompletedToday ? (language === 'it' ? 'Completato ✓' : 'Completed ✓') : (language === 'it' ? 'Fatto!' : 'Done!')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
