import React from 'react';
import {
  Award,
  BookOpen,
  Compass,
  Lightbulb,
  RotateCcw,
  Shield,
  Sprout,
  Zap,
} from 'lucide-react';
import { SITES } from '../data/gameData';
import {
  FailureDiagnosis,
  ResourceState,
  SiteId,
  SolHistoryEntry,
} from '../types/game';
import { soundEngine } from '../utils/sound';

interface EndScreenProps {
  outcome: 'success' | 'abort';
  site: SiteId;
  finalResources: ResourceState;
  history: SolHistoryEntry[];
  diagnosis: FailureDiagnosis | null;
  failedSol: number;
  onReplaySameSite: () => void;
  onPlayAnotherSite: () => void;
  onOpenSources: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({
  outcome,
  site,
  finalResources,
  history,
  diagnosis,
  failedSol,
  onReplaySameSite,
  onPlayAnotherSite,
  onOpenSources,
}) => {
  const siteInfo = SITES[site];
  const avgScore = Math.round(
    (finalResources.power + finalResources.bio + finalResources.shield) / 3
  );

  const rank =
    avgScore >= 75
      ? {
          title: 'Chief Artemis Commander',
          color: 'text-emerald-400',
          desc: 'Masterful closed-loop balance! Your habitat thrived through dust, shadows, and solar storms.',
        }
      : avgScore >= 55
      ? {
          title: 'Mission Specialist',
          color: 'text-sky-400',
          desc: 'Solid engineering! You guided your crew safely through 10 challenging Sols.',
        }
      : {
          title: 'Junior Cadet',
          color: 'text-amber-400',
          desc: 'Mission survived! Every subsystem stayed above zero—now try boosting your average score.',
        };

  // Build SVG chart coordinates for 10-Sol history
  const chartW = 640;
  const chartH = 220;
  const padL = 42;
  const padR = 18;
  const padT = 18;
  const padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const maxSolIndex = Math.max(1, history.length - 1);
  const toX = (idx: number) => padL + (idx / maxSolIndex) * plotW;
  const toY = (val: number) => padT + ((100 - Math.max(0, Math.min(100, val))) / 100) * plotH;

  const buildPolyline = (key: keyof ResourceState) =>
    history.map((entry, idx) => `${toX(idx)},${toY(entry.resources[key])}`).join(' ');

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0B101C]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="text-base font-bold text-white">
            BioHab: Mission Debrief · {siteInfo.name}
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenSources();
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#111827] px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-sky-400" />
            <span>NASA Science &amp; Sources</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-5 px-5 py-6">
        {outcome === 'success' ? (
          <>
            {/* Success Hero Card */}
            <section className="rounded-xl border border-emerald-500/40 bg-[#0E1829] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-emerald-400">
                    10-Sol Outpost Complete · All Life-Support Systems Active
                  </div>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                    Mission Accomplished, {rank.title}!
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-300 max-w-2xl">{rank.desc}</p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#111E33] px-4 py-3 shrink-0">
                  <Award className={`h-9 w-9 ${rank.color}`} />
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">Average Score</div>
                    <div className="font-mono tabular-nums text-2xl font-extrabold text-white">
                      {avgScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Resource Readouts */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-800 bg-[#0B111E] p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold">
                    <Zap className="h-4 w-4" />
                    <span>Final Power</span>
                  </div>
                  <span className="font-mono tabular-nums text-lg font-bold text-white">
                    {finalResources.power}%
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0B111E] p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <Sprout className="h-4 w-4" />
                    <span>Final Bio-Life</span>
                  </div>
                  <span className="font-mono tabular-nums text-lg font-bold text-white">
                    {finalResources.bio}%
                  </span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0B111E] p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                    <Shield className="h-4 w-4" />
                    <span>Final Shielding</span>
                  </div>
                  <span className="font-mono tabular-nums text-lg font-bold text-white">
                    {finalResources.shield}%
                  </span>
                </div>
              </div>
            </section>

            {/* 10-Sol Resource History SVG Chart */}
            <section className="rounded-xl border border-slate-800 bg-[#0D1422] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-base font-bold text-white">
                    10-Sol Telemetry History
                  </h2>
                  <p className="text-xs text-slate-400">
                    How your engineering trade-offs shaped Power, Bio-Life Support, and Shielding
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-sky-400">━ Power</span>
                  <span className="text-emerald-400">━ Bio-Life</span>
                  <span className="text-amber-400">━ Shield</span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-auto min-w-[460px]"
                  role="img"
                  aria-label="Line chart showing Power, Bio-Life Support, and Shielding across 10 Sols"
                >
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = toY(val);
                    return (
                      <g key={val}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={chartW - padR}
                          y2={y}
                          stroke="#1E293B"
                          strokeWidth="1"
                        />
                        <text
                          x={padL - 8}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="#94A3B8"
                          className="font-mono"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* X-axis labels */}
                  {history.map((entry, idx) => (
                    <text
                      key={entry.sol}
                      x={toX(idx)}
                      y={chartH - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#94A3B8"
                      className="font-mono"
                    >
                      {entry.sol === 0 ? 'Start' : `S${entry.sol}`}
                    </text>
                  ))}

                  {/* Lines */}
                  <polyline
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={buildPolyline('power')}
                  />
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={buildPolyline('bio')}
                  />
                  <polyline
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={buildPolyline('shield')}
                  />

                  {/* Points */}
                  {history.map((entry, idx) => (
                    <g key={entry.sol}>
                      <circle cx={toX(idx)} cy={toY(entry.resources.power)} r="3.5" fill="#38BDF8" />
                      <circle cx={toX(idx)} cy={toY(entry.resources.bio)} r="3.5" fill="#10B981" />
                      <circle cx={toX(idx)} cy={toY(entry.resources.shield)} r="3.5" fill="#F59E0B" />
                    </g>
                  ))}
                </svg>
              </div>
            </section>
          </>
        ) : (
          /* Non-Punitive Mission Abort Screen */
          <section className="rounded-xl border border-amber-500/40 bg-[#121625] p-6">
            <div className="text-xs font-semibold text-amber-400">
              Sol {failedSol} Telemetry Check · Safe Training Mode
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Simulation Paused — Engineering Lesson Learned!
            </h1>

            {diagnosis && (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-[#0D1320] p-4">
                  <div className="text-sm font-bold text-rose-400">{diagnosis.title}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {diagnosis.cascadeExplanation}
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                  <div>
                    <div className="text-xs font-bold text-sky-300">
                      ASTRO-BOT Engineering Tip for Your Next Run
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">
                      {diagnosis.tip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status at pause */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-800 bg-[#0B101B] p-3 text-center">
                <div className="text-xs text-sky-400 font-semibold">Power</div>
                <div className="mt-1 font-mono tabular-nums text-lg font-bold text-white">
                  {finalResources.power}%
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#0B101B] p-3 text-center">
                <div className="text-xs text-emerald-400 font-semibold">Bio-Life</div>
                <div className="mt-1 font-mono tabular-nums text-lg font-bold text-white">
                  {finalResources.bio}%
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#0B101B] p-3 text-center">
                <div className="text-xs text-amber-400 font-semibold">Shielding</div>
                <div className="mt-1 font-mono tabular-nums text-lg font-bold text-white">
                  {finalResources.shield}%
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0F1625] px-5 py-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onReplaySameSite();
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#151F33] px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-sky-400" />
            <span>
              {outcome === 'abort' ? `Retry ${siteInfo.name}` : `Replay ${siteInfo.name}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onPlayAnotherSite();
            }}
            className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400 transition-colors cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>Play Another Site</span>
          </button>
        </div>
      </main>
    </div>
  );
};
