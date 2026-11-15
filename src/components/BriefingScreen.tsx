import React from 'react';
import {
  BookOpen,
  Compass,
  Rocket,
  Shield,
  Sprout,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { SITES } from '../data/gameData';
import { SiteId } from '../types/game';
import { soundEngine } from '../utils/sound';

interface BriefingScreenProps {
  selectedSite: SiteId;
  onSelectSite: (site: SiteId) => void;
  onStartMission: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSources: () => void;
}

export const BriefingScreen: React.FC<BriefingScreenProps> = ({
  selectedSite,
  onSelectSite,
  onStartMission,
  soundEnabled,
  onToggleSound,
  onOpenSources,
}) => {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/90 bg-[#0B101B]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap truncate">
              BioHab: Junior Astronaut Mission Trainer
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onToggleSound();
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400" />
              )}
              <span>Sound: {soundEnabled ? 'On' : 'Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenSources();
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-sky-400" />
              <span>NASA Science &amp; Sources</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-5 py-6">
        {/* Hero Briefing Hook */}
        <section className="max-w-3xl">
          <div className="text-xs font-semibold tracking-wide text-sky-400">
            Artemis &amp; Mars Exploration · 10-Sol Outpost Challenge
          </div>
          <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
            Keep Your Space Greenhouse Alive for 10 Sols
          </h1>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-300">
            Step into Mission Control to run a real NASA-inspired space habitat where solar power,
            oxygen-making plants, and water radiation walls all depend on each other. Make smart
            engineering trade-offs every Sol so none of your three life-support systems hit zero!
          </p>
        </section>

        {/* System Interdependence Strip */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-[#0F1625] p-4">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Zap className="h-4 w-4" />
              <span>1. Solar Power (kW)</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Powers greenhouse LED grow lights, water pumps, and active magnetic storm shields.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0F1625] p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Sprout className="h-4 w-4" />
              <span>2. Bio-Life Support</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Crops and Spirulina algae scrub crew CO2 into oxygen and food, using water and light.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0F1625] p-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Shield className="h-4 w-4" />
              <span>3. Radiation Shielding</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Water-filled walls and regolith dirt protect astronauts and plant DNA from solar flares.
            </p>
          </div>
        </section>

        {/* Site Selection */}
        <section aria-label="Choose Landing Site">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Compass className="h-4 w-4 text-sky-400" />
              <span>Choose Your NASA Mission Site</span>
            </h2>
            <span className="text-xs text-slate-400">
              All systems start at <strong className="font-mono text-slate-200">65%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(['lunar', 'mars'] as SiteId[]).map((siteId) => {
              const site = SITES[siteId];
              const isSelected = selectedSite === siteId;
              const isLunar = siteId === 'lunar';

              return (
                <button
                  key={siteId}
                  type="button"
                  onClick={() => {
                    soundEngine.playSelect();
                    onSelectSite(siteId);
                  }}
                  aria-pressed={isSelected}
                  className={`group text-left rounded-xl border p-5 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isLunar
                        ? 'border-sky-400 bg-[#111C31] ring-2 ring-sky-400/25'
                        : 'border-amber-400 bg-[#1B1618] ring-2 ring-amber-400/25'
                      : 'border-slate-800 bg-[#0E1422] hover:border-slate-600 hover:bg-[#121A2C]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        {site.locationLabel} · {site.gravityLabel}
                      </div>
                      <h3 className="mt-1 text-xl font-bold text-white">{site.name}</h3>
                      <div
                        className={`text-xs font-semibold ${
                          isLunar ? 'text-sky-400' : 'text-amber-400'
                        }`}
                      >
                        {site.subtitle}
                      </div>
                    </div>

                    {/* Custom inline SVG celestial emblem */}
                    <svg
                      viewBox="0 0 64 64"
                      className="h-14 w-14 shrink-0"
                      aria-hidden="true"
                    >
                      {isLunar ? (
                        <g>
                          <circle cx="32" cy="32" r="24" fill="#475569" />
                          <circle cx="32" cy="32" r="24" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                          <circle cx="24" cy="24" r="5" fill="#334155" />
                          <circle cx="40" cy="36" r="6" fill="#334155" />
                          <circle cx="28" cy="43" r="3" fill="#334155" />
                          <path d="M10,22 A24,24 0 0,1 48,14" fill="none" stroke="#BAE6FD" strokeWidth="2" opacity="0.65" />
                        </g>
                      ) : (
                        <g>
                          <circle cx="32" cy="32" r="24" fill="#B45309" />
                          <circle cx="32" cy="32" r="24" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                          <path d="M16,28 Q28,22 44,30 Q34,38 18,34 Z" fill="#7C2D12" opacity="0.65" />
                          <ellipse cx="32" cy="11" rx="9" ry="3" fill="#FDE68A" opacity="0.6" />
                          <circle cx="40" cy="40" r="4" fill="#9A3412" />
                        </g>
                      )}
                    </svg>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {site.description}
                  </p>

                  <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-400 shrink-0">Sunlight:</span>
                      <span>{site.sunlightNote}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-400 shrink-0">Hazards:</span>
                      <span>{site.hazardNote}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">{site.distanceLabel}</span>
                    <span
                      className={
                        isSelected
                          ? isLunar
                            ? 'text-sky-300'
                            : 'text-amber-300'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }
                    >
                      {isSelected ? 'Selected Site ✓' : 'Select Site'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Launch CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#0F1625] px-5 py-4">
          <div className="text-sm text-slate-300">
            Ready to command <strong className="text-white">{SITES[selectedSite].name}</strong>?
            You get <strong className="font-mono text-sky-400">2 actions</strong> per Sol for{' '}
            <strong className="font-mono text-emerald-400">10 Sols</strong>.
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playExecuteSol(true);
              onStartMission();
            }}
            className="flex items-center gap-2.5 rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-sky-400 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            <Rocket className="h-4 w-4" />
            <span>Launch 10-Sol Mission</span>
          </button>
        </div>
      </main>
    </div>
  );
};
