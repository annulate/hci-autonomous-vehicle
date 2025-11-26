import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';

interface VoiceFeedbackProps {
  message: string;
  urgency: 'low' | 'medium' | 'high';
  isPlaying: boolean;
}

export function VoiceFeedback({ message, urgency, isPlaying }: VoiceFeedbackProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (isPlaying && message) {
      setDisplayText('');
      let index = 0;
      const speed = urgency === 'high' ? 30 : urgency === 'medium' ? 50 : 70;
      
      const interval = setInterval(() => {
        if (index < message.length) {
          setDisplayText(message.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      // Simulate speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = urgency === 'high' ? 1.2 : urgency === 'medium' ? 1.0 : 0.9;
        utterance.pitch = urgency === 'high' ? 1.1 : 1.0;
        utterance.volume = urgency === 'high' ? 1.0 : 0.8;
        window.speechSynthesis.speak(utterance);
      }

      return () => {
        clearInterval(interval);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [message, urgency, isPlaying]);

  if (!isPlaying || !message) return null;

  const getColorClass = () => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 border-red-500 text-red-100';
      case 'medium': return 'bg-amber-500/20 border-amber-500 text-amber-100';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-100';
    }
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${getColorClass()} backdrop-blur-sm`}>
      <Volume2 
        className={`w-5 h-5 ${urgency === 'high' ? 'animate-pulse' : ''}`} 
      />
      <p className="text-sm flex-1">
        {displayText}
        {displayText.length < message.length && (
          <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
        )}
      </p>
    </div>
  );
}
