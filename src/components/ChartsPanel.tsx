"use client";

import { CalculatorInputs, CalculationResult } from "@/lib/types";
import AnnualRentCostChart from "./AnnualRentCostChart";
import AnnualOwningCostChart from "./AnnualOwningCostChart";
import CostDifferenceChart from "./CostDifferenceChart";
import PortfolioComparisonChart from "./PortfolioComparisonChart";

interface Props {
  data: CalculationResult;
  inputs: CalculatorInputs;
}

export default function ChartsPanel({ data, inputs }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <AnnualRentCostChart data={data} />
      <AnnualOwningCostChart data={data} />
      <CostDifferenceChart data={data} />
      <PortfolioComparisonChart data={data} closingCostsPct={inputs.closingCostsPct} capitalGainsTaxRate={inputs.capitalGainsTaxRate} />
    </div>
  );
}
