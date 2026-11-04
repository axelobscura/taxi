import type { City, Zone } from "./cities";

/**
 * English copy for the coverage pages, keyed by the same slugs as
 * `cities.ts`. Data that isn't copy (slugs, places, coordinates, fare
 * routes) is taken from the Spanish source, so it can't drift.
 *
 * FAQs are matched to the Spanish ones by position: keep both lists in the
 * same order. `localizeCity` throws at build time if the counts differ.
 */

type FaqCopy = { q: string; a: string };
type ZoneCopy = Pick<Zone, "name" | "tagline" | "intro" | "highlights"> & {
  faqs: FaqCopy[];
};
export type CityCopy = Pick<City, "name" | "intro"> & {
  faqs: FaqCopy[];
  zones: Record<string, ZoneCopy>;
};

export const CITIES_EN: Record<string, CityCopy> = {
  "ciudad-de-mexico": {
    name: "Mexico City",
    intro:
      "Book a safe taxi in any of Mexico City's 16 boroughs. You see a fixed fare before you confirm, your driver is licensed by SEMOVI, the city's transport authority, and we run 24/7, including to AICM airport and the bus terminals.",
    faqs: [
      {
        q: "How much does a taxi cost in Mexico City?",
        a: "It depends on distance, estimated time and ride type. The app shows the exact price before you confirm, and that's what you pay.",
      },
      {
        q: "Are taxis available 24 hours a day?",
        a: "Yes. We operate 24 hours a day, 365 days a year, in all 16 boroughs of Mexico City.",
      },
      {
        q: "Are the drivers verified?",
        a: "Every driver is licensed by Mexico City's transport authority (SEMOVI) and passes license, permit and background checks before taking rides.",
      },
      {
        q: "Is there surge pricing at rush hour?",
        a: "No. The fare is fixed before you ride and doesn't change with traffic or demand.",
      },
    ],
    zones: {
      "aeropuerto-aicm": {
        name: "AICM Airport",
        tagline: "Taxi to and from AICM airport, Terminal 1 and Terminal 2",
        intro:
          "Make your flight on time, or leave Mexico City International Airport without waiting in line. Book your taxi from Terminal 1 or Terminal 2 and know the price before you get in, with no extra charge for luggage.",
        highlights: [
          "Round-the-clock service at T1 and T2, including late at night",
          "XL rides for groups of up to 6 passengers with luggage",
          "Fixed fare: Circuito Interior traffic won't change the price",
        ],
        faqs: [
          {
            q: "How much is a taxi from AICM airport to Polanco?",
            a: "The exact price appears in the app before you confirm.",
          },
          {
            q: "Can I book a taxi from Terminal 2?",
            a: "Yes. Choose “AICM Airport T2” as your pickup and the driver will meet you at that terminal's pickup area.",
          },
        ],
      },
      polanco: {
        name: "Polanco",
        tagline: "Safe taxi in Polanco, Miguel Hidalgo",
        intro:
          "Get around Masaryk, Antara, Plaza Carso and the Campos Elíseos hotels with verified drivers. Great for business meetings and nights out, with Confort rides for executive trips.",
        highlights: [
          "Confort rides in newer cars with air conditioning",
          "Pickup at hotels, offices and shopping centers in the area",
          "Invoices available for business travel",
        ],
        faqs: [
          {
            q: "How much is a taxi from Polanco to Santa Fe?",
            a: "You can compare it with Eco and Confort in the app before booking.",
          },
        ],
      },
      condesa: {
        name: "Condesa",
        tagline: "Taxi in Condesa, Cuauhtémoc",
        intro:
          "Book a taxi in Condesa to go out for dinner, head to work or get home late. We pick up around Parque México, Parque España and Avenida Ámsterdam, with a fixed fare and a trip you can share live.",
        highlights: [
          "Fast pickups: one of the areas with the most drivers",
          "Share your live location during the ride",
          "No surge pricing when bars and restaurants close",
        ],
        faqs: [
          {
            q: "Is it safe to take a taxi in Condesa at night?",
            a: "Yes. Before you get in you can check the driver's name, photo, car model and plate, and you can share your trip with anyone you choose.",
          },
        ],
      },
      "roma-norte": {
        name: "Roma Norte",
        tagline: "Taxi in Roma Norte, Cuauhtémoc",
        intro:
          "Pickups on Álvaro Obregón, Plaza Río de Janeiro, Colima and across Roma Norte. Book your taxi in seconds and ride anywhere in the city at the price agreed before you get in.",
        highlights: [
          "Drivers verified by SEMOVI",
          "Fixed price even with traffic on Insurgentes",
          "Four ride types for every budget and group size",
        ],
        faqs: [
          {
            q: "How long does a taxi take to reach Roma Norte?",
            a: "With a Rosa ride, the average pickup time is about 3 minutes.",
          },
        ],
      },
      "santa-fe": {
        name: "Santa Fe",
        tagline: "Taxi in Santa Fe, Cuajimalpa and Álvaro Obregón",
        intro:
          "Leave the corporate towers, Centro Santa Fe or the area's universities without worrying about the price. Distances in Santa Fe are long: with a fixed fare you know what you'll pay before heading down to Reforma or the airport.",
        highlights: [
          "Long trips at a fixed price, no rush-hour surprises",
          "Confort rides for business travel",
          "Invoices for companies",
        ],
        faqs: [
          {
            q: "How much is a taxi from Santa Fe to the airport?",
            a: "The exact price appears in the app and doesn't change with traffic.",
          },
        ],
      },
      coyoacan: {
        name: "Coyoacán",
        tagline: "Taxi in Coyoacán, near downtown and UNAM",
        intro:
          "Book a taxi in downtown Coyoacán, near the Casa Azul, the Viveros park or Ciudad Universitaria. We'll take you south, downtown or to the airport with a fixed fare and licensed drivers.",
        highlights: [
          "Coverage in downtown Coyoacán, UNAM and Taxqueña",
          "Close to the South Bus Terminal for bus trips",
          "Eco rides for short, budget-friendly trips",
        ],
        faqs: [
          {
            q: "How much is a taxi from Coyoacán to the Zócalo?",
            a: "Eco is cheaper. Compare all four ride types in the app.",
          },
        ],
      },
      "centro-historico": {
        name: "Historic Center",
        tagline: "Taxi in the Historic Center and the Zócalo",
        intro:
          "Pickups by the Zócalo, Bellas Artes, the Cathedral and the hotels of the Historic Center. Skip hailing a cab on the street: book online and check the plate and driver before you get in.",
        highlights: [
          "Pickups on the main streets of the old town",
          "Great for visitors: price in pesos before you ride",
          "Quick connection to the TAPO bus terminal and AICM airport",
        ],
        faqs: [
          {
            q: "How much is a taxi from the Zócalo to the airport?",
            a: "The app shows the exact fare before you confirm.",
          },
        ],
      },
      "terminal-norte": {
        name: "North Bus Terminal",
        tagline: "Taxi at the Central de Autobuses del Norte",
        intro:
          "Arriving or leaving by bus from Terminal Norte? Book your taxi from the terminal and reach your destination at a fixed price, without haggling with the taxi stands.",
        highlights: [
          "24/7 service for late-night arrivals",
          "XL rides for travelling with luggage",
          "Direct connection to AICM airport and downtown",
        ],
        faqs: [
          {
            q: "Can I book a taxi from Terminal Norte to the airport?",
            a: "Yes, and the price doesn't change with traffic.",
          },
        ],
      },
      tapo: {
        name: "TAPO",
        tagline: "Taxi at TAPO, the Eastern Bus Terminal",
        intro:
          "Book a taxi as you leave TAPO, a few minutes from the airport and the Historic Center. Fixed fare and verified drivers to get you and your luggage to any borough.",
        highlights: [
          "A few minutes from AICM airport",
          "Round-the-clock service for late departures and arrivals",
          "XL rides for groups",
        ],
        faqs: [
          {
            q: "How much is a taxi from TAPO to the airport?",
            a: "It's one of the shortest rides to AICM airport.",
          },
        ],
      },
      "central-del-sur": {
        name: "South Bus Terminal",
        tagline: "Taxi at the Central de Autobuses del Sur, Taxqueña",
        intro:
          "Arriving at the South Bus Terminal in Taxqueña and need to keep going? Book a safe taxi from the terminal to Coyoacán, downtown or the airport with the fare agreed from the start.",
        highlights: [
          "Pickup at the Taxqueña terminal exit",
          "Close to Coyoacán, UNAM and Estadio Azteca",
          "Fixed fare for long trips to the north of the city",
        ],
        faqs: [
          {
            q: "How much is a taxi from the South Bus Terminal to the airport?",
            a: "You'll see the exact price in the app before you book.",
          },
        ],
      },
    },
  },
};
