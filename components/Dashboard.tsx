import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, PenTool, FileText, AlertTriangle } from 'lucide-react';
import { ViewState } from '../types';

interface DashboardProps {
  changeView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ changeView }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Target: 11 hours from now (mock)
    const targetDate = new Date(new Date().getTime() + 11 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance < 0) {
        setTimeLeft("EXAM STARTED");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-nus-blue">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-nus-blue">EE4216 Exam Prep</h1>
            <p className="text-slate-600 mt-2">Hardware for IoT • Final Exam Preparation</p>
          </div>
          <div className="text-right bg-nus-orange/10 p-4 rounded-lg border border-nus-orange/20">
            <div className="text-sm text-nus-orange font-semibold uppercase tracking-wide">Time Remaining</div>
            <div className="text-3xl font-mono font-bold text-nus-orange flex items-center gap-2">
              <Clock className="w-6 h-6" />
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertTriangle className="text-yellow-600 w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800">Exam Format Reminder</h3>
            <ul className="list-disc list-inside text-sm text-yellow-800 mt-1 space-y-1">
              <li>Allowed: One A4-size helping sheet (double-sided).</li>
              <li>4 Questions: Spot errors, Fill in blanks, Concept explanations.</li>
              <li>Tip: If you forget a function name, describe the intent clearly.</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => changeView(ViewState.CHEATSHEET)}
            className="group p-6 bg-slate-50 hover:bg-nus-blue hover:text-white border border-slate-200 rounded-xl transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-md"
          >
            <FileText className="w-12 h-12 text-nus-blue group-hover:text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Cheat Sheet Generator</h3>
            <p className="text-sm text-slate-500 group-hover:text-blue-100">View and print your condensed A4 study guide covering all 5 chapters.</p>
          </button>

          <button 
            onClick={() => changeView(ViewState.PRACTICE)}
            className="group p-6 bg-slate-50 hover:bg-nus-blue hover:text-white border border-slate-200 rounded-xl transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-md"
          >
            <PenTool className="w-12 h-12 text-nus-blue group-hover:text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Exam Simulator</h3>
            <p className="text-sm text-slate-500 group-hover:text-blue-100">Practice error spotting and code completion with AI-generated questions.</p>
          </button>

          <button 
            onClick={() => changeView(ViewState.CONCEPTS)}
            className="group p-6 bg-slate-50 hover:bg-nus-blue hover:text-white border border-slate-200 rounded-xl transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-12 h-12 text-nus-blue group-hover:text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Key Concepts</h3>
            <p className="text-sm text-slate-500 group-hover:text-blue-100">Deep dive into MQTT vs HTTP, Sleep Modes, and FreeRTOS states.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;