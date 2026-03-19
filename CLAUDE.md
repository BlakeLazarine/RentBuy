# RentBuy — Rent vs. Buy Calculator

## Overview

A client-side Next.js web app that compares the financial outcomes of renting vs. buying a home over a configurable time horizon. Deployed on Vercel via GitHub (https://github.com/BlakeLazarine/RentBuy).

## Tech Stack

- **Next.js** (App Router, all components are `"use client"`)
- **Recharts v3** for charts
- **Tailwind CSS** for styling
- **TypeScript** with strict types

## Project Structure

```
src/
├── app/page.tsx              # Main page — state, localStorage load, layout
├── lib/
│   ├── types.ts              # CalculatorInputs, YearlyData, CalculationResult
│   ├── defaults.ts           # Default input values (Bay Area defaults)
│   ├── calculate.ts          # Pure calculation engine (most critical file)
│   └── format.ts             # Currency formatting ($1.2M for axes, $1,234,567 for details)
├── hooks/
│   └── useChartClick.ts      # Click-to-select pattern for all charts
└── components/
    ├── InputPanel.tsx         # All input fields + Reset/Export/Import buttons
    ├── InputField.tsx         # Reusable input (number with prefix/suffix, or checkbox)
    ├── ChartsPanel.tsx        # Grid container for 4 charts
    ├── ChartCard.tsx          # Card wrapper with title, optional controls, optional detail panel
    ├── ChartTooltip.tsx       # Custom Recharts tooltip + hover tracking
    ├── DetailRow.tsx          # DetailRow, DetailDivider, DetailHeader components
    ├── AnnualRentCostChart.tsx
    ├── AnnualOwningCostChart.tsx
    ├── CostDifferenceChart.tsx
    └── PortfolioComparisonChart.tsx
```

## Key Design Decisions

### Calculation Engine (`calculate.ts`)

- **Monthly amortization**: Interest/principal are computed month-by-month (12 iterations per year), not approximated annually.
- **Simulation length ≠ loan term**: `simulationYears` can exceed `loanTermYears`. After the loan is paid off, mortgage costs drop to $0 but ownership costs continue.
- **Year 0**: Included as a data point showing starting positions (no costs incurred).
- **Portfolio logic**: Renter starts with `downPayment + buyerClosingCosts` invested in stocks. Each year, whichever side pays less invests the difference. Growth is applied before contributions.
- **Cost basis tracking**: Cumulative contributions tracked separately for capital gains calculations on liquidation.

### Tax Logic

- **Federal & state mortgage interest deductions** have separate loan caps (`$750K` federal, `$1M` CA state). The deductible fraction is `min(cap, loanAmount) / loanAmount`.
- **SALT deduction limit** (`underSaltLimit` checkbox): When enabled, property tax is deductible from federal income AND state mortgage interest savings create a federal clawback: `saltStateClawback = stateMortgageSavings × (federalTaxRate / 100)`.
- **Tax savings** stored as negative values: `taxSavings = -(federal + state + propertyTax - saltClawback)`.

### PMI (Mortgage Insurance)

- Appears as an input only when `downPaymentPct < 20%`.
- In calculation, PMI applies while `balance / homeValue > 0.8` (uses current home value with appreciation, not purchase price).

### Prop 13 (California)

- When enabled, property tax is assessed at purchase price and grows max 2%/year: `basePropTax × 1.02^(year-1)`.
- When disabled, property tax is based on current home value.

### Chart Click Interaction

- **Recharts v3 does not support chart-level `onClick` with `activePayload`** like v2 did. The working pattern uses:
  1. `ChartTooltip` tracks the hovered data index via a ref (called `onUpdate`)
  2. A container `<div onClick>` reads the ref to determine which year was clicked
  3. Only `selectedYear` (a number) is stored in state
  4. Selected data is derived via `useMemo` from the live data array, so detail panels update instantly when inputs change

### Portfolio "If Liquidated Today"

- Stocks: taxed at `capitalGainsTaxRate` on gains only (`portfolio - costBasis`)
- Home: equity minus seller closing costs (`sellerClosingCostsPct`), gains assumed rolled into next property (no tax)
- Net advantage computed as difference between after-tax/cost portfolio values

### Persistence

- All inputs auto-save to `localStorage` on every change
- Auto-loaded on mount via `useEffect` in `page.tsx`
- Export/Import JSON buttons for sharing configurations

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

Deployed automatically on push to GitHub via Vercel.

## Known Issues

- Hydration mismatch warning from browser extensions injecting styles on `<body>` — not from app code, safe to ignore.

## Feature Ideas (Not Yet Implemented)

- Zillow import (was explored but scrapped — would need a Next.js API route + RapidAPI key to avoid exposing credentials client-side)
