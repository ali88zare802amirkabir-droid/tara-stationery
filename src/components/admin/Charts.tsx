'use client';

import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCompactPrice, toPersianDigits } from '@/lib/format';

export interface ChartPoint {
  label: string;
  value: number;
  secondary?: number;
}

/* ------------------------------------------------------------ area / line */

export function AreaChart({
  data,
  height = 260,
  valueFormat = (value: number) => toPersianDigits(value),
  accent = 'brand',
}: {
  data: ChartPoint[];
  height?: number;
  valueFormat?: (value: number) => string;
  accent?: 'brand' | 'mint' | 'accent';
}) {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const width = 720;
  const padding = { top: 16, right: 16, bottom: 34, left: 46 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...data.map((point) => point.value), 1);
  const min = 0;
  const range = max - min || 1;

  const points = useMemo(
    () =>
      data.map((point, index) => {
        const x = padding.left + (index / Math.max(data.length - 1, 1)) * innerW;
        const y = padding.top + innerH - ((point.value - min) / range) * innerH;
        return { ...point, x, y };
      }),
    [data, innerH, innerW, padding.left, padding.top, min, range],
  );

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? padding.left} ${padding.top + innerH} L${points[0]?.x ?? padding.left} ${padding.top + innerH} Z`;

  const palette = {
    brand: { line: '#4A73E8', fill: '#4A73E8', soft: '#DEE8FF' },
    mint: { line: '#17A186', fill: '#17A186', soft: '#D0F3E6' },
    accent: { line: '#7C4DE8', fill: '#7C4DE8', soft: '#E4DCFD' },
  }[accent];

  const ticks = 4;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={`نمودار با ${toPersianDigits(data.length)} نقطه داده`}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.fill} stopOpacity="0.28" />
            <stop offset="100%" stopColor={palette.fill} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {Array.from({ length: ticks + 1 }, (_, index) => {
          const y = padding.top + (index / ticks) * innerH;
          const value = max - (index / ticks) * range;
          return (
            <g key={index}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#E6ECF8"
                strokeWidth="1"
                strokeDasharray={index === ticks ? undefined : '4 6'}
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-ink-300 text-[10px]"
              >
                {toPersianDigits(Math.round(value))}
              </text>
            </g>
          );
        })}

        <motion.path
          d={areaPath}
          fill={`url(#${gradientId}-fill)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={palette.line}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        {points.map((point, index) => (
          <g key={point.label}>
            <rect
              x={point.x - innerW / data.length / 2}
              y={padding.top}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              tabIndex={0}
              role="button"
              aria-label={`${point.label}: ${valueFormat(point.value)}`}
            />
            {activeIndex === index ? (
              <>
                <line
                  x1={point.x}
                  y1={padding.top}
                  x2={point.x}
                  y2={padding.top + innerH}
                  stroke={palette.line}
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity="0.5"
                />
                <circle cx={point.x} cy={point.y} r="6" fill="white" stroke={palette.line} strokeWidth="3" />
              </>
            ) : null}
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-ink-400 text-[10px]"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      {activeIndex !== null && points[activeIndex] ? (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 shadow-lift"
          style={{ insetInlineStart: `${(points[activeIndex].x / width) * 100}%` }}
        >
          <p className="text-2xs text-ink-400">{points[activeIndex].label}</p>
          <p className="tnum text-xs font-extrabold text-ink-900">
            {valueFormat(points[activeIndex].value)}
          </p>
          {typeof points[activeIndex].secondary === 'number' ? (
            <p className="tnum text-2xs text-brand-600">
              {toPersianDigits(points[activeIndex].secondary as number)} سفارش
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ bars */

export function BarChart({
  data,
  height = 220,
  accent = 'brand',
  valueFormat = (value: number) => toPersianDigits(value),
}: {
  data: ChartPoint[];
  height?: number;
  accent?: 'brand' | 'mint' | 'accent' | 'warning';
  valueFormat?: (value: number) => string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);  const max = Math.max(...data.map((point) => point.value), 1);

  const colors = {
    brand: ['#4A73E8', '#9BB9FB'],
    mint: ['#17A186', '#8FDCC6'],
    accent: ['#7C4DE8', '#B9A6F5'],
    warning: ['#D08A1E', '#EFCB8A'],
  }[accent];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2" style={{ height }} role="img" aria-label="نمودار میله‌ای">
        {data.map((point, index) => {
          const ratio = point.value / max;
          const isActive = activeIndex === index;
          return (
            <div
              key={point.label}
              className="group flex h-full flex-1 cursor-pointer flex-col justify-end gap-1.5"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              role="button"
              tabIndex={0}
              aria-label={`${point.label}: ${valueFormat(point.value)}`}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            >
              <motion.div
                className="w-full rounded-t-xl"
                style={{
                  background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(ratio * 100, 4)}%` }}
                transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                {isActive ? (
                  <span className="tnum block -translate-y-6 text-center text-2xs font-extrabold text-ink-800">
                    {valueFormat(point.value)}
                  </span>
                ) : null}
              </motion.div>
            </div>
          );
        })}
      </div>
      <ul className="flex gap-2">
        {data.map((point) => (
          <li key={point.label} className="flex-1 truncate text-center text-[0.625rem] text-ink-400">
            {point.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------- donut */

export function DonutChart({
  data,
  size = 200,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, entry) => sum + entry.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label="نمودار سهم دسته‌بندی‌ها">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EFF3FB"
            strokeWidth={thickness}
          />
          {data.map((entry, index) => {
            const ratio = entry.value / total;
            const dash = ratio * circumference;
            const element = (
              <circle
                key={entry.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={entry.color}
                strokeWidth={activeIndex === index ? thickness + 5 : thickness}
                strokeDasharray={`${Math.max(dash - 3, 0)} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${entry.label}: ${toPersianDigits(entry.value)}`}
              />
            );
            offset += dash;
            return element;
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="tnum text-xl font-extrabold text-ink-900">
              {activeIndex !== null ? toPersianDigits(data[activeIndex].value) : (centerValue ?? toPersianDigits(total))}
            </p>
            <p className="mt-0.5 text-2xs text-ink-400">
              {activeIndex !== null ? data[activeIndex].label : (centerLabel ?? 'مجموع')}
            </p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-2">
        {data.map((entry, index) => (
          <li
            key={entry.label}
            className={cn(
              'flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors',
              activeIndex === index ? 'bg-surface-sunken' : 'bg-transparent',
            )}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-2xs text-ink-500">{entry.label}</span>
            <span className="tnum shrink-0 text-2xs font-bold text-ink-800">
              {toPersianDigits(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------ progress */

export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  label,
  className,
}: {
  value: number;
  max?: number;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'accent';
  label?: string;
  className?: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const tones = {
    brand: 'bg-brand-500',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    accent: 'bg-accent',
  }[tone];

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-2xs">
          <span className="text-ink-500">{label}</span>
          <span className="tnum font-bold text-ink-800">{toPersianDigits(Math.round(percent))}٪</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-line-soft">
        <motion.div
          className={cn('h-full rounded-full', tones)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export const formatRevenue = (value: number) => `${formatCompactPrice(value)} تومان`;
