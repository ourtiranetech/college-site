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

const ACCENT_BORDER = {
  success: "border-l-emerald-500",
  info:    "border-l-blue-500",
  warning: "border-l-amber-500",
  danger:  "border-l-red-500",
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
      <div
        className={`
          relative rounded-2xl border border-slate-200 bg-white p-6
          shadow-sm transition-all duration-200 hover:shadow-lg
          border-l-[3px] ${ACCENT_BORDER[chipColor] || ACCENT_BORDER.info}
          hover:-translate-y-0.5
        `}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="shrink-0 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] p-2">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {title}
              </h3>
              {chip && (
                <span
                  className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CHIP_STYLES[chipColor]}`}
                >
                  {chip}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {description}
              </p>
            )}
            {children && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-[13px] text-slate-700 leading-relaxed">
                  {children}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
