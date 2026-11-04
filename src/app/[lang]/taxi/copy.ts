import type { Lang } from "@/i18n/config";

/** Copy shared by the `/taxi` coverage pages. `{x}` placeholders go through `fmt`. */
export const TAXI_COPY = {
  es: {
    home: "Inicio",
    coverage: "Cobertura",
    taxiIn: "Taxi en {place}",
    /** First line of the two-line page title above the place name. */
    taxiPrefix: "Taxi en",
    // Index page
    indexTitle: "Taxi en México: ciudades y zonas con servicio",
    indexDescription:
      "Consulta dónde opera TAXI-MEX: taxis seguros con tarifa cerrada en la Ciudad de México, el aeropuerto AICM y las centrales de autobuses.",
    indexH1a: "Taxi seguro",
    indexH1b: "en México",
    indexLead:
      "Estas son las ciudades y zonas donde puedes pedir un taxi con nosotros. Seguimos creciendo: cada ciudad nueva aparecerá aquí en cuanto el servicio esté activo.",
    orderNow: "Pide tu taxi ahora",
    // City page
    cityTitle: "Taxi en {city} ({short}) 24 horas · Tarifa cerrada",
    cityDescription:
      "Pide un taxi seguro en {city} en segundos. Tarifa cerrada antes de subir, conductores verificados y servicio 24/7 al aeropuerto y centrales.",
    zonesTitle: "Zonas con servicio",
    tiersTitle: "Categorías y tarifas en {short}",
    tierLine: "{tagline}. Banderazo {base}, {perKm} por km, hasta {seats} pasajeros.",
    detailA: "Detalle completo en",
    fares: "tarifas",
    and: "y",
    services: "servicios",
    samplesFrom: "Precios de ejemplo desde {place}",
    samplesLead: "Categoría Rosa, calculados con la misma fórmula que usa la app.",
    boroughsTitle: "Alcaldías con cobertura",
    faqTitle: "Preguntas frecuentes",
    orderIn: "Pide tu taxi en {place}",
    // Zone page
    zoneTitle: "Taxi en {zone}, {short} · Precio fijo 24/7",
    zoneDescription:
      "{tagline}. Tarifa cerrada antes de subir, conductores verificados ante la SEMOVI y servicio las 24 horas.",
    whyTitle: "Por qué pedir con nosotros",
    zoneFaresTitle: "Precios de taxi desde {zone}",
    zoneFaresLead:
      "Tarifas estimadas en categoría Rosa con la fórmula de la app. Compara Eco, Confort y XL al pedir.",
    otherZones: "Otras zonas en {short}",
  },
  en: {
    home: "Home",
    coverage: "Coverage",
    taxiIn: "Taxi in {place}",
    taxiPrefix: "Taxi in",
    indexTitle: "Taxi in Mexico: Cities and Areas We Serve",
    indexDescription:
      "See where TAXI-MEX operates: safe taxis with a fixed fare in Mexico City, AICM airport and the bus terminals.",
    indexH1a: "Safe taxis",
    indexH1b: "in Mexico",
    indexLead:
      "These are the cities and areas where you can book a taxi with us. We're growing: each new city will appear here as soon as service is live.",
    orderNow: "Book your taxi now",
    cityTitle: "Taxi in {city} ({short}) 24/7 · Fixed Fare",
    cityDescription:
      "Book a safe taxi in {city} in seconds. Fixed fare before you ride, verified drivers and 24/7 service to the airport and bus terminals.",
    zonesTitle: "Areas we serve",
    tiersTitle: "Ride types and fares in {short}",
    tierLine: "{tagline}. Base fare {base}, {perKm} per km, up to {seats} passengers.",
    detailA: "Full details on",
    fares: "fares",
    and: "and",
    services: "services",
    samplesFrom: "Sample prices from {place}",
    samplesLead: "Rosa rides, calculated with the same formula the app uses.",
    boroughsTitle: "Boroughs we cover",
    faqTitle: "Frequently asked questions",
    orderIn: "Book your taxi in {place}",
    zoneTitle: "Taxi in {zone}, {short} · Fixed Price 24/7",
    zoneDescription:
      "{tagline}. Fixed fare before you ride, drivers licensed by SEMOVI and 24-hour service.",
    whyTitle: "Why book with us",
    zoneFaresTitle: "Taxi prices from {zone}",
    zoneFaresLead:
      "Estimated Rosa fares using the app's formula. Compare Eco, Confort and XL when you book.",
    otherZones: "Other areas in {short}",
  },
} satisfies Record<Lang, Record<string, string>>;
