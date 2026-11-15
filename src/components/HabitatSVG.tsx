import React, { useState } from 'react';
import { BotMood, HazardVisualType, ResourceState, SiteId } from '../types/game';

interface HabitatSVGProps {
  site: SiteId;
  resources: ResourceState;
  hazardType: HazardVisualType;
  botMood: BotMood;
  selectedCardIds: string[];
}

type SubsystemFocus = 'solar' | 'greenhouse' | 'shield' | 'bot' | null;

export const HabitatSVG: React.FC<HabitatSVGProps> = ({
  site,
  resources,
  hazardType,
  botMood,
  selectedCardIds,
}) => {
  const [focus, setFocus] = useState<SubsystemFocus>(null);

  const isLunar = site === 'lunar';
  const isDusty = hazardType === 'dust' || (site === 'mars' && hazardType === 'deep_shadow');
  const isShadow = hazardType === 'deep_shadow';
  const isStorm = hazardType === 'solar_storm';
  const isAlgaeBloom = hazardType === 'algae_bloom';
  const isCold = hazardType === 'cold_snap';
  const isMicro = hazardType === 'micrometeorite';

  const powerLow = resources.power < 30;
  const bioLow = resources.bio < 30;
  const bioWarn = resources.bio >= 30 && resources.bio < 50;
  const shieldLow = resources.shield < 30;

  const ledBoost =
    selectedCardIds.includes('red_blue_led') || selectedCardIds.includes('harvest_spirulina');
  const shieldBoost =
    selectedCardIds.includes('greywater_shield') ||
    selectedCardIds.includes('active_mag_shield') ||
    selectedCardIds.includes('regolith_berm');
  const solarTilt =
    selectedCardIds.includes('solar_tracking') || selectedCardIds.includes('electrostatic_dust');

  const plantLeafColor = bioLow ? '#CA8A04' : bioWarn ? '#84CC16' : '#10B981';
  const plantLeafDark = bioLow ? '#854D0E' : bioWarn ? '#4D7C0F' : '#047857';
  const shieldStroke = shieldLow ? '#F43F5E' : isStorm || shieldBoost ? '#38BDF8' : '#0EA5E9';

  const focusSummary: Record<Exclude<SubsystemFocus, null>, string> = {
    solar: isDusty
      ? 'Solar Array: Dust film reducing light capture — electrostatic cleaning or panel tilt helps.'
      : isShadow
      ? 'Solar Array: Low sunlight angle — LED power-saving mode protects battery reserves.'
      : `Solar Array: Generating steady electricity (${resources.power}% grid charge).`,
    greenhouse: bioLow
      ? 'Greenhouse Dome: Crops stressed! Restore water recycling or power up grow lights.'
      : isAlgaeBloom
      ? 'Greenhouse Dome: Spirulina algae surging — flush bio-filters to keep O2 flowing.'
      : `Greenhouse Dome: Red/Blue LEDs fueling O2 and crop growth (${resources.bio}% Bio-Life).`,
    shield: shieldLow
      ? 'Habitat Shield: Integrity critical! Pump greywater or pack regolith onto walls.'
      : isStorm
      ? 'Habitat Shield: Active proton storm deflection — hydrogen-rich water walls absorbing radiation.'
      : `Habitat Shield: Protecting crew & plant DNA (${resources.shield}% integrity).`,
    bot: `ASTRO-BOT Telemetry AI: Status ${
      botMood === 'alert'
        ? 'Red Alert — check low gauges!'
        : botMood === 'worried'
        ? 'Caution — watch system balance.'
        : botMood === 'excited'
        ? 'Systems thriving!'
        : 'All sensors online.'
    }`,
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#070B14]">
      <svg
        viewBox="0 0 760 340"
        className="w-full h-auto block select-none"
        role="img"
        aria-label={`Interactive cross-section of the ${
          isLunar ? 'Lunar South Pole' : 'Mars Jezero Crater'
        } BioHab outpost`}
      >
        <defs>
          <linearGradient id="skyLunar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04070F" />
            <stop offset="100%" stopColor="#0D1526" />
          </linearGradient>
          <linearGradient id="skyMars" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#120B14" />
            <stop offset="65%" stopColor="#2A1717" />
            <stop offset="100%" stopColor="#3E2019" />
          </linearGradient>
          <linearGradient id="ledBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E879F9" stopOpacity={powerLow ? 0.08 : ledBoost ? 0.55 : 0.35} />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity={powerLow ? 0.05 : 0.2} />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="shieldGlow" cx="50%" cy="65%" r="60%">
            <stop offset="65%" stopColor={shieldStroke} stopOpacity="0" />
            <stop offset="92%" stopColor={shieldStroke} stopOpacity={shieldLow ? 0.28 : isStorm || shieldBoost ? 0.26 : 0.12} />
            <stop offset="100%" stopColor={shieldStroke} stopOpacity={shieldLow ? 0.55 : 0.4} />
          </radialGradient>
          <linearGradient id="solarPanelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={powerLow || isShadow ? '#1E293B' : '#0369A1'} />
            <stop offset="100%" stopColor={powerLow || isShadow ? '#0F172A' : '#38BDF8'} />
          </linearGradient>
          <linearGradient id="waterWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect
          x="0"
          y="0"
          width="760"
          height="340"
          fill={isLunar ? 'url(#skyLunar)' : 'url(#skyMars)'}
        />

        {/* Stars */}
        <g fill="#E2E8F0" opacity={isLunar ? 0.75 : 0.38}>
          <circle cx="52" cy="36" r="1.2" />
          <circle cx="118" cy="64" r="1" />
          <circle cx="185" cy="28" r="1.5" />
          <circle cx="268" cy="48" r="1" />
          <circle cx="345" cy="24" r="1.3" />
          <circle cx="430" cy="40" r="1" />
          <circle cx="540" cy="26" r="1.4" />
          <circle cx="628" cy="52" r="1.1" />
          <circle cx="712" cy="32" r="1.3" />
          <circle cx="685" cy="84" r="0.9" />
        </g>

        {/* Distant Celestial Body: Earth for Moon, Phobos + Sun haze for Mars */}
        {isLunar ? (
          <g transform="translate(658, 56)">
            <circle cx="0" cy="0" r="22" fill="#1D4ED8" opacity="0.9" />
            <path d="M-12,-10 Q-2,-16 8,-6 Q12,4 2,12 Q-8,8 -12,-10 Z" fill="#10B981" opacity="0.75" />
            <path d="M-16,4 Q-6,10 6,6 Q14,12 4,18 Q-12,16 -16,4 Z" fill="#F8FAFC" opacity="0.55" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.5" />
          </g>
        ) : (
          <g>
            {/* Distant smaller Martian Sun */}
            <circle cx="648" cy="62" r="13" fill="#FDE68A" opacity={isShadow ? 0.22 : 0.8} />
            <circle cx="648" cy="62" r="22" fill="#F59E0B" opacity={isShadow ? 0.05 : 0.16} />
            {/* Phobos */}
            <ellipse cx="568" cy="44" rx="7" ry="5" fill="#9A8C82" opacity="0.8" />
          </g>
        )}

        {/* Deep Shadow overlay if shadow / storm */}
        {isShadow && (
          <rect x="0" y="0" width="760" height="340" fill="#020617" opacity="0.45" />
        )}

        {/* Distant Mountain / Crater Rim */}
        <path
          d="M0,252 L85,228 L165,245 L250,220 L330,242 L440,226 L530,244 L630,218 L760,242 L760,340 L0,340 Z"
          fill={isLunar ? '#182030' : '#4A241B'}
        />

        {/* Ground Terrain */}
        <path
          d="M0,266 Q180,256 380,264 Q580,272 760,260 L760,340 L0,340 Z"
          fill={isLunar ? '#263042' : '#6A3323'}
        />
        {/* Crater details */}
        <ellipse
          cx="112"
          cy="304"
          rx="42"
          ry="9"
          fill={isLunar ? '#1A2232' : '#512418'}
        />
        <ellipse
          cx="658"
          cy="308"
          rx="48"
          ry="10"
          fill={isLunar ? '#1A2232' : '#512418'}
        />
        {isCold && (
          <path
            d="M0,266 Q180,256 380,264 Q580,272 760,260"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2.5"
            opacity="0.55"
          />
        )}

        {/* Solar Storm Incoming Rays */}
        {isStorm && (
          <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
            <line x1="80" y1="30" x2="120" y2="66" className="animate-storm-ray" />
            <line x1="250" y1="18" x2="295" y2="58" className="animate-storm-ray" />
            <line x1="420" y1="22" x2="462" y2="60" className="animate-storm-ray" />
            <line x1="560" y1="36" x2="602" y2="74" className="animate-storm-ray" />
          </g>
        )}

        {/* Micrometeorite streaks */}
        {isMicro && (
          <g stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
            <line x1="160" y1="26" x2="192" y2="56" className="animate-storm-ray" />
            <line x1="395" y1="14" x2="425" y2="48" className="animate-storm-ray" />
            <line x1="510" y1="38" x2="542" y2="70" className="animate-storm-ray" />
          </g>
        )}

        {/* ============================================================
            1. SOLAR ARRAY WING (Left Zone)
           ============================================================ */}
        <g
          className="cursor-pointer"
          onClick={() => setFocus(focus === 'solar' ? null : 'solar')}
          tabIndex={0}
          role="button"
          aria-label="Inspect Solar Array Wing"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFocus(focus === 'solar' ? null : 'solar');
            }
          }}
        >
          {/* Mounting pedestal */}
          <rect x="86" y="210" width="12" height="60" rx="2" fill="#475569" />
          <rect x="74" y="264" width="36" height="8" rx="2" fill="#64748B" />
          {/* Power conduit cable to main hub */}
          <path
            d="M98,256 Q145,256 175,244"
            fill="none"
            stroke={powerLow ? '#64748B' : '#38BDF8'}
            strokeWidth="3"
            strokeDasharray={powerLow ? '4 4' : 'none'}
          />

          {/* Tilting Solar Wings */}
          <g
            transform={`translate(92, 198) rotate(${solarTilt ? -12 : -22})`}
            className="transition-transform duration-500"
          >
            {/* Left wing */}
            <rect
              x="-68"
              y="-22"
              width="62"
              height="44"
              rx="3"
              fill="url(#solarPanelGrad)"
              stroke={focus === 'solar' ? '#38BDF8' : '#94A3B8'}
              strokeWidth={focus === 'solar' ? '2.2' : '1.4'}
            />
            {/* Grid lines */}
            <line x1="-47" y1="-22" x2="-47" y2="22" stroke="#0F172A" strokeWidth="1" opacity="0.55" />
            <line x1="-26" y1="-22" x2="-26" y2="22" stroke="#0F172A" strokeWidth="1" opacity="0.55" />
            <line x1="-68" y1="0" x2="-6" y2="0" stroke="#0F172A" strokeWidth="1" opacity="0.55" />

            {/* Right wing */}
            <rect
              x="6"
              y="-22"
              width="62"
              height="44"
              rx="3"
              fill="url(#solarPanelGrad)"
              stroke={focus === 'solar' ? '#38BDF8' : '#94A3B8'}
              strokeWidth={focus === 'solar' ? '2.2' : '1.4'}
            />
            <line x1="27" y1="-22" x2="27" y2="22" stroke="#0F172A" strokeWidth="1" opacity="0.55" />
            <line x1="48" y1="-22" x2="48" y2="22" stroke="#0F172A" strokeWidth="1" opacity="0.55" />
            <line x1="6" y1="0" x2="68" y2="0" stroke="#0F172A" strokeWidth="1" opacity="0.55" />

            {/* Dust coating overlay during dust events */}
            {isDusty && (
              <g opacity="0.72">
                <rect
                  x="-68"
                  y="-22"
                  width="62"
                  height="44"
                  rx="3"
                  fill={isLunar ? '#64748B' : '#B45309'}
                  opacity="0.5"
                />
                <rect
                  x="6"
                  y="-22"
                  width="62"
                  height="44"
                  rx="3"
                  fill={isLunar ? '#64748B' : '#B45309'}
                  opacity="0.5"
                />
              </g>
            )}

            {/* Center hub */}
            <circle cx="0" cy="0" r="7" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
          </g>

          {/* Animated Dust Particles */}
          {isDusty && (
            <g fill={isLunar ? '#94A3B8' : '#F59E0B'} className="animate-dust-drift">
              <circle cx="48" cy="176" r="2.2" />
              <circle cx="76" cy="164" r="1.8" />
              <circle cx="118" cy="182" r="2.4" />
              <circle cx="142" cy="168" r="1.6" />
              <circle cx="95" cy="152" r="2" />
            </g>
          )}
        </g>

        {/* ============================================================
            2. OUTER RADIATION & REGOLITH SHIELD DOME
           ============================================================ */}
        <g
          className="cursor-pointer"
          onClick={() => setFocus(focus === 'shield' ? null : 'shield')}
          tabIndex={0}
          role="button"
          aria-label="Inspect Radiation and Habitat Shielding"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFocus(focus === 'shield' ? null : 'shield');
            }
          }}
        >
          {/* Shimmering dome canopy overarching Crew Module + Greenhouse */}
          <path
            d="M158,270 A218,176 0 0,1 594,270"
            fill="url(#shieldGlow)"
            stroke={shieldStroke}
            strokeWidth={shieldLow ? '2.5' : isStorm || shieldBoost ? '2.8' : '1.6'}
            strokeDasharray={shieldLow ? '8 6' : 'none'}
            className="animate-shield-pulse"
          />
          {/* Regolith Berm Side Anchors */}
          <path
            d="M148,270 Q168,242 192,270 Z"
            fill={isLunar ? '#334155' : '#7C2D12'}
            stroke="#475569"
            strokeWidth="1"
          />
          <path
            d="M560,270 Q584,242 606,270 Z"
            fill={isLunar ? '#334155' : '#7C2D12'}
            stroke="#475569"
            strokeWidth="1"
          />
        </g>

        {/* ============================================================
            3. CREW LIVING MODULE & WATER RADIATION WALL (Center-Left)
           ============================================================ */}
        <g
          className="cursor-pointer"
          onClick={() => setFocus(focus === 'shield' ? null : 'shield')}
        >
          {/* Base legs */}
          <rect x="192" y="254" width="12" height="16" fill="#64748B" />
          <rect x="330" y="254" width="12" height="16" fill="#64748B" />

          {/* Outer hull */}
          <rect
            x="176"
            y="168"
            width="180"
            height="90"
            rx="16"
            fill="#1E293B"
            stroke={focus === 'shield' ? '#38BDF8' : '#475569'}
            strokeWidth={focus === 'shield' ? '2.4' : '1.8'}
          />

          {/* Water Bladder Radiation Wall Layer (thicker when shield is healthy) */}
          <rect
            x="183"
            y="174"
            width="166"
            height="78"
            rx="11"
            fill="none"
            stroke="url(#waterWallGrad)"
            strokeWidth={resources.shield >= 65 ? '7' : resources.shield >= 35 ? '4.5' : '2'}
            opacity={shieldLow ? 0.35 : 0.85}
          />

          {/* Interior Crew Cabin */}
          <rect x="190" y="181" width="152" height="64" rx="7" fill="#0F172A" />

          {/* Cabin Light & Console */}
          <rect x="200" y="187" width="46" height="22" rx="3" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="1" />
          <polyline
            points="204,200 212,194 220,202 228,192 238,198"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
          />

          {/* Mini Astronaut Silhouette inside module */}
          <g transform="translate(274, 212)">
            {/* Torso */}
            <rect x="-7" y="4" width="14" height="18" rx="4" fill="#E2E8F0" />
            {/* Helmet */}
            <circle cx="0" cy="-4" r="8" fill="#F8FAFC" />
            <rect x="-5" y="-7" width="10" height="6" rx="2.5" fill="#0284C7" />
          </g>

          {/* Sleeping / ECLSS Pod */}
          <rect x="298" y="192" width="34" height="44" rx="4" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <line x1="304" y1="204" x2="326" y2="204" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
          <line x1="304" y1="214" x2="326" y2="214" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />
          <line x1="304" y1="224" x2="320" y2="224" stroke="#F59E0B" strokeWidth="1.5" opacity="0.7" />

          {/* Connecting Airlock Tunnel to Greenhouse */}
          <rect x="352" y="210" width="28" height="32" fill="#334155" stroke="#475569" strokeWidth="1.2" />
          <rect x="356" y="216" width="20" height="20" rx="2" fill="#0F172A" />
        </g>

        {/* ============================================================
            4. BIOREGENERATIVE GREENHOUSE DOME (Right-Center)
           ============================================================ */}
        <g
          className="cursor-pointer"
          onClick={() => setFocus(focus === 'greenhouse' ? null : 'greenhouse')}
          tabIndex={0}
          role="button"
          aria-label="Inspect Bioregenerative Greenhouse Dome"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFocus(focus === 'greenhouse' ? null : 'greenhouse');
            }
          }}
        >
          {/* Base foundation */}
          <rect x="376" y="252" width="196" height="16" rx="3" fill="#334155" />

          {/* Geodesic Dome Glass */}
          <path
            d="M380,254 A94,96 0 0,1 568,254 Z"
            fill="#0B192C"
            fillOpacity="0.82"
            stroke={focus === 'greenhouse' ? '#10B981' : '#64748B'}
            strokeWidth={focus === 'greenhouse' ? '2.4' : '1.8'}
          />
          {/* Dome ribs */}
          <path
            d="M425,254 A54,94 0 0,1 474,158"
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            opacity="0.55"
          />
          <path
            d="M523,254 A54,94 0 0,0 474,158"
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            opacity="0.55"
          />

          {/* NASA Red/Blue LED Grow Light Array */}
          <rect x="424" y="176" width="100" height="7" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          {/* LED diodes */}
          <circle cx="436" cy="182" r="2.2" fill="#F43F5E" opacity={powerLow ? 0.25 : 1} />
          <circle cx="450" cy="182" r="2.2" fill="#38BDF8" opacity={powerLow ? 0.25 : 1} />
          <circle cx="464" cy="182" r="2.2" fill="#E879F9" opacity={powerLow ? 0.25 : 1} />
          <circle cx="478" cy="182" r="2.2" fill="#38BDF8" opacity={powerLow ? 0.25 : 1} />
          <circle cx="492" cy="182" r="2.2" fill="#F43F5E" opacity={powerLow ? 0.25 : 1} />
          <circle cx="506" cy="182" r="2.2" fill="#38BDF8" opacity={powerLow ? 0.25 : 1} />
          <circle cx="516" cy="182" r="2.2" fill="#E879F9" opacity={powerLow ? 0.25 : 1} />

          {/* LED Light Cone */}
          <polygon points="426,183 522,183 546,248 402,248" fill="url(#ledBeam)" />

          {/* Hydroponic Tray */}
          <rect x="398" y="242" width="112" height="10" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />

          {/* Animated Growing Plants */}
          <g className="animate-plant-sway">
            {/* Plant 1 */}
            <path d="M416,242 Q410,224 402,218 Q414,220 420,234" fill={plantLeafColor} />
            <path d="M418,242 Q426,222 434,216 Q424,226 420,242" fill={plantLeafDark} />
            {/* Plant 2 (tall tomato/pepper) */}
            <line x1="454" y1="242" x2="454" y2="206" stroke={plantLeafDark} strokeWidth="2.4" />
            <ellipse cx="445" cy="224" rx="8" ry="4.5" fill={plantLeafColor} transform="rotate(-20 445 224)" />
            <ellipse cx="463" cy="218" rx="8" ry="4.5" fill={plantLeafColor} transform="rotate(20 463 218)" />
            <ellipse cx="454" cy="204" rx="7" ry="5" fill={plantLeafColor} />
            {!bioLow && <circle cx="448" cy="229" r="3" fill="#F43F5E" />}
            {!bioLow && <circle cx="460" cy="224" r="2.8" fill="#F43F5E" />}
            {/* Plant 3 (leafy lettuce) */}
            <path d="M490,242 Q480,222 476,216 Q488,218 492,232" fill={plantLeafColor} />
            <path d="M492,242 Q492,214 494,210 Q502,220 496,242" fill={plantLeafDark} />
            <path d="M494,242 Q504,222 508,218 Q500,232 496,242" fill={plantLeafColor} />
          </g>

          {/* Spirulina Algae Bioreactor Tank */}
          <rect
            x="522"
            y="196"
            width="24"
            height="54"
            rx="6"
            fill={isAlgaeBloom ? '#059669' : bioLow ? '#854D0E' : '#10B981'}
            fillOpacity={isAlgaeBloom ? '0.92' : '0.68'}
            stroke="#34D399"
            strokeWidth="1.5"
          />
          {/* Algae bubbles inside tank */}
          <circle cx="530" cy="236" r="2" fill="#A7F3D0" />
          <circle cx="538" cy="222" r="2.4" fill="#A7F3D0" />
          <circle cx="532" cy="210" r="1.8" fill="#A7F3D0" />

          {/* Floating O2 Bubbles */}
          {!bioLow && (
            <g fill="#38BDF8" opacity="0.85">
              <circle cx="430" cy="218" r="2.5" className="animate-bubble-1" />
              <circle cx="472" cy="214" r="3" className="animate-bubble-2" />
              <circle cx="534" cy="198" r="2.5" className="animate-bubble-3" />
            </g>
          )}
        </g>

        {/* ============================================================
            5. ASTRO-BOT AI MISSION COMPANION (Right Foreground)
           ============================================================ */}
        <g
          transform="translate(658, 224)"
          className="cursor-pointer animate-bot-hover"
          onClick={() => setFocus(focus === 'bot' ? null : 'bot')}
          tabIndex={0}
          role="button"
          aria-label="Inspect ASTRO-BOT Companion"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFocus(focus === 'bot' ? null : 'bot');
            }
          }}
        >
          {/* Hover shadow on ground */}
          <ellipse cx="0" cy="48" rx="22" ry="5" fill="#020617" opacity="0.55" />

          {/* Antenna */}
          <line x1="0" y1="-34" x2="0" y2="-48" stroke="#94A3B8" strokeWidth="2.5" />
          <circle
            cx="0"
            cy="-50"
            r="4.5"
            fill={
              botMood === 'alert'
                ? '#F43F5E'
                : botMood === 'worried'
                ? '#F59E0B'
                : botMood === 'excited'
                ? '#10B981'
                : '#38BDF8'
            }
          />

          {/* Robot Body */}
          <rect
            x="-20"
            y="8"
            width="40"
            height="30"
            rx="10"
            fill="#E2E8F0"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Chest badge */}
          <rect x="-10" y="16" width="20" height="10" rx="3" fill="#0F172A" />
          <circle cx="-4" cy="21" r="2" fill="#38BDF8" />
          <circle cx="4" cy="21" r="2" fill="#10B981" />

          {/* Arms */}
          <rect x="-27" y="12" width="6" height="16" rx="3" fill="#94A3B8" />
          <rect x="21" y="12" width="6" height="16" rx="3" fill="#94A3B8" />

          {/* Robot Head */}
          <rect
            x="-26"
            y="-34"
            width="52"
            height="38"
            rx="12"
            fill="#F8FAFC"
            stroke={focus === 'bot' ? '#38BDF8' : '#475569'}
            strokeWidth="2"
          />
          {/* Face Visor */}
          <rect x="-20" y="-27" width="40" height="24" rx="7" fill="#090D16" />

          {/* Facial Expressions */}
          {botMood === 'happy' && (
            <g stroke="#38BDF8" strokeWidth="2.4" fill="none" strokeLinecap="round">
              <path d="M-12,-17 Q-9,-21 -6,-17" />
              <path d="M6,-17 Q9,-21 12,-17" />
              <path d="M-6,-10 Q0,-6 6,-10" />
            </g>
          )}
          {botMood === 'excited' && (
            <g stroke="#10B981" strokeWidth="2.4" fill="none" strokeLinecap="round">
              <circle cx="-9" cy="-18" r="2.5" fill="#10B981" />
              <circle cx="9" cy="-18" r="2.5" fill="#10B981" />
              <path d="M-8,-11 Q0,-4 8,-11" />
            </g>
          )}
          {botMood === 'worried' && (
            <g stroke="#F59E0B" strokeWidth="2.2" fill="none" strokeLinecap="round">
              <line x1="-13" y1="-20" x2="-6" y2="-17" />
              <line x1="13" y1="-20" x2="6" y2="-17" />
              <circle cx="-9" cy="-15" r="1.5" fill="#F59E0B" />
              <circle cx="9" cy="-15" r="1.5" fill="#F59E0B" />
              <path d="M-6,-9 Q0,-12 6,-9" />
            </g>
          )}
          {botMood === 'alert' && (
            <g stroke="#F43F5E" strokeWidth="2.4" fill="none" strokeLinecap="round">
              <line x1="-12" y1="-20" x2="-6" y2="-15" />
              <line x1="-6" y1="-20" x2="-12" y2="-15" />
              <line x1="6" y1="-20" x2="12" y2="-15" />
              <line x1="12" y1="-20" x2="6" y2="-15" />
              <rect x="-5" y="-10" width="10" height="3" rx="1" fill="#F43F5E" />
            </g>
          )}
        </g>

        {/* Clean Subsystem Labels on Canvas */}
        <g className="font-mono" fontSize="10" fontWeight="600" fill="#CBD5E1">
          <text x="92" y="294" textAnchor="middle">
            SOLAR WING
          </text>
          <text x="266" y="294" textAnchor="middle">
            CREW &amp; WATER WALL
          </text>
          <text x="474" y="294" textAnchor="middle">
            BIO-GREENHOUSE
          </text>
          <text x="658" y="294" textAnchor="middle">
            ASTRO-BOT
          </text>
        </g>
      </svg>

      {/* Interactive Subsystem Inspection Bar */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-800/90 bg-[#0C1220] px-3.5 py-2 text-xs text-slate-300">
        <span className="truncate">
          {focus ? focusSummary[focus] : 'Click any module above (Solar Wing, Crew & Water Wall, Bio-Greenhouse, or ASTRO-BOT) to inspect live hardware.'}
        </span>
        {focus && (
          <button
            type="button"
            onClick={() => setFocus(null)}
            className="shrink-0 text-sky-400 hover:text-sky-300 font-medium whitespace-nowrap cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
