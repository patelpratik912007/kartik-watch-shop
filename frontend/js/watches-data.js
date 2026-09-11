/**
 * Kartik Watch Shop — Master Watch Catalog Data (31 Watches)
 * Exact Distribution:
 *   - Seiko:           3 Men's + 2 Women's  =  5 total
 *   - Citizen:         3 Men's + 1 Women's  =  4 total
 *   - Tissot:          4 Men's + 2 Women's  =  6 total
 *   - Casio & G-Shock: 5 Men's + 5 Women's  = 10 total
 *   - Hamilton:        3 Men's + 3 Women's  =  6 total
 * Total: 31 Timepieces
 */

const WATCH_CATALOG = [

  // ══════════════════════════════════════════════════════════════════
  // SEIKO — 3 MEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 1,
    name: "Seiko Prospex Speedtimer",
    brand: "seiko",
    category: "seiko-mens",
    gender: "male",
    price: 68000,
    rating: 5.0,
    specs: "39mm • Solar Chrono Cal. V192",
    desc: "Solar-powered precision racing chronograph with tachymeter bezel, 100m water resistance, and curved sapphire crystal.",
    image: "assets/watches/seiko/speedtimer.jpg",
    badge: "SEIKO • JAPAN"
  },
  {
    id: 2,
    name: "Seiko Prospex King Samurai Diver",
    brand: "seiko",
    category: "seiko-mens",
    gender: "male",
    price: 54000,
    rating: 4.9,
    specs: "43.8mm • Auto Cal. 4R35 • 200m ISO",
    desc: "Iconic angular diver with waffle pattern dial, ceramic bezel, 200m ISO certification, and LumiBrite hands.",
    image: "assets/watches/seiko/diver.jpg",
    badge: "SEIKO • DIVER"
  },
  {
    id: 3,
    name: "Seiko Presage Sharp Edged Series",
    brand: "seiko",
    category: "seiko-mens",
    gender: "male",
    price: 88000,
    rating: 5.0,
    specs: "39.3mm • Cal. 6R35 • 70h Reserve",
    desc: "Traditional Japanese Asanoha hemp-leaf textured dial, 70-hour power reserve, and super-hard coating.",
    image: "assets/watches/seiko/presage.jpg",
    badge: "SEIKO • PRESAGE"
  },

  // ══════════════════════════════════════════════════════════════════
  // SEIKO — 2 WOMEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 4,
    name: "Seiko Lukia Solar Diamond Ladies",
    brand: "seiko",
    category: "seiko-womens",
    gender: "female",
    price: 48000,
    rating: 5.0,
    specs: "28mm • Solar Quartz Cal. V137",
    desc: "Fluted bezel in rose gold tone, genuine diamond markers on an iridescent mother-of-pearl dial, sapphire glass.",
    image: "assets/watches/seiko/lukia.jpg",
    badge: "SEIKO • JAPAN"
  },
  {
    id: 5,
    name: "Seiko Presage Cocktail Time Bellini",
    brand: "seiko",
    category: "seiko-womens",
    gender: "female",
    price: 42000,
    rating: 4.8,
    specs: "33.8mm • Auto Cal. 4R35",
    desc: "Sunburst guilloche dial inspired by Tokyo cocktail culture, box-shaped crystal, and exhibition case back.",
    image: "assets/watches/seiko/cocktail.jpg",
    badge: "SEIKO • ELEGANCE"
  },

  // ══════════════════════════════════════════════════════════════════
  // CITIZEN — 3 MEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 6,
    name: "Citizen Promaster Skyhawk A-T",
    brand: "citizen",
    category: "citizen-mens",
    gender: "male",
    price: 58000,
    rating: 5.0,
    specs: "45mm • Eco-Drive Atomic U680",
    desc: "Radio-controlled atomic timekeeping in 43 cities, perpetual calendar chronograph powered by any light.",
    image: "assets/watches/citizen/skyhawk.jpg",
    badge: "CITIZEN • ECO-DRIVE"
  },
  {
    id: 7,
    name: "Citizen Promaster Marine Mechanical Diver",
    brand: "citizen",
    category: "citizen-mens",
    gender: "male",
    price: 62000,
    rating: 4.9,
    specs: "41mm • Auto Cal. 9051 • 200m ISO",
    desc: "Super Titanium magnetic-resistant automatic diver with 200m ISO rating and high-luminosity indices.",
    image: "assets/watches/citizen/marine.jpg",
    badge: "CITIZEN • DIVER"
  },
  {
    id: 8,
    name: "Citizen Series 8 Automatic 831",
    brand: "citizen",
    category: "citizen-mens",
    gender: "male",
    price: 95000,
    rating: 4.9,
    specs: "40mm • Cal. 9051 • Anti-Magnetic",
    desc: "Sleek geometric case with octagonal bezel, high-beat anti-magnetic automatic movement, and sapphire crystal.",
    image: "assets/watches/citizen/series8.jpg",
    badge: "CITIZEN • SERIES 8"
  },

  // ══════════════════════════════════════════════════════════════════
  // CITIZEN — 1 WOMEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 9,
    name: "Citizen L Ambiluna Eco-Drive",
    brand: "citizen",
    category: "citizen-womens",
    gender: "female",
    price: 36000,
    rating: 4.9,
    specs: "31mm • Eco-Drive Cal. E031",
    desc: "Poetic minimalist luxury with frosted moon sapphire glass, urushi drop emblem, and sustainably powered by light.",
    image: "assets/watches/citizen/ambiluna.jpg",
    badge: "CITIZEN • ECO-DRIVE"
  },

  // ══════════════════════════════════════════════════════════════════
  // TISSOT — 4 MEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 10,
    name: "Tissot PRX Chrono Automatic",
    brand: "tissot",
    category: "tissot-mens",
    gender: "male",
    price: 155000,
    rating: 4.9,
    specs: "42mm • Valjoux A05.H31 • 60h",
    desc: "Integrated bracelet chronograph with blue panda dial, 60-hour power reserve, and transparent case back.",
    image: "assets/watches/tissot/prx.jpg",
    badge: "TISSOT • SWISS"
  },
  {
    id: 11,
    name: "Tissot Seastar 1000 Powermatic 80",
    brand: "tissot",
    category: "tissot-mens",
    gender: "male",
    price: 72000,
    rating: 4.8,
    specs: "43mm • Powermatic 80 • 300m",
    desc: "Professional 300m Swiss dive watch with unidirectional ceramic bezel and Nivachron balance spring.",
    image: "assets/watches/tissot/seastar.jpg",
    badge: "TISSOT • SWISS"
  },
  {
    id: 12,
    name: "Tissot T-Touch Connect Solar",
    brand: "tissot",
    category: "tissot-mens",
    gender: "male",
    price: 88000,
    rating: 4.8,
    specs: "47mm • Solar Smart • Titanium",
    desc: "Swiss-made solar hybrid smartwatch with tactile sapphire touchscreen, activity tracker, and 6-month battery.",
    image: "assets/watches/tissot/ttouch.jpg",
    badge: "TISSOT • SMART"
  },
  {
    id: 13,
    name: "Tissot Gentleman Powermatic 80 Silicium",
    brand: "tissot",
    category: "tissot-mens",
    gender: "male",
    price: 68000,
    rating: 4.8,
    specs: "40mm • Powermatic 80 Silicium",
    desc: "Versatile gentleman's Swiss automatic with anti-magnetic silicon hairspring and crosshair blue dial.",
    image: "assets/watches/tissot/gentleman.jpg",
    badge: "TISSOT • SWISS"
  },

  // ══════════════════════════════════════════════════════════════════
  // TISSOT — 2 WOMEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 14,
    name: "Tissot Bellissima Small Lady",
    brand: "tissot",
    category: "tissot-womens",
    gender: "female",
    price: 38500,
    rating: 4.9,
    specs: "29mm • Swiss Quartz • Guilloche",
    desc: "Timeless Roman numerals, silver guilloche rosette dial, and cabochon crown for day-to-night Swiss grace.",
    image: "assets/watches/tissot/celestia.jpg",
    badge: "TISSOT • ELEGANCE"
  },
  {
    id: 15,
    name: "Tissot Flamingo Two-Tone",
    brand: "tissot",
    category: "tissot-womens",
    gender: "female",
    price: 32000,
    rating: 4.7,
    specs: "30mm • ETA Swiss Quartz",
    desc: "Jewelry watch with asymmetric lugs, iridescent mother-of-pearl dial, and yellow gold PVD bicolour bracelet.",
    image: "assets/watches/tissot/flamingo.jpg",
    badge: "TISSOT • SWISS"
  },

  // ══════════════════════════════════════════════════════════════════
  // CASIO & G-SHOCK — 5 MEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 16,
    name: "Casio G-Shock MT-G Carbon Titanium",
    brand: "casio",
    category: "casio-smart-mens",
    gender: "male",
    price: 79999,
    rating: 4.9,
    specs: "Carbon Core • Tough Solar • BT",
    desc: "Triple G Resist, Bluetooth smartphone link, Multi-Band 6 atomic time, sapphire crystal, and dual core guard.",
    image: "assets/watches/casio/gsmart_titanium.jpg",
    badge: "G-SHOCK • MT-G"
  },
  {
    id: 17,
    name: "Casio Pro Trek PRG-340 Solar",
    brand: "casio",
    category: "casio-smart-mens",
    gender: "male",
    price: 24500,
    rating: 4.7,
    specs: "Triple Sensor • Tough Solar • 100m",
    desc: "Outdoor tactical timepiece with digital compass, altimeter, barometer, thermometer, and duplex LCD.",
    image: "assets/watches/casio/protrek.jpg",
    badge: "CASIO PRO TREK"
  },
  {
    id: 18,
    name: "Casio G-Shock Mudmaster GWG-B1000",
    brand: "casio",
    category: "casio-smart-mens",
    gender: "male",
    price: 48500,
    rating: 4.8,
    specs: "Mud Resist • Solar • Triple Sensor",
    desc: "Indestructible master of G built for extreme terrains with carbon-reinforced resin and sapphire glass.",
    image: "assets/watches/casio/gshock_gbd.jpg",
    badge: "G-SHOCK • TOUGH"
  },
  {
    id: 19,
    name: "Casio Edifice EQB-2000 Sospensione",
    brand: "casio",
    category: "casio-smart-mens",
    gender: "male",
    price: 34500,
    rating: 4.7,
    specs: "47mm • Solar • BT Smartphone Link",
    desc: "Motorsport-inspired suspension arm lug design, Bluetooth automatic time calibration, and lap timer.",
    image: "assets/watches/casio/edifice_eqb.jpg",
    badge: "CASIO EDIFICE"
  },
  {
    id: 20,
    name: "Casio Edifice ECB-900 Racing Chrono",
    brand: "casio",
    category: "casio-smart-mens",
    gender: "male",
    price: 18500,
    rating: 4.6,
    specs: "48mm • Solar Chrono • World Time",
    desc: "Speed indicator, dual auto LED super illuminator, Bluetooth phone sync, and 1/1000-second stopwatch.",
    image: "assets/watches/casio/edifice_ecb.jpg",
    badge: "CASIO EDIFICE"
  },

  // ══════════════════════════════════════════════════════════════════
  // CASIO & G-SHOCK — 5 WOMEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 21,
    name: "Casio Baby-G BGA-280 Pastel Series",
    brand: "casio",
    category: "casio-smart-womens",
    gender: "female",
    price: 7995,
    rating: 4.6,
    specs: "Shock Resist • 100m • World Time",
    desc: "Chic round pastel design, shock resistance, super illuminator backlight, and 3-year battery life.",
    image: "assets/watches/casio/baby_g.jpg",
    badge: "CASIO BABY-G"
  },
  {
    id: 22,
    name: "Casio Sheen SHE-4543 Diamond Slim",
    brand: "casio",
    category: "casio-smart-womens",
    gender: "female",
    price: 9995,
    rating: 4.5,
    specs: "32mm • Solar • Sapphire • Crystals",
    desc: "Ultra-slim 6.4mm profile, scratch-resistant sapphire crystal with anti-glare, Swarovski crystals on bezel.",
    image: "assets/watches/casio/sheen.jpg",
    badge: "CASIO SHEEN"
  },
  {
    id: 23,
    name: "Casio Sheen SHE-4554 Peach Gold",
    brand: "casio",
    category: "casio-smart-womens",
    gender: "female",
    price: 11995,
    rating: 4.6,
    specs: "31mm • Sapphire • Peach Gold IP",
    desc: "Minimalist dial with crystal hour markers, genuine Milanese steel mesh strap, and 50m water resistance.",
    image: "assets/watches/casio/sheen_sapphire.jpg",
    badge: "CASIO SHEEN"
  },
  {
    id: 24,
    name: "Casio Lineage LCW-M100 Titanium Solar",
    brand: "casio",
    category: "casio-smart-womens",
    gender: "female",
    price: 16500,
    rating: 4.7,
    specs: "Pure Titanium • Solar • Radio Wave",
    desc: "Ultra-light pure titanium construction with Multi-Band 6 radio wave atomic precision and sapphire crystal.",
    image: "assets/watches/casio/lineage.jpg",
    badge: "CASIO LINEAGE"
  },
  {
    id: 25,
    name: "Casio Vintage A1000 All-Metal Luxury",
    brand: "casio",
    category: "casio-smart-womens",
    gender: "female",
    price: 8995,
    rating: 4.5,
    specs: "Solid Steel • Mother of Pearl • LED",
    desc: "Premium all-stainless steel vintage icon with natural mother-of-pearl dial face and Milanese bracelet.",
    image: "assets/watches/casio/ws_b1500.jpg",
    badge: "CASIO VINTAGE"
  },

  // ══════════════════════════════════════════════════════════════════
  // HAMILTON — 3 MEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 26,
    name: "Hamilton Khaki Field Mechanical",
    brand: "hamilton",
    category: "hamilton-mens",
    gender: "male",
    price: 54500,
    rating: 4.9,
    specs: "38mm • Hand-Wound H-50 • 80h",
    desc: "Original soldier's military field watch, 80-hour power reserve hand-wound movement, matte steel case, NATO strap.",
    image: "assets/watches/hamilton/khaki.jpg",
    badge: "HAMILTON • SWISS"
  },
  {
    id: 27,
    name: "Hamilton Jazzmaster Open Heart Auto",
    brand: "hamilton",
    category: "hamilton-mens",
    gender: "male",
    price: 92000,
    rating: 4.9,
    specs: "42mm • Cal. H-10 • 80h Reserve",
    desc: "Precision cut-out dial showcasing the ticking Swiss balance wheel and escapement with Côtes de Genève finish.",
    image: "assets/watches/hamilton/jazzmaster.jpg",
    badge: "HAMILTON • SWISS"
  },
  {
    id: 28,
    name: "Hamilton Intra-Matic Auto Chrono",
    brand: "hamilton",
    category: "hamilton-mens",
    gender: "male",
    price: 185000,
    rating: 4.8,
    specs: "40mm • Cal. H-31 • 60h Chrono",
    desc: "Classic 1968 vintage panda chronograph remake with reverse panda sub-dials, box sapphire, and leather strap.",
    image: "assets/watches/hamilton/intramatic.jpg",
    badge: "HAMILTON • HERITAGE"
  },

  // ══════════════════════════════════════════════════════════════════
  // HAMILTON — 3 WOMEN'S
  // ══════════════════════════════════════════════════════════════════
  {
    id: 29,
    name: "Hamilton Ventura Elvis80 Auto",
    brand: "hamilton",
    category: "hamilton-womens",
    gender: "female",
    price: 128000,
    rating: 4.8,
    specs: "42.5mm • Asymmetric Shield • H-10",
    desc: "The world's first electric watch icon with dramatic triangular shield case, sapphire crystal, and 80-hour power reserve.",
    image: "assets/watches/hamilton/ventura.jpg",
    badge: "HAMILTON • ICONIC"
  },
  {
    id: 30,
    name: "Hamilton Jazzmaster Lady Auto",
    brand: "hamilton",
    category: "hamilton-womens",
    gender: "female",
    price: 74000,
    rating: 4.7,
    specs: "30mm • ETA 2671 Automatic",
    desc: "Exquisite Swiss automatic for women with mother-of-pearl dial, diamond index markers, and exhibition case back.",
    image: "assets/watches/hamilton/jazzmaster_lady.jpg",
    badge: "HAMILTON • ELEGANCE"
  },
  {
    id: 31,
    name: "Hamilton Ardmore Heritage Art Deco",
    brand: "hamilton",
    category: "hamilton-womens",
    gender: "female",
    price: 46000,
    rating: 4.8,
    specs: "18.7x27mm • Swiss Quartz",
    desc: "Rectangular 1937 Art Deco silhouette with emerald leather strap, silver dial, and vintage Roman numerals.",
    image: "assets/watches/hamilton/ardmore.jpg",
    badge: "HAMILTON • ART DECO"
  }

];

// ══════════════════════════════════════════════════════════════════
// CATEGORY DEFINITIONS (for filtering & section rendering)
// ══════════════════════════════════════════════════════════════════
const WATCH_CATEGORIES = [
  {
    id: "seiko-mens",
    label: "Seiko Men's",
    icon: "🇯🇵",
    subtitle: "SEIKO • MEN'S COLLECTION",
    title: "Seiko — Men's Precision & Heritage",
    desc: "Three iconic Seiko references showcasing Japanese craftsmanship, Prospex dive capability, and Presage artistry."
  },
  {
    id: "seiko-womens",
    label: "Seiko Women's",
    icon: "✨",
    subtitle: "SEIKO • WOMEN'S COLLECTION",
    title: "Seiko — Women's Refined Elegance",
    desc: "Exquisite Seiko Lukia and Presage creations blending graceful femininity with solar and mechanical precision."
  },
  {
    id: "citizen-mens",
    label: "Citizen Men's",
    icon: "⚡",
    subtitle: "CITIZEN • MEN'S COLLECTION",
    title: "Citizen — Men's Eco-Drive & Mechanical Mastery",
    desc: "Three legendary Citizen references, from the atomic Skyhawk to the Promaster Marine and anti-magnetic Series 8."
  },
  {
    id: "citizen-womens",
    label: "Citizen Women's",
    icon: "🌸",
    subtitle: "CITIZEN • WOMEN'S COLLECTION",
    title: "Citizen — Women's L Collection & Eco-Drive",
    desc: "Radiant Citizen L Ambiluna timepieces powered endlessly by light with frosted sapphire glass and subtle luxury."
  },
  {
    id: "tissot-mens",
    label: "Tissot Men's",
    icon: "🇨🇭",
    subtitle: "TISSOT • MEN'S COLLECTION",
    title: "Tissot — Men's Swiss Excellence",
    desc: "Four refined Swiss timepieces from the iconic PRX Chrono and Seastar Diver to the high-tech T-Touch Connect."
  },
  {
    id: "tissot-womens",
    label: "Tissot Women's",
    icon: "💎",
    subtitle: "TISSOT • WOMEN'S COLLECTION",
    title: "Tissot — Women's Swiss Grace",
    desc: "Two graceful Swiss pieces that complement every occasion with guilloche artistry and understated sophistication."
  },
  {
    id: "casio-smart-mens",
    label: "Casio & G-Shock Men's",
    icon: "🛡️",
    subtitle: "CASIO & G-SHOCK • MEN'S COLLECTION",
    title: "Casio & G-Shock — Men's Indestructible & Smart Timepieces",
    desc: "Five cutting-edge Casio timepieces from MT-G carbon titanium and Mudmaster to Pro Trek solar and Edifice racing chronographs."
  },
  {
    id: "casio-smart-womens",
    label: "Casio & G-Shock Women's",
    icon: "🎀",
    subtitle: "CASIO & G-SHOCK • WOMEN'S COLLECTION",
    title: "Casio & G-Shock — Women's Connected & Chic Styles",
    desc: "Five stylish Casio timepieces fusing Tough Solar technology, pastel Baby-G toughness, and Sheen sapphire elegance."
  },
  {
    id: "hamilton-mens",
    label: "Hamilton Men's",
    icon: "⚔️",
    subtitle: "HAMILTON • MEN'S COLLECTION",
    title: "Hamilton — Men's American Spirit & Swiss Precision",
    desc: "Three legendary Hamilton references: the military Khaki Field, the Jazzmaster Open Heart, and Intra-Matic Chrono."
  },
  {
    id: "hamilton-womens",
    label: "Hamilton Women's",
    icon: "⚜️",
    subtitle: "HAMILTON • WOMEN'S COLLECTION",
    title: "Hamilton — Women's Iconic & Art Deco Classics",
    desc: "Three distinctive feminine creations from the avant-garde triangular Ventura to the 1937 Art Deco Ardmore."
  }
];
