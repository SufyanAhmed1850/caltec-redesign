export const site = {
  name: 'CALTEC Instrument Services Co',
  short: 'CALTEC',
  tagline: 'Precision that keeps industry moving.',
  description:
    'Traceable, ISO-certified calibration, instrumentation support and thermal validation for pharma, manufacturing, energy and food industries across Pakistan. Based in Korangi, Karachi since 2014.',
  founded: 2014,
  url: 'https://caltec.com.pk',
  address: {
    lines: ['Office 203, 2nd Floor, Building LS-1', 'Plot S/T-3/1, Sector 15', 'Korangi Industrial Area, Karachi'],
    poBox: 'PO Box 8271',
    map: 'https://www.google.com/maps/search/?api=1&query=Sector+15+Korangi+Industrial+Area+Karachi',
  },
  contact: 'Shafqat Khan',
  phones: {
    mobile: { label: '+92 333 22 83557', href: 'tel:+923332283557' },
    landline: { label: '+92 21 35167530', href: 'tel:+922135167530' },
    fax: { label: '+92 21 35167999', href: 'tel:+922135167999' },
    whatsapp: { label: '+92 300 8213260', href: 'https://wa.me/923008213260' },
  },
  emails: {
    info: 'info@caltec.com.pk',
    sales: 'sales@caltec.com.pk',
    calibration: 'calibration@caltec.com.pk',
  },
  linkedin: 'https://pk.linkedin.com/company/caltec-instrument-services-co',
};

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Certification', href: '/certification/' },
  { label: 'Profile', href: '/business-profile/' },
  { label: 'Journal', href: '/blog/' },
  { label: 'Contact', href: '/contact-us/' },
];

export type Service = {
  slug: string;
  index: string;
  name: string;
  short: string;
  kicker: string;
  lede: string;
  body: string[];
  parameters: string[];
  image: string;
  instruments: string[];
};

const uniq = (list: string[]) =>
  Array.from(new Map(list.map((i) => [i.toLowerCase().replace(/\s+/g, ' ').trim(), i.trim()])).values());

export const services: Service[] = [
  {
    slug: 'pressure-calibration',
    index: '01',
    name: 'Pressure Calibration',
    short: 'Pressure',
    kicker: 'Gauges · transmitters · switches · standards',
    lede: 'From vacuum to hydraulic gauges rated up to 400 bar, we verify every pressure point your process depends on.',
    body: [
      'Pressure is the heartbeat of a process line. A drifting gauge or transmitter quietly erodes product quality, energy efficiency and safety margins long before an alarm ever trips.',
      'Our technicians calibrate pressure, vacuum and compound instruments against traceable reference standards — on site at your plant or in our Karachi workshop — and hand over certificates that capture every as-found and as-left reading.',
    ],
    parameters: ['Vacuum to 400 bar', 'Gauge · absolute · differential', 'Dead-weight referenced', 'As-found / as-left data'],
    image: '/images/refinery-night.jpg',
    instruments: uniq([
      'Pressure, Vacuum & Compound Gauges', 'Pressure Calibrators', 'Pressure Switches', 'Pressure Transmitters', 'Pressure Transducers',
      'Pressure Chart Recorders', 'Dead Weight Testers', 'Differential Pressure Gauges', 'Anemometers', 'Air Velocity Meters', 'Barometers',
      'Digital Pressure Gauges', 'Flow Transmitters', 'Gram Gauges', 'High Pressure Gauges', 'Low Pressure Gauges', 'Hook Gauges', 'Manometers',
      'Air / Mass Flow Meters', 'Pressure Recorders', 'Vacuum Gauges', 'Vacuum Switches', 'Turbine Meters', 'Speed Meters', 'RPM Meters',
      'Medical Device Mass Flow Instruments', 'NDT — Non-Destructive Testing',
    ]),
  },
  {
    slug: 'temperature-calibration',
    index: '02',
    name: 'Temperature Calibration',
    short: 'Temperature',
    kicker: 'Sensors · controllers · chambers · baths',
    lede: 'Sensors, controllers, ovens, freezers and everything in between — calibrated so every degree reads true.',
    body: [
      'In pharmaceuticals, food and healthcare a single degree can decide whether a batch is released or rejected. Temperature instruments deserve the same rigour as the products they protect.',
      'We calibrate RTDs, thermocouples, transmitters, indicators and complete thermal equipment using liquid baths and dry-block references, with multi-point comparisons documented for your auditors.',
    ],
    parameters: ['RTD · thermocouple · IR', 'Liquid bath & dry block', 'Multi-point comparison', 'Controllers & chambers'],
    image: '/images/refinery-dusk.jpg',
    instruments: uniq([
      'Temperature Controllers / Indicators', 'Temperature Sensors (RTD, Thermocouple)', 'Temperature Transmitters', 'Temperature Calibrators (Liquid & Dry Block)',
      'Temperature Recorders (Chart / Digital)', 'Thermo Switches / Thermostats', 'Thermometers (Glass, Digital, Wet & Dry, IR)', 'Hot Air Ovens', 'Muffle Furnaces',
      'Water Baths', 'Incubators', 'Refrigerators', 'Deep Freezers', 'Analog Gauges', 'Bi-Metal Thermometers', 'Chart Recorders', 'Chambers', 'Digital Thermometers',
      'Digital Temperature Indicators', 'Dry Blocks', 'Data Loggers', 'Furnaces', 'Freezers', 'Glass Thermometers', 'Heating Baths / Blocks', 'Infrared Thermometers',
      'Ovens', 'Oil Baths', 'PRTs', 'Partial Immersion Thermometers', 'Pyrometers', 'RTD Thermometers', 'Sterilizers', 'Surface Thermometers',
      'Thermocouple Thermometers', 'Thermocouple Probes', 'Temperature Gauges', 'Temperature Switches', 'Temperature Transducers', 'Thermistor Probes',
      'Temperature Pen Recorders', 'Thermo-hygrographs', 'Thermo-hygrometers', 'Temperature & Humidity Meters', 'Total-Immersion Glass Thermometers',
    ]),
  },
  {
    slug: 'electrical-calibration',
    index: '03',
    name: 'Electrical Calibration',
    short: 'Electrical',
    kicker: 'Test · measurement · power · control',
    lede: 'Multimeters to oscilloscopes, insulation testers to hi-pot sets — electrical measurement you can sign off on.',
    body: [
      'Electrical test equipment is what your maintenance team trusts to keep people and plant safe. If it reads wrong, every decision downstream inherits the error.',
      'We verify voltage, current, resistance, frequency and power functions across handheld, bench and process instruments, with results traceable to recognised standards.',
    ],
    parameters: ['V · A · Ω · Hz · W', 'Loop & process signals', 'Insulation & earth', 'High-voltage testers'],
    image: '/images/plant-wide.jpg',
    instruments: uniq([
      'Digital Multimeters', 'Multi-Function Calibrators', 'Clamp Meters', 'Ammeters / Voltmeters', 'Loop Calibrators', 'Insulation Testers',
      'Non-contact Tachometers', 'AC/DC Power Supplies', 'Analogue & Digital Meters', 'Earth Testers', 'Decade Resistance Boxes', 'Clamp-On Hi Testers',
      'Capacitance Boxes', 'Current Probes', 'Current Clamps', 'Digital Earth Testers', 'Energy Meters', 'Function Generators', 'Frequency Meters',
      'Frequency Counters', 'High Voltage Generators', 'High Voltage Probes', 'Hi-Pot Testers', 'Induction Boxes', 'LCR Meters', 'Loggers',
      'Multi-Function Meters', 'Megohmmeters', 'Milliohmmeters', 'Oscilloscopes', 'Phase Detectors', 'Phase Indicators', 'Power Meters',
      'Power Supply Functions', 'Resistivity Meters', 'RCD Meters', 'System Controls', 'Scope Meters', 'Timers', 'Volt Meters',
    ]),
  },
  {
    slug: 'mechanical-calibration',
    index: '04',
    name: 'Mechanical Calibration',
    short: 'Mechanical',
    kicker: 'Mass · force · torque · hardness',
    lede: 'Balances, weights, torque tools and hardness testers — the physical measurements behind every spec sheet.',
    body: [
      'Weighing and force instruments sit at the centre of formulation, packaging and assembly. Small errors multiply quickly across thousands of units.',
      'We calibrate balances and weight sets, load cells, torque wrenches and hardness testers, and check rotational speed instruments — all documented for ISO and GMP environments.',
    ],
    parameters: ['Balances & weight sets', 'Load cells & force', 'Torque tools', 'Hardness & RPM'],
    image: '/images/refinery-night.jpg',
    instruments: uniq([
      'Weighing Balances', 'Weights / Weight Boxes', 'Standard Weights', 'Masses', 'Cable Tension Meters', 'Durometers', 'Force Gauges', 'Gram Gauges',
      'Hardness Machines', 'Hardness Meters', 'Load Cells', 'Push / Pull Gauges', 'Pocket Balances', 'RPM Meters', 'Rubber Hardness Testers',
      'Spring Balances', 'Speed Indicators', 'Stroboscopes', 'Tension Gauges', 'Tachometers', 'Torque Drivers', 'Torque Checkers', 'Torque Dials',
      'Torque Gauges', 'Torque Wrenches',
    ]),
  },
  {
    slug: 'precision-calibration',
    index: '05',
    name: 'Precision Calibration',
    short: 'Precision',
    kicker: 'Dimensional · gauges · GD&T checks',
    lede: 'Micron-level dimensional metrology — calipers, micrometers, gauge blocks and drawing verification.',
    body: [
      'Dimensional accuracy is the difference between a part that fits and a line that stops. Hand tools wear, get dropped and drift, often without anyone noticing.',
      'Our precision lab covers the full range of dimensional instruments, plus measurement checks of jigs and fixtures against drawings using geometric dimensioning and tolerancing.',
    ],
    parameters: ['Micron-level checks', 'Gauge blocks & rings', 'Optical & vision systems', 'GD&T drawing verification'],
    image: '/images/plant-wide.jpg',
    instruments: uniq([
      'Vernier Calipers', 'Micrometers', 'Dial Gauges (Plunger / Lever / Bore)', 'Measuring Tapes', 'V Blocks', 'Steel Rulers', 'Bore Gauges', 'Bevel Protractors',
      'Bubble Level Gauges', 'Carpenter Tapes', 'Circumferential Tapes', 'Caliper Gauges', 'Coating & Thickness Gauges', 'Check Masters', 'Caliper Checkers',
      'Crimping Tools', 'Carpenter’s Level Gauges', 'Dial Test Indicators', 'Dial Slide Calipers', 'Dial Indicators', 'Dial Calibrators', 'Digimatic Calipers',
      'Depth Calipers', 'Depth Gauges', 'Depth Micrometers', 'Depth Micro Checkers', 'Digimatic Micrometers', 'Digital Level Gauges', 'Electrical Comparators',
      'Extension Rods & Anvils', 'External Micrometers', 'Exchangeable Micrometers', 'Film Applicators', 'Fineness Gauges', 'Feeler Gauges', 'Gauge Blocks',
      'Glass Scales', 'Hook Tapes', 'Horizontal Metroscopes', 'Height Setting Micrometers', 'Internal Jaw Micrometers', 'Inclinometers',
      'Interchangeable Micrometers', 'Lupe Scales', 'Lever Probe Indicators', 'GD&T Measurement Checks', 'Jig & Fixture Checks Against Drawing',
      'Micrometer Heads', 'Micro Indicators', 'Mu Checkers', 'Millitrons', 'Mini Horizontals', 'Optical Flats', 'Optical Parallels', 'Optical Comparators',
      'Precision Test Indicators', 'PI Tapes', 'Plastic Rulers', '3-Point Internal Micrometers', 'Pocket Thickness Gauges', 'Plain Plug Gauges', 'Pin Gauges',
      'Plain Ring Gauges', 'Parallel Screw Gauges', 'Perforated Plates', 'Pendulums', 'Riser Blocks', 'Standard Rods', 'Surveyor Tapes',
      'Stage Micrometer Scales', 'Slide Calipers', 'Stick & Tubular Inside Micrometers', 'Surface Profile Gauges', 'Super Micrometers', 'Spirit Level Gauges',
      'Eye Lupes', 'Tank Gauging Tapes', 'Toolmaker Microscopes', 'Thread Ring Gauges', 'Ultrasonic Thickness Gauges', 'Universal Length Machines',
      'Vernier Depth Calipers', 'Vertical Height Gauges', 'Vertical Linear Height Gauges', 'Vision Measurement Machines', 'Video Measuring Systems',
      'Wet & Dry Film Thickness Gauges', 'Working Gauge Blocks', 'Woven Wire Cloth',
    ]),
  },
  {
    slug: 'flow-meter-calibration',
    index: '06',
    name: 'Flow Meter Calibration',
    short: 'Flow',
    kicker: 'Liquid · gas · steam flow',
    lede: 'Electromagnetic, turbine, vortex and thermal mass meters — verified so every litre is accounted for.',
    body: [
      'Flow meters decide how much raw material goes into a batch and how much product leaves the gate. A few percent of error becomes real money very quickly.',
      'We verify meter type and application, installation, zero-flow baselines and reference traceability before calibrating, so the result reflects how the meter behaves in your process.',
    ],
    parameters: ['Liquid · gas · steam', 'Zero-flow baselining', 'Installation checks', 'Traceable references'],
    image: '/images/refinery-dusk.jpg',
    instruments: uniq([
      'Electromagnetic Flow Meters', 'Turbine Flow Meters', 'Thermal Mass Flow Meters', 'Vortex Flow Meters', 'Calorimetric Mass Flow Meters',
      'Glass Rotameters', 'Orifice Flow Meters',
    ]),
  },
  {
    slug: 'thermal-mapping-validation',
    index: '07',
    name: 'Thermal Mapping & Validation',
    short: 'Thermal mapping',
    kicker: 'Qualification of controlled environments',
    lede: 'Multi-sensor mapping that proves your sterilisers, chambers, cold rooms and warehouses hold spec — everywhere, all the time.',
    body: [
      'A controlled environment is only as good as its worst corner. Thermal mapping reveals hot and cold spots that a single controller sensor will never see.',
      'We deploy calibrated data loggers across the working volume, run the study over the required duration and deliver a validation report ready for GMP and regulatory review.',
    ],
    parameters: ['Multi-point loggers', 'Hot / cold spot analysis', 'GMP-ready reports', 'Empty & loaded studies'],
    image: '/images/plant-wide.jpg',
    instruments: uniq([
      'Dry Heat Sterilizers', 'Autoclaves', 'Steam Sterilizers', 'Ovens', 'Stability Chambers', 'Humidity Chambers', 'Incubators', 'Tray Dryers',
      'Warehouses', 'Cold Rooms',
    ]),
  },
];

export const instrumentCount = services.reduce((n, s) => n + s.instruments.length, 0);

export const industries = [
  { name: 'Pharmaceutical', note: 'GMP-grade calibration & validation' },
  { name: 'Hospitals & Healthcare', note: 'Medical and lab equipment' },
  { name: 'Oil & Gas', note: 'Process pressure & flow' },
  { name: 'Textiles', note: 'Mills, dyeing & finishing' },
  { name: 'Food & Dairy', note: 'Temperature-critical processing' },
  { name: 'Cement', note: 'Kilns, drives & heavy duty' },
  { name: 'Fertiliser & Chemical', note: 'Hazardous process control' },
  { name: 'Power Generation', note: 'Plant controls & monitoring' },
  { name: 'Automotive', note: 'Dimensional & torque' },
  { name: 'Paper & Packaging', note: 'Line instrumentation' },
];

export const clients: { name: string; file: string }[] = [
  'Abbott', 'Aga Khan University', 'AJM Pharma', 'Alkaram', 'Archroma', 'Artistic Milliners', 'Artmill', 'Aspin Pharma', 'Atlas Autos', 'Avari',
  'Brookes', 'Changan', 'Community World Service Asia', 'Dalda', 'Energy Future', 'Feroze 1888', 'FPCL', "Gerry's dnata", 'Ghani', 'GSK', 'Haleon',
  'Herbion', 'Hilal', 'Hilton Pharma', 'Hoechst', 'Indigo', 'Indus Pharma', 'International Textile', 'Ismail Industries', 'Izhar Group', 'Lucky Core',
  'Lucky Motor Corporation', 'Lucky Textile Mills', 'Matco Foods', 'Medzntech', 'Mezrab', 'MN Textiles', 'Multitek Engineering', 'Oncogen', 'Otsuka',
  'PAEPL', 'Pak Gum', 'Pharmdic', 'Power Cement', 'Printech', 'Rajby', 'Rizwan Enterprises', 'SCADA Industries', 'Scilife', 'SGS', 'Soorty', 'Stile',
  'TCS', 'US Group', 'Zedco',
].map((name) => ({
  name,
  file: `/images/clients/${name.replace(/'/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`,
}));

export const process = [
  { n: '01', title: 'Define', text: 'Share your instrument list, ranges, location and turnaround. We clarify scope before we promise anything.' },
  { n: '02', title: 'Plan', text: 'We confirm the reference standards, method and route — on site, in our Karachi lab, or both.' },
  { n: '03', title: 'Calibrate', text: 'Certified technicians complete the work under documented quality controls, recording as-found and as-left data.' },
  { n: '04', title: 'Close the loop', text: 'You receive traceable certificates and records organised for your quality system and next audit.' },
];

export const isoCerts = [
  { code: 'ISO 9001', year: '2015', area: 'Quality', title: 'Quality Management System', file: 'iso-9001' },
  { code: 'ISO 14001', year: '2015', area: 'Environment', title: 'Environmental Management System', file: 'iso-14001' },
  { code: 'ISO 45001', year: '2018', area: 'Health & Safety', title: 'Occupational Health & Safety', file: 'iso-45001' },
];
