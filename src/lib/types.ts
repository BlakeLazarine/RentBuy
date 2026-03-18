export interface CalculatorInputs {
  // Home Purchase
  homePrice: number;
  downPaymentPct: number;
  mortgageRate: number;
  loanTermYears: number;
  buyerClosingCostsPct: number;
  sellerClosingCostsPct: number;

  // Ongoing Ownership
  propertyTaxRate: number;
  monthlyOwnershipCosts: number; // HOA + maintenance + insurance (absolute $, grows with inflation)
  prop13Enabled: boolean;

  // Rent
  monthlyRent: number;
  annualRentIncreasePct: number;

  // Simulation
  simulationYears: number;

  // Economic
  homeAppreciationRate: number;
  inflationRate: number; // only grows monthlyOwnershipCosts
  investmentReturnRate: number;

  // Tax
  federalTaxRate: number;
  stateTaxRate: number;
  federalLoanDeductionCap: number; // max loan amount for federal mortgage interest deduction
  stateLoanDeductionCap: number;   // max loan amount for state mortgage interest deduction (e.g. $1M for CA)
  deductPropertyTaxFederal: boolean; // whether to deduct property tax from federal income
  capitalGainsTaxRate: number; // long-term capital gains rate for stock liquidation
}

export interface YearlyData {
  year: number;

  // Graph 1
  annualRentCost: number;

  // Graph 2
  annualOwnershipCostBeforeTax: number;
  taxSavings: number;
  netAnnualOwningCost: number;

  // Graph 3
  costDifference: number;

  // Graph 4
  renterPortfolio: number;
  buyerPortfolio: number;

  // Intermediate - ownership breakdown
  mortgagePayment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  propertyTax: number;
  ownershipCosts: number;
  homeValue: number;
  homeEquity: number;

  // Intermediate - tax breakdown
  federalMortgageSavings: number;
  stateMortgageSavings: number;
  propertyTaxSavings: number;

  // Intermediate - portfolio breakdown
  renterStocks: number;
  buyerStocks: number;
  renterStockGrowth: number;
  buyerStockGrowth: number;
  renterNewContribution: number;
  buyerNewContribution: number;
  renterStockCostBasis: number; // total contributions into renter stocks
  buyerStockCostBasis: number;  // total contributions into buyer stocks
}

export type CalculationResult = YearlyData[];
