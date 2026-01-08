import React from 'react';
import { MockApp } from '../types';

interface AppIconProps {
  app: MockApp;
  onClick: (app: MockApp) => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => onClick(app)}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md transition-transform group-hover:-translate-y-1 ${app.color}`}>
        <i className={`fas ${app.icon}`}></i>
      </div>
      <span className="text-xs font-medium text-gray-300 group-hover:text-white">{app.name}</span>
    </div>
  );
};
