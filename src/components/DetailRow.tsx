"use client";

import { formatCurrencyFull } from "@/lib/format";

interface DetailRowProps {
  label: string;
  value: number;
  indent?: boolean;
  bold?: boolean;
  color?: string;
}

export function DetailRow({ label, value, indent, bold, color }: DetailRowProps) {
  return (
    <div className={`flex justify-between text-sm ${indent ? "pl-4" : ""} ${bold ? "font-semibold" : ""}`}>
      <span className="text-gray-700">{label}</span>
      <span className={color || "text-gray-900"}>{formatCurrencyFull(value)}</span>
    </div>
  );
}

export function DetailDivider() {
  return <div className="border-t border-gray-100 my-1" />;
}

interface DetailHeaderProps {
  year: number;
  onClose: () => void;
}

export function DetailHeader({ year, onClose }: DetailHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-semibold text-gray-900">Year {year} Breakdown</span>
      <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
    </div>
  );
}
