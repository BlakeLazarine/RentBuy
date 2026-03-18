"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { CalculationResult } from "@/lib/types";
import { formatCurrency, formatCurrencyFull } from "@/lib/format";
import { useChartClick } from "@/hooks/useChartClick";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import { DetailRow, DetailDivider, DetailHeader } from "./DetailRow";

interface Props {
  data: CalculationResult;
}

export default function CostDifferenceChart({ data }: Props) {
  const { selected, handleContainerClick, onTooltipUpdate, clearSelection } = useChartClick(data);

  return (
    <ChartCard
      title="Annual Cost Difference (Rent − Own)"
      detail={selected && (
        <div className="space-y-1">
          <DetailHeader year={selected.year} onClose={clearSelection} />
          <DetailRow label="Annual rent cost" value={selected.annualRentCost} />
          <DetailDivider />
          <DetailRow label="Annual owning cost (before tax)" value={selected.annualOwnershipCostBeforeTax} />
          <DetailRow label="  Mortgage (P&I)" value={selected.mortgagePayment} indent />
          <DetailRow label="  Property tax" value={selected.propertyTax} indent />
          <DetailRow label="  Other monthly costs" value={selected.ownershipCosts} indent />
          <DetailRow label="Tax savings" value={selected.taxSavings} color="text-green-600" />
          <DetailRow label="Net owning cost" value={selected.netAnnualOwningCost} bold />
          <DetailDivider />
          <DetailRow
            label={`Difference (${selected.costDifference >= 0 ? "renting costs more" : "owning costs more"})`}
            value={selected.costDifference}
            bold
            color={selected.costDifference >= 0 ? "text-green-600" : "text-red-600"}
          />
        </div>
      )}
    >
      <div onClick={handleContainerClick} className="h-full cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis tickFormatter={formatCurrency} width={60} />
            <Tooltip content={<ChartTooltip onUpdate={onTooltipUpdate} formatValue={(val) => [formatCurrencyFull(val), val >= 0 ? "Renting costs more" : "Owning costs more"]} />} />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="costDifference" name="Difference" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: "#8b5cf6" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
