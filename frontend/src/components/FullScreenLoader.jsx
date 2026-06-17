import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import loaderAnim from "../assets/loader3.json";

export default function FullScreenLoader({ isDone }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Só inicia o processo de abertura quando o sistema disser que está pronto
    if (isDone) {
      
      // FORÇA O LOADER A DEMORAR MAIS UM POUCO (2.5 segundos de pura retenção)
      const delayAntesDeAbrir = setTimeout(() => {
        setIsLeaving(true); // Dispara a abertura suave da página

        // ESPERA A TRANSIÇÃO ULTRA LENTA DE 2 SEGUNDOS TERMINAR
        const removeDoDOM = setTimeout(() => {
          setShouldRender(false);
        }, 2000); // Casado exatamente com os 2000ms do CSS abaixo

        return () => clearTimeout(removeDoDOM);
      }, 2500); 

      return () => clearTimeout(delayAntesDeAbrir);
    }
  }, [isDone]);

  if (!shouldRender) return null;

  return (
    <div 
      style={{
        ...styles.overlay,
        ...(isLeaving ? styles.overlayExit : {})
      }}
    >
      <div 
        style={{
          ...styles.content,
          ...(isLeaving ? styles.contentExit : {})
        }}
      >
        {/* LOTTIE BEM MENOR NO MOBILE */}
        <div style={styles.lottieBox}>
          <Lottie animationData={loaderAnim} style={styles.lottie} />
        </div>

        {/* TEXTO */}
        <h3 style={styles.title}>Espere...</h3>
        <p style={styles.subtitle}>Bernet System</p>
      </div>
    </div>
  );
}

const styles = {
  /* FUNDO DO LOADER */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#0a0f1c',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    opacity: 1,
    // TRANSIÇÃO ULTRA SUAVE E LENTA (2 segundos de transição cinematográfica)
    transition: 'opacity 2000ms cubic-bezier(0.33, 1, 0.68, 1)',
    willChange: 'opacity',
  },

  /* QUANDO ABRE A PÁGINA: Desvanece muito devagar para não abrir rápido */
  overlayExit: {
    opacity: 0,
    pointerEvents: 'none',
  },

  /* CONTEÚDO DA ANIMAÇÃO */
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    opacity: 1,
    transform: 'scale(1)',
    transition: 'transform 2000ms cubic-bezier(0.33, 1, 0.68, 1), opacity 2000ms cubic-bezier(0.33, 1, 0.68, 1)',
    willChange: 'transform, opacity',
  },

  /* O conteúdo some sumindo no horizonte lentamente */
  contentExit: {
    transform: 'scale(0.92)',
    opacity: 0,
  },

  /* AJUSTE COMPLETO DE RESPONSIVIDADE (DIMINUI NO MOBILE) */
  lottieBox: {
    // No Mobile: 200px (bem menor). No Desktop: até 360px.
    width: 'clamp(200px, 35vw, 360px)',
    height: 'clamp(200px, 35vw, 360px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.6))',
  },

  lottie: {
    width: '100%',
    height: '100%',
  },

  /* TEXTOS RESPONSIVOS */
  title: {
    marginTop: '20px',
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '0.5px',
  },

  subtitle: {
    marginTop: '6px',
    fontSize: 'clamp(10px, 1.5vw, 12px)',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  }
};