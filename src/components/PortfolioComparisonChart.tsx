"use client";

import { useState } from "react";
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
import { formatCurrency } from "@/lib/format";
import { useChartClick } from "@/hooks/useChartClick";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import { DetailRow, DetailDivider, DetailHeader } from "./DetailRow";

interface Props {
  data: CalculationResult;
  sellerClosingCostsPct: number;
  capitalGainsTaxRate: number;
}

export default function PortfolioComparisonChart({ data, sellerClosingCostsPct, capitalGainsTaxRate }: Props) {
  const capGainsRate = capitalGainsTaxRate / 100;
  const [logScale, setLogScale] = useState(false);
  const { selected, handleContainerClick, onTooltipUpdate, clearSelection } = useChartClick(data, true);

  const prevYear = selected ? data.find((d) => d.year === selected.year - 1) : null;

  // "If sold today" calculations
  const renterStockGains = selected ? Math.max(0, selected.renterStocks - selected.renterStockCostBasis) : 0;
  const renterCapGainsTax = renterStockGains * capGainsRate;
  const renterAfterTax = selected ? selected.renterStocks - renterCapGainsTax : 0;

  const buyerStockGains = selected ? Math.max(0, selected.buyerStocks - selected.buyerStockCostBasis) : 0;
  const buyerCapGainsTax = buyerStockGains * capGainsRate;
  const buyerStocksAfterTax = selected ? selected.buyerStocks - buyerCapGainsTax : 0;
  const saleClosingCosts = selected ? selected.homeValue * (sellerClosingCostsPct / 100) : 0;
  const buyerHomeProceeds = selected ? selected.homeEquity - saleClosingCosts : 0;
  const buyerAfterTax = buyerStocksAfterTax + buyerHomeProceeds;

  return (
    <ChartCard
      title="Portfolio Comparison (Renter vs. Buyer)"
      controls={
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={logScale} onChange={(e) => setLogScale(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-xs text-gray-700">Log scale</span>
        </label>
      }
      detail={selected && (
        <div className="space-y-1">
          <DetailHeader year={selected.year} onClose={clearSelection} />

          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">Renter</div>
          <DetailRow label="Starting stocks" value={prevYear ? prevYear.renterStocks : selected.renterStocks} />
          {selected.year > 0 && <>
            <DetailRow label="Investment growth" value={selected.renterStockGrowth} color="text-green-600" />
            <DetailRow label="New contribution (cost savings)" value={selected.renterNewContribution} color={selected.renterNewContribution > 0 ? "text-green-600" : "text-gray-500"} />
          </>}
          <DetailRow label="Total renter portfolio" value={selected.renterPortfolio} bold />

          <DetailDivider />

          <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mt-1">Buyer</div>
          <DetailRow label="Home value" value={selected.homeValue} />
          <DetailRow label="Remaining mortgage" value={-selected.remainingBalance} color="text-red-600" />
          <DetailRow label="Home equity" value={selected.homeEquity} bold />
          <DetailRow label="Starting stocks" value={prevYear ? prevYear.buyerStocks : 0} />
          {selected.year > 0 && <>
            <DetailRow label="Investment growth" value={selected.buyerStockGrowth} color="text-green-600" />
            <DetailRow label="New contribution (cost savings)" value={selected.buyerNewContribution} color={selected.buyerNewContribution > 0 ? "text-green-600" : "text-gray-500"} />
          </>}
          <DetailRow label="Buyer stocks" value={selected.buyerStocks} />
          <DetailDivider />
          <DetailRow label="Total buyer portfolio (equity + stocks)" value={selected.buyerPortfolio} bold />

          <DetailDivider />

          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider mt-2">If Liquidated Today</div>
          <p className="text-xs text-gray-500 italic">Stock gains taxed at {capitalGainsTaxRate}% capital gains. Home gains rolled into new property (no tax). Sale closing costs apply.</p>

          <div className="text-xs font-semibold text-blue-600 mt-1">Renter</div>
          <DetailRow label="Stocks" value={selected.renterStocks} />
          <DetailRow label="Cost basis" value={selected.renterStockCostBasis} />
          <DetailRow label="Capital gains" value={renterStockGains} />
          <DetailRow label={`Capital gains tax (${capitalGainsTaxRate}%)`} value={-renterCapGainsTax} color="text-red-600" />
          <DetailRow label="Renter net after tax" value={renterAfterTax} bold />

          <div className="text-xs font-semibold text-green-700 mt-1">Buyer</div>
          <DetailRow label="Home equity" value={selected.homeEquity} />
          <DetailRow label={`Sale closing costs (${sellerClosingCostsPct}%)`} value={-saleClosingCosts} color="text-red-600" />
          <DetailRow label="Home proceeds (gains rolled over)" value={buyerHomeProceeds} />
          <DetailRow label="Stocks" value={selected.buyerStocks} />
          <DetailRow label="Cost basis" value={selected.buyerStockCostBasis} />
          <DetailRow label="Capital gains" value={buyerStockGains} />
          <DetailRow label={`Capital gains tax (${capitalGainsTaxRate}%)`} value={-buyerCapGainsTax} color="text-red-600" />
          <DetailRow label="Buyer net after tax" value={buyerAfterTax} bold />

          <DetailDivider />
          <DetailRow
            label={`Advantage (${buyerAfterTax >= renterAfterTax ? "buyer" : "renter"})`}
            value={Math.abs(buyerAfterTax - renterAfterTax)}
            bold
            color={buyerAfterTax >= renterAfterTax ? "text-green-600" : "text-blue-600"}
          />
        </div>
      )}
    >
      <div onClick={handleContainerClick} className="h-full cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
            <YAxis tickFormatter={formatCurrency} width={70} scale={logScale ? "log" : "auto"} domain={logScale ? ["auto", "auto"] : undefined} allowDataOverflow={logScale} />
            <Tooltip content={<ChartTooltip onUpdate={onTooltipUpdate} />} />
            <Legend verticalAlign="top" />
            <Line type="monotone" dataKey="renterPortfolio" name="Renter (Stocks)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="buyerPortfolio" name="Buyer (Equity + Stocks)" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
