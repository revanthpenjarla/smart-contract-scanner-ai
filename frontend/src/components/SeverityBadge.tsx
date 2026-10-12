import { SEVERITY_TOKENS, type SeverityLevel } from '@/lib/design-tokens';

interface Props {
  severity: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export default function SeverityBadge({
  severity,
  size = 'sm',
  showDot = false,
  className = '',
}: Props) {
  const token = SEVERITY_TOKENS[severity as SeverityLevel] ?? SEVERITY_TOKENS.Informational;
  const sizeClasses =
    size === 'lg'
      ? 'px-3.5 py-1 text-sm'
      : size === 'md'
      ? 'px-3 py-0.5 text-xs'
      : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full tracking-wide transition-all ${sizeClasses} ${token.badge} ${token.glow} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${token.dot} ${
            severity === 'Critical' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {severity}
    </span>
  );
}

export function severityColor(severity: string): string {
  const token = SEVERITY_TOKENS[severity as SeverityLevel];
  return token ? token.color : '#94a3b8';
}
