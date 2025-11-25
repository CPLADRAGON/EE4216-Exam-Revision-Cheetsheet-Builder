import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CheatSheet from './components/CheatSheet';
import PracticeMode from './components/PracticeMode';
import Concepts from './components/Concepts';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  return (
    <div className="antialiased">
      {currentView === ViewState.DASHBOARD && (
        <Dashboard changeView={setCurrentView} />
      )}
      {currentView === ViewState.CHEATSHEET && (
        <CheatSheet changeView={setCurrentView} />
      )}
      {currentView === ViewState.PRACTICE && (
        <PracticeMode changeView={setCurrentView} />
      )}
      {currentView === ViewState.CONCEPTS && (
        <Concepts changeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;