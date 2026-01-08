import { MockApp } from './types';

export const MOCK_APPS: MockApp[] = [
  { id: 'insta', name: 'InstaScroll', icon: 'fa-camera-retro', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600', type: 'distraction' },
  { id: 'tok', name: 'TikTime', icon: 'fa-music', color: 'bg-black border border-gray-700', type: 'distraction' },
  { id: 'tube', name: 'YouWatch', icon: 'fa-play', color: 'bg-red-600', type: 'distraction' },
  { id: 'mail', name: 'Mail', icon: 'fa-envelope', color: 'bg-blue-500', type: 'utility' },
  { id: 'maps', name: 'Maps', icon: 'fa-map-marker-alt', color: 'bg-green-500', type: 'utility' },
  { id: 'notes', name: 'Notes', icon: 'fa-sticky-note', color: 'bg-yellow-500', type: 'utility' },
];

export const INITIAL_REQUIRED_ITEMS = 3; // User must consume 3 content pieces to unlock
export const REWARD_DURATION_MS = 60000; // 1 minute of unlock time for demo purposes (usually would be 5-10 mins)
