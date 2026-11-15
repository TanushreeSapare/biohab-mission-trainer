import React from 'react';
import { Shield, Sprout, Zap } from 'lucide-react';
import { ResourceKey } from '../types/game';

interface ResourceBarProps {
  resourceKey: ResourceKey;
  value: number;
  projectedValue?: number;
}

const RESOURCE_META: Record<
  ResourceKey,
  {
    label: string;
    sublabel: string;
    barColor: string;
    accentText: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  power: {
    label: 'Power',
    sublabel: 'Solar & Battery (kW)',
    barColor: 'bg-sky-400',
    accentText: 'text-sky-400',
    Icon: Zap,
  },
  bio: {
    label: 'Bio-Life Support',
    sublabel: 'O2 · Water · Crops',
    barColor: 'bg-emerald-400',
    accentText: 'text-emerald-400',
    Icon: Sprout,
  },
  shield: {
    label: 'Radiation Shield',
    sublabel: 'Water & Regolith Wall',
    barColor: 'bg-amber-400',
    accentText: 'text-amber-400',
    Icon: Shield,
  },
};

export const ResourceBar: React.FC<ResourceBarProps> = ({
  resourceKey,
  value,
  projectedValue,
}) => {
  const meta = RESOURCE_META[resourceKey];
  const Icon = meta.Icon;
  const clamped = Math.max(0, Math.min(100, value));
  const clampedProj =
    projectedValue !== undefined ? Math.max(0, Math.min(100, projectedValue)) : undefined;
  const delta = clampedProj !== undefined ? clampedProj - clamped : 0;

  const statusText =
    clamped <= 25 ? 'Critical' : clamped <= 45 ? 'Caution' : 'Nominal';
  const statusColor =
    clamped <= 25
      ? 'text-rose-400'
      : clamped <= 45
      ? 'text-amber-400'
      : 'text-emerald-400';

  const activeBarColor =
    clamped <= 25
      ? 'bg-rose-500'
      : clamped <= 45
      ? 'bg-amber-400'
      : meta.barColor;

  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-[#0F1625] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`h-4 w-4 shrink-0 ${meta.accentText}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100 truncate">
                {meta.label}
              </span>
              <span className="text-[11px] text-slate-400 hidden xl:inline truncate">
                · {meta.sublabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 shrink-0 font-mono tabular-nums">
          <span className={`text-[11px] font-medium ${statusColor}`}>{statusText}</span>
          <span className="text-sm font-bold text-slate-100">{clamped}%</span>
          {clampedProj !== undefined && (
            <span
              className={`text-xs font-semibold ${
                delta > 0
                  ? 'text-emerald-400'
                  : delta < 0
                  ? clampedProj <= 20
                    ? 'text-rose-400'
                    : 'text-amber-300'
                  : 'text-slate-400'
              }`}
              title="Projected end-of-Sol value"
            >
              → {clampedProj}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div
        className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/90"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${meta.label} level ${clamped}%`}
      >
        {/* Projected positive extension */}
        {clampedProj !== undefined && clampedProj > clamped && (
          <div
            className="absolute inset-y-0 left-0 bg-emerald-400/35 transition-all duration-300"
            style={{ width: `${clampedProj}%` }}
          />
        )}
        {/* Current fill */}
        <div
          className={`relative h-full rounded-full transition-all duration-500 ${activeBarColor}`}
          style={{ width: `${clamped}%` }}
        />
        {/* Projected negative marker */}
        {clampedProj !== undefined && clampedProj < clamped && (
          <div
            className="absolute inset-y-0 right-0 bg-rose-500/45 transition-all duration-300"
            style={{
              left: `${clampedProj}%`,
              width: `${clamped - clampedProj}%`,
            }}
          />
        )}
      </div>
    </div>
  );
};
