import React from 'react';

interface OwlLogoProps {
  className?: string;
  size?: number;
}

export default function OwlLogo({ className = "w-6 h-6" }: OwlLogoProps) {
  return (
    <svg
      viewBox="0 0 100 86"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Exact silhouette reconstruction of the golden Owl logo from reference */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 50 4 
           C 24.6 4 4 24.6 4 50 
           C 4 64.5 10.5 77.5 13 82 
           C 13.5 83 14.8 82.5 15.2 81.5 
           C 18.5 69 22 52.5 22 41 
           C 22 40 23.2 39.5 23.9 40.2 
           L 35.5 50.5 
           C 31 54 28 59.5 28 66 
           C 28 75.4 35.6 83 45 83 
           C 47.5 83 49 81.5 50 78.5 
           C 51 81.5 52.5 83 55 83 
           C 64.4 83 72 75.4 72 66 
           C 72 59.5 69 54 64.5 50.5 
           L 76.1 40.2 
           C 76.8 39.5 78 40 78 41 
           C 78 52.5 81.5 69 84.8 81.5 
           C 85.2 82.5 86.5 83 87 82 
           C 89.5 77.5 96 64.5 96 50 
           C 96 24.6 75.4 4 50 4 Z 
           M 50 17 
           C 65 17 77.5 26.5 81.5 36.5 
           C 77 34 71 34 66 38 
           L 50 51.5 
           L 34 38 
           C 29 34 23 34 18.5 36.5 
           C 22.5 26.5 35 17 50 17 Z"
      />
    </svg>
  );
}
