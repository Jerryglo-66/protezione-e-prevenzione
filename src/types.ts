export interface Exercise {
  id: string;
  title: string;
  category: 'allungamento' | 'rinforzo' | 'mobilita';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzato' | 'Beginner' | 'Intermediate' | 'Advanced';
  targetRegion: 'cervicale' | 'dorsale' | 'lombare' | 'tutta';
  durationSeconds: number;
  description: string;
  steps: string[];
  tips: string[]; // Consigli utili
  mistakes: string[]; // Errori comuni da evitare
  visualType: 'cat-camel' | 'childs-pose' | 'cobra' | 'bird-dog' | 'bridge' | 'plank' | 'spinal-twist' | 'chest-opener';
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  emoji: string;
  exerciseIds: string[];
  estimatedMinutes: number;
}

export interface DailyHabit {
  id: string;
  text: string;
  category: 'postura' | 'movimento' | 'benessere';
  completed: boolean;
}

export interface WorkoutHistory {
  date: string; // YYYY-MM-DD
  completedExercisesCount: number;
  completedRoutines: string[];
}
