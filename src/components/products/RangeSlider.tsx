'use client';

import { useEffect, useState } from 'react';
import { toPersianDigits } from '@/lib/format';

const STEPS = 20;

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  label = 'محدوده قیمت',
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
}) {
  const [low, setLow] = useState(value[0]);
  const [high, setHigh] = useState(value[1]);
  const [from, to] = value;

  useEffect(() => {
    setLow(from);
    setHigh(to);
  }, [from, to]);

  const span = Math.max(max - min, 1);
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  const clampTo = (raw: number) => {
    const stepped = Math.round((raw - min) / (span / STEPS)) * (span / STEPS) + min;
    return Math.min(Math.max(stepped, min), max);
  };

  const update = (nextLow: number, nextHigh: number) => {
    const safeLow = Math.min(nextLow, nextHigh);
    const safeHigh = Math.max(nextLow, nextHigh);
    setLow(safeLow);
    setHigh(safeHigh);
    onChange([Math.round(safeLow), Math.round(safeHigh)]);
  };

  return (
    <div className="pt-1">
      <div className="mb-3 flex items-center justify-between text-2xs font-bold text-ink-600">
        <span className="tnum">{toPersianDigits(Math.round(low))}</span>
        <span className="text-ink-300">تا</span>
        <span className="tnum">{toPersianDigits(Math.round(high))}</span>
      </div>

      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-500"
          style={{ insetInlineStart: `${lowPercent}%`, width: `${Math.max(highPercent - lowPercent, 0)}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={Math.round(span / STEPS)}
          value={low}
          aria-label={`${label} — حداقل`}
          onChange={(event) => update(clampTo(Number(event.target.value)), high)}
          className="pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent focus:pointer-events-auto focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-500 [&::-moz-range-thumb]:bg-white"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={Math.round(span / STEPS)}
          value={high}
          aria-label={`${label} — حداکثر`}
          onChange={(event) => update(low, clampTo(Number(event.target.value)))}
          className="pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent focus:pointer-events-auto focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-500 [&::-moz-range-thumb]:bg-white"
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[0.625rem] text-ink-300">
        <span className="tnum">{toPersianDigits(min)}</span>
        <span className="tnum">{toPersianDigits(max)}</span>
      </div>
    </div>
  );
}
