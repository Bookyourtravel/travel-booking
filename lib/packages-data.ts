// lib/packages-data.ts
// Central packages + attractions data used across pages.

import { ReactNode } from "react";

type Attraction = {
  slug: string;
  title: string;
  short?: string;
  long?: string; // full description (plain text / markdown)
  images?: string[];
};

type PackageItem = {
  subtitle?: ReactNode;
  slug: string;
  title: string;
  titleHero?: string;
  tagline?: string;
  heroImage?: string;
  short?: string;
  starting?: string;
  duration?: string;
  highlights?: string[];
  rating?: number;
  images?: string[];
  badge?: string;
  overview?: string;
  attractions?: Attraction[];
};

const PACKAGES_DATA: Record<string, PackageItem> = {
  ayodhya: {
    slug: "ayodhya",
    title: "Varanasi → Ayodhya Cab",
    titleHero: "Varanasi → Ayodhya Cab",
    tagline: "“Pilgrimage is not a race — it’s a slow discovery. Let us take you there comfortably.”",
    heroImage: "/images/ayodhya4.webp",
    short: "Reliable intercity cab with fixed price and driver guide.",
    starting: "₹1,850 (4 pax)",
    duration: "Full day",
    highlights: ["Private car", "Driver guide", "Comfort stops"],
    rating: 4.7,
    images: ["/images/ayodhya1.webp", "/images/ayodhya2.webp", "/images/ayodhya4.webp"],
    badge: "Popular",
    overview:
      "Ayodhya is an ancient city tied to the Ramayana era. This package covers travel from Varanasi to Ayodhya with comfortable stops and local guidance.",
    attractions: [
      {
        slug: "ram-janmabhoomi-complex",
        title: "Ram Janmabhoomi Complex",
        short: "Historic complex believed to be Lord Ram's birthplace.",
        long: `The Ram Janmabhoomi Complex is the most significant religious site in Ayodhya. 
It is believed to be the birthplace of Lord Ram. Currently, a grand Ram Mandir is being constructed here, which is considered one of the most prestigious projects in India. Millions of devotees visit every year for darshan and worship.

The newly constructed grand temple is an architectural masterpiece, showcasing the finest of Indian craftsmanship. The temple premises now include modern facilities and large arrangements for devotees to have a comfortable experience.

**Visiting Tips:**
- Best time to visit is early morning or evening.
- During peak hours, entry queues can take longer.
- Carry comfortable clothing and a water bottle.
- Respect temple rules and maintain cleanliness in the premises.`,
        images: ["/images/ram1.webp", "/images/ram2.webp"],
      },
      {
        slug: "hanuman-garhi",
        title: "Hanuman Garhi",
        short: "Famous hill-top Hanuman temple with sunrise views.",
        long: `Hanuman Garhi is a highly revered temple located on a hilltop, offering beautiful views of Ayodhya. 
This temple is particularly famous for its sunrise view and spiritual atmosphere. 
It attracts large crowds daily, especially on Tuesdays and Saturdays when special prayers are held.

**Visiting Tips:**
- Be prepared to climb stairs to reach the temple.
- Best time to visit is early morning.`,
        images: ["/images/hanumangari.webp"],
      },
      {
        slug: "kanak-bhawan",
        title: "Kanak Bhawan",
        short: "Royal temple gifted to Sita; rich carvings and idols.",
        long: `Kanak Bhawan is a royal temple dedicated to Lord Ram and Sita. 
It is believed to have been gifted to Sita as a wedding present. 
The temple is renowned for its artistic carvings, intricate idols, and beautiful spiritual ambience.

**Visiting Tips:**
- Visit during the morning hours to avoid rush.
- Ask locals about special prayer timings.`,
        images: ["/images/kanak1.webp"],
      },
    ],
  },

  "kashi-darshan": {
    slug: "kashi-darshan",
    title: "Local Darshan - Kashi Vishwanath",
    titleHero: "Local Darshan — Kashi Vishwanath",
    tagline: "Experience the ghats, the temple and the Ganga Aarti — a soul-stirring evening.",
    heroImage: "/images/kashi1.webp",
    short: "Temple darshan + guided walk and Ganga Aarti experience.",
    starting: "₹3,800 (4 pax)",
    duration: "3–4 hours",
    highlights: ["Ganga Aarti", "Local guide", "Short walk"],
    rating: 4.9,
    images: ["/images/kashi1.webp", "/images/kashi2.webp"],
    badge: "Top Rated",
    overview:
      "Kashi Darshan package includes a visit to the iconic Kashi Vishwanath temple, a guided walk through the ghats, and the divine Ganga Aarti experience.",
    attractions: [
      {
        slug: "kashi-vishwanath-temple",
        title: "Kashi Vishwanath Temple",
        short: "Iconic Shiva temple in the old city — one of the twelve Jyotirlingas.",
        long: `Kashi Vishwanath is the principal Shiva temple in Varanasi, located near the Ganga ghats. 
It is one of the twelve Jyotirlinga shrines and a core pilgrimage site for Hindus; the temple complex includes several smaller shrines and historic features such as the Gyanvapi well.`,
        images: ["/images/kashi-temple1.webp", "/images/kashi-temple2.webp"],
      },
      {
        slug: "dashashwamedh-ghat",
        title: "Dashashwamedh Ghat & Ganga Aarti",
        short: "Historic main ghat famous for the evening Ganga Aarti ceremony.",
        long: `Dashashwamedh is one of Varanasi's oldest and most celebrated ghats. 
At dusk, the daily Ganga Aarti — a rhythmic, lamp-based ritual accompanied by chants — creates an immersive spiritual experience for visitors.`,
        images: ["/images/dashashwamedh1.webp", "/images/ganga-aarti1.webp"],
      },
      {
        slug: "sarnath",
        title: "Sarnath",
        short: "Important Buddhist site where Buddha delivered his first sermon.",
        long: `Sarnath, a short drive from Varanasi, is a major Buddhist pilgrimage site where the Buddha taught the Dhammacakkappavattana Sutta (the turning of the wheel of dharma). 
Visitors can see the archaeological ruins, the Dhamek Stupa, and the Sarnath museum.`,
        images: ["/images/sarnath1.webp", "/images/sarnath2.webp"],
      },
      {
        slug: "namo-ghat",
        title: "Namo Ghat",
        short: "Newly developed ghat with modern amenities and a newer Ganga Aarti.",
        long: `Namo Ghat is a recently developed ghat with improved facilities, promenades and public spaces; it hosts a newer Ganga Aarti and offers a less crowded experience compared to older ghats.`,
        images: ["/images/namo-ghat1.webp"],
      },
      {
        slug: "manikarnika-ghat",
        title: "Manikarnika Ghat",
        short: "One of the most significant cremation ghats of Varanasi.",
        long: `Manikarnika is the famous burning ghat of Varanasi, historically associated with death and moksha in local belief. 
Visitors should be respectful of rituals and the solemn atmosphere at this site.`,
        images: ["/images/manikarnika1.webp"],
      },
    ],
  },

  // NEW: lucknow-airport (detailed page for airport pickup/drop)
"lucknow-airport": {
  slug: "lucknow-airport",
  title: "Lucknow Airport Transfers",
  titleHero: "Varanasi/Lucknow — Airport Transfers",
  tagline: "Safe, punctual airport transfers with flight monitoring and friendly drivers.",
  heroImage: "/images/lucknow-lucknow-airport.webp",
  short: "Comfortable sedan / Innova with flight tracking options.",
  starting: "₹699 (Pickup)",
  duration: "As required",
    highlights: ["Flight tracking", "Meet & greet", "Child seat available", "Fixed fare"],
    rating: 4.6,
    images: ["/images/lucknow-airport.webp", "/images/lucknow-airport.webp"],
    overview:
      "Reliable airport transfers between Varanasi and Lucknow with experienced drivers, on-time pickups and flight tracking. Whether you need a pickup from Lucknow airport or a drop to catch a flight, we ensure a smooth door-to-door transfer with comfortable vehicles and helpful drivers.",
    attractions: [
      {
        slug: "meet-and-greet",
        title: "Meet & Greet Service",
        short: "Driver waits at arrival gate with signboard and assists with luggage.",
        long: "Our driver monitors your flight and meets you at the arrival gate (where allowed). They will assist with luggage and help get you comfortably to your vehicle.",
        images: ["/images/airport-meet.webp"]
      },
      {
        slug: "flight-tracking",
        title: "Flight Monitoring",
        short: "We track delays and adjust pickup time accordingly.",
        long: "We actively monitor flight status so your driver arrives on time. If the flight is delayed, we update pickup time automatically — no extra waiting charges for reasonable delays.",
        images: ["/images/flight-track.webp"]
      }
    ],
  },

  prayagraj: {
    slug: "prayagraj",
    title: "Varanasi → Prayagraj (Sangam)",
    titleHero: "Varanasi → Prayagraj (Sangam)",
    tagline: "Explore the confluence of the Ganga, Yamuna and Saraswati — a sacred experience.",
    heroImage: "/images/prayagraj1.webp",
    short: "Day trip or overnight packages with optional hotel add-ons.",
    starting: "₹2,900 (4 pax)",
    duration: "Overnight / Day trip",
    highlights: ["Optional hotel", "Local stops", "Sangam visit"],
    rating: 4.5,
    images: ["/images/prayagraj1.webp", "/images/prayagraj2.webp"],
    overview: "Visit the Sangam and nearby temples with comfortable transport and local guidance.",
    attractions: [],
  },

  "ganga-aarti": {
    slug: "ganga-aarti",
    title: "Evening Ganga Aarti Special",
    titleHero: "Evening Ganga Aarti Special",
    tagline: "Front-row aarti experience with priest and photography.",
    heroImage: "/images/ganga-aarti1.webp",
    short: "Front-row aarti experience with priest and photography.",
    starting: "₹1,599 (per person)",
    duration: "2 hours",
    highlights: ["Front-row seating", "Priest guidance", "Photo ops"],
    rating: 4.8,
    images: ["/images/arti1.webp", "/images/arti2.webp"],
    overview: "An evening dedicated to the Ganga Aarti — immersive ritual with music and lamps.",
    attractions: [],
  },

  "self-drive": {
    slug: "self-drive",
    title: "Self-Drive Cars (Varanasi)",
    titleHero: "Self-Drive Cars (Varanasi)",
    tagline: "Flexible self-drive hatchbacks & sedans — hourly or daily rentals.",
    heroImage: "/images/selfdrive1.webp",
    short: "Flexible self-drive cars with easy pickup/drop.",
    starting: "₹1,850 / day",
    duration: "Per day",
    highlights: ["Unlimited kms", "Insurance included", "Multiple vehicle types"],
    rating: 4.4,
    images: ["/images/selfdrive1.webp"],
    overview: "Self-drive rentals with clear pricing and pickup options.",
    attractions: [],
  },
};

export default PACKAGES_DATA;
