import React, { useState, useEffect } from 'react';
import AppRoutes from './routes';
import FullScreenLoader from './components/FullScreenLoader';

function App() {
  // Mostra a animação de entrada a cada vez que a app é carregada/recarregada.
  // isDone é ativado após 1.8s, dando tempo à animação Lottie de completar
  // antes de iniciar o fade-out (que dura 1.2s adicionais no FullScreenLoader).
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FullScreenLoader isDone={appReady} />
      <AppRoutes />
    </>
  );
}

export default App;
