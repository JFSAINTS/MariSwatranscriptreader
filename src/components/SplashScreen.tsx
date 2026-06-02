import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <img
          src="/icons/icon-256.png"
          alt="Mari Swa"
          className="w-32 h-32 rounded-full shadow-2xl"
        />
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-delay-1">
        Mari Swa
      </h1>
      <p className="text-slate-400 text-sm mb-8 animate-fade-in-delay-2">
        Transcriptos Reader
      </p>

      {/* Indicador de carga */}
      <div className="flex gap-2 animate-fade-in-delay-3">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          animation: fadeIn 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-3 {
          animation: fadeIn 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 0.1s !important;
        }

        .delay-200 {
          animation-delay: 0.2s !important;
        }
      `}</style>
    </div>
  );
}
