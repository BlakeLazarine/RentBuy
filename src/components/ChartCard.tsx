"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  detail?: ReactNode;
  controls?: ReactNode;
}

export default function ChartCard({ title, children, detail, controls }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {controls}
      </div>
      <div className="h-72">{children}</div>
      {detail && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          {detail}
        </div>
      )}
    </div>
  );
}
