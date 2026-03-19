"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export default function AnnualOwningCostChart({ data }: Props) {
  const { selected, handleContainerClick, onTooltipUpdate, clearSelection } = useChartClick(data);

  const chartData = data.map((d) => ({
    ...d,
    taxSavingsDisplay: Math.abs(d.taxSavings),
  }));

  return (
    <ChartCard
      title="Annual Cost of Owning"
      detail={selected && (
        <div className="space-y-1">
          <DetailHeader year={selected.year} onClose={clearSelection} />
          <DetailRow label="Mortgage payments (P&I)" value={selected.mortgagePayment} />
          <DetailRow label="  Principal" value={selected.principalPaid} indent />
          <DetailRow label="  Interest" value={selected.interestPaid} indent />
          <DetailRow label="Property tax" value={selected.propertyTax} />
          <DetailRow label="Other monthly costs (HOA/maint./ins.)" value={selected.ownershipCosts} />
          {selected.mortgageInsurance > 0 && (
            <DetailRow label="Mortgage insurance (PMI)" value={selected.mortgageInsurance} />
          )}
          <DetailDivider />
          <DetailRow label="Total before tax savings" value={selected.annualOwnershipCostBeforeTax} bold />
          <DetailDivider />
          <DetailRow label="Federal mortgage interest deduction" value={-selected.federalMortgageSavings} color="text-green-600" />
          <DetailRow label="State mortgage interest deduction" value={-selected.stateMortgageSavings} color="text-green-600" />
          {selected.propertyTaxSavings > 0 && (
            <DetailRow label="Property tax deduction (federal)" value={-selected.propertyTaxSavings} color="text-green-600" />
          )}
          {selected.saltStateClawback > 0 && (
            <DetailRow label="SALT clawback (reduced federal deduction)" value={selected.saltStateClawback} color="text-red-600" />
          )}
          <DetailRow label="Total tax savings" value={selected.taxSavings} bold color="text-green-600" />
          <DetailDivider />
          <DetailRow label="Net annual cost of owning" value={selected.netAnnualOwningCost} bold />
        </div>
      )}
    >
      <div onClick={handleContainerClick} className="h-full cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis tickFormatter={formatCurrency} width={60} />
            <Tooltip content={<ChartTooltip onUpdate={onTooltipUpdate} formatValue={(val, name) => {
              if (name === "Tax Savings") return [formatCurrencyFull(-val), name];
              return [formatCurrencyFull(val), name];
            }} />} />
            <Legend verticalAlign="top" />
            <Line type="monotone" dataKey="annualOwnershipCostBeforeTax" name="Before Tax Savings" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="taxSavingsDisplay" name="Tax Savings" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="netAnnualOwningCost" name="Net Cost" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: "#f97316" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
