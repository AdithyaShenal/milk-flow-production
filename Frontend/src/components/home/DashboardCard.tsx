import { type ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  subtitle,
  rightSlot,
  children,
  className = "",
}: Props) {
  return (
    <div className={`card bg-base-100 border border-base-300/60 ${className}`}>
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {rightSlot && <div>{rightSlot}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
