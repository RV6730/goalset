import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-accent to-blue-600 text-white hover:shadow-brand-accent/50",
    secondary: "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Thinking...</span>
        </>
      ) : children}
    </button>
  );
};
