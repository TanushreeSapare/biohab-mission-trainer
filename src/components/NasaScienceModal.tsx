import React, { useEffect } from 'react';
import { BookOpen, CheckCircle2, X } from 'lucide-react';
import { NASA_SOURCES } from '../data/gameData';
import { soundEngine } from '../utils/sound';

interface NasaScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NasaScienceModal: React.FC<NasaScienceModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nasa-sources-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-xl border border-slate-700 bg-[#0D1322] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#0D1322] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="nasa-sources-title" className="text-lg font-bold text-slate-100">
                NASA Science &amp; Engineering Sources
              </h2>
              <p className="text-xs text-slate-400">
                Real spaceflight biology and life-support systems powering BioHab
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close NASA Science modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {NASA_SOURCES.map((source) => (
            <section
              key={source.id}
              className="rounded-xl border border-slate-800 bg-[#11192B] p-5"
            >
              <div className="text-xs font-medium text-sky-400">{source.subtitle}</div>
              <h3 className="mt-1 text-base font-bold text-slate-100">{source.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{source.summary}</p>
              <ul className="mt-3 space-y-2 border-t border-slate-800/80 pt-3">
                {source.facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="rounded-lg border border-slate-800 bg-[#0A101D] px-4 py-3 text-xs text-slate-400">
            Educational reference adapted from public NASA Artemis, ISS Veggie / Advanced Plant
            Habitat, and ECLSS mission documentation for students ages 7–12.
          </div>
        </div>
      </div>
    </div>
  );
};
