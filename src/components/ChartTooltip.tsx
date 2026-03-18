"use client";

import { formatCurrencyFull } from "@/lib/format";

interface TooltipProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string | number;
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: (props: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatValue?: (value: number, name: string) => [string, string];
}

export default function ChartTooltip({ payload, label, active, onUpdate, formatValue }: TooltipProps) {
  // Report the hovered data to parent for click tracking
  if (onUpdate) onUpdate({ payload, label, active });

  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-2 text-xs">
      <div className="font-semibold text-gray-700 mb-1">Year {label}</div>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => {
        const [displayValue, displayName] = formatValue
          ? formatValue(entry.value, entry.name)
          : [formatCurrencyFull(entry.value), entry.name];
        return (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{displayName}</span>
            <span className="text-gray-900">{displayValue}</span>
          </div>
        );
      })}
    </div>
  );
}
