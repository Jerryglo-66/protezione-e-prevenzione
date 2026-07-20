/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  EXERCISES_IT,
  EXERCISES_EN,
  ROUTINES_IT,
  ROUTINES_EN,
  DEFAULT_HABITS_IT,
  DEFAULT_HABITS_EN
} from './data/exercises';
import { TRANSLATIONS } from './translations';
import { Exercise, DailyHabit } from './types';
import BackVisualizer from './components/BackVisualizer';
import ExerciseCard from './components/ExerciseCard';
import DailyHabits from './components/DailyHabits';
import RoutineSelector from './components/RoutineSelector';
import DeviceConnector from './components/DeviceConnector';
import {
  Sparkles,
  Activity,
  Calendar,
  Search,
  Compass,
  Heart,
  Info,
  Shield,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Language selection state
  const [language, setLanguage] = useState<'it' | 'en'>(() => {
    const saved = localStorage.getItem('schiena_language');
    return (saved as 'it' | 'en') || 'it';
  });

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('schiena_language', language);
  }, [language]);

  const EXERCISES = language === 'it' ? EXERCISES_IT : EXERCISES_EN;
  const ROUTINES = language === 'it' ? ROUTINES_IT : ROUTINES_EN;
  const DEFAULT_HABITS = language === 'it' ? DEFAULT_HABITS_IT : DEFAULT_HABITS_EN;

  // Main states
  const [selectedRegion, setSelectedRegion] = useState<'cervicale' | 'dorsale' | 'lombare' | 'tutta'>('tutta');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persisted state: Completed exercises (array of IDs completed today)
  const [completedExercises, setCompletedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem('schiena_completed_exercises');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Verify it's for today's date
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          return parsed.ids;
        }
      } catch (e) {
        console.error('Error loading completed exercises', e);
      }
    }
    return [];
  });

  // Persisted state: Daily Habits checklist
  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem('schiena_habits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset checklist if it's a different day
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          return parsed.items;
        }
      } catch (e) {
        console.error('Error loading habits', e);
      }
    }
    const initialLang = localStorage.getItem('schiena_language') || 'it';
    return initialLang === 'it' ? DEFAULT_HABITS_IT : DEFAULT_HABITS_EN;
  });

  // Keep habits text in sync when language changes
  useEffect(() => {
    setHabits(prevHabits => {
      const currentDefaults = language === 'it' ? DEFAULT_HABITS_IT : DEFAULT_HABITS_EN;
      const otherDefaults = language === 'it' ? DEFAULT_HABITS_EN : DEFAULT_HABITS_IT;
      return prevHabits.map(habit => {
        // Find if this habit corresponds to a default habit
        const defaultIdx = otherDefaults.findIndex(d => d.id === habit.id);
        if (defaultIdx !== -1) {
          return {
            ...habit,
            text: currentDefaults[defaultIdx].text
          };
        }
        return habit;
      });
    });
  }, [language]);

  // Posture assessment states
  const [assessmentStep, setAssessmentStep] = useState(0); // 0 = not started, 1, 2, 3 = questions, 4 = result
  const [painLevel, setPainLevel] = useState<number | null>(null); // 0 to 5
  const [sittingHours, setSittingHours] = useState<string | null>(null); // 'low', 'medium', 'high'
  const [activityGoal, setActivityGoal] = useState<string | null>(null); // 'allungare', 'rinforzare', 'mobilitare'
  const [assessmentResult, setAssessmentResult] = useState<{
    routineId: string;
    exerciseIds: string[];
    advice: string;
  } | null>(null);

  // Synchronize completed exercises to localStorage
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      'schiena_completed_exercises',
      JSON.stringify({ date: todayStr, ids: completedExercises })
    );
  }, [completedExercises]);

  // Synchronize habits to localStorage
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      'schiena_habits',
      JSON.stringify({ date: todayStr, items: habits })
    );
  }, [habits]);

  // Handle exercise completion
  const handleCompleteExercise = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises((prev) => [...prev, exerciseId]);
      
      // Auto toggle the related habit "Esegui almeno 1 esercizio" if not already checked
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h.id === 'h5' ? { ...h, completed: true } : h
        )
      );
    } else {
      // Toggle off if clicked again (optional)
      setCompletedExercises((prev) => prev.filter((id) => id !== exerciseId));
    }
  };

  // Handle habit toggling
  const handleToggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completed: !h.completed } : h))
    );
  };

  // Select routine filter
  const handleSelectRoutine = (routineId: string | null) => {
    setSelectedRoutineId(routineId);
    if (routineId) {
      // Clear region filter if a specific routine is selected to avoid overlap issues
      setSelectedRegion('tutta');
    }
  };

  // Run Quick Posture Diagnosis
  const handleCalculateAssessment = () => {
    let recommendedRoutine = 'pain-relief';
    let advice = '';
    let exercises: string[] = [];

    if (painLevel !== null && painLevel >= 3) {
      recommendedRoutine = 'pain-relief';
      advice = language === 'it' 
        ? 'La tua schiena mostra segnali di forte stress o affaticamento. Evita sforzi intensi o plank prolungati. Concentrati su allungamenti delicati e sulla respirazione addominale profonda come la Posizione del Bambino e le Torsioni Supine.'
        : 'Your back shows signs of high stress or fatigue. Avoid heavy strain or prolonged planks. Focus on gentle stretches and deep abdominal breathing like Child\'s Pose and Supine Twists.';
      exercises = ['childs-pose', 'spinal-twist', 'cat-camel'];
    } else if (sittingHours === 'high') {
      recommendedRoutine = 'smart-working';
      advice = language === 'it'
        ? 'Rimanere seduti a lungo accorcia i muscoli flessori dell\'anca e indebolisce la colonna. Ti consigliamo la routine "Smart Working" con enfasi sull\'apertura del petto e sulla mobilità della colonna lombare.'
        : 'Sitting for long periods shortens hip flexors and weakens the spine. We recommend the "Smart Working" routine with emphasis on chest opening and lumbar spine mobility.';
      exercises = ['chest-opener', 'cat-camel', 'cobra'];
    } else if (activityGoal === 'rinforzare') {
      recommendedRoutine = 'strength-prevent';
      advice = language === 'it'
        ? 'Ottima scelta! Rinforzare i muscoli glutei, il core profondo e gli erettori della colonna è il modo più efficace per stabilizzare la schiena ed eliminare i dolori sul lungo termine.'
        : 'Great choice! Strengthening glute muscles, deep core, and spinal erectors is the most effective way to stabilize the back and eliminate long-term pain.';
      exercises = ['bird-dog', 'bridge', 'plank'];
    } else {
      // Default fallback
      recommendedRoutine = 'smart-working';
      advice = language === 'it'
        ? 'Abbiamo preparato per te un mix bilanciato di mobilità e stretching leggero per riattivare i canali energetici e sciogliere la muscolatura contratta.'
        : 'We have prepared a balanced mix of mobility and gentle stretching for you to reactivate energetic flows and loosen tight muscles.';
      exercises = ['cat-camel', 'childs-pose', 'chest-opener'];
    }

    setAssessmentResult({
      routineId: recommendedRoutine,
      exerciseIds: exercises,
      advice
    });
    setAssessmentStep(4);
  };

  const handleResetAssessment = () => {
    setAssessmentStep(0);
    setPainLevel(null);
    setSittingHours(null);
    setActivityGoal(null);
    setAssessmentResult(null);
  };

  // Filter exercises based on: region filter, routine filter, and search query
  const filteredExercises = EXERCISES.filter((ex) => {
    // 1. Filter by Region
    if (selectedRegion !== 'tutta' && ex.targetRegion !== selectedRegion && ex.targetRegion !== 'tutta') {
      return false;
    }

    // 2. Filter by Routine
    if (selectedRoutineId) {
      const routine = ROUTINES.find((r) => r.id === selectedRoutineId);
      if (routine && !routine.exerciseIds.includes(ex.id)) {
        return false;
      }
    }

    // 3. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = ex.title.toLowerCase().includes(query);
      const matchDesc = ex.description.toLowerCase().includes(query);
      const matchSteps = ex.steps.some((s) => s.toLowerCase().includes(query));
      const matchRegion = ex.targetRegion.toLowerCase().includes(query);
      const matchCategory = ex.category.toLowerCase().includes(query);

      return matchTitle || matchDesc || matchSteps || matchRegion || matchCategory;
    }

    return true;
  });

  // Current date formatted beautifully
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-16 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER BANNER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100 text-2xl">
              🧘
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                {TRANSLATIONS[language].appName}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
                {TRANSLATIONS[language].appSubtitle}
              </p>
            </div>
          </div>

          {/* Date and Activity Summary */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs font-bold text-slate-500 capitalize flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {getFormattedDate()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                {language === 'it' ? (
                  <>Oggi hai completato <strong className="text-indigo-600 font-bold">{completedExercises.length}</strong> esercizi</>
                ) : (
                  <>Today you completed <strong className="text-indigo-600 font-bold">{completedExercises.length}</strong> exercises</>
                )}
              </span>
            </div>

            {/* Quick Badge score */}
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>{TRANSLATIONS[language].backScore}: <strong>{completedExercises.length * 10} {language === 'it' ? 'punti' : 'pts'}</strong></span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
              <button
                onClick={() => setLanguage('it')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'it'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🇮🇹 <span className="hidden sm:inline">Italiano</span><span className="sm:hidden">IT</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🇬🇧 <span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* MOTIVATIONAL STATEMENT / NOTIFICATION */}
        <div className="bg-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-10">
            <span className="text-[200px]">🧘‍♀️</span>
          </div>
          
          <div className="space-y-2 relative z-10 max-w-2xl">
            <span className="bg-indigo-800 text-indigo-200 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
              {language === 'it' ? 'Benvenuto nel tuo Spazio Benessere' : 'Welcome to Your Wellness Space'}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              {language === 'it' ? 'Prenditi cura del tuo pilastro fondamentale.' : 'Take care of your fundamental pillar.'}
            </h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
              {language === 'it'
                ? "Pochi minuti di movimenti controllati ogni giorno possono disattivare le tensioni muscolari, stimolare l'idratazione dei dischi e prevenire blocchi posturali dolorosi."
                : 'A few minutes of controlled movements every day can release muscle tension, stimulate disc hydration, and prevent painful posture blocks.'}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 flex gap-3">
            <a
              href="#spine-visualizer"
              className="bg-white text-indigo-900 font-bold text-xs px-5 py-3 rounded-2xl hover:bg-indigo-50 transition-colors shadow-sm text-center"
            >
              {language === 'it' ? 'Filtra per Zona Schiena' : 'Filter by Back Area'}
            </a>
            <a
              href="#exercises-catalog"
              className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-colors text-center"
            >
              {language === 'it' ? 'Vedi Catalogo' : 'View Catalog'}
            </a>
          </div>
        </div>

        {/* TWO COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Exercises, visualizer & routines (8 columns) */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* 1. SPINE REGION INTERACTIVE VISUALIZER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span>脊</span> {language === 'it' ? 'Mappa Interattiva della Schiena' : 'Interactive Back Map'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'it'
                      ? 'Clicca sui diversi tratti spinali per scoprire dettagli e filtrare gli esercizi specifici'
                      : 'Click on different spinal segments to discover details and filter specific exercises'}
                  </p>
                </div>
              </div>
              <BackVisualizer selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} language={language} />
            </div>

            {/* 2. PRESET ROUTINE PLANS */}
            <RoutineSelector
              routines={ROUTINES}
              selectedRoutineId={selectedRoutineId}
              onSelectRoutine={handleSelectRoutine}
              completedExercises={completedExercises}
              language={language}
            />

            {/* 3. CATALOGUE AND SEARCH */}
            <div id="exercises-catalog" className="space-y-5 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-500" />
                    {TRANSLATIONS[language].exerciseTitle} ({filteredExercises.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedRoutineId
                      ? (language === 'it'
                          ? `Mostrando solo gli esercizi inclusi nella routine "${ROUTINES.find(r => r.id === selectedRoutineId)?.name}"`
                          : `Showing only exercises included in the "${ROUTINES.find(r => r.id === selectedRoutineId)?.name}" routine`)
                      : selectedRegion !== 'tutta'
                      ? (language === 'it'
                          ? `Esercizi filtrati per il tratto spinale: ${selectedRegion.toUpperCase()}`
                          : `Exercises filtered for spinal area: ${selectedRegion === 'lombare' ? 'LUMBAR' : selectedRegion === 'cervicale' ? 'CERVICAL' : 'THORACIC'}`)
                      : (language === 'it'
                          ? 'Esercizi consigliati senza attrezzi da fare a casa o in ufficio'
                          : 'Recommended equipment-free exercises to do at home or in the office')}
                  </p>
                </div>

                {/* SEARCH BAR */}
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                  <input
                    type="text"
                    id="search-exercises-input"
                    placeholder={language === 'it' ? 'Cerca esercizio (es. gatto, allungamento...)' : 'Search exercise (e.g. cat, stretch...)'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-11 pr-4 py-2.5 text-sm transition-all shadow-2xs outline-none"
                  />
                  {searchQuery && (
                    <button
                      id="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      {language === 'it' ? 'Cancella' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              {/* LIST OF FILTERED EXERCISES */}
              <div className="space-y-4">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onComplete={handleCompleteExercise}
                      isCompletedToday={completedExercises.includes(exercise.id)}
                      language={language}
                    />
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
                    <span className="text-4xl block mb-3">🔍</span>
                    <h4 className="font-bold text-slate-700 text-base mb-1">
                      {language === 'it' ? 'Nessun esercizio trovato' : 'No exercises found'}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {language === 'it'
                        ? "Nessun esercizio risponde ai filtri selezionati. Prova a svuotare la ricerca o a selezionare \"Tutta la schiena\" per mostrare l'intera libreria."
                        : 'No exercises match the selected filters. Try clearing your search or selecting "Whole spine" to display the full library.'}
                    </p>
                    <button
                      id="reset-all-filters-btn"
                      onClick={() => {
                        setSelectedRegion('tutta');
                        setSelectedRoutineId(null);
                        setSearchQuery('');
                      }}
                      className="mt-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition-colors"
                    >
                      {language === 'it' ? 'Azzera Tutti i Filtri' : 'Reset All Filters'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </section>

          {/* RIGHT PANEL: Checklist, Score, Device & Diagnostic test (4 columns) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* 1. SMART DEVICE CONNECTOR CONSOLE */}
            <DeviceConnector language={language} />

            {/* 2. DAILY HABITS CHECKLIST */}
            <DailyHabits
              habits={habits}
              onToggleHabit={handleToggleHabit}
              completedExercisesCount={completedExercises.length}
              language={language}
            />

            {/* 2. INTERACTIVE POSTURE DIAGNOSTICS CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  {TRANSLATIONS[language].diagnosticTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {TRANSLATIONS[language].diagnosticSubtitle}
                </p>
              </div>

              {/* STAGE 0: Introduction */}
              {assessmentStep === 0 && (
                <div className="space-y-4 pt-1">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'it' 
                      ? 'Hai un lieve indolenzimento o vuoi impostare la migliore prevenzione per oggi? Il nostro mini test valuta le tue risposte e ti indirizza verso la corretta sequenza di esercizi terapeutici.'
                      : 'Do you have mild soreness or want to set up the best prevention for today? Our mini quiz evaluates your answers and guides you to the correct sequence of therapeutic exercises.'}
                  </p>
                  <button
                    id="start-assessment-btn"
                    onClick={() => setAssessmentStep(1)}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-3 rounded-2xl transition-colors flex items-center justify-center gap-1 border border-indigo-100"
                  >
                    {language === 'it' ? 'Inizia il Test Rapido →' : 'Start Quick Quiz →'}
                  </button>
                </div>
              )}

              {/* STAGE 1: Pain Level */}
              {assessmentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase">
                    <span>{language === 'it' ? 'Domanda 1 di 3' : 'Question 1 of 3'}</span>
                    <span>{language === 'it' ? 'Intensità Fastidio' : 'Pain Intensity'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    {language === 'it' ? 'Come valuteresti la tensione o il fastidio attuale alla schiena?' : 'How would you rate your current back tension or discomfort?'}
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        id={`pain-btn-${val}`}
                        onClick={() => setPainLevel(val)}
                        className={`py-3 rounded-xl font-mono text-sm font-bold border transition-all ${
                          painLevel === val
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{language === 'it' ? 'Nessun dolore (0)' : 'No pain (0)'}</span>
                    <span>{language === 'it' ? 'Tensione acuta (5)' : 'Acute tension (5)'}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      id="assessment-back-1"
                      onClick={() => setAssessmentStep(0)}
                      className="flex-1 text-xs text-slate-500 border border-slate-200 py-2.5 rounded-xl font-bold"
                    >
                      {TRANSLATIONS[language].back}
                    </button>
                    <button
                      id="assessment-next-1"
                      disabled={painLevel === null}
                      onClick={() => setAssessmentStep(2)}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-bold text-white transition-all ${
                        painLevel !== null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {language === 'it' ? 'Avanti' : 'Next'}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: Sitting hours */}
              {assessmentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase">
                    <span>{language === 'it' ? 'Domanda 2 di 3' : 'Question 2 of 3'}</span>
                    <span>{language === 'it' ? 'Tempo Seduto' : 'Sitting Time'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    {language === 'it' ? 'Quante ore passi mediamente seduto durante il giorno?' : 'How many hours on average do you spend sitting during the day?'}
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: 'low', text: language === 'it' ? 'Meno di 3 ore (Molto attivo)' : 'Less than 3 hours (Highly active)' },
                      { key: 'medium', text: language === 'it' ? 'Da 3 a 6 ore (Moderato)' : '3 to 6 hours (Moderate)' },
                      { key: 'high', text: language === 'it' ? 'Più di 6 ore (Sedentario / Scrivania)' : 'More than 6 hours (Sedentary / Desk)' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        id={`sitting-btn-${opt.key}`}
                        onClick={() => setSittingHours(opt.key)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-medium flex items-center justify-between ${
                          sittingHours === opt.key
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {sittingHours === opt.key && <span className="text-indigo-600">✓</span>}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      id="assessment-back-2"
                      onClick={() => setAssessmentStep(1)}
                      className="flex-1 text-xs text-slate-500 border border-slate-200 py-2.5 rounded-xl font-bold"
                    >
                      {TRANSLATIONS[language].back}
                    </button>
                    <button
                      id="assessment-next-2"
                      disabled={sittingHours === null}
                      onClick={() => setAssessmentStep(3)}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-bold text-white transition-all ${
                        sittingHours !== null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {language === 'it' ? 'Avanti' : 'Next'}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Activity Goal */}
              {assessmentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase">
                    <span>{language === 'it' ? 'Domanda 3 di 3' : 'Question 3 of 3'}</span>
                    <span>{language === 'it' ? 'Obiettivo Benessere' : 'Wellness Goal'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    {language === 'it' ? 'Qual è il tuo obiettivo primario per la schiena oggi?' : 'What is your primary goal for your back today?'}
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: 'allungare', text: language === 'it' ? 'Stretching e allungamento tensioni' : 'Stretching and tension relief' },
                      { key: 'rinforzare', text: language === 'it' ? 'Rinforzare addome e lombari (stabilità)' : 'Strengthen core and lower back (stability)' },
                      { key: 'mobilitare', text: language === 'it' ? 'Sciogliere rigidità articolari / mobilizzazione' : 'Loosen joint stiffness / mobilization' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        id={`goal-btn-${opt.key}`}
                        onClick={() => setActivityGoal(opt.key)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-medium flex items-center justify-between ${
                          activityGoal === opt.key
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600'
                        }`}
                      >
                        <span>{opt.text}</span>
                        {activityGoal === opt.key && <span className="text-indigo-600">✓</span>}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      id="assessment-back-3"
                      onClick={() => setAssessmentStep(2)}
                      className="flex-1 text-xs text-slate-500 border border-slate-200 py-2.5 rounded-xl font-bold"
                    >
                      {TRANSLATIONS[language].back}
                    </button>
                    <button
                      id="assessment-next-3"
                      disabled={activityGoal === null}
                      onClick={handleCalculateAssessment}
                      className={`flex-1 text-xs py-2.5 rounded-xl font-bold text-white transition-all ${
                        activityGoal !== null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {language === 'it' ? 'Vedi Risultato 📈' : 'See Result 📈'}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: Diagnostic Result */}
              {assessmentStep === 4 && assessmentResult && (
                <div className="space-y-4 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>{language === 'it' ? 'Il Tuo Risultato' : 'Your Result'}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {assessmentResult.advice}
                  </p>

                  <div className="border-t border-indigo-100/60 pt-3 space-y-2.5">
                    <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                      {language === 'it' ? 'Routine Consigliata:' : 'Recommended Routine:'}
                    </div>
                    
                    {/* Visual Button to Auto-Apply recommended routine */}
                    <button
                      id="apply-assessment-routine-btn"
                      onClick={() => {
                        handleSelectRoutine(assessmentResult.routineId);
                        // Scroll down to the exercises section
                        const el = document.getElementById('exercises-catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>{language === 'it' ? '✨ Attiva:' : '✨ Activate:'}</span>
                      <strong>
                        {ROUTINES.find((r) => r.id === assessmentResult.routineId)?.name}
                      </strong>
                    </button>
                  </div>

                  <button
                    id="assessment-reset-btn"
                    onClick={handleResetAssessment}
                    className="w-full text-[10px] text-slate-400 hover:text-slate-600 font-bold text-center pt-1"
                  >
                    {TRANSLATIONS[language].recalcBtn}
                  </button>
                </div>
              )}
            </div>

            {/* 3. POSTURE TIP CARD */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full" />
              <h4 className="font-display font-bold text-sm text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-indigo-400" /> {language === 'it' ? 'Pillola di Postura' : 'Posture Tip'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'it' ? (
                  <>Quando sei seduto davanti allo schermo, tieni la <strong>regola dei 90 gradi</strong>: gomiti, anche e ginocchia piegati a 90° con i piedi ben saldi a terra. Inoltre, tieni la sommità della testa allungata verso l'alto come se ci fosse un filo sottile a tirarti delicatamente.</>
                ) : (
                  <>When sitting in front of the screen, keep the <strong>90-degree rule</strong>: elbows, hips, and knees bent at 90° with feet flat on the ground. Also, keep the top of your head reaching upward as if a thin thread were gently pulling you.</>
                )}
              </p>
            </div>

          </aside>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-100 text-center space-y-2.5">
        <p className="text-xs text-slate-400">
          {language === 'it' 
            ? 'Esercizi Schiena — Guida interattiva per l\'allungamento, il rinforzo e il benessere vertebrale.'
            : 'Back Exercises — Interactive guide for stretching, strengthening, and spinal well-being.'}
        </p>
        <p className="text-[10px] text-slate-400 max-w-xl mx-auto leading-relaxed">
          <strong>{TRANSLATIONS[language].medicalNoteTitle}:</strong> {TRANSLATIONS[language].medicalNote}
        </p>
      </footer>
    </div>
  );
}
