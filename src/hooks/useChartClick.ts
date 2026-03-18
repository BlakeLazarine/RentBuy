"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { YearlyData, CalculationResult } from "@/lib/types";

export function useChartClick(data: CalculationResult, allowYear0 = false) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const hoveredIndex = useRef<number | null>(null);

  // Derive selected data from live data array
  const selected: YearlyData | null = useMemo(() => {
    if (selectedYear === null) return null;
    return data.find((d) => d.year === selectedYear) ?? null;
  }, [data, selectedYear]);

  // Called by Tooltip content to track which index is active
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTooltipUpdate = useCallback((props: any) => {
    if (props?.payload?.length > 0) {
      const year = props.payload[0].payload?.year;
      if (year !== undefined) {
        const idx = data.findIndex((d) => d.year === year);
        hoveredIndex.current = idx >= 0 ? idx : null;
      }
    } else {
      hoveredIndex.current = null;
    }
    return null;
  }, [data]);

  const handleContainerClick = useCallback(() => {
    const idx = hoveredIndex.current;
    if (idx === null || idx < 0 || idx >= data.length) return;
    const d = data[idx];
    if (!allowYear0 && d.year === 0) return;
    setSelectedYear((prev) => (prev === d.year ? null : d.year));
  }, [data, allowYear0]);

  const clearSelection = useCallback(() => setSelectedYear(null), []);

  return { selected, handleContainerClick, onTooltipUpdate, clearSelection };
}
