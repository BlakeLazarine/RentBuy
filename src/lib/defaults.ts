import { CalculatorInputs } from "./types";

export const defaultInputs: CalculatorInputs = {
  homePrice: 1000000,
  downPaymentPct: 20,
  mortgageRate: 6.5,
  loanTermYears: 30,
  buyerClosingCostsPct: 2,
  sellerClosingCostsPct: 5,

  propertyTaxRate: 1.2,
  monthlyOwnershipCosts: 500,
  prop13Enabled: true,

  monthlyRent: 3500,
  annualRentIncreasePct: 3,

  simulationYears: 30,

  homeAppreciationRate: 4,
  inflationRate: 2.5,
  investmentReturnRate: 7,

  federalTaxRate: 35,
  stateTaxRate: 9.3,
  federalLoanDeductionCap: 750000,
  stateLoanDeductionCap: 1000000,
  deductPropertyTaxFederal: true,
  capitalGainsTaxRate: 15,
};
