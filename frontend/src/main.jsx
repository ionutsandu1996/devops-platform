// main.jsx — Entry point of the React application
// This is the file that Vite loads first
// It mounts the React app into the HTML page

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global CSS — imported once here, applies everywhere
import './index.css';

import App from './App.jsx';

// createRoot: the React 18 way to mount the app
// document.getElementById('root') finds the <div id="root"> in index.html
// This is where our entire React app lives in the DOM
createRoot(document.getElementById('root')).render(
    // StrictMode: development tool that highlights potential problems
    // It renders components twice in development to detect side effects
    // Has no effect in production
    <StrictMode>
        <App />
    </StrictMode>
);