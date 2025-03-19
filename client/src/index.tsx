import React from 'react';
import ReactDOM from 'react-dom/client';

import { Application } from './application';

import { TaskProvider } from './contexts/task-context';
import { ThemeProvider } from './contexts/theme-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <Application />
      </TaskProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
