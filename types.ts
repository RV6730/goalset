export interface Goal {
  id: string;
  statement: string; // e.g., "Learn Go by Friday"
  category: 'coding' | 'language' | 'fitness' | 'finance' | 'general';
}

export interface FeedItem {
  id: string;
  type: 'quiz' | 'fact' | 'analogy';
  content: string;
  headline: string;
  options?: string[]; // For quiz
  correctAnswer?: string; // For quiz
  explanation: string;
}

export type AppView = 'onboarding' | 'home' | 'intercept' | 'reward';

export interface AppState {
  view: AppView;
  goal: Goal | null;
  selectedDistractionApp: MockApp | null;
  feedItems: FeedItem[];
  itemsConsumed: number;
  itemsRequiredToUnlock: number;
  unlockedMinutes: number;
}

export interface MockApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'distraction' | 'utility';
}
