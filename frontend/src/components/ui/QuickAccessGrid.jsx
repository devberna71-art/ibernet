import React from "react";
import { Link } from "react-router-dom";

export default function QuickAccessGrid({ items = [], columns = 2 }) {
  const gridCols =
    columns === 4
      ? "grid-cols-2 md:grid-cols-4"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-5`}>
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <div className="flex items-center justify-center w-10 h-10 text-primary">
              {Icon && <Icon size={22} strokeWidth={1.75} />}
            </div>
            <span className="text-muted font-medium text-text text-center">
              {item.label}
            </span>
          </>
        );

        const className =
          "flex flex-col items-center justify-center gap-3 p-6 rounded-md bg-surface border border-surfaceMuted hover:bg-primarySoft transition-colors duration-200 min-h-[120px]";

        if (item.to) {
          return (
            <Link key={item.label} to={item.to} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={className}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
