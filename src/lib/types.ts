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
  monthlyMortgageInsurance: number; // PMI, required when down payment < 20%, drops off at 80% LTV
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
  underSaltLimit: boolean; // under SALT deduction limit — enables property tax deduction and claws back federal benefit of state tax savings
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
  mortgageInsurance: number;
  homeValue: number;
  homeEquity: number;

  // Intermediate - tax breakdown
  federalMortgageSavings: number;
  stateMortgageSavings: number;
  propertyTaxSavings: number;
  saltStateClawback: number; // federal tax increase from reduced SALT deduction due to state tax savings

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
