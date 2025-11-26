import { useState } from 'react';
import { GroupAPrototype } from './components/GroupAPrototype';
import { GroupBPrototype } from './components/GroupBPrototype';
import { Button } from './components/ui/button';

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | null>(null);

  if (selectedGroup === 'A') {
    return <GroupAPrototype onBack={() => setSelectedGroup(null)} />;
  }

  if (selectedGroup === 'B') {
    return <GroupBPrototype onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-white">Context-Aware Transition UI</h1>
          <p className="text-slate-300">
            Autonomous Vehicle Handover Control Experiment
          </p>
          <div className="pt-2 space-y-1">
            <p className="text-slate-400 text-sm">Team 41</p>
            <div className="text-slate-500 text-xs space-y-0.5">
              <p>Pang Jia De</p>
              <p>Tan Eng Tong Chervelle</p>
              <p>Hooi Yong Xiang</p>
              <p>Lim Min Xuan</p>
              <p>Koh Han Sheng</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 space-y-3">
            <h2 className="text-white">Group A</h2>
            <p className="text-slate-400 text-sm">
              Context-aware alerts with detailed situation information
            </p>
            <Button 
              onClick={() => setSelectedGroup('A')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start Group A Prototype
            </Button>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 space-y-3">
            <h2 className="text-white">Group B</h2>
            <p className="text-slate-400 text-sm">
              Generic alerts without specific context
            </p>
            <Button 
              onClick={() => setSelectedGroup('B')}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Start Group B Prototype
            </Button>
          </div>
        </div>

        <p className="text-slate-500 text-xs">
          Prototype for experimental evaluation of AV handover interfaces
        </p>
      </div>
    </div>
  );
}