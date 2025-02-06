import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BatchFile from './pages/BatchFile'; 
import Home from './pages/Home'; 


function App() {
  return (
    <BrowserRouter> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batch" element={<BatchFile />} />
        </Routes>
    </BrowserRouter> 
  );
}

export default App;
