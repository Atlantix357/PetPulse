import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'glass';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-dark-light border border-dark-lighter',
    neon: 'bg-dark-light border border-secondary shadow-neon',
    glass: 'bg-dark-light bg-opacity-70 backdrop-blur-md border border-dark-lighter',
  };
  
  const hoverClass = hover ? 'hover:border-primary' : '';
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
