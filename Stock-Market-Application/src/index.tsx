import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement: HTMLElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

root.render(<App />);

