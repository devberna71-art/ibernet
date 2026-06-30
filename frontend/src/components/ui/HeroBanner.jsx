import React from "react";

export default function HeroBanner({
  image,
  badge,
  title,
  description,
  cta,
  avatars = [],
  extraCount = 0,
  className = "",
}) {
  return (
    <div
      className={[
        "relative w-full min-h-[280px] md:min-h-[340px] rounded-lg overflow-hidden shadow-soft",
        className,
      ].join(" ")}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {badge && (
        <div className="absolute top-5 left-5 z-10">{badge}</div>
      )}

      <div className="relative z-10 flex flex-col justify-end h-full min-h-[inherit] p-6 md:p-8">
        <div className="max-w-xl">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-body text-white/90 mb-5">{description}</p>
          )}
          {cta}
        </div>

        {(avatars.length > 0 || extraCount > 0) && (
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center">
            <div className="flex -space-x-2">
              {avatars.slice(0, 4).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            {extraCount > 0 && (
              <span className="ml-2 text-sm font-semibold text-white/90">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
