import React from "react";
import { Sun } from "lucide-react";

export default function FeatureImageCard({
  image,
  quote,
  attribution,
  icon: Icon = Sun,
  className = "",
}) {
  return (
    <div
      className={[
        "relative min-h-[200px] rounded-lg overflow-hidden shadow-soft p-6 md:p-8 flex flex-col justify-end",
        className,
      ].join(" ")}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      <Icon
        size={20}
        strokeWidth={1.5}
        className="absolute top-5 right-5 text-white/70"
      />

      <div className="relative z-10">
        {quote && (
          <p className="text-body italic text-white/95 leading-relaxed mb-3">
            "{quote}"
          </p>
        )}
        {attribution && (
          <p className="text-body font-bold text-white">{attribution}</p>
        )}
      </div>
    </div>
  );
}
