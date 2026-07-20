import React from 'react';
import { DailyHabit } from '../types';
import { CheckSquare, Square, Flame, Sparkles, Heart, Activity } from 'lucide-react';

interface DailyHabitsProps {
  habits: DailyHabit[];
  onToggleHabit: (habitId: string) => void;
  completedExercisesCount: number;
  language?: 'it' | 'en';
}

export default function DailyHabits({ habits, onToggleHabit, completedExercisesCount, language = 'it' }: DailyHabitsProps) {
  const completedHabitsCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  
  // Back Wellness Index formula: Habits completed + (Exercises completed * 1.5) as a percentage
  const maxScorePoints = totalHabits + 3; // Let's cap exercise contribution to max 3 exercises for the score
  const actualPoints = completedHabitsCount + Math.min(completedExercisesCount, 3);
  const scorePercent = Math.min(Math.round((actualPoints / maxScorePoints) * 100), 100);

  // Motivational messages based on score
  const getMotivationalMessage = () => {
    if (language === 'it') {
      if (scorePercent === 0) return 'Inizia la tua giornata di prevenzione! Spunta la prima abitudine.';
      if (scorePercent < 40) return 'Buon inizio! Piccoli cambiamenti posturali quotidiani fanno una grande differenza.';
      if (scorePercent < 75) return 'La tua schiena ringrazia! Continua così per ridurre la tensione accumulata.';
      if (scorePercent < 100) return 'Eccellente! Livello di cura della colonna altissimo. Sei un esempio!';
      return 'Schiena Perfetta! 🏆 Tutte le abitudini completate e muscoli attivati oggi.';
    } else {
      if (scorePercent === 0) return 'Start your prevention day! Check your first habit.';
      if (scorePercent < 40) return 'Good start! Small daily posture changes make a big difference.';
      if (scorePercent < 75) return 'Your back is grateful! Keep it up to reduce accumulated tension.';
      if (scorePercent < 100) return 'Excellent! Outstanding spine care. You are an example!';
      return 'Perfect Back! 🏆 All habits completed and muscles activated today.';
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'postura':
      case 'posture':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'movimento':
      case 'movement':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'benessere':
      case 'well-being':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      {/* Header with Wellness Score */}
      <div className="border-b border-slate-50 pb-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-50" />
              {language === 'it' ? 'Abitudini Salva-Schiena' : 'Back-Saving Habits'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'it' ? 'Spunta i comportamenti posturali eseguiti oggi' : 'Check off posture behaviors done today'}
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              {language === 'it' ? 'Indice Benessere' : 'Wellness Index'}
            </span>
            <span className="font-mono text-2xl font-black text-indigo-600">
              {scorePercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "{getMotivationalMessage()}"
          </p>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3.5">
        {habits.map((habit) => (
          <div
            key={habit.id}
            id={`habit-${habit.id}`}
            onClick={() => onToggleHabit(habit.id)}
            className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
              habit.completed
                ? 'bg-slate-50/50 border-slate-100 opacity-75'
                : 'bg-white border-slate-100/80 hover:border-slate-200 hover:shadow-2xs'
            }`}
          >
            {/* Checkbox Icon */}
            <div className="mt-0.5">
              {habit.completed ? (
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center transition-all scale-100">
                  <CheckSquare className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md border border-slate-300 text-transparent hover:border-indigo-500 flex items-center justify-center transition-colors">
                  <Square className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Habit Text & Category */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-normal ${
                habit.completed ? 'text-slate-400 line-through' : 'text-slate-700'
              }`}>
                {habit.text}
              </p>
              
              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1.5 ${
                getCategoryStyles(habit.category)
              }`}>
                {language === 'it' 
                  ? habit.category
                  : (habit.category === 'postura' ? 'posture' : habit.category === 'movimento' ? 'movement' : 'well-being')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Tracker Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50/60 rounded-2xl p-3 border border-slate-100/60 text-center">
          <div className="text-xl font-bold text-slate-800 font-mono mb-0.5">
            {completedExercisesCount}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'it' ? 'Esercizi Oggi' : 'Exercises Today'}
          </div>
        </div>
        <div className="bg-slate-50/60 rounded-2xl p-3 border border-slate-100/60 text-center">
          <div className="text-xl font-bold text-slate-800 font-mono mb-0.5">
            {completedHabitsCount}/{totalHabits}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'it' ? 'Abitudini Attive' : 'Active Habits'}
          </div>
        </div>
      </div>
    </div>
  );
}
