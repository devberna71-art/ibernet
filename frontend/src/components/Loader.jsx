import React, { useEffect, useState } from "react";
import "./loader.css";

export default function Loader({ show }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    // MOSTRA O LOADER
    if (show) {
      setVisible(true);
    }

    // DEMORA PARA FECHAR
    else {
      timer = setTimeout(() => {
        setVisible(false);
      }, 35000000); // <<< AQUI O TEMPO (3.5 segundos)
    }

    return () => clearTimeout(timer);
  }, [show]);

  // mantém loader visível
  if (!visible && !show) return null;

  return (
    <div className="premium-loader-overlay">
      {/* glow */}
      <div className="premium-loader-glow"></div>

      {/* conteúdo */}
      <div className="premium-loader-container">
        <div className="premium-spinner">
          <div className="spinner-ring ring1"></div>
          <div className="spinner-ring ring2"></div>
          <div className="spinner-core"></div>
        </div>

        <div className="premium-loader-text">
          Carregando...
        </div>
      </div>
    </div>
  );
}