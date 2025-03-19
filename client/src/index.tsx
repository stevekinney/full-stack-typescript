import React from 'react';
import ReactDOM from 'react-dom/client';

import { Application } from './application';
import './index.css';

import { ThemeProvider } from './contexts/theme-context';
import { TaskProvider } from './contexts/task-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <Application />
      </TaskProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
