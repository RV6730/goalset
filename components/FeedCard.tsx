import React, { useState } from 'react';
import { FeedItem } from '../types';
import { Button } from './Button';

interface FeedCardProps {
  item: FeedItem;
  onComplete: () => void;
  index: number;
  total: number;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, onComplete, index, total }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const handleOptionClick = (option: string) => {
    if (showExplanation) return;
    
    setSelectedOption(option);
    if (option === item.correctAnswer) {
      setShowExplanation(true);
      setIsWrong(false);
    } else {
      setIsWrong(true);
      // Shake effect logic handled by UI classes
      setTimeout(() => setSelectedOption(null), 800); // Reset selection after visual feedback
    }
  };

  const handleContinue = () => {
    setShowExplanation(true); // Just show explanation for non-quiz items immediately
  };

  return (
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-[500px] max-h-[70vh]">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-brand-accent transition-all duration-300" 
          style={{ width: `${((index) / total) * 100}%` }}
        ></div>
      </div>

      <div className="mt-4 mb-2 flex justify-between items-center text-gray-400 text-xs uppercase tracking-wider font-bold">
        <span>FUTURE FEED • {item.type}</span>
        <span>{index + 1} / {total}</span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
        {item.headline}
      </h3>

      <div className="flex-grow overflow-y-auto no-scrollbar">
        <p className="text-lg text-gray-300 mb-6 font-light leading-relaxed">
          {item.content}
        </p>

        {item.type === 'quiz' && item.options && (
          <div className="space-y-3">
            {item.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  selectedOption === opt
                    ? isWrong 
                      ? 'bg-red-500/20 border-red-500 text-red-200'
                      : 'bg-green-500/20 border-green-500 text-green-200'
                    : 'bg-gray-800 border-transparent hover:bg-gray-700 text-gray-200'
                }`}
              >
                {opt}
                {showExplanation && opt === item.correctAnswer && (
                  <i className="fas fa-check float-right mt-1 text-green-400"></i>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Explanation Area */}
      <div className={`mt-auto pt-6 border-t border-gray-800 transition-all duration-500 ${showExplanation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-brand-accent/10 p-4 rounded-xl border border-brand-accent/20 mb-4">
          <p className="text-sm text-brand-accent font-medium">
            <i className="fas fa-lightbulb mr-2"></i>
            {item.explanation}
          </p>
        </div>
        <Button onClick={onComplete} className="w-full shadow-brand-accent/20 shadow-lg">
          I Learned This <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>

      {/* Non-quiz continue button if explanation not shown */}
      {item.type !== 'quiz' && !showExplanation && (
         <div className="absolute bottom-6 left-6 right-6">
            <Button onClick={handleContinue} className="w-full">
              Reveal Insight
            </Button>
         </div>
      )}
    </div>
  );
};