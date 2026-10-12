import { severityColor } from './SeverityBadge';
import SeverityBadge from './SeverityBadge';

interface Props {
  counts: Record<string, number>;
  total: number;
}

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Informational'] as const;

export default function RiskBar({ counts, total }: Props) {
  if (total === 0) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-950/20 border border-emerald-500/20 rounded-lg px-4 py-3">
        <span className="text-emerald-400 font-bold">✓</span> No vulnerabilities detected — contract passed all static & LLM checks.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Segmented Risk Bar */}
      <div className="flex rounded-full overflow-hidden h-2.5 bg-slate-800/80 p-0.5 border border-slate-700/60 shadow-inner">
        {SEVERITIES.map((s) => {
          const count = counts[s] ?? 0;
          if (count === 0) return null;
          const pct = (count / total) * 100;
          return (
            <div
              key={s}
              style={{
                width: `${pct}%`,
                backgroundColor: severityColor(s),
              }}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90"
              title={`${s}: ${count} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {SEVERITIES.map((s) => {
          const count = counts[s] ?? 0;
          if (count === 0) return null;
          const pct = Math.round((count / total) * 100);
          return (
            <div
              key={s}
              className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1 text-xs"
            >
              <SeverityBadge severity={s} showDot size="sm" />
              <span className="text-slate-100 font-bold">{count}</span>
              <span className="text-slate-500 text-[10px]">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Horizontal progress bar for a single severity row */
export function SeverityRow({
  severity,
  count,
  max,
}: {
  severity: string;
  count: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  const color = severityColor(severity);

  return (
    <div className="flex items-center gap-3 group">
      <div className="w-28 shrink-0">
        <SeverityBadge severity={severity} showDot size="sm" />
      </div>
      <div className="flex-1 bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-slate-200 font-mono font-semibold text-xs w-8 text-right">
        {count}
      </span>
    </div>
  );
}
