import React, { useState, useEffect } from "react";
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
        }, 1200);
        return () => clearTimeout(removeDoDOM);
      }, 800);
      return () => clearTimeout(delayAntesDeAbrir);
    }
  }, [isDone]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-primaryDark transition-opacity duration-[1200ms] ease-in-out ${
        isLeaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-[1200ms] ease-in-out ${
          isLeaving ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center justify-center w-[clamp(150px,25vw,250px)] h-[clamp(150px,25vw,250px)] rounded-full bg-primary/10">
          <Lottie animationData={loaderAnim} className="w-full h-full" />
        </div>

        <div className="text-center animate-pulse2">
          <h3 className="m-0 text-lg font-semibold text-white tracking-widest uppercase">
            Bernet System
          </h3>
          <p className="mt-2 text-sm text-textMuted tracking-wide">
            Iniciando ambiente seguro...
          </p>
        </div>
      </div>
    </div>
  );
}
