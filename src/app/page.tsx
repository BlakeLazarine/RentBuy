"use client";

import { useState, useMemo, useEffect } from "react";
import { CalculatorInputs } from "@/lib/types";
import { defaultInputs } from "@/lib/defaults";
import { calculate } from "@/lib/calculate";
import InputPanel from "@/components/InputPanel";
import ChartsPanel from "@/components/ChartsPanel";

const STORAGE_KEY = "rentbuy-config";

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);

  // Auto-load saved config on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setInputs({ ...defaultInputs, ...JSON.parse(raw) });
      }
    } catch {}
  }, []);

  const data = useMemo(() => calculate(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Rent vs. Buy Calculator</h1>
      </header>
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-80 xl:w-96 shrink-0 border-r border-gray-200 bg-white p-4 overflow-y-auto lg:h-[calc(100vh-52px)]">
          <InputPanel inputs={inputs} onChange={setInputs} />
        </aside>
        <main className="flex-1 p-4 overflow-y-auto lg:h-[calc(100vh-52px)]">
          <ChartsPanel data={data} inputs={inputs} />
        </main>
      </div>
    </div>
  );
}
