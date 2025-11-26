import { motion } from 'motion/react';
import { Button } from './ui/button';
import { BarChart3, Clock, TrendingDown, Award, ArrowLeft } from 'lucide-react';

interface ResultsPageProps {
  groupType: 'A' | 'B';
  reactionTimes: Array<{ scenario: string; time: number }>;
  onBackToMenu: () => void;
}

export function ResultsPage({ groupType, reactionTimes, onBackToMenu }: ResultsPageProps) {
  const averageTime = reactionTimes.length > 0
    ? reactionTimes.reduce((sum, rt) => sum + rt.time, 0) / reactionTimes.length
    : 0;

  const fastestTime = reactionTimes.length > 0
    ? Math.min(...reactionTimes.map(rt => rt.time))
    : 0;

  const slowestTime = reactionTimes.length > 0
    ? Math.max(...reactionTimes.map(rt => rt.time))
    : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
      <div className="min-h-screen p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <h1 className="text-white text-2xl">Experiment Complete!</h1>
                  <p className="text-slate-400 text-sm">
                    Group {groupType}: {groupType === 'A' ? 'Context-Aware UI' : 'Generic Alert UI'}
                  </p>
                </div>
              </div>
              <Button
                onClick={onBackToMenu}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/50 to-blue-950/50 rounded-xl p-6 border border-blue-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <p className="text-blue-300 text-sm">Average Reaction Time</p>
              </div>
              <p className="text-white text-3xl">{averageTime.toFixed(2)}s</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-900/50 to-green-950/50 rounded-xl p-6 border border-green-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">Fastest Response</p>
              </div>
              <p className="text-white text-3xl">{fastestTime.toFixed(2)}s</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-900/50 to-amber-950/50 rounded-xl p-6 border border-amber-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <p className="text-amber-300 text-sm">Slowest Response</p>
              </div>
              <p className="text-white text-3xl">{slowestTime.toFixed(2)}s</p>
            </motion.div>
          </div>

          {/* Individual Scenario Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-white text-xl">Scenario Breakdown</h2>
            </div>

            <div className="space-y-4">
              {reactionTimes.map((rt, index) => {
                const percentage = (rt.time / slowestTime) * 100;
                const isGood = rt.time <= averageTime;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isGood ? 'bg-green-600/20 text-green-400' : 'bg-amber-600/20 text-amber-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white">{rt.scenario}</p>
                          <p className="text-slate-400 text-xs">
                            {isGood ? 'Above average' : 'Below average'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xl tabular-nums">{rt.time.toFixed(2)}s</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className={`h-full ${
                          isGood 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Performance Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`rounded-2xl p-6 border ${
              averageTime < 3 
                ? 'bg-gradient-to-br from-green-900/50 to-green-950/50 border-green-700'
                : averageTime < 5
                ? 'bg-gradient-to-br from-blue-900/50 to-blue-950/50 border-blue-700'
                : 'bg-gradient-to-br from-amber-900/50 to-amber-950/50 border-amber-700'
            }`}
          >
            <h3 className="text-white text-lg mb-2">Performance Summary</h3>
            <p className="text-slate-300 text-sm">
              {averageTime < 3 && (
                "Excellent response times! You demonstrated quick situational awareness and fast handover reactions."
              )}
              {averageTime >= 3 && averageTime < 5 && (
                "Good performance. Your reaction times show solid awareness of the handover situations."
              )}
              {averageTime >= 5 && (
                "Your reaction times suggest room for improvement. Consider how the UI clarity affects your response speed."
              )}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-4"
          >
            <Button
              onClick={onBackToMenu}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6"
            >
              Return to Main Menu
            </Button>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-slate-500 text-xs pb-8">
            <p>Thank you for participating in this experiment!</p>
            <p className="mt-1">Your data helps improve autonomous vehicle handover interfaces.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}