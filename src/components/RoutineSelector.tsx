import React from 'react';
import { Routine, Exercise } from '../types';
import { Clock, Play, Dumbbell, Sparkles } from 'lucide-react';

interface RoutineSelectorProps {
  routines: Routine[];
  selectedRoutineId: string | null;
  onSelectRoutine: (routineId: string | null) => void;
  completedExercises: string[];
  language?: 'it' | 'en';
}

export default function RoutineSelector({
  routines,
  selectedRoutineId,
  onSelectRoutine,
  completedExercises,
  language = 'it'
}: RoutineSelectorProps) {
  
  // Check completion percentage of a specific routine
  const getRoutineStats = (routine: Routine) => {
    const total = routine.exerciseIds.length;
    const completed = routine.exerciseIds.filter(id => completedExercises.includes(id)).length;
    const isCompleted = completed === total && total > 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percent, isCompleted };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🏋️‍♂️</span> {language === 'it' ? 'Programmi Rapidi Guidati' : 'Quick Guided Programs'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'it' ? 'Filtra gli esercizi consigliati per la tua esigenza' : 'Filter recommended exercises for your needs'}
          </p>
        </div>
        {selectedRoutineId && (
          <button
            id="clear-routine-filter-btn"
            onClick={() => onSelectRoutine(null)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {language === 'it' ? 'Azzera Filtro' : 'Clear Filter'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routines.map((routine) => {
          const { completed, total, percent, isCompleted } = getRoutineStats(routine);
          const isSelected = selectedRoutineId === routine.id;

          return (
            <div
              key={routine.id}
              id={`routine-card-${routine.id}`}
              onClick={() => onSelectRoutine(isSelected ? null : routine.id)}
              className={`group p-5 rounded-3xl border cursor-pointer select-none transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm text-slate-700'
              }`}
            >
              {/* Routine Emoji */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-2xl p-2.5 rounded-2xl flex items-center justify-center ${
                  isSelected ? 'bg-indigo-500/50 text-white' : 'bg-slate-50 text-slate-700'
                }`}>
                  {routine.emoji}
                </span>

                {/* Progress / Completion Badge */}
                {isCompleted ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white text-indigo-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {language === 'it' ? 'COMPLETATO ✓' : 'COMPLETED ✓'}
                  </span>
                ) : percent > 0 ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {completed}/{total} ({percent}%)
                  </span>
                ) : null}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5">
                <h4 className={`font-display font-bold text-base md:text-lg ${
                  isSelected ? 'text-white' : 'text-slate-800'
                }`}>
                  {routine.name}
                </h4>
                <p className={`text-xs leading-relaxed ${
                  isSelected ? 'text-indigo-100' : 'text-slate-500'
                }`}>
                  {routine.description}
                </p>
              </div>

              {/* Bottom statistics */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-current/20">
                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{routine.estimatedMinutes} {language === 'it' ? 'minuti' : 'minutes'}
                </span>
                
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
                  isSelected ? 'text-white' : 'text-indigo-600'
                }`}>
                  {isSelected ? (language === 'it' ? 'Attivo' : 'Active') : (language === 'it' ? 'Seleziona' : 'Select')} →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
