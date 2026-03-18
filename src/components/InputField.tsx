"use client";

interface InputFieldProps {
  label: string;
  value: number | boolean;
  onChange: (value: number | boolean) => void;
  suffix?: string;
  prefix?: string;
  step?: number;
  min?: number;
  max?: number;
  isCheckbox?: boolean;
}

export default function InputField({
  label,
  value,
  onChange,
  suffix,
  prefix,
  step = 1,
  min,
  max,
  isCheckbox = false,
}: InputFieldProps) {
  if (isCheckbox) {
    return (
      <label className="flex items-center gap-2 py-1 cursor-pointer">
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-900">{label}</span>
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-1">
      <label className="text-sm text-gray-900">{label}</label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-gray-700">{prefix}</span>}
        <input
          type="number"
          value={value as number}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {suffix && <span className="text-sm text-gray-700 whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}
