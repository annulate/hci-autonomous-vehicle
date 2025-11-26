import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SteeringWheelControlProps {
  urgency: 'low' | 'medium' | 'high';
  onTakeControl: () => void;
  isActive: boolean;
}

export function SteeringWheelControl({ urgency, onTakeControl, isActive }: SteeringWheelControlProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 100);
    }, urgency === 'high' ? 300 : urgency === 'medium' ? 600 : 1000);

    return () => clearInterval(interval);
  }, [urgency, isActive]);

  const getColorScheme = () => {
    switch (urgency) {
      case 'high':
        return {
          glow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
          ring: 'stroke-red-500',
          fill: 'fill-red-500/20',
          text: 'text-red-500',
          bg: 'bg-red-500/10'
        };
      case 'medium':
        return {
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
          ring: 'stroke-amber-500',
          fill: 'fill-amber-500/20',
          text: 'text-amber-500',
          bg: 'bg-amber-500/10'
        };
      default:
        return {
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          ring: 'stroke-blue-500',
          fill: 'fill-blue-500/20',
          text: 'text-blue-500',
          bg: 'bg-blue-500/10'
        };
    }
  };

  const colors = getColorScheme();
  const shouldPulse = isActive && urgency !== 'low';

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={shouldPulse ? {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1]
        } : {}}
        transition={{
          duration: urgency === 'high' ? 0.6 : 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`relative ${colors.glow}`}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => {
          setIsPressed(false);
          if (isActive) onTakeControl();
        }}
        onPointerLeave={() => setIsPressed(false)}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className={`transform transition-transform ${isPressed ? 'scale-95' : 'scale-100'} cursor-pointer`}
        >
          {/* Outer glow ring */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            className={colors.ring}
            strokeWidth="2"
            opacity={isActive ? (shouldPulse ? 0.3 + (pulseIntensity / 100) * 0.4 : 0.3) : 0.1}
          />

          {/* Steering wheel outer rim */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            className={colors.ring}
            strokeWidth="12"
            opacity={isActive ? 0.8 : 0.3}
          />

          {/* Steering wheel inner rim */}
          <circle
            cx="100"
            cy="100"
            r="65"
            className={colors.fill}
            opacity={isActive ? 0.2 : 0.1}
          />

          {/* Spokes */}
          <line x1="100" y1="30" x2="100" y2="50" className={colors.ring} strokeWidth="8" opacity={isActive ? 0.8 : 0.3} />
          <line x1="100" y1="150" x2="100" y2="170" className={colors.ring} strokeWidth="8" opacity={isActive ? 0.8 : 0.3} />
          <line x1="30" y1="100" x2="50" y2="100" className={colors.ring} strokeWidth="8" opacity={isActive ? 0.8 : 0.3} />
          <line x1="150" y1="100" x2="170" y2="100" className={colors.ring} strokeWidth="8" opacity={isActive ? 0.8 : 0.3} />

          {/* Center hub */}
          <circle
            cx="100"
            cy="100"
            r="25"
            className={colors.fill}
            opacity={isActive ? 0.4 : 0.2}
          />
          <circle
            cx="100"
            cy="100"
            r="25"
            fill="none"
            className={colors.ring}
            strokeWidth="3"
            opacity={isActive ? 0.8 : 0.3}
          />

          {/* Center icon - hand */}
          {isActive && (
            <g transform="translate(100, 100)">
              <path
                d="M-8,-10 L-8,0 M-4,-12 L-4,0 M0,-14 L0,0 M4,-12 L4,0 M8,-10 L8,2 Q8,8 2,8 L-8,8 Q-10,8 -10,6 L-10,0"
                fill="none"
                className={colors.ring}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>

        {/* LED indicators around the wheel */}
        {isActive && urgency !== 'low' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const radius = 95;
              const x = Math.cos(angle) * radius + 100;
              const y = Math.sin(angle) * radius + 100;
              const isLit = urgency === 'high' ? true : (pulseIntensity / 10) > i;
              
              return (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${isLit ? colors.bg : 'bg-slate-700/30'} transition-colors`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              );
            })}
          </div>
        )}
      </motion.div>

      {isActive && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${colors.text} text-center text-sm`}
        >
          {urgency === 'high' ? 'PLACE HANDS ON WHEEL NOW' : 
           urgency === 'medium' ? 'Place hands on steering wheel' :
           'Prepare to take control'}
        </motion.p>
      )}
    </div>
  );
}
