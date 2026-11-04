import type { Lang } from "./config";

/**
 * UI strings shared across components, including Client Components (the
 * whole dictionary is passed to them through `I18nProvider`, so it must stay
 * plain serializable data). Page-specific copy lives next to each page.
 *
 * `{name}` placeholders are filled with `fmt`.
 */
const es = {
  nav: {
    "/": "Pedir taxi",
    "/servicios": "Servicios",
    "/tarifas": "Tarifas",
    "/taxi": "Cobertura",
    "/nosotros": "Nosotros",
    "/contacto": "Contacto",
  },
  header: {
    login: "Entrar",
    tagline: "Pide y relájate",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menu: "Menú",
    mainMenu: "Menú principal",
    fleetPanel: "Panel de flota",
    coverage247: "24/7 en toda la CDMX",
    switchTo: "English",
    switchLabel: "Ver el sitio en inglés",
  },
  footer: {
    about:
      "Taxis verificados en la Ciudad de México. Tarifa cerrada antes de subir, sin sorpresas.",
    navigation: "Navegación",
    taxiIn: "Taxi en {city}",
    contact: "Contacto",
    service: "Servicio 24/7 en toda la CDMX",
    legal: "Conductores verificados con la SEMOVI",
  },
  booking: {
    title: "Pide un",
    titleAccent: "taxi",
    origin: "Origen",
    destination: "Destino",
    pickPoint: "Selecciona un punto",
    whereFrom: "¿Dónde te recogemos?",
    whereTo: "¿A dónde vas?",
    noResults: "Sin resultados para “{query}”",
    swap: "Invertir origen y destino",
    viewOptions: "Ver opciones · {min} min",
    back: "Volver",
    tripMeta: "{km} km · aprox. {min} min con tráfico",
    chooseService: "Elige tu servicio",
    seats: "{n} plazas",
    request: "Pedir {tier} · {fare}",
    searching: "Buscando conductor…",
    noDrivers: "No hay conductores disponibles para este servicio. Prueba otra categoría.",
    assignFailed: "No se pudo asignar un conductor. Intenta de nuevo.",
    networkError: "Error de conexión. Intenta de nuevo.",
    driverArrived: "Tu conductor llegó",
    driverOnTheWay: "Tu conductor va en camino",
    trips: "{n} viajes",
    plate: "Placa",
    call: "Llamar",
    message: "Mensaje",
    estimatedTotal: "Total estimado",
    payment: "{tier} · Efectivo o tarjeta",
    cancel: "Cancelar",
    safetyNote:
      "Comparte tu viaje en tiempo real desde el menú. Todos los conductores están verificados con la SEMOVI.",
  },
  contactForm: {
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Correo",
    emailPlaceholder: "tu@correo.mx",
    subject: "Asunto",
    subjects: {
      viaje: "Un viaje",
      factura: "Facturación",
      conductor: "Quiero manejar",
      otro: "Otro tema",
    },
    body: "Mensaje",
    bodyPlaceholder: "¿En qué te ayudamos?",
    send: "Enviar mensaje",
    sending: "Enviando…",
    sent: "Mensaje recibido. Te respondemos en menos de 24 horas.",
    errors: {
      name: "Escribe tu nombre",
      email: "Correo inválido",
      body: "Cuéntanos un poco más",
      invalid: "Revisa los datos del formulario",
    },
  },
  tiers: {
    eco: "El más económico",
    rosa: "Nuestro clásico de la ciudad",
    confort: "Autos nuevos, más espacio",
    xl: "Hasta 6 pasajeros",
  },
  /** Display names for places whose Spanish name doesn't carry over. */
  places: {} as Record<string, string>,
};

export type Dict = typeof es;

const en: Dict = {
  nav: {
    "/": "Book a taxi",
    "/servicios": "Services",
    "/tarifas": "Fares",
    "/taxi": "Coverage",
    "/nosotros": "About",
    "/contacto": "Contact",
  },
  header: {
    login: "Log in",
    tagline: "Ride and relax",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    mainMenu: "Main menu",
    fleetPanel: "Fleet panel",
    coverage247: "24/7 across Mexico City",
    switchTo: "Español",
    switchLabel: "Ver el sitio en español",
  },
  footer: {
    about:
      "Verified taxis in Mexico City. Fixed fare before you ride, no surprises.",
    navigation: "Navigation",
    taxiIn: "Taxi in {city}",
    contact: "Contact",
    service: "24/7 service across Mexico City",
    legal: "Drivers verified by SEMOVI",
  },
  booking: {
    title: "Book a",
    titleAccent: "taxi",
    origin: "Pickup",
    destination: "Drop-off",
    pickPoint: "Choose a place",
    whereFrom: "Where should we pick you up?",
    whereTo: "Where to?",
    noResults: "No results for “{query}”",
    swap: "Swap pickup and drop-off",
    viewOptions: "See options · {min} min",
    back: "Back",
    tripMeta: "{km} km · approx. {min} min with traffic",
    chooseService: "Choose your ride",
    seats: "{n} seats",
    request: "Book {tier} · {fare}",
    searching: "Finding a driver…",
    noDrivers: "No drivers available for this ride type. Try another one.",
    assignFailed: "We couldn't assign a driver. Please try again.",
    networkError: "Connection error. Please try again.",
    driverArrived: "Your driver has arrived",
    driverOnTheWay: "Your driver is on the way",
    trips: "{n} trips",
    plate: "Plate",
    call: "Call",
    message: "Message",
    estimatedTotal: "Estimated total",
    payment: "{tier} · Cash or card",
    cancel: "Cancel",
    safetyNote:
      "Share your trip live from the menu. Every driver is verified by SEMOVI, Mexico City's transport authority.",
  },
  contactForm: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    subject: "Subject",
    subjects: {
      viaje: "A trip",
      factura: "Invoicing",
      conductor: "I want to drive",
      otro: "Something else",
    },
    body: "Message",
    bodyPlaceholder: "How can we help?",
    send: "Send message",
    sending: "Sending…",
    sent: "Message received. We'll reply within 24 hours.",
    errors: {
      name: "Please enter your name",
      email: "Invalid email",
      body: "Tell us a little more",
      invalid: "Please check the form",
    },
  },
  tiers: {
    eco: "The most affordable",
    rosa: "Our city classic",
    confort: "Newer cars, more room",
    xl: "Up to 6 passengers",
  },
  places: {
    "Aeropuerto AICM T1": "AICM Airport T1",
    "Aeropuerto AICM T2": "AICM Airport T2",
    "Bosque de Chapultepec": "Chapultepec Park",
    "Coyoacán Centro": "Downtown Coyoacán",
    "Ciudad Universitaria": "Ciudad Universitaria (UNAM)",
    "Basílica de Guadalupe": "Basilica of Guadalupe",
    "Mercado de La Merced": "La Merced Market",
    "Terminal Norte": "North Bus Terminal",
    "Central del Sur": "South Bus Terminal",
    TAPO: "TAPO Bus Terminal",
  },
};

const DICTS: Record<Lang, Dict> = { es, en };

export const getDict = (lang: Lang): Dict => DICTS[lang];

/** Fills `{name}` placeholders: `fmt("{n} trips", { n: 3 })`. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** Display name of a place in the dictionary's language. */
export const placeLabel = (dict: Dict, name: string) => dict.places[name] ?? name;
