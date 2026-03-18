import { CalculatorInputs, CalculationResult } from "./types";

export function calculate(inputs: CalculatorInputs): CalculationResult {
  const {
    homePrice,
    downPaymentPct,
    mortgageRate,
    loanTermYears,
    closingCostsPct,
    simulationYears,
    propertyTaxRate,
    monthlyOwnershipCosts,
    prop13Enabled,
    monthlyRent,
    annualRentIncreasePct,
    homeAppreciationRate,
    inflationRate,
    investmentReturnRate,
    federalTaxRate,
    stateTaxRate,
    federalLoanDeductionCap,
    stateLoanDeductionCap,
    deductPropertyTaxFederal,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const closingCosts = homePrice * (closingCostsPct / 100);
  const loanAmount = homePrice - downPayment;
  const totalMonths = loanTermYears * 12;
  const monthlyRate = mortgageRate / 100 / 12;

  // Monthly mortgage payment (fixed-rate amortization)
  let monthlyMortgagePayment = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    monthlyMortgagePayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (totalMonths > 0) {
    monthlyMortgagePayment = loanAmount / totalMonths;
  }

  // Mortgage interest deduction caps: fraction of interest deductible at each level
  const federalDeductibleFraction = loanAmount > 0 ? Math.min(federalLoanDeductionCap, loanAmount) / loanAmount : 0;
  const stateDeductibleFraction = loanAmount > 0 ? Math.min(stateLoanDeductionCap, loanAmount) / loanAmount : 0;

  const results: CalculationResult = [];
  let balance = loanAmount;
  let renterStocks = downPayment + closingCosts; // renter invests what buyer spent upfront
  let buyerStocks = 0;
  let renterStockCostBasis = downPayment + closingCosts;
  let buyerStockCostBasis = 0;

  // Base property tax for Prop 13 (assessed at purchase price)
  const basePropTax = (propertyTaxRate / 100) * homePrice;

  const years = Math.max(1, simulationYears);

  // Year 0: starting positions
  const initialEquity = homePrice - loanAmount; // equals down payment
  results.push({
    year: 0,
    annualRentCost: 0,
    annualOwnershipCostBeforeTax: 0,
    taxSavings: 0,
    netAnnualOwningCost: 0,
    costDifference: 0,
    renterPortfolio: renterStocks,
    buyerPortfolio: initialEquity + buyerStocks,
    mortgagePayment: 0,
    principalPaid: 0,
    interestPaid: 0,
    remainingBalance: balance,
    propertyTax: 0,
    ownershipCosts: 0,
    homeValue: homePrice,
    homeEquity: initialEquity,
    federalMortgageSavings: 0,
    stateMortgageSavings: 0,
    propertyTaxSavings: 0,
    renterStocks,
    buyerStocks: 0,
    renterStockGrowth: 0,
    buyerStockGrowth: 0,
    renterNewContribution: 0,
    buyerNewContribution: 0,
    renterStockCostBasis,
    buyerStockCostBasis: 0,
  });

  for (let year = 1; year <= years; year++) {
    const loanActive = year <= loanTermYears && balance > 0;

    // --- Mortgage amortization for this year (month by month) ---
    let yearInterest = 0;
    let yearPrincipal = 0;
    if (loanActive) {
      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(balance, monthlyMortgagePayment - interestPayment);
        yearInterest += interestPayment;
        yearPrincipal += principalPayment;
        balance = Math.max(0, balance - principalPayment);
      }
    }

    // --- Home value ---
    const homeValue = homePrice * Math.pow(1 + homeAppreciationRate / 100, year);
    const homeEquity = homeValue - balance;

    // --- Property tax ---
    let propertyTax: number;
    if (prop13Enabled) {
      propertyTax = basePropTax * Math.pow(1.02, year - 1);
    } else {
      propertyTax = (propertyTaxRate / 100) * homeValue;
    }

    // --- Monthly ownership costs (grow with inflation) ---
    const ownershipCosts = monthlyOwnershipCosts * 12 * Math.pow(1 + inflationRate / 100, year - 1);

    // --- Annual ownership cost before tax ---
    const annualMortgage = yearInterest + yearPrincipal;
    const annualOwnershipCostBeforeTax = annualMortgage + propertyTax + ownershipCosts;

    // --- Tax savings ---
    // Federal mortgage interest deduction
    const federalDeductibleInterest = yearInterest * federalDeductibleFraction;
    const federalMortgageSavings = federalDeductibleInterest * (federalTaxRate / 100);

    // State mortgage interest deduction
    const stateDeductibleInterest = yearInterest * stateDeductibleFraction;
    const stateMortgageSavings = stateDeductibleInterest * (stateTaxRate / 100);

    // Property tax deduction (federal only, if enabled)
    const propertyTaxSavings = deductPropertyTaxFederal
      ? propertyTax * (federalTaxRate / 100)
      : 0;

    const taxSavings = -(federalMortgageSavings + stateMortgageSavings + propertyTaxSavings);

    // --- Net annual owning cost ---
    const netAnnualOwningCost = annualOwnershipCostBeforeTax + taxSavings;

    // --- Rent ---
    const annualRentCost = monthlyRent * 12 * Math.pow(1 + annualRentIncreasePct / 100, year - 1);

    // --- Cost difference (positive = renting costs more) ---
    const costDifference = annualRentCost - netAnnualOwningCost;

    // --- Portfolio growth ---
    const renterStocksBefore = renterStocks;
    const buyerStocksBefore = buyerStocks;

    renterStocks *= 1 + investmentReturnRate / 100;
    buyerStocks *= 1 + investmentReturnRate / 100;

    const renterStockGrowth = renterStocks - renterStocksBefore;
    const buyerStockGrowth = buyerStocks - buyerStocksBefore;

    let renterNewContribution = 0;
    let buyerNewContribution = 0;
    if (costDifference > 0) {
      buyerNewContribution = costDifference;
      buyerStocks += costDifference;
      buyerStockCostBasis += costDifference;
    } else {
      renterNewContribution = Math.abs(costDifference);
      renterStocks += Math.abs(costDifference);
      renterStockCostBasis += Math.abs(costDifference);
    }

    const renterPortfolio = renterStocks;
    const buyerPortfolio = homeEquity + buyerStocks;

    results.push({
      year,
      annualRentCost,
      annualOwnershipCostBeforeTax,
      taxSavings,
      netAnnualOwningCost,
      costDifference,
      renterPortfolio,
      buyerPortfolio,
      mortgagePayment: loanActive ? monthlyMortgagePayment * 12 : 0,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      remainingBalance: balance,
      propertyTax,
      ownershipCosts,
      homeValue,
      homeEquity,
      federalMortgageSavings,
      stateMortgageSavings,
      propertyTaxSavings,
      renterStocks,
      buyerStocks,
      renterStockGrowth,
      buyerStockGrowth,
      renterNewContribution,
      buyerNewContribution,
      renterStockCostBasis,
      buyerStockCostBasis,
    });
  }

  return results;
}
