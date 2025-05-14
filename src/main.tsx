
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ReportProvider } from './context/ReportContext.tsx';

createRoot(document.getElementById("root")!).render(
  <ReportProvider>
    <App />
  </ReportProvider>
);
