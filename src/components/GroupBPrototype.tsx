import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrafficScene } from './TrafficScene';
import { SteeringWheelControl } from './SteeringWheelControl';
import { VoiceFeedback } from './VoiceFeedback';
import { ResultsPage } from './ResultsPage';
import { Button } from './ui/button';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GroupBPrototypeProps {
  onBack: () => void;
}

type Scenario = {
  id: string;
  type: 'construction' | 'weather' | 'accident' | 'sensor-failure';
  stages: Stage[];
};

type Stage = {
  urgency: 'low' | 'medium' | 'high';
  distance: number; // km
  duration: number;
};

const scenarios: Scenario[] = [
  {
    id: 'test1',
    type: 'construction',
    stages: [
      { urgency: 'low', distance: 3.2, duration: 8 }
    ]
  },
  {
    id: 'test2',
    type: 'weather',
    stages: [
      { urgency: 'medium', distance: 0.8, duration: 8 }
    ]
  },
  {
    id: 'test3',
    type: 'accident',
    stages: [
      { urgency: 'high', distance: 0.2, duration: 8 }
    ]
  }
];

const scenarioNames = [
  'Test 1',
  'Test 2',
  'Test 3'
];

export function GroupBPrototype({ onBack }: GroupBPrototypeProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<Array<{ scenario: string; time: number }>>([]);
  const [countdown, setCountdown] = useState(10);

  const currentScenario = scenarios[currentScenarioIndex];
  const currentStage = currentScenario.stages[currentStageIndex];

  useEffect(() => {
    if (!isActive) return;

    setStartTime(Date.now());
    setCountdown(10);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    const timer = setTimeout(() => {
      if (currentStageIndex < currentScenario.stages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
      }
    }, currentStage.duration * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isActive, currentStageIndex, currentStage.duration, currentScenario.stages.length]);

  const handleTakeControl = () => {
    if (startTime) {
      const reactionTime = (Date.now() - startTime) / 1000;
      setReactionTimes([...reactionTimes, {
        scenario: scenarioNames[currentScenarioIndex],
        time: reactionTime
      }]);
    }
    
    setIsActive(false);
    setShowResume(true);
  };

  const handleResume = () => {
    setShowResume(false);
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setCurrentStageIndex(0);
    } else {
      // Show results page after last scenario
      setShowResults(true);
    }
  };

  const handleBackToMenu = () => {
    setShowResults(false);
    setCurrentScenarioIndex(0);
    setCurrentStageIndex(0);
    setReactionTimes([]);
    onBack(); // Return to main menu where user can choose Group A or B
  };

  const handleStartScenario = () => {
    setIsActive(true);
    setCurrentStageIndex(0);
  };

  const getGenericMessage = () => {
    switch (currentStage.urgency) {
      case 'high': return 'TAKE CONTROL NOW!';
      case 'medium': return 'Please take control';
      default: return 'Prepare to take control';
    }
  };

  const getGenericVoiceMessage = () => {
    switch (currentStage.urgency) {
      case 'high': return 'Take control of the vehicle now!';
      case 'medium': return 'Please take control of the vehicle.';
      default: return 'Prepare to take control of the vehicle.';
    }
  };

  const getAlertBarColor = () => {
    switch (currentStage.urgency) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  if (showResults) {
    return (
      <ResultsPage
        groupType="B"
        reactionTimes={reactionTimes}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header - Different style from Group A */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 p-3 flex items-center justify-between z-50">
        <button onClick={onBack} className="text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-yellow-400 text-sm uppercase tracking-wider">Group B - Generic Alerts</h2>
          <p className="text-gray-400 text-xs">Test {currentScenarioIndex + 1} • Phase {currentStageIndex + 1}</p>
        </div>
        <div className="w-5" />
      </div>

      {/* Traffic Scene */}
      <div className="flex-1 relative">
        <TrafficScene 
          scenario={currentScenario.type} 
          distance={currentStage.distance}
          isActive={isActive}
          urgency={currentStage.urgency}
        />

        {/* Generic Alert Banner - Centered on screen, different design */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div className={`${getAlertBarColor()} rounded-xl shadow-2xl border-4 border-white/20 overflow-hidden min-w-[320px] max-w-md`}>
                {/* Alert Header */}
                <div className={`p-4 flex items-center gap-3 ${
                  currentStage.urgency === 'high' ? 'animate-pulse' : ''
                }`}>
                  <div className="bg-white/20 rounded-full p-2">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg font-medium">{getGenericMessage()}</p>
                    <p className="text-white/80 text-sm mt-0.5">System Alert</p>
                  </div>
                </div>
                
                {/* Timer Bar - Now clearly visible for all stages */}
                <div className="bg-black/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        key={`timer-${currentScenarioIndex}-${currentStageIndex}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: currentStage.duration, ease: 'linear' }}
                        className="h-full bg-white shadow-lg"
                      />
                    </div>
                    <span className="text-white font-mono text-lg min-w-[3ch] text-right">{countdown}s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Feedback - Different positioning */}
        <div className="absolute bottom-32 left-4 right-4 z-40">
          <VoiceFeedback 
            message={getGenericVoiceMessage()}
            urgency={currentStage.urgency}
            isPlaying={isActive}
          />
        </div>

        {/* Steering Wheel Control */}
        <div className="absolute inset-0 flex items-center justify-center">
          <SteeringWheelControl 
            urgency={currentStage.urgency}
            onTakeControl={handleTakeControl}
            isActive={isActive}
          />
        </div>

        {/* Resume Overlay - Different color scheme */}
        <AnimatePresence>
          {showResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500 rounded-2xl p-8 max-w-sm mx-4 text-center space-y-6 shadow-2xl"
              >
                <CheckCircle2 className="w-16 h-16 text-yellow-500 mx-auto" />
                <div>
                  <h3 className="text-white text-xl mb-2">Manual Control Active</h3>
                  <p className="text-gray-300 text-sm">You are driving manually</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={handleResume}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                  >
                    Resume Autonomous Mode
                  </Button>
                  <Button 
                    onClick={() => setShowResume(false)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    Continue Manual Drive
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Scenario Overlay - Different styling */}
        {!isActive && !showResume && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-2xl p-8 max-w-sm mx-4 text-center space-y-4 shadow-2xl">
              <div className="bg-yellow-500/10 rounded-full p-4 inline-block">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
              </div>
              <div>
                <h3 className="text-white text-xl mb-2">Test Scenario Ready</h3>
                <p className="text-gray-400 text-sm">Test {currentScenarioIndex + 1} of {scenarios.length}</p>
              </div>
              <Button 
                onClick={handleStartScenario}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
              >
                Start Test
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats - Different style */}
      <div className="bg-gray-800 border-t-2 border-yellow-500 p-3">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Tests</p>
            <p className="text-yellow-400 font-mono">{currentScenarioIndex + 1}/{scenarios.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Avg Time</p>
            <p className="text-yellow-400 font-mono">
              {reactionTimes.length > 0 
                ? (reactionTimes.reduce((a, b) => a + b.time, 0) / reactionTimes.length).toFixed(2) + 's'
                : '--'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}