import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SimulatorComponent from './pages/Simulator';


// Mock useParams
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ airportCode: 'KTEB' })), // Fix the mock
}));

// Mock Axios
jest.mock('axios');
