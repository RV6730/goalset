import React, { useState, useEffect } from 'react';
import { MOCK_APPS, INITIAL_REQUIRED_ITEMS, REWARD_DURATION_MS } from './constants';
import { AppState, Goal, MockApp, FeedItem } from './types';
import { generateFutureFeedContent } from './services/geminiService';
import { AppIcon } from './components/AppIcon';
import { Button } from './components/Button';
import { FeedCard } from './components/FeedCard';

// Sub-components for cleaner App.tsx
const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full h-full md:h-[800px] md:w-[400px] bg-black md:rounded-[3rem] md:border-[8px] md:border-gray-800 overflow-hidden shadow-2xl flex flex-col">
    {/* Dynamic Island / Notch Mockup */}
    <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-50"></div>
    {children}
  </div>
);

const StatusBar = () => (
  <div className="w-full px-6 py-3 flex justify-between items-center text-xs font-semibold text-white z-40 bg-transparent absolute top-0">
    <span>9:41</span>
    <div className="flex gap-2">
      <i className="fas fa-signal"></i>
      <i className="fas fa-wifi"></i>
      <i className="fas fa-battery-full"></i>
    </div>
  </div>
);

const App = () => {
  const [state, setState] = useState<AppState>({
    view: 'onboarding',
    goal: null,
    selectedDistractionApp: null,
    feedItems: [],
    itemsConsumed: 0,
    itemsRequiredToUnlock: INITIAL_REQUIRED_ITEMS,
    unlockedMinutes: 0,
  });
  
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [goalCategory, setGoalCategory] = useState<Goal['category']>('general');
  
  // Timer for reward expiration
  useEffect(() => {
    let timer: number;
    if (state.view === 'reward' && state.unlockedMinutes > 0) {
      // For demo, we just simulate the time passing visually or simple timeout
      // In a real app, we'd decrement accurate timestamps
      timer = window.setTimeout(() => {
        setState(prev => ({
           ...prev, 
           view: 'home', 
           unlockedMinutes: 0, 
           selectedDistractionApp: null,
           itemsConsumed: 0 
        }));
        alert("Time's up! Back to focus.");
      }, REWARD_DURATION_MS);
    }
    return () => clearTimeout(timer);
  }, [state.view, state.unlockedMinutes]);

  const handleSetGoal = () => {
    if (!goalInput.trim()) return;
    setState(prev => ({
      ...prev,
      goal: { id: 'g1', statement: goalInput, category: goalCategory },
      view: 'home'
    }));
  };

  const handleAppClick = async (app: MockApp) => {
    if (app.type === 'utility') {
      // Utilities open immediately (mock alert)
      alert(`Opening ${app.name}... (Allowed App)`);
      return;
    }

    // It is a distraction app
    setState(prev => ({ ...prev, selectedDistractionApp: app }));

    // If already unlocked, go to reward view
    /* In a real app, we would check timestamp expiration here */
    
    // Otherwise, intercept!
    setIsLoadingFeed(true);
    setState(prev => ({ ...prev, view: 'intercept' }));

    // Generate content based on goal
    if (state.goal) {
      const items = await generateFutureFeedContent(state.goal.statement, state.goal.category, INITIAL_REQUIRED_ITEMS);
      setState(prev => ({ 
        ...prev, 
        feedItems: items,
        itemsConsumed: 0
      }));
    }
    setIsLoadingFeed(false);
  };

  const handleFeedItemComplete = () => {
    setState(prev => {
      const newConsumed = prev.itemsConsumed + 1;
      if (newConsumed >= prev.itemsRequiredToUnlock) {
        // Unlock!
        return {
          ...prev,
          itemsConsumed: newConsumed,
          view: 'reward',
          unlockedMinutes: 1 // 1 minute reward
        };
      }
      return {
        ...prev,
        itemsConsumed: newConsumed
      };
    });
  };

  const handleGiveUp = () => {
    setState(prev => ({ ...prev, view: 'home', selectedDistractionApp: null, itemsConsumed: 0 }));
  };

  // --- Views ---

  const renderOnboarding = () => {
    const categories: { id: Goal['category'], label: string, icon: string }[] = [
      { id: 'general', label: 'General Improvement', icon: 'fa-star' },
      { id: 'coding', label: 'Coding & Tech', icon: 'fa-code' },
      { id: 'language', label: 'Language Learning', icon: 'fa-language' },
      { id: 'fitness', label: 'Health & Fitness', icon: 'fa-running' },
      { id: 'finance', label: 'Personal Finance', icon: 'fa-coins' },
    ];

    // Get active icon for the header/input
    const activeCategory = categories.find(c => c.id === goalCategory) || categories[0];

    return (
      <div className="flex flex-col h-full bg-brand-dark p-8 justify-center overflow-y-auto no-scrollbar">
        <div className="mb-8 text-center shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-accent to-blue-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-accent/30">
            <i className={`fas ${activeCategory.icon} text-4xl text-white transition-all duration-300`}></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Future Feed</h1>
          <p className="text-gray-400">Gatekeep your dopamine.</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">1. Choose Focus Area</label>
            <div className="relative">
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value as Goal['category'])}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl p-4 pl-12 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all cursor-pointer shadow-sm"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-gray-800 py-2">
                    {cat.label}
                  </option>
                ))}
              </select>
              
              {/* Custom Icon Overlay */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent">
                <i className={`fas ${activeCategory.icon} text-lg`}></i>
              </div>
              
              {/* Chevron Overlay */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">2. Define Specific Goal</label>
            <input 
              type="text" 
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Learn React Hooks, Save $500..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
            />
          </div>
          
          <Button onClick={handleSetGoal} className="w-full mt-4" disabled={!goalInput.trim()}>
            Start Inverting <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="h-full bg-cover bg-center relative" style={{ backgroundImage: 'url(https://picsum.photos/400/800?blur=4)' }}>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <StatusBar />
      
      <div className="relative z-10 pt-20 px-6">
        <div className="grid grid-cols-4 gap-y-8 gap-x-4">
           {MOCK_APPS.map(app => (
             <AppIcon key={app.id} app={app} onClick={handleAppClick} />
           ))}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 flex justify-around items-center border border-white/5">
         <AppIcon app={{ id: 'phone', name: '', icon: 'fa-phone', color: 'bg-green-500', type: 'utility' }} onClick={() => {}} />
         <AppIcon app={{ id: 'safari', name: '', icon: 'fa-compass', color: 'bg-blue-400', type: 'utility' }} onClick={() => {}} />
         <AppIcon app={{ id: 'messages', name: '', icon: 'fa-comment', color: 'bg-green-400', type: 'utility' }} onClick={() => {}} />
         <AppIcon app={{ id: 'music', name: '', icon: 'fa-music', color: 'bg-red-400', type: 'utility' }} onClick={() => {}} />
      </div>
    </div>
  );

  const renderIntercept = () => {
    const currentItem = state.feedItems[state.itemsConsumed];
    
    return (
      <div className="h-full bg-gray-900 flex flex-col relative">
        <StatusBar />
        
        {/* Progress Header */}
        <div className="pt-14 px-6 mb-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Locked: {state.selectedDistractionApp?.name}</p>
              <h2 className="text-white text-lg font-bold">Pay the Toll</h2>
            </div>
            <div className="flex gap-1">
              {[...Array(state.itemsRequiredToUnlock)].map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i < state.itemsConsumed ? 'bg-brand-success' : 'bg-gray-700'}`}></div>
              ))}
            </div>
        </div>

        <div className="flex-grow flex items-center justify-center p-4 relative">
          {isLoadingFeed ? (
            <div className="text-center">
               <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-brand-accent animate-pulse font-medium">Preparing your Future Feed...</p>
               <p className="text-gray-500 text-sm mt-2">Connecting to Gemini Nano...</p>
            </div>
          ) : currentItem ? (
            <div className="animate-slide-up w-full flex justify-center">
               <FeedCard 
                  item={currentItem} 
                  onComplete={handleFeedItemComplete} 
                  index={state.itemsConsumed}
                  total={state.itemsRequiredToUnlock}
               />
            </div>
          ) : (
            <div className="text-white">Error loading content.</div>
          )}
        </div>

        <div className="p-6">
          <button onClick={handleGiveUp} className="w-full py-4 text-gray-500 hover:text-white transition-colors text-sm font-medium">
            Give up & Return Home
          </button>
        </div>
      </div>
    );
  };

  const renderReward = () => (
    <div className="h-full bg-brand-dark flex flex-col relative overflow-hidden">
      <StatusBar />
      
      {/* Fake Instagram Header */}
      <div className="pt-12 pb-2 px-4 border-b border-gray-800 flex justify-between items-center bg-brand-dark z-20">
        <h1 className="font-bold text-xl italic font-serif">InstaScroll</h1>
        <div className="flex gap-4 text-xl">
           <i className="far fa-heart"></i>
           <i className="far fa-paper-plane"></i>
        </div>
      </div>

      {/* Fake Feed */}
      <div className="flex-grow overflow-y-auto no-scrollbar">
         {[1, 2, 3].map((i) => (
           <div key={i} className="mb-8">
             <div className="flex items-center gap-3 p-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500"></div>
               <span className="font-semibold text-sm">random_influencer_{i}</span>
             </div>
             <img 
               src={`https://picsum.photos/400/400?random=${i}`} 
               alt="Feed" 
               className="w-full aspect-square object-cover"
             />
             <div className="p-3">
               <div className="flex gap-4 text-xl mb-2">
                 <i className="far fa-heart"></i>
                 <i className="far fa-comment"></i>
                 <i className="far fa-paper-plane"></i>
               </div>
               <p className="text-sm"><span className="font-bold">random_influencer_{i}</span> Just living my best life! #blessed #coffee</p>
             </div>
           </div>
         ))}
      </div>

      {/* Reward Timer Overlay - Floating */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-brand-success/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl border border-white/20 flex items-center gap-3 z-50">
         <i className="fas fa-unlock text-white text-xs"></i>
         <span className="text-white font-bold text-sm">Unlocked for 1 min</span>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <Button variant="secondary" onClick={() => setState(prev => ({ ...prev, view: 'home', itemsConsumed: 0 }))} className="px-4 py-2 text-xs rounded-full">
          Close App
        </Button>
      </div>

    </div>
  );

  return (
    <PhoneFrame>
      {state.view === 'onboarding' && renderOnboarding()}
      {state.view === 'home' && renderHome()}
      {state.view === 'intercept' && renderIntercept()}
      {state.view === 'reward' && renderReward()}
    </PhoneFrame>
  );
};

export default App;
