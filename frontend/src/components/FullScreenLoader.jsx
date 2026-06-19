import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import loaderAnim from "../assets/loader3.json";

export default function FullScreenLoader({ isDone }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (isDone) {
      const delayAntesDeAbrir = setTimeout(() => {
        setIsLeaving(true);
        const removeDoDOM = setTimeout(() => {
          setShouldRender(false);
        }, 1200); // Ajustado para uma transição mais fluida
        return () => clearTimeout(removeDoDOM);
      }, 800);
      return () => clearTimeout(delayAntesDeAbrir);
    }
  }, [isDone]);

  if (!shouldRender) return null;

  return (
    <div style={{ ...styles.overlay, ...(isLeaving ? styles.overlayExit : {}) }}>
      <div style={{ ...styles.content, ...(isLeaving ? styles.contentExit : {}) }}>
        <div style={styles.lottieBox}>
          <Lottie animationData={loaderAnim} style={styles.lottie} />
        </div>
        
        <div style={styles.textContainer}>
          <h3 style={styles.title}>Bernet System</h3>
          <p style={styles.subtitle}>Iniciando ambiente seguro...</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    // Gradiente radial moderno que traz profundidade ao centro
    background: 'radial-gradient(circle at center, #1a2038 0%, #0a0f1c 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    opacity: 1,
    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  overlayExit: {
    opacity: 0,
    pointerEvents: 'none',
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s ease',
  },

  contentExit: {
    transform: 'translateY(20px)',
    opacity: 0,
  },

  lottieBox: {
    width: 'clamp(150px, 25vw, 250px)',
    height: 'clamp(150px, 25vw, 250px)',
    // Efeito de brilho sutil atrás do ícone
    background: 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, transparent 70%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
  },

  lottie: {
    width: '100%',
    height: '100%',
  },

  textContainer: {
    textAlign: 'center',
    animation: 'pulse 2s infinite ease-in-out',
  },

  title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '400',
    color: '#e2e8f0',
    letterSpacing: '0.2rem',
    textTransform: 'uppercase',
  },

  subtitle: {
    margin: '8px 0 0 0',
    fontSize: '0.8rem',
    color: '#64748b',
    letterSpacing: '0.1rem',
  },
};

// Adicione este bloco de estilo CSS no seu arquivo CSS global ou style tag
/*
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
*/