import './App.css';
import React from 'react';
import Header from './components/Header';
import Bio from './components/Bio';
import ProjectView from './components/ProjectView';

function App() {
  return (
    <div className="Homepage">
      <Header />
      <Bio />
      <ProjectView />
    </div>
  );
}

export default App;