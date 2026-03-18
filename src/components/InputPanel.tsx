"use client";

import { CalculatorInputs } from "@/lib/types";
import { defaultInputs } from "@/lib/defaults";
import InputField from "./InputField";

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const STORAGE_KEY = "rentbuy-config";

function saveToLocalStorage(inputs: CalculatorInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {}
}

function exportToJson(inputs: CalculatorInputs) {
  const blob = new Blob([JSON.stringify(inputs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rentbuy-config.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJson(onChange: (inputs: CalculatorInputs) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const merged = { ...defaultInputs, ...parsed };
        onChange(merged);
        saveToLocalStorage(merged);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export default function InputPanel({ inputs, onChange }: InputPanelProps) {
  const set = (key: keyof CalculatorInputs) => (value: number | boolean) => {
    const updated = { ...inputs, [key]: value };
    onChange(updated);
    saveToLocalStorage(updated);
  };

  const handleReset = () => {
    onChange(defaultInputs);
    saveToLocalStorage(defaultInputs);
  };

  const btnClass =
    "px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-900 hover:bg-gray-100 transition-colors";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Calculator Inputs</h2>

      {/* Save / Load / Export / Import */}
      <div className="flex flex-wrap gap-2">
        <button className={btnClass} onClick={handleReset}>Reset</button>
        <button className={btnClass} onClick={() => exportToJson(inputs)}>Export JSON</button>
        <button className={btnClass} onClick={() => importFromJson((v) => { onChange(v); })}>Import JSON</button>
      </div>

      {/* Simulation */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Simulation
        </h3>
        <InputField label="Simulation Length" value={inputs.simulationYears} onChange={set("simulationYears")} suffix="years" step={1} min={1} max={50} />
      </section>

      {/* Rent */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Rent
        </h3>
        <InputField label="Monthly Rent" value={inputs.monthlyRent} onChange={set("monthlyRent")} prefix="$" step={100} min={0} />
        <InputField label="Annual Rent Increase" value={inputs.annualRentIncreasePct} onChange={set("annualRentIncreasePct")} suffix="%" step={0.5} min={0} />
      </section>

      {/* Home Purchase */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Home Purchase
        </h3>
        <InputField label="Home Price" value={inputs.homePrice} onChange={set("homePrice")} prefix="$" step={10000} min={0} />
        <InputField label="Down Payment" value={inputs.downPaymentPct} onChange={set("downPaymentPct")} suffix="%" step={1} min={0} max={100} />
        <InputField label="Mortgage Interest Rate" value={inputs.mortgageRate} onChange={set("mortgageRate")} suffix="%" step={0.125} min={0} />
        <InputField label="Loan Term" value={inputs.loanTermYears} onChange={set("loanTermYears")} suffix="years" step={1} min={1} max={40} />
        <InputField label="Buyer Closing Costs" value={inputs.buyerClosingCostsPct} onChange={set("buyerClosingCostsPct")} suffix="%" step={0.5} min={0} />
        <InputField label="Seller Closing Costs" value={inputs.sellerClosingCostsPct} onChange={set("sellerClosingCostsPct")} suffix="%" step={0.5} min={0} />
      </section>

      {/* Ongoing Ownership Costs */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Ownership Costs
        </h3>
        <InputField label="Property Tax Rate" value={inputs.propertyTaxRate} onChange={set("propertyTaxRate")} suffix="%" step={0.1} min={0} />
        <InputField label="Monthly Costs (HOA + Maintenance + Insurance)" value={inputs.monthlyOwnershipCosts} onChange={set("monthlyOwnershipCosts")} prefix="$" step={50} min={0} />
        <InputField label="CA Prop 13 (2% property tax growth cap)" value={inputs.prop13Enabled} onChange={set("prop13Enabled")} isCheckbox />
      </section>

      {/* Economic Assumptions */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Economic Assumptions
        </h3>
        <InputField label="Home Appreciation Rate" value={inputs.homeAppreciationRate} onChange={set("homeAppreciationRate")} suffix="%" step={0.5} />
        <InputField label="Inflation Rate (ownership cost growth)" value={inputs.inflationRate} onChange={set("inflationRate")} suffix="%" step={0.5} min={0} />
        <InputField label="Investment Return Rate" value={inputs.investmentReturnRate} onChange={set("investmentReturnRate")} suffix="%" step={0.5} />
      </section>

      {/* Tax */}
      <section>
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
          Tax
        </h3>
        <InputField label="Federal Tax Rate" value={inputs.federalTaxRate} onChange={set("federalTaxRate")} suffix="%" step={1} min={0} max={100} />
        <InputField label="State Tax Rate" value={inputs.stateTaxRate} onChange={set("stateTaxRate")} suffix="%" step={0.1} min={0} max={100} />
        <InputField label="Federal Mortgage Deduction Loan Cap" value={inputs.federalLoanDeductionCap} onChange={set("federalLoanDeductionCap")} prefix="$" step={50000} min={0} />
        <InputField label="State Mortgage Deduction Loan Cap" value={inputs.stateLoanDeductionCap} onChange={set("stateLoanDeductionCap")} prefix="$" step={50000} min={0} />
        <InputField label="Deduct property tax from federal income" value={inputs.deductPropertyTaxFederal} onChange={set("deductPropertyTaxFederal")} isCheckbox />
        <InputField label="Capital Gains Tax Rate" value={inputs.capitalGainsTaxRate} onChange={set("capitalGainsTaxRate")} suffix="%" step={1} min={0} max={100} />
      </section>
    </div>
  );
}
