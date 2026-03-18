"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CalculationResult } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { useChartClick } from "@/hooks/useChartClick";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import { DetailRow, DetailHeader } from "./DetailRow";

interface Props {
  data: CalculationResult;
}

export default function AnnualRentCostChart({ data }: Props) {
  const { selected, handleContainerClick, onTooltipUpdate, clearSelection } = useChartClick(data);

  const monthlyRent = selected ? selected.annualRentCost / 12 : 0;

  return (
    <ChartCard
      title="Annual Cost of Renting"
      detail={selected && (
        <div className="space-y-1">
          <DetailHeader year={selected.year} onClose={clearSelection} />
          <DetailRow label="Monthly rent" value={monthlyRent} />
          <DetailRow label={`Annual rent (× 12)`} value={selected.annualRentCost} bold />
        </div>
      )}
    >
      <div onClick={handleContainerClick} className="h-full cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis tickFormatter={formatCurrency} width={60} />
            <Tooltip content={<ChartTooltip onUpdate={onTooltipUpdate} />} />
            <Line type="monotone" dataKey="annualRentCost" name="Annual Rent" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
