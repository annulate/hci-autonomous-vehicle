import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrafficScene } from './TrafficScene';
import { SteeringWheelControl } from './SteeringWheelControl';
import { VoiceFeedback } from './VoiceFeedback';
import { ResultsPage } from './ResultsPage';
import { Button } from './ui/button';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, Construction, Cloud, Car } from 'lucide-react';

interface GroupAPrototypeProps {
  onBack: () => void;
}

type Scenario = {
  id: string;
  type: 'construction' | 'weather' | 'accident' | 'sensor-failure';
  name: string;
  stages: Stage[];
};

type Stage = {
  urgency: 'low' | 'medium' | 'high';
  distance: number; // km
  message: string;
  voiceMessage: string;
  duration: number; // seconds
  icon: typeof Construction;
};

const scenarios: Scenario[] = [
  {
    id: 'construction',
    type: 'construction',
    name: 'Construction Zone',
    stages: [
      {
        urgency: 'low',
        distance: 3.2,
        message: 'Construction zone ahead in 3.2 km',
        voiceMessage: 'Construction zone detected ahead. You will need to take control shortly.',
        duration: 5,
        icon: Construction
      },
      {
        urgency: 'medium',
        distance: 0.8,
        message: 'Approaching construction - Prepare to take control',
        voiceMessage: 'Construction zone ahead. Please place your hands on the steering wheel.',
        duration: 5,
        icon: Construction
      },
      {
        urgency: 'high',
        distance: 0.2,
        message: 'Construction zone - TAKE CONTROL NOW',
        voiceMessage: 'Take control of the vehicle immediately. Construction zone ahead.',
        duration: 8,
        icon: Construction
      }
    ]
  },
  {
    id: 'weather',
    type: 'weather',
    name: 'Heavy Weather',
    stages: [
      {
        urgency: 'low',
        distance: 2.4,
        message: 'Heavy rain detected - Sensors may be affected',
        voiceMessage: 'Heavy weather conditions ahead. Prepare to take control.',
        duration: 5,
        icon: Cloud
      },
      {
        urgency: 'medium',
        distance: 0.5,
        message: 'Weather conditions worsening - Take the wheel',
        voiceMessage: 'Sensor visibility reduced. Please take control of the vehicle.',
        duration: 5,
        icon: Cloud
      },
      {
        urgency: 'high',
        distance: 0.2,
        message: 'CRITICAL: Sensor blockage - IMMEDIATE HANDOVER',
        voiceMessage: 'Critical sensor blockage detected. Take control now!',
        duration: 8,
        icon: AlertTriangle
      }
    ]
  },
  {
    id: 'accident',
    type: 'accident',
    name: 'Accident Ahead',
    stages: [
      {
        urgency: 'medium',
        distance: 1.3,
        message: 'Accident reported ahead - Lane changes required',
        voiceMessage: 'Accident ahead. Complex maneuvering needed. Please prepare to take control.',
        duration: 5,
        icon: Car
      },
      {
        urgency: 'high',
        distance: 0.3,
        message: 'ACCIDENT AHEAD - TAKE CONTROL IMMEDIATELY',
        voiceMessage: 'Take control now. Accident ahead requires immediate driver intervention.',
        duration: 8,
        icon: AlertTriangle
      }
    ]
  },
  {
    id: 'sensor',
    type: 'sensor-failure',
    name: 'Sensor Failure',
    stages: [
      {
        urgency: 'high',
        distance: 0.0,
        message: 'SENSOR FAILURE - IMMEDIATE HANDOVER REQUIRED',
        voiceMessage: 'Critical system failure. Take control of the vehicle immediately!',
        duration: 8,
        icon: AlertTriangle
      }
    ]
  }
];

// Fisher-Yates shuffle algorithm for randomizing scenarios
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function GroupAPrototype({ onBack }: GroupAPrototypeProps) {
  // Randomize scenarios once when component mounts
  const [randomizedScenarios] = useState(() => shuffleArray(scenarios));
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<Array<{ scenario: string; time: number }>>([]);
  const [failureCount, setFailureCount] = useState(0);

  const currentScenario = randomizedScenarios[currentScenarioIndex];
  const currentStage = currentScenario.stages[currentStageIndex];

  useEffect(() => {
    if (!isActive) return;

    setStartTime(Date.now());

    const timer = setTimeout(() => {
      if (currentStageIndex < currentScenario.stages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
      } else {
        // Timer ran out on final stage - scenario failure
        setIsActive(false);
        setShowFailure(true);
        setFailureCount(failureCount + 1);
      }
    }, currentStage.duration * 1000);

    return () => clearTimeout(timer);
  }, [isActive, currentStageIndex, currentStage.duration, currentScenario.stages.length, failureCount]);

  const handleTakeControl = () => {
    if (startTime) {
      const reactionTime = (Date.now() - startTime) / 1000;
      setReactionTimes([...reactionTimes, {
        scenario: currentScenario.name,
        time: reactionTime
      }]);
    }
    
    setIsActive(false);
    setShowResume(true);
  };

  const handleResume = () => {
    setShowResume(false);
    if (currentScenarioIndex < randomizedScenarios.length - 1) {
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

  const handleRetryScenario = () => {
    setShowFailure(false);
    setCurrentStageIndex(0);
    setIsActive(true);
  };

  const handleStartScenario = () => {
    setIsActive(true);
    setCurrentStageIndex(0);
  };

  const getAlertBarColor = () => {
    switch (currentStage.urgency) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const Icon = currentStage.icon;

  if (showResults) {
    return (
      <ResultsPage
        groupType="A"
        reactionTimes={reactionTimes}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between z-50">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-white text-sm">Group A: Context-Aware UI</h2>
          <p className="text-slate-400 text-xs">{currentScenario.name} - Stage {currentStageIndex + 1}/{currentScenario.stages.length}</p>
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

        {/* Alert Bar */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className={`absolute top-0 left-0 right-0 ${getAlertBarColor()} ${
                currentStage.urgency === 'high' ? 'animate-pulse' : ''
              }`}
            >
              <div className="p-4 flex items-center gap-3">
                <Icon className="w-6 h-6 text-white flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white">{currentStage.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-white/70" />
                    <p className="text-white/70 text-xs">{currentStage.distance} km</p>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <motion.div
                key={`timer-${currentScenarioIndex}-${currentStageIndex}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: currentStage.duration, ease: 'linear' }}
                className="h-1 bg-white/30"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Feedback */}
        <div className="absolute top-20 left-4 right-4 z-40">
          <VoiceFeedback 
            message={currentStage.voiceMessage}
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

        {/* Resume Overlay */}
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
                className="bg-gradient-to-b from-green-900/90 to-green-950/90 border-2 border-green-500 rounded-2xl p-8 max-w-sm mx-4 text-center space-y-6"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-white text-xl mb-2">Hazard Cleared</h3>
                  <p className="text-green-200 text-sm">You have successfully taken control of the vehicle</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={handleResume}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Resume Autonomous Drive
                  </Button>
                  <Button 
                    onClick={() => setShowResume(false)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    Keep Driving Manually
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Failure Overlay */}
        <AnimatePresence>
          {showFailure && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              {/* Red flash effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8, 1, 0] }}
                transition={{ duration: 1, times: [0, 0.2, 0.4, 0.6, 1] }}
                className="absolute inset-0 bg-red-600/60 pointer-events-none"
              />
              
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-b from-red-900/90 to-red-950/90 border-2 border-red-500 rounded-2xl p-8 max-w-sm mx-4 text-center space-y-6 relative z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
                </motion.div>
                <div>
                  <h3 className="text-white text-xl mb-2">Scenario Failed</h3>
                  <p className="text-red-200 text-sm">You did not take control in time</p>
                  <p className="text-red-300 text-xs mt-2">The vehicle experienced a near-miss collision</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={handleRetryScenario}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Retry Scenario
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Scenario Overlay */}
        {!isActive && !showResume && !showFailure && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-sm mx-4 text-center space-y-4">
              <Icon className="w-12 h-12 text-blue-500 mx-auto" />
              <div>
                <h3 className="text-white text-xl mb-2">{currentScenario.name}</h3>
                <p className="text-slate-400 text-sm">Scenario {currentScenarioIndex + 1} of {randomizedScenarios.length}</p>
              </div>
              <Button 
                onClick={handleStartScenario}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Scenario
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-900 border-t border-slate-700 p-3">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-slate-400 text-xs">Scenarios</p>
            <p className="text-white">{currentScenarioIndex + 1}/{randomizedScenarios.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Avg Reaction</p>
            <p className="text-white">
              {reactionTimes.length > 0 
                ? (reactionTimes.reduce((a, b) => a + b.time, 0) / reactionTimes.length).toFixed(2) + 's'
                : '--'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Failures</p>
            <p className="text-red-500">{failureCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}