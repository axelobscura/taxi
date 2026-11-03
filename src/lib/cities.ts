import { PLACES, type Place } from "./data";

/**
 * Where we operate. Every entry here becomes an indexable landing page under
 * `/taxi/[ciudad]` and `/taxi/[ciudad]/[zona]`, and is listed in the sitemap.
 *
 * Only add a city or zone once service there is real: pages for places we
 * don't serve mislead riders and search engines treat them as doorway pages.
 */

export type Faq = {
  q: string;
  a: string;
  /**
   * For price questions: the route to quote. The page prefixes the answer
   * with the live Rosa fare, so the copy never drifts from the tariff.
   */
  fare?: [from: string, to: string];
};

export type Zone = {
  slug: string;
  name: string;
  /** The PLACES entry used as the pickup point for the sample fares. */
  place: string;
  /** Short line under the title, also used as the meta description lead. */
  tagline: string;
  intro: string;
  highlights: string[];
  /** PLACES names priced as sample trips from this zone. */
  destinations: string[];
  faqs: Faq[];
};

export type City = {
  slug: string;
  name: string;
  /** Short form used in titles and headings, e.g. "CDMX". */
  shortName: string;
  state: string;
  lat: number;
  lng: number;
  intro: string;
  coverage: string[];
  zones: Zone[];
  faqs: Faq[];
};

export const CITIES: City[] = [
  {
    slug: "ciudad-de-mexico",
    name: "Ciudad de México",
    shortName: "CDMX",
    state: "Ciudad de México",
    lat: 19.4326,
    lng: -99.1332,
    intro:
      "Pide un taxi seguro en cualquiera de las 16 alcaldías de la Ciudad de México. Ves la tarifa cerrada antes de confirmar, tu conductor está acreditado ante la SEMOVI y el servicio funciona las 24 horas, también al AICM y a las centrales de autobuses.",
    coverage: [
      "Álvaro Obregón",
      "Azcapotzalco",
      "Benito Juárez",
      "Coyoacán",
      "Cuajimalpa",
      "Cuauhtémoc",
      "Gustavo A. Madero",
      "Iztacalco",
      "Iztapalapa",
      "Magdalena Contreras",
      "Miguel Hidalgo",
      "Milpa Alta",
      "Tláhuac",
      "Tlalpan",
      "Venustiano Carranza",
      "Xochimilco",
    ],
    faqs: [
      {
        q: "¿Cuánto cuesta un taxi en la CDMX?",
        a: "Depende de la distancia, el tiempo estimado y la categoría. La app te muestra el precio exacto antes de confirmar y ese es el que pagas.",
        fare: ["Ángel de la Independencia", "Zócalo"],
      },
      {
        q: "¿El taxi está disponible las 24 horas?",
        a: "Sí. Operamos las 24 horas, los 365 días del año, en las 16 alcaldías de la Ciudad de México.",
      },
      {
        q: "¿Los conductores están verificados?",
        a: "Todos los conductores están acreditados ante la Secretaría de Movilidad (SEMOVI) y pasan por revisión de licencia, tarjetón y antecedentes antes de recibir viajes.",
      },
      {
        q: "¿Hay tarifa dinámica en horas pico?",
        a: "No. La tarifa se cierra antes de subir y no cambia por tráfico ni por demanda.",
      },
    ],
    zones: [
      {
        slug: "aeropuerto-aicm",
        name: "Aeropuerto AICM",
        place: "Aeropuerto AICM T1",
        tagline: "Taxi al aeropuerto y desde el AICM, Terminal 1 y Terminal 2",
        intro:
          "Llega a tiempo a tu vuelo o sal del Aeropuerto Internacional de la Ciudad de México sin hacer fila. Pide tu taxi desde la Terminal 1 o la Terminal 2 y conoce el precio antes de subir, sin cobros extra por equipaje.",
        highlights: [
          "Servicio permanente en T1 y T2, también de madrugada",
          "Categoría XL para grupos de hasta 6 pasajeros con maletas",
          "Tarifa cerrada: el tráfico de Circuito Interior no cambia el precio",
        ],
        destinations: [
          "Ángel de la Independencia",
          "Polanco",
          "Santa Fe",
          "Zócalo",
          "Coyoacán Centro",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi del AICM a Polanco?",
            a: "El precio exacto aparece en la app antes de confirmar.",
            fare: ["Aeropuerto AICM T1", "Polanco"],
          },
          {
            q: "¿Puedo pedir taxi desde la Terminal 2?",
            a: "Sí. Elige “Aeropuerto AICM T2” como origen y el conductor te recoge en la zona de ascenso de esa terminal.",
          },
        ],
      },
      {
        slug: "polanco",
        name: "Polanco",
        place: "Polanco",
        tagline: "Taxi seguro en Polanco, Miguel Hidalgo",
        intro:
          "Muévete entre Masaryk, Antara, Plaza Carso y los hoteles de Campos Elíseos con conductores verificados. Ideal para reuniones de trabajo y salidas de noche, con categoría Confort para viajes ejecutivos.",
        highlights: [
          "Categoría Confort con autos recientes y aire acondicionado",
          "Recogida en hoteles, oficinas y centros comerciales de la zona",
          "Factura disponible para viajes de trabajo",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Santa Fe",
          "Ángel de la Independencia",
          "Parque México",
          "Bosque de Chapultepec",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi de Polanco a Santa Fe?",
            a: "Puedes compararlo con Eco y Confort en la app antes de pedir.",
            fare: ["Polanco", "Santa Fe"],
          },
        ],
      },
      {
        slug: "condesa",
        name: "Condesa",
        place: "Parque México",
        tagline: "Taxi en la Condesa, Cuauhtémoc",
        intro:
          "Pide taxi en la Condesa para salir a cenar, ir al trabajo o regresar a casa de noche. Recogemos alrededor de Parque México, Parque España y Avenida Ámsterdam, con tarifa cerrada y viaje compartible en tiempo real.",
        highlights: [
          "Llegada rápida: es una de las zonas con más conductores",
          "Comparte tu ubicación en vivo durante el viaje",
          "Sin tarifa dinámica al salir de bares y restaurantes",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Polanco",
          "Zócalo",
          "Ciudad Universitaria",
          "Santa Fe",
        ],
        faqs: [
          {
            q: "¿Es seguro pedir taxi en la Condesa de noche?",
            a: "Sí. Antes de subir confirmas nombre, foto, modelo y placa del conductor, y puedes compartir tu trayecto con quien elijas.",
          },
        ],
      },
      {
        slug: "roma-norte",
        name: "Roma Norte",
        place: "Plaza Río de Janeiro",
        tagline: "Taxi en la Roma Norte, Cuauhtémoc",
        intro:
          "Recogida en Álvaro Obregón, Plaza Río de Janeiro, Colima y el resto de la Roma Norte. Pide tu taxi en segundos y llega a cualquier punto de la ciudad con el precio acordado antes de subir.",
        highlights: [
          "Conductores verificados ante la SEMOVI",
          "Precio fijo aunque haya tráfico en Insurgentes",
          "Cuatro categorías según presupuesto y espacio",
        ],
        destinations: [
          "Aeropuerto AICM T2",
          "Polanco",
          "Coyoacán Centro",
          "Zócalo",
          "Terminal Norte",
        ],
        faqs: [
          {
            q: "¿Cuánto tarda en llegar un taxi a la Roma Norte?",
            a: "En categoría Rosa el tiempo de llegada promedio es de unos 3 minutos.",
          },
        ],
      },
      {
        slug: "santa-fe",
        name: "Santa Fe",
        place: "Santa Fe",
        tagline: "Taxi en Santa Fe, Cuajimalpa y Álvaro Obregón",
        intro:
          "Sal de los corporativos, el Centro Santa Fe o las universidades de la zona sin preocuparte por el precio. En Santa Fe las distancias son largas: con tarifa cerrada sabes cuánto pagas antes de bajar a Reforma o al aeropuerto.",
        highlights: [
          "Viajes largos con precio fijo, sin sorpresas en horas pico",
          "Categoría Confort para traslados de trabajo",
          "Factura para empresas",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Polanco",
          "Ángel de la Independencia",
          "Parque México",
          "Coyoacán Centro",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi de Santa Fe al aeropuerto?",
            a: "El precio exacto aparece en la app y no cambia por tráfico.",
            fare: ["Santa Fe", "Aeropuerto AICM T1"],
          },
        ],
      },
      {
        slug: "coyoacan",
        name: "Coyoacán",
        place: "Coyoacán Centro",
        tagline: "Taxi en Coyoacán, cerca del centro y de CU",
        intro:
          "Pide taxi en el centro de Coyoacán, junto a la Casa Azul, los Viveros o Ciudad Universitaria. Te llevamos al sur, al centro o al aeropuerto con tarifa cerrada y conductores acreditados.",
        highlights: [
          "Cobertura en el centro de Coyoacán, CU y Taxqueña",
          "Cerca de la Central del Sur para viajes en autobús",
          "Categoría Eco para trayectos cortos y económicos",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Zócalo",
          "Parque México",
          "Estadio Azteca",
          "Xochimilco",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi de Coyoacán al Zócalo?",
            a: "En Eco es más barato. Compara las cuatro categorías en la app.",
            fare: ["Coyoacán Centro", "Zócalo"],
          },
        ],
      },
      {
        slug: "centro-historico",
        name: "Centro Histórico",
        place: "Zócalo",
        tagline: "Taxi en el Centro Histórico y el Zócalo",
        intro:
          "Recogida junto al Zócalo, Bellas Artes, la Catedral y los hoteles del Centro Histórico. Evita buscar taxi en la calle: pide en línea y confirma placa y conductor antes de subir.",
        highlights: [
          "Recogida en las calles principales del primer cuadro",
          "Ideal para turistas: precio en pesos antes de subir",
          "Conexión rápida a la TAPO y al AICM",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Polanco",
          "Coyoacán Centro",
          "Basílica de Guadalupe",
          "Parque México",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi del Zócalo al aeropuerto?",
            a: "La app te muestra la tarifa exacta antes de confirmar.",
            fare: ["Zócalo", "Aeropuerto AICM T1"],
          },
        ],
      },
      {
        slug: "terminal-norte",
        name: "Terminal Norte",
        place: "Terminal Norte",
        tagline: "Taxi en la Central de Autobuses del Norte",
        intro:
          "¿Llegas o sales en autobús por la Terminal Norte? Pide tu taxi desde la central y llega a tu destino con el precio fijo, sin negociar con taxis de sitio.",
        highlights: [
          "Servicio 24/7 para llegadas nocturnas",
          "Categoría XL para viajar con equipaje",
          "Conexión directa al AICM y al centro",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Zócalo",
          "Polanco",
          "Basílica de Guadalupe",
          "Bosque de Chapultepec",
        ],
        faqs: [
          {
            q: "¿Puedo pedir taxi de la Terminal Norte al aeropuerto?",
            a: "Sí, y el precio no cambia por tráfico.",
            fare: ["Terminal Norte", "Aeropuerto AICM T1"],
          },
        ],
      },
      {
        slug: "tapo",
        name: "TAPO",
        place: "TAPO",
        tagline: "Taxi en la TAPO, Terminal de Autobuses de Pasajeros de Oriente",
        intro:
          "Pide taxi a la salida de la TAPO, a unos minutos del aeropuerto y del Centro Histórico. Tarifa cerrada y conductores verificados para llegar con tu equipaje a cualquier alcaldía.",
        highlights: [
          "A pocos minutos del AICM",
          "Servicio permanente para salidas y llegadas nocturnas",
          "Categoría XL para grupos",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Zócalo",
          "Ángel de la Independencia",
          "Coyoacán Centro",
          "Polanco",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi de la TAPO al aeropuerto?",
            a: "Es uno de los trayectos más cortos hacia el AICM.",
            fare: ["TAPO", "Aeropuerto AICM T1"],
          },
        ],
      },
      {
        slug: "central-del-sur",
        name: "Central del Sur",
        place: "Central del Sur",
        tagline: "Taxi en la Central de Autobuses del Sur, Taxqueña",
        intro:
          "Llegas a la Central del Sur en Taxqueña y necesitas seguir tu camino. Pide un taxi seguro desde la terminal hacia Coyoacán, el centro o el aeropuerto con la tarifa acordada desde el inicio.",
        highlights: [
          "Recogida en la salida de la terminal de Taxqueña",
          "Cerca de Coyoacán, CU y el Estadio Azteca",
          "Tarifa cerrada para viajes largos al norte de la ciudad",
        ],
        destinations: [
          "Aeropuerto AICM T1",
          "Coyoacán Centro",
          "Zócalo",
          "Ciudad Universitaria",
          "Parque México",
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta un taxi de la Central del Sur al aeropuerto?",
            a: "Verás el precio exacto en la app antes de pedir.",
            fare: ["Central del Sur", "Aeropuerto AICM T1"],
          },
        ],
      },
    ],
  },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function findZone(city: City, slug: string): Zone | undefined {
  return city.zones.find((z) => z.slug === slug);
}

export function placeNamed(name: string): Place {
  const place = PLACES.find((p) => p.name === name);
  if (!place) throw new Error(`Unknown place in cities.ts: ${name}`);
  return place;
}
