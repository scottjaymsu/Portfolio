import './App.css';
import React from 'react';
import Header from './components/Header';
import Bio from './components/Bio';
import LabView from './components/LabView';

function App() {
  return (
    <div className="Homepage">
      <Header />
      <Bio />
      <LabView />
    </div>
  );
}

export default App;