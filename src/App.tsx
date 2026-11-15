/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BriefingScreen } from './components/BriefingScreen';
import { EndScreen } from './components/EndScreen';
import {
  computeProjectedResources,
  MissionDashboard,
} from './components/MissionDashboard';
import { NasaScienceModal } from './components/NasaScienceModal';
import {
  DECISION_CARDS,
  diagnoseFailure,
  SOL_EVENTS,
  STARTING_RESOURCES,
} from './data/gameData';
import {
  DecisionCard,
  FailureDiagnosis,
  GameScreen,
  ResourceKey,
  ResourceState,
  SiteId,
  SolHistoryEntry,
} from './types/game';
import { soundEngine } from './utils/sound';

interface SolOutcomeState {
  before: ResourceState;
  after: ResourceState;
  chosenCards: DecisionCard[];
  eventTitle: string;
  eventScience: string;
  cascadeNote: string | null;
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('briefing');
  const [site, setSite] = useState<SiteId>('lunar');
  const [sol, setSol] = useState<number>(1);
  const [resources, setResources] = useState<ResourceState>({ ...STARTING_RESOURCES });
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [history, setHistory] = useState<SolHistoryEntry[]>([
    {
      sol: 0,
      resources: { ...STARTING_RESOURCES },
      eventTitle: 'Touchdown Baseline',
      chosenTitles: [],
    },
  ]);
  const [solOutcome, setSolOutcome] = useState<SolOutcomeState | null>(null);
  const [diagnosis, setDiagnosis] = useState<FailureDiagnosis | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sourcesOpen, setSourcesOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
  };

  const resetAndStartMission = (targetSite: SiteId) => {
    setSite(targetSite);
    setSol(1);
    setResources({ ...STARTING_RESOURCES });
    setSelectedCardIds([]);
    setSolOutcome(null);
    setDiagnosis(null);
    setHistory([
      {
        sol: 0,
        resources: { ...STARTING_RESOURCES },
        eventTitle: 'Touchdown Baseline',
        chosenTitles: [],
      },
    ]);
    setScreen('mission');
  };

  const handleToggleCard = (cardId: string) => {
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        soundEngine.playDeselect();
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      soundEngine.playSelect();
      return [...prev, cardId];
    });
  };

  const handleExecuteSol = () => {
    if (selectedCardIds.length !== 2) return;

    const currentEvent = SOL_EVENTS[site][sol - 1];
    const chosenCards = selectedCardIds
      .map((id) => DECISION_CARDS[id])
      .filter(Boolean);

    const { projected, cascadeWarning } = computeProjectedResources(
      resources,
      currentEvent.passiveDelta,
      selectedCardIds
    );

    const before = { ...resources };
    setResources(projected);

    setHistory((prev) => [
      ...prev,
      {
        sol,
        resources: projected,
        eventTitle: currentEvent.title,
        chosenTitles: chosenCards.map((c) => c.title),
      },
    ]);

    const failedKey: ResourceKey | null =
      projected.power <= 0
        ? 'power'
        : projected.bio <= 0
        ? 'bio'
        : projected.shield <= 0
        ? 'shield'
        : null;

    if (failedKey) {
      soundEngine.playMissionAbort();
      setDiagnosis(diagnoseFailure(failedKey, site));
      setSolOutcome(null);
      setScreen('abort');
      return;
    }

    const healthy =
      Math.min(projected.power, projected.bio, projected.shield) >= 30;
    soundEngine.playExecuteSol(healthy);
    if (!healthy) {
      setTimeout(() => soundEngine.playAlert(), 260);
    }

    setSolOutcome({
      before,
      after: projected,
      chosenCards,
      eventTitle: currentEvent.title,
      eventScience: currentEvent.scienceContext,
      cascadeNote: cascadeWarning,
    });
  };

  const handleAdvanceFromOutcome = () => {
    soundEngine.playClick();
    setSolOutcome(null);
    setSelectedCardIds([]);

    if (sol >= 10) {
      soundEngine.playMissionSuccess();
      setScreen('success');
    } else {
      setSol((prev) => prev + 1);
    }
  };

  return (
    <>
      {screen === 'briefing' && (
        <BriefingScreen
          selectedSite={site}
          onSelectSite={setSite}
          onStartMission={() => resetAndStartMission(site)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSources={() => setSourcesOpen(true)}
        />
      )}

      {screen === 'mission' && (
        <MissionDashboard
          site={site}
          sol={sol}
          resources={resources}
          selectedCardIds={selectedCardIds}
          onToggleCard={handleToggleCard}
          onExecuteSol={handleExecuteSol}
          solOutcome={solOutcome}
          onAdvanceFromOutcome={handleAdvanceFromOutcome}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSources={() => setSourcesOpen(true)}
          onReturnBriefing={() => setScreen('briefing')}
        />
      )}

      {(screen === 'success' || screen === 'abort') && (
        <EndScreen
          outcome={screen}
          site={site}
          finalResources={resources}
          history={history}
          diagnosis={diagnosis}
          failedSol={sol}
          onReplaySameSite={() => resetAndStartMission(site)}
          onPlayAnotherSite={() => {
            setSite(site === 'lunar' ? 'mars' : 'lunar');
            setScreen('briefing');
          }}
          onOpenSources={() => setSourcesOpen(true)}
        />
      )}

      <NasaScienceModal isOpen={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </>
  );
}
