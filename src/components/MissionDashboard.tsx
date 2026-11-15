import React, { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  BookOpen,
  CheckCircle2,
  Droplets,
  Filter,
  FlaskConical,
  Layers,
  Lightbulb,
  Magnet,
  Mountain,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Sprout,
  Sun,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { DECISION_CARDS, SITES, SOL_CARD_SETS, SOL_EVENTS } from '../data/gameData';
import {
  BotMood,
  CardIconId,
  DecisionCard,
  ResourceKey,
  ResourceState,
  SiteId,
} from '../types/game';
import { soundEngine } from '../utils/sound';
import { HabitatSVG } from './HabitatSVG';
import { ResourceBar } from './ResourceBar';

interface MissionDashboardProps {
  site: SiteId;
  sol: number;
  resources: ResourceState;
  selectedCardIds: string[];
  onToggleCard: (cardId: string) => void;
  onExecuteSol: () => void;
  solOutcome: {
    before: ResourceState;
    after: ResourceState;
    chosenCards: DecisionCard[];
    eventTitle: string;
    eventScience: string;
    cascadeNote: string | null;
  } | null;
  onAdvanceFromOutcome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSources: () => void;
  onReturnBriefing: () => void;
}

const CARD_ICONS: Record<CardIconId, React.ComponentType<{ className?: string }>> = {
  led: Lightbulb,
  water_wall: Droplets,
  algae: FlaskConical,
  dust_repeller: Wind,
  solar_tilt: Sun,
  regolith: Mountain,
  aeroponics: Sprout,
  sabatier: Droplets,
  battery: BatteryCharging,
  shield_pulse: Magnet,
  myco: Layers,
  filter_flush: Filter,
};

function renderDeltaChip(label: string, val: number) {
  if (val === 0) return null;
  const positive = val > 0;
  return (
    <span
      className={`inline-flex items-center font-mono tabular-nums text-xs font-bold ${
        positive ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {positive ? `+${val}%` : `${val}%`} {label}
    </span>
  );
}

export function computeProjectedResources(
  resources: ResourceState,
  passiveDelta: ResourceState,
  selectedCardIds: string[]
): { projected: ResourceState; cascadePenalty: ResourceState; cascadeWarning: string | null } {
  const cascadePenalty: ResourceState = { power: 0, bio: 0, shield: 0 };
  const warnings: string[] = [];

  if (resources.power < 25) {
    cascadePenalty.bio = -6;
    warnings.push('Low Power (<25%) dims grow lights (-6% Bio-Life)');
  }
  if (resources.bio < 25) {
    cascadePenalty.shield = -6;
    warnings.push('Low Bio-Life (<25%) reduces crew repair capacity (-6% Shield)');
  }

  let power = resources.power + passiveDelta.power + cascadePenalty.power;
  let bio = resources.bio + passiveDelta.bio + cascadePenalty.bio;
  let shield = resources.shield + passiveDelta.shield + cascadePenalty.shield;

  selectedCardIds.forEach((id) => {
    const card = DECISION_CARDS[id];
    if (card) {
      power += card.effects.power;
      bio += card.effects.bio;
      shield += card.effects.shield;
    }
  });

  return {
    projected: {
      power: Math.max(0, Math.min(100, power)),
      bio: Math.max(0, Math.min(100, bio)),
      shield: Math.max(0, Math.min(100, shield)),
    },
    cascadePenalty,
    cascadeWarning: warnings.length > 0 ? warnings.join(' · ') : null,
  };
}

export const MissionDashboard: React.FC<MissionDashboardProps> = ({
  site,
  sol,
  resources,
  selectedCardIds,
  onToggleCard,
  onExecuteSol,
  solOutcome,
  onAdvanceFromOutcome,
  soundEnabled,
  onToggleSound,
  onOpenSources,
  onReturnBriefing,
}) => {
  const siteInfo = SITES[site];
  const currentEvent = SOL_EVENTS[site][sol - 1];
  const cardIds = SOL_CARD_SETS[sol] || SOL_CARD_SETS[1];
  const cards = cardIds.map((id) => DECISION_CARDS[id]);

  const actionsRemaining = 2 - selectedCardIds.length;

  const { projected, cascadeWarning } = useMemo(
    () => computeProjectedResources(resources, currentEvent.passiveDelta, selectedCardIds),
    [resources, currentEvent.passiveDelta, selectedCardIds]
  );

  const botMood: BotMood = useMemo(() => {
    const minCurr = Math.min(resources.power, resources.bio, resources.shield);
    const minProj = Math.min(projected.power, projected.bio, projected.shield);
    if (minCurr <= 20 || (selectedCardIds.length === 2 && minProj <= 15)) return 'alert';
    if (minCurr <= 40 || currentEvent.hazardType === 'solar_storm') return 'worried';
    if (
      resources.power >= 65 &&
      resources.bio >= 65 &&
      resources.shield >= 65
    ) {
      return 'excited';
    }
    return 'happy';
  }, [resources, projected, selectedCardIds.length, currentEvent.hazardType]);

  const dynamicBotMessage = useMemo(() => {
    if (selectedCardIds.length === 2) {
      const minProj = Math.min(projected.power, projected.bio, projected.shield);
      if (minProj === 0) {
        return 'Warning! With those 2 picks, one meter will hit 0%! Try swapping a card to save that system.';
      }
      if (minProj <= 25) {
        return 'Heads up—one system will finish pretty low after this Sol. Double-check if you want to adjust!';
      }
      return 'Great engineering balance! Ready to execute this Sol plan whenever you are, Commander.';
    }
    if (selectedCardIds.length === 1) {
      return '1 action queued! Pick 1 more engineering decision card to complete your Sol plan.';
    }
    return currentEvent.botPrompt;
  }, [selectedCardIds.length, projected, currentEvent.botPrompt]);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Mission Control Header */}
      <header className="border-b border-slate-800 bg-[#0B101C]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
              BioHab Mission Control
            </span>
            <span className="text-slate-600 hidden sm:inline" aria-hidden="true">
              /
            </span>
            <span
              className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                site === 'lunar' ? 'text-sky-400' : 'text-amber-400'
              }`}
            >
              {siteInfo.name}
            </span>
          </div>

          {/* Sol & Action Counters */}
          <div className="flex items-center gap-4 font-mono tabular-nums text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sol</span>
              <span className="font-bold text-white">{sol}</span>
              <span className="text-slate-500">/ 10</span>
            </div>
            <span className="text-slate-700" aria-hidden="true">
              |
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Actions Left:</span>
              <span
                className={`font-bold ${
                  actionsRemaining === 0 ? 'text-emerald-400' : 'text-sky-400'
                }`}
              >
                {actionsRemaining}
              </span>
              <span className="text-slate-500">/ 2</span>
            </div>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onToggleSound();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-slate-400" />
              )}
              <span className="hidden md:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenSources();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-sky-300 hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              <span>NASA Science &amp; Sources</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onReturnBriefing();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              title="Switch Landing Site"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sites</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Dashboard */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 px-4 py-3">
        {/* Top Resource Gauges */}
        <section
          aria-label="Habitat Resource Gauges"
          className="grid grid-cols-1 gap-2.5 md:grid-cols-3"
        >
          {(['power', 'bio', 'shield'] as ResourceKey[]).map((key) => (
            <ResourceBar
              key={key}
              resourceKey={key}
              value={resources[key]}
              projectedValue={projected[key]}
            />
          ))}
        </section>

        {/* Two-Column Interactive Workspace */}
        <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT STAGE: Morning Telemetry + SVG Habitat + ASTRO-BOT */}
          <section className="flex flex-col gap-3 lg:col-span-7">
            {/* Step 1: Morning Telemetry Hazard */}
            <div className="rounded-xl border border-slate-800 bg-[#0F1625] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {currentEvent.hazardType === 'solar_storm' ||
                  currentEvent.hazardType === 'micrometeorite' ? (
                    <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                  ) : currentEvent.hazardType === 'dust' ||
                    currentEvent.hazardType === 'deep_shadow' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  ) : (
                    <Sun className="h-4 w-4 text-sky-400 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-sky-400">
                    Step 1 · Sol {sol} Morning Telemetry
                  </span>
                </div>

                {/* Transparent Sol Passive Drift */}
                <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums text-xs">
                  <span className="text-slate-400">Sol Drift:</span>
                  <span
                    className={
                      currentEvent.passiveDelta.power >= 0 ? 'text-emerald-400' : 'text-amber-300'
                    }
                  >
                    Power {currentEvent.passiveDelta.power >= 0 ? '+' : ''}
                    {currentEvent.passiveDelta.power}%
                  </span>
                  <span className="text-slate-600">·</span>
                  <span
                    className={
                      currentEvent.passiveDelta.bio >= 0 ? 'text-emerald-400' : 'text-amber-300'
                    }
                  >
                    Bio {currentEvent.passiveDelta.bio >= 0 ? '+' : ''}
                    {currentEvent.passiveDelta.bio}%
                  </span>
                  <span className="text-slate-600">·</span>
                  <span
                    className={
                      currentEvent.passiveDelta.shield >= 0 ? 'text-emerald-400' : 'text-amber-300'
                    }
                  >
                    Shield {currentEvent.passiveDelta.shield >= 0 ? '+' : ''}
                    {currentEvent.passiveDelta.shield}%
                  </span>
                </div>
              </div>

              <h2 className="mt-1 text-base font-bold text-white">{currentEvent.title}</h2>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-300">
                {currentEvent.summary}
              </p>

              {cascadeWarning && (
                <div className="mt-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200">
                  Cascade Effect Active: {cascadeWarning}
                </div>
              )}
            </div>

            {/* Interactive Habitat Cross-Section SVG */}
            <HabitatSVG
              site={site}
              resources={resources}
              hazardType={currentEvent.hazardType}
              botMood={botMood}
              selectedCardIds={selectedCardIds}
            />

            {/* ASTRO-BOT Companion Guidance Strip */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0F1625] px-4 py-2.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  botMood === 'alert'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : botMood === 'worried'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : botMood === 'excited'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}
              >
                BOT
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-slate-400">
                  ASTRO-BOT Companion
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-snug">
                  {dynamicBotMessage}
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Step 2 Tactical Decisions + Execute Bar */}
          <section className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-[#0D1422] p-3.5 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-emerald-400">
                    Step 2 · Commander Tactical Decisions
                  </div>
                  <h2 className="text-base font-bold text-white">
                    Choose 2 Actions for Sol {sol}
                  </h2>
                </div>
                <span className="font-mono tabular-nums text-xs font-semibold text-slate-300">
                  {selectedCardIds.length} / 2 Selected
                </span>
              </div>

              {/* 4 Decision Cards */}
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {cards.map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  const selectionIndex = selectedCardIds.indexOf(card.id);
                  const Icon = CARD_ICONS[card.icon];
                  const isDisabled = !isSelected && selectedCardIds.length >= 2;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => onToggleCard(card.id)}
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      className={`group flex flex-col justify-between rounded-xl border p-3 text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-sky-400 bg-[#132038] ring-2 ring-sky-400/25 cursor-pointer'
                          : isDisabled
                          ? 'border-slate-800/70 bg-[#0A101B] opacity-55 cursor-not-allowed'
                          : 'border-slate-800 bg-[#11192A] hover:border-slate-600 hover:bg-[#162036] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isSelected
                                ? 'bg-sky-500/25 text-sky-300'
                                : 'bg-slate-800 text-slate-300 group-hover:text-sky-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-medium text-slate-400">
                              {card.tag}
                            </div>
                            <div className="text-sm font-bold text-white leading-snug">
                              {card.title}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="shrink-0 font-mono text-xs font-bold text-sky-300">
                            #{selectionIndex + 1} ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        {card.description}
                      </p>

                      {/* Exact Trade-Offs Before Clicking */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-800/80 pt-2">
                        {renderDeltaChip('Power', card.effects.power)}
                        {renderDeltaChip('Bio-Life', card.effects.bio)}
                        {renderDeltaChip('Shield', card.effects.shield)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3 Trigger: Execute Sol Plan */}
            <div className="border-t border-slate-800 pt-3">
              <button
                type="button"
                disabled={selectedCardIds.length !== 2}
                onClick={onExecuteSol}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                  selectedCardIds.length === 2
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {selectedCardIds.length === 2
                    ? `Execute Sol ${sol} Plan`
                    : `Select ${actionsRemaining} More Action${actionsRemaining > 1 ? 's' : ''}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Step 3: End-of-Sol Simulation & NASA Science Bite Modal */}
      {solOutcome && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sol-outcome-title"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-[#0D1424] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-emerald-400">
                  Step 3 · Sol {sol} Simulation Complete
                </div>
                <h2 id="sol-outcome-title" className="mt-0.5 text-xl font-bold text-white">
                  {solOutcome.eventTitle}
                </h2>
              </div>
              <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-400" />
            </div>

            {/* Resource Delta Summary */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {(
                [
                  { key: 'power', label: 'Power', color: 'text-sky-400' },
                  { key: 'bio', label: 'Bio-Life', color: 'text-emerald-400' },
                  { key: 'shield', label: 'Shielding', color: 'text-amber-400' },
                ] as { key: ResourceKey; label: string; color: string }[]
              ).map((item) => {
                const before = solOutcome.before[item.key];
                const after = solOutcome.after[item.key];
                const diff = after - before;
                return (
                  <div
                    key={item.key}
                    className="rounded-lg border border-slate-800 bg-[#111A2E] p-3 text-center"
                  >
                    <div className={`text-xs font-semibold ${item.color}`}>{item.label}</div>
                    <div className="mt-1 font-mono tabular-nums text-lg font-bold text-white">
                      {after}%
                    </div>
                    <div
                      className={`font-mono tabular-nums text-xs font-semibold ${
                        diff > 0
                          ? 'text-emerald-400'
                          : diff < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {diff > 0 ? `+${diff}%` : `${diff}%`} this Sol
                    </div>
                  </div>
                );
              })}
            </div>

            {solOutcome.cascadeNote && (
              <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-200">
                {solOutcome.cascadeNote}
              </div>
            )}

            {/* NASA Science Bites */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-sky-300">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <span>NASA Science Bites — Why Your Choices Worked</span>
              </div>

              {solOutcome.chosenCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-slate-800 bg-[#11192B] p-3.5"
                >
                  <div className="text-xs font-bold text-emerald-400">{card.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">
                    {card.scienceBite}
                  </p>
                </div>
              ))}

              <div className="rounded-lg border border-slate-800 bg-[#0A101D] p-3.5 text-xs leading-relaxed text-slate-300">
                <strong className="text-slate-100">Site Field Note:</strong>{' '}
                {solOutcome.eventScience}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onAdvanceFromOutcome}
                className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400 transition-colors cursor-pointer"
              >
                <span>
                  {sol < 10 ? `Continue to Sol ${sol + 1}` : 'View Mission Debrief'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
