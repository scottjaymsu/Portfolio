import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapComponent from './Map';
import SummaryPage from './SummaryPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MapComponent />} />
                <Route path="/summary/:location" element={<SummaryPage/>} />
            </Routes>
        </Router>
    );
}

export default App;

