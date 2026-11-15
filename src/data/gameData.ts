import {
  DecisionCard,
  FailureDiagnosis,
  ResourceKey,
  SiteConfig,
  SiteId,
  SolEvent,
} from '../types/game';

export const STARTING_RESOURCES = {
  power: 65,
  bio: 65,
  shield: 65,
};

export const SITES: Record<SiteId, SiteConfig> = {
  lunar: {
    id: 'lunar',
    name: 'Lunar South Pole',
    subtitle: 'Shackleton Crater Rim',
    locationLabel: 'Moon · 89.9°S',
    description:
      'High-elevation crater ridges receive bright sunlight for power, but sharp abrasive Moon dust, freezing shadows, and zero atmosphere keep your engineering team busy.',
    sunlightNote: 'Strong solar intensity during lit hours, sudden shadow dips',
    hazardNote: 'Sharp electrostatic lunar regolith dust and extreme cold',
    gravityLabel: '1/6 Earth Gravity',
    distanceLabel: '384,400 km from Earth',
    accentColor: '#38BDF8',
  },
  mars: {
    id: 'mars',
    name: 'Mars Outpost',
    subtitle: 'Jezero Crater Delta',
    locationLabel: 'Mars · 18.4°N',
    description:
      'Farther from the Sun with a thin rusty sky, your Mars habitat faces weaker baseline sunlight, swirling global dust storms, and steady cosmic radiation.',
    sunlightNote: 'Lower baseline solar output (43% of Earth sunlight)',
    hazardNote: 'Global fine dust storms and constant cosmic ray exposure',
    gravityLabel: '3/8 Earth Gravity',
    distanceLabel: '225M km avg from Earth',
    accentColor: '#F59E0B',
  },
};

export const DECISION_CARDS: Record<string, DecisionCard> = {
  red_blue_led: {
    id: 'red_blue_led',
    title: 'Switch to Red & Blue LEDs',
    icon: 'led',
    description:
      'Tune greenhouse grow lights to only red and blue wavelengths that plant leaves absorb best, cutting wasted heat.',
    effects: { power: 16, bio: 12, shield: 0 },
    tag: 'NASA Veggie',
    scienceBite:
      'Plants reflect green light, which is why leaves look green! NASA ISS Veggie chambers shine mostly red and blue LEDs, saving electricity while fueling rapid photosynthesis.',
  },
  greywater_shield: {
    id: 'greywater_shield',
    title: 'Pump Greywater to Shield Walls',
    icon: 'water_wall',
    description:
      'Route recycled wash water into flexible bladder walls around the crew module to block space radiation.',
    effects: { power: 0, bio: -12, shield: 26 },
    tag: 'Radiation Wall',
    scienceBite:
      'Water molecules (H2O) are packed with tiny hydrogen atoms. When fast space radiation hits hydrogen, it scatters and slows down safely—making water one of NASA’s best radiation shields!',
  },
  harvest_spirulina: {
    id: 'harvest_spirulina',
    title: 'Run Spirulina Algae Bioreactor',
    icon: 'algae',
    description:
      'Power up bubbling green algae tanks to rapidly scrub crew CO2, release fresh oxygen, and grow protein-rich food.',
    effects: { power: -14, bio: 26, shield: 0 },
    tag: 'Bioreactor',
    scienceBite:
      'Microalgae like Spirulina grow faster than leafy vegetables and absorb huge amounts of carbon dioxide. Just a small tank can act like a mini forest inside a spacecraft!',
  },
  electrostatic_dust: {
    id: 'electrostatic_dust',
    title: 'Pulse Electrostatic Dust Shield',
    icon: 'dust_repeller',
    description:
      'Send high-voltage ripples across solar panels to shake off clinging dust, briefly drawing power from outer shield coils.',
    effects: { power: 24, bio: 0, shield: -10 },
    tag: 'Dust Clearing',
    scienceBite:
      'NASA’s Electrodynamic Dust Shield uses gentle electric waves to lift charged Moon and Mars dust right off solar glass without needing windshield wipers that would scratch it.',
  },
  solar_tracking: {
    id: 'solar_tracking',
    title: 'Angle Solar Wings Toward Horizon',
    icon: 'solar_tilt',
    description:
      'Use motorized gimbals to tilt solar arrays toward the low polar or dusty sun, using extra backup pump power from crops.',
    effects: { power: 22, bio: -8, shield: 0 },
    tag: 'Solar Array',
    scienceBite:
      'At the Lunar South Pole, the Sun skims right along the horizon! Vertical rotating solar towers capture sunlight at steep angles that flat rooftop panels would miss.',
  },
  regolith_berm: {
    id: 'regolith_berm',
    title: 'Pack Regolith Dirt Over Dome',
    icon: 'regolith',
    description:
      'Command a rover to scoop local Moon/Mars soil onto the habitat roof for thick physical radiation armor.',
    effects: { power: -12, bio: 0, shield: 24 },
    tag: 'ISRU Armor',
    scienceBite:
      'Launching heavy metal shields from Earth costs too much rocket fuel. Using local soil (regolith) with 3D-printed binders blocks both cosmic rays and tiny space rocks!',
  },
  aeroponic_mist: {
    id: 'aeroponic_mist',
    title: 'Activate Aeroponic Root Misters',
    icon: 'aeroponics',
    description:
      'Spray nutrient mist directly onto hanging plant roots, cutting water waste while speeding up lettuce and dwarf tomato growth.',
    effects: { power: -10, bio: 22, shield: 0 },
    tag: 'Hydroponics',
    scienceBite:
      'In aeroponics, roots hang in air and drink fine mist droplets. NASA uses this technique to grow crisp space veggies using up to 90% less water than Earth farms!',
  },
  sabatier_recovery: {
    id: 'sabatier_recovery',
    title: 'Boost Sabatier Water Recycler',
    icon: 'sabatier',
    description:
      'Combine crew carbon dioxide with hydrogen in the ECLSS reactor to bake brand-new drinking and plant water.',
    effects: { power: -12, bio: 20, shield: 6 },
    tag: 'NASA ECLSS',
    scienceBite:
      'On the International Space Station, NASA’s Sabatier system turns exhaled CO2 and hydrogen gas into pure liquid water—recycling over 98% of the crew’s water supply!',
  },
  active_mag_shield: {
    id: 'active_mag_shield',
    title: 'Charge Active Magnetic Deflector',
    icon: 'shield_pulse',
    description:
      'Channel strong solar electricity into superconducting coils around the crew dome to deflect incoming solar storm particles.',
    effects: { power: -16, bio: 0, shield: 28 },
    tag: 'Storm Defense',
    scienceBite:
      'Earth’s magnetic field shields us naturally from solar flares. Future Artemis habitats can generate small local magnetic bubbles during emergencies to steer charged particles away!',
  },
  battery_hibernation: {
    id: 'battery_hibernation',
    title: 'Dim Non-Essential Cabin Lights',
    icon: 'battery',
    description:
      'Put non-essential lab screens to sleep and store extra battery charge, giving the greenhouse a short cool rest period.',
    effects: { power: 20, bio: -6, shield: 0 },
    tag: 'Energy Reserve',
    scienceBite:
      'Just like night-time on Earth, space crops actually benefit from a brief dark rest phase where they convert daytime light energy into healthy roots and leaves.',
  },
  filter_flush: {
    id: 'filter_flush',
    title: 'Backflush Bio-Filter Pipes',
    icon: 'filter_flush',
    description:
      'Clear sticky algae buildup from hydroponic pipes using pressurized water from the outer thermal wall.',
    effects: { power: -6, bio: 22, shield: -6 },
    tag: 'ECLSS Plumbing',
    scienceBite:
      'In microgravity and low gravity, water clings to pipes and biofilms grow fast! Astronauts routinely inspect and clean ECLSS filters so oxygen and water keep flowing smoothly.',
  },
  myco_insulation: {
    id: 'myco_insulation',
    title: 'Grow Mycelium Wall Tiles',
    icon: 'myco',
    description:
      'Use fungal root fibers fed with plant scraps to grow tough, lightweight radiation and thermal wall insulation.',
    effects: { power: 0, bio: -8, shield: 22 },
    tag: 'Myco-Architecture',
    scienceBite:
      'NASA’s Myco-Architecture project studies growing mushroom mycelium bricks from agricultural waste—creating self-repairing habitat walls that block radiation and trap cozy heat!',
  },
};

export const SOL_EVENTS: Record<SiteId, SolEvent[]> = {
  lunar: [
    {
      sol: 1,
      title: 'Outpost Touchdown & First Light',
      summary:
        'Your Artemis BioHab has landed on Shackleton Crater Rim! Sunlight hits the solar wing, while cold vacuum draws heat from the walls.',
      hazardType: 'normal',
      passiveDelta: { power: 4, bio: -8, shield: -8 },
      botPrompt:
        'Welcome, Commander! Let’s balance our grow lights and check our outer radiation walls right away.',
      scienceContext:
        'Shackleton Crater’s rim gets nearly continuous sunlight, while nearby crater floors stay in permanent freezing shadow.',
    },
    {
      sol: 2,
      title: 'Lunar Regolith Dust Accumulation',
      summary:
        'Static-charged Moon dust kicked up by lander thrusters settles onto your solar glass, cutting electricity generation.',
      hazardType: 'dust',
      passiveDelta: { power: -14, bio: -6, shield: -6 },
      botPrompt:
        'Uh-oh! Sharp Moon dust is clinging to our solar panels like static socks from a dryer.',
      scienceContext:
        'Because the Moon has no wind or rain, lunar dust stays jagged like tiny glass shards and sticks tightly via static electricity.',
    },
    {
      sol: 3,
      title: 'Cryogenic Crater Shadow Chill',
      summary:
        'Freezing -170°C temperatures sweep across the rim, forcing habitat heaters and plant pumps to work overtime.',
      hazardType: 'cold_snap',
      passiveDelta: { power: -10, bio: -10, shield: -6 },
      botPrompt:
        'Brrr! Keeping our plants cozy at 22°C takes steady heater energy and good wall insulation.',
      scienceContext:
        'With no air to hold warmth, lunar temperatures swing dramatically between scorching sunlight and deep-freeze shadows.',
    },
    {
      sol: 4,
      title: 'Solar Coronal Mass Ejection (CME)',
      summary:
        'A burst of high-energy protons erupts from the Sun! Radiation slams into the outer habitat shield.',
      hazardType: 'solar_storm',
      passiveDelta: { power: 4, bio: -6, shield: -20 },
      botPrompt:
        'Solar storm incoming! Protect the crew and our plant DNA with water walls or magnetic shielding!',
      scienceContext:
        'Unlike Earth, the Moon has no global magnetic field. Astronauts rely on thick water walls, soil berms, and storm shelters during solar flares.',
    },
    {
      sol: 5,
      title: 'Peak Sunlight Harvest Window',
      summary:
        'Clear skies above the crater rim boost solar charging, though intense UV warms the greenhouse dome.',
      hazardType: 'normal',
      passiveDelta: { power: 8, bio: -10, shield: -8 },
      botPrompt:
        'Great sunlight today! Let’s turn extra electricity into fresh oxygen, crops, and stronger shielding.',
      scienceContext:
        'Plants need consistent light, CO2, and cooled water mist so leaves don’t overheat in an enclosed space greenhouse.',
    },
    {
      sol: 6,
      title: 'Greenhouse Algae Bloom & Filter Clog',
      summary:
        'Your Spirulina tanks surge with oxygen-making growth—great for air, but thick green algae clogs water recycler pipes!',
      hazardType: 'algae_bloom',
      passiveDelta: { power: -8, bio: -12, shield: -4 },
      botPrompt:
        'Our algae grew super fast! Let’s flush the hydroponic filters and keep our closed-loop water flowing.',
      scienceContext:
        'In closed-loop life support, microbes and algae grow quickly in warm nutrient tanks and must be harvested and filtered cleanly.',
    },
    {
      sol: 7,
      title: 'Micrometeorite Shower',
      summary:
        'Tiny pebble-sized space rocks traveling faster than a jet pepper the lunar surface, nicking the outer shield.',
      hazardType: 'micrometeorite',
      passiveDelta: { power: -6, bio: -6, shield: -16 },
      botPrompt:
        'Ping! Tiny micrometeorites tapped the hull. Let’s reinforce our shielding so the pressure stays tight!',
      scienceContext:
        'Without a thick atmosphere to burn up shooting stars, even sand-sized space dust strikes the Moon at 20 km per second.',
    },
    {
      sol: 8,
      title: 'Crater Rim Deep Shadow Crossing',
      summary:
        'A tall mountain peak blocks the low Sun! Solar panels drop into deep shadow, testing your stored battery power.',
      hazardType: 'deep_shadow',
      passiveDelta: { power: -18, bio: -8, shield: -6 },
      botPrompt:
        'The Sun dipped behind a crater peak! Save electricity with red/blue LEDs and smart power management.',
      scienceContext:
        'Near the Moon’s poles, mountains cast long shadows that can cut solar power for days at a time.',
    },
    {
      sol: 9,
      title: 'High-Yield Crop Harvest & Dust Drift',
      summary:
        'Your space lettuce and dwarf tomatoes are booming and drinking extra water, while rover tracks kick up fine dust.',
      hazardType: 'dust',
      passiveDelta: { power: -10, bio: -12, shield: -8 },
      botPrompt:
        'Almost at Sol 10! Hungry crops need water recycling, and dusty panels could use a quick zap.',
      scienceContext:
        'NASA astronauts on the ISS actually eat fresh space-grown red romaine lettuce and radishes from the Veggie habitat!',
    },
    {
      sol: 10,
      title: 'Final Sol: Artemis Supply Convoy Inbound',
      summary:
        'Solar wind gusts brush the shield one last time before the Artemis relief crew arrives at dawn. Hold steady!',
      hazardType: 'solar_storm',
      passiveDelta: { power: -6, bio: -8, shield: -14 },
      botPrompt:
        'Final Sol, Commander! Keep all three systems above zero and earn your Artemis Mission rank!',
      scienceContext:
        'Every day a closed-loop habitat survives on the Moon proves we can live sustainably far from Earth.',
    },
  ],
  mars: [
    {
      sol: 1,
      title: 'Jezero Crater Landing & Solar Check',
      summary:
        'Your BioHab touches down in an ancient Martian river delta! Distant sunlight is softer here, and cosmic rays trickle down.',
      hazardType: 'normal',
      passiveDelta: { power: -4, bio: -6, shield: -10 },
      botPrompt:
        'Touchdown on Mars! Notice how the Sun is farther away here, so every watt of electricity counts.',
      scienceContext:
        'Mars orbits 1.5 times farther from the Sun than Earth, receiving less than half as much sunlight per square meter.',
    },
    {
      sol: 2,
      title: 'Martian Iron-Oxide Dust Accumulation',
      summary:
        'Rust-red dust devils swirl across Jezero Crater, coating your solar wings in fine reddish powder.',
      hazardType: 'dust',
      passiveDelta: { power: -14, bio: -6, shield: -8 },
      botPrompt:
        'Red dust alert! Martian dust dims solar panels fast—let’s shake it off or optimize our LED energy.',
      scienceContext:
        'NASA’s InSight lander and Opportunity rover both lost power when fine Martian iron-oxide dust coated their solar arrays.',
    },
    {
      sol: 3,
      title: 'Thin-Air Radiation & Dry Chill',
      summary:
        'Mars’s thin CO2 air offers little protection from cosmic rays, and freezing night winds pull heat from the greenhouse.',
      hazardType: 'cold_snap',
      passiveDelta: { power: -8, bio: -8, shield: -12 },
      botPrompt:
        'Mars air is 100 times thinner than Earth’s, so radiation gets through more easily. Let’s beef up our walls!',
      scienceContext:
        'Mars lacks a strong global magnetic field and thick ozone layer, exposing surface crews to continuous galactic cosmic rays.',
    },
    {
      sol: 4,
      title: 'Solar Coronal Mass Ejection (CME)',
      summary:
        'A powerful solar flare races past Mars, spiking surface radiation across the crew living module and greenhouse.',
      hazardType: 'solar_storm',
      passiveDelta: { power: -2, bio: -6, shield: -20 },
      botPrompt:
        'Solar flare hitting Jezero Crater! Divert greywater into the shield walls or fire up magnetic coils!',
      scienceContext:
        'During intense solar particle events, NASA forecasts space weather so Mars crews can shelter behind water tanks and soil berms.',
    },
    {
      sol: 5,
      title: 'Dry Regolith Perchlorate Cleanup',
      summary:
        'Filtering salty Martian soil dust out of airlocks strains your water recyclers and life-support pumps.',
      hazardType: 'normal',
      passiveDelta: { power: -8, bio: -12, shield: -6 },
      botPrompt:
        'Keeping Martian dirt out of our clean greenhouse takes extra water recycling and filtration!',
      scienceContext:
        'Real Mars dirt contains salts called perchlorates, so NASA habitats use strict airlocks and closed hydroponic water loops.',
    },
    {
      sol: 6,
      title: 'Greenhouse Algae Bloom & Filter Clog',
      summary:
        'Warm red/blue grow lights spark an energetic Spirulina algae bloom—boosting O2, while thick algae clogs water filters!',
      hazardType: 'algae_bloom',
      passiveDelta: { power: -8, bio: -14, shield: -4 },
      botPrompt:
        'Whoa, super-active algae! Flush those filters and keep our Sabatier water loop humming.',
      scienceContext:
        'NASA studies photosynthetic algae bioreactors because they produce oxygen and edible biomass in tight spacecraft quarters.',
    },
    {
      sol: 7,
      title: 'High-Altitude Ice Cloud & Cosmic Rays',
      summary:
        'Thin Martian ice clouds scatter sunlight while energetic cosmic rays from deep space chip away at shield integrity.',
      hazardType: 'micrometeorite',
      passiveDelta: { power: -10, bio: -6, shield: -14 },
      botPrompt:
        'Hazy sky today! Tilt those solar arrays and pack some Martian soil onto our dome roof.',
      scienceContext:
        'Mars’s carbon dioxide and water-ice clouds reflect incoming sunlight, lowering solar power while cosmic rays still pass through.',
    },
    {
      sol: 8,
      title: 'Regional Martian Dust Storm',
      summary:
        'A towering orange dust storm darkens Jezero Crater’s sky into twilight, slashing solar power generation!',
      hazardType: 'deep_shadow',
      passiveDelta: { power: -18, bio: -8, shield: -8 },
      botPrompt:
        'Dust storm twilight! Time to run Red/Blue LEDs, clear panels, or conserve cabin power!',
      scienceContext:
        'Martian dust storms can grow as big as continents and dim sunlight for weeks, making low-power LED agriculture essential.',
    },
    {
      sol: 9,
      title: 'Post-Storm Cleanup & Crop Surge',
      summary:
        'As winds calm, heavy dust coats the solar wings and flowering space crops demand extra water and nutrients.',
      hazardType: 'dust',
      passiveDelta: { power: -10, bio: -12, shield: -8 },
      botPrompt:
        'The storm is clearing! Let’s feed our crops with aeroponic mist and recharge our power banks.',
      scienceContext:
        'Aeroponic misting cuts plant water use dramatically, helping crews bounce back right after power-saving dust storms.',
    },
    {
      sol: 10,
      title: 'Final Sol: Mars Ascent Beacon Active',
      summary:
        'Final Sol check before crew rotation! Static winds and radiation test every subsystem one last time.',
      hazardType: 'solar_storm',
      passiveDelta: { power: -8, bio: -8, shield: -14 },
      botPrompt:
        'One last Sol on Mars, Commander! Balance your power, plants, and shielding to complete the mission!',
      scienceContext:
        'Surviving 10 Sols in Jezero Crater demonstrates the exact closed-loop biology NASA plans for future Mars explorers.',
    },
  ],
};

// Curated 4-card decision hands per Sol so every turn presents meaningful, educational trade-offs
export const SOL_CARD_SETS: Record<number, [string, string, string, string]> = {
  1: ['red_blue_led', 'greywater_shield', 'harvest_spirulina', 'regolith_berm'],
  2: ['electrostatic_dust', 'red_blue_led', 'aeroponic_mist', 'myco_insulation'],
  3: ['solar_tracking', 'sabatier_recovery', 'myco_insulation', 'harvest_spirulina'],
  4: ['active_mag_shield', 'greywater_shield', 'red_blue_led', 'solar_tracking'],
  5: ['harvest_spirulina', 'regolith_berm', 'battery_hibernation', 'sabatier_recovery'],
  6: ['filter_flush', 'sabatier_recovery', 'electrostatic_dust', 'active_mag_shield'],
  7: ['regolith_berm', 'solar_tracking', 'aeroponic_mist', 'greywater_shield'],
  8: ['red_blue_led', 'battery_hibernation', 'electrostatic_dust', 'myco_insulation'],
  9: ['aeroponic_mist', 'electrostatic_dust', 'sabatier_recovery', 'regolith_berm'],
  10: ['active_mag_shield', 'harvest_spirulina', 'solar_tracking', 'greywater_shield'],
};

export function diagnoseFailure(failedKey: ResourceKey, site: SiteId): FailureDiagnosis {
  const siteWord = site === 'lunar' ? 'Moon' : 'Mars';
  if (failedKey === 'power') {
    return {
      failedResource: 'power',
      title: 'Solar & Battery Grid Depleted',
      cascadeExplanation:
        'Your habitat ran out of electricity! Without power for the Red/Blue LED grow lights, water pumps, and heaters, your greenhouse plants stopped making oxygen.',
      tip: 'Try switching to Red & Blue LEDs or using the Electrostatic Dust Shield early when dust settles on your solar wings.',
    };
  }
  if (failedKey === 'bio') {
    return {
      failedResource: 'bio',
      title: 'Bio-Life Support Loop Paused',
      cascadeExplanation:
        'Greenhouse crops and algae tanks ran too low on water and nutrients. Without healthy plants scrubbing CO2 and producing oxygen, the crew entered emergency reserve mode.',
      tip: 'Watch out when pumping greywater into radiation walls—balance it with Spirulina Algae, Aeroponic Misters, or the Sabatier Water Recycler!',
    };
  }
  return {
    failedResource: 'shield',
    title: 'Radiation Shielding Below Safe Threshold',
    cascadeExplanation: `High-energy solar particles and ${siteWord} cosmic rays breached the outer protection threshold, putting both astronaut cells and delicate greenhouse plant DNA at risk.`,
    tip: 'Prioritize Greywater Shield Walls, Regolith Berms, or the Active Magnetic Deflector especially on Solar Storm Sols!',
  };
}

export const NASA_SOURCES = [
  {
    id: 'veggie',
    title: 'NASA Veggie & Advanced Plant Habitat (ISS)',
    subtitle: 'Photosynthesis & LED Wavelength Engineering',
    summary:
      'Aboard the International Space Station, NASA grows red romaine lettuce, zinnias, and chili peppers inside enclosed chambers using tuned red (660 nm) and blue (450 nm) LEDs.',
    facts: [
      'Chlorophyll absorbs red and blue light most efficiently and reflects green light—so glowing purple-pink chambers save huge electrical power.',
      'Plants absorb astronaut-exhaled carbon dioxide (CO2) and release fresh oxygen (O2) and clean transpired water vapor.',
      'Aeroponic misting and capillary mats deliver water directly to roots in low gravity without drowning them.',
    ],
  },
  {
    id: 'eclss',
    title: 'NASA ECLSS (Environmental Control & Life Support)',
    subtitle: 'Closed-Loop Water & Oxygen Recycling',
    summary:
      'Every kilogram of water launched to the Moon or Mars costs tremendous rocket fuel. NASA’s ECLSS recycles almost all air and water inside the habitat.',
    facts: [
      'The Sabatier Reactor combines waste CO2 with hydrogen to produce fresh liquid water and methane.',
      'Water recovery systems capture cabin humidity, shower greywater, and plant transpiration so nearly 98% of water stays in the loop.',
      'Algae bioreactors like Spirulina offer fast CO2 scrubbing plus nutritious protein, though filters must be cleaned regularly.',
    ],
  },
  {
    id: 'artemis',
    title: 'NASA Artemis Lunar South Pole & Mars Exploration',
    subtitle: 'Dust Mitigation, Sunlight & Radiation Walls',
    summary:
      'Surviving on the Moon or Mars means adapting to extreme environments where air, warmth, and protection must all be engineered.',
    facts: [
      'Water (H2O) and polyethylene plastics are rich in hydrogen atoms, which scatter dangerous solar protons better than heavy lead!',
      'At Shackleton Crater on the Moon, vertical solar arrays catch low horizon sunlight, while electrostatic shields repel jagged static dust.',
      'On Mars, global dust storms cut sunlight by over 80%, making low-power LED farming and soil (regolith) radiation berms vital.',
    ],
  },
];
