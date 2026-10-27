// src/components/SchoolCard.tsx
import type { ReactNode } from "react";

interface SchoolCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  chip?: string;
  chipColor?: "success" | "info" | "warning" | "danger";
  children?: ReactNode;
}

const CHIP_STYLES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info:    "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger:  "bg-red-50 text-red-700 border-red-200",
};

export function SchoolCard({
  title,
  description,
  icon,
  href,
  chip,
  chipColor = "info",
  children,
}: SchoolCardProps) {
  const CardWrapper = href ? "a" : "div";
  const cardProps = href
    ? { href, className: "block group" }
    : { className: "block" };

  return (
    <CardWrapper {...cardProps}>
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="shrink-0 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] p-2">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-800 truncate">
                {title}
              </h3>
              {chip && (
                <span
                  className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${CHIP_STYLES[chipColor]}`}
                >
                  {chip}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
