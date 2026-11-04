# TAXI_MEX · Taxis CDMX

App de reserva de taxis para la Ciudad de México. Next.js 16 (App Router),
React 19, TypeScript y Tailwind v4.

## Arrancar

```bash
npm install
cp .env.example .env.local   # opcional; hay valores por defecto
npm run dev                  # http://localhost:3000
```

Necesita las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y
`DB_NAME` en `.env.local` (ver *Base de datos*). Las tablas se crean solas en
la primera consulta.

`npm run build` para producción, `npm run lint` para revisar el código.

## Cómo funciona

El flujo vive en `src/app/page.tsx` y avanza por tres etapas:

| Etapa | Qué ve el usuario |
|---|---|
| `search`  | Elige origen y destino desde lugares reales de la CDMX |
| `confirm` | Compara las cuatro categorías con tarifa y tiempo de llegada |
| `riding`  | Datos del conductor, placa, cuenta regresiva y total |

## Estructura

```
src/
  app/
    layout.tsx      Fuentes (Sora/Outfit), metadata, tema
    globals.css     Tokens de color, animaciones, utilidades
    page.tsx        Máquina de estados del flujo
  components/
    CityMap.tsx     Mapa SVG estilizado, encuadre automático
    PlacePicker.tsx Buscador de origen y destino
    TierSelect.tsx  Categorías de viaje
    DriverCard.tsx  Conductor asignado
  lib/
    data.ts         Lugares, categorías, conductores y tarifas
```

## Lenguaje visual

El diseño toma la estructura de formas de la plantilla **Taxiar**: esquinas a
90° sin redondeo, figuras en diagonal (barra de marca, botones, control de
intercambio), tipografía pesada en mayúsculas y la etiqueta de doble guion
sobre cada encabezado. La paleta se mantiene en rosa CDMX sobre fondo oscuro
en lugar del amarillo sobre blanco del original.

Las utilidades viven en `globals.css`: `.skewed`, `.skewed-btn`, `.cut-tr` y
`.eyebrow`.

> Nota: `.skewed` usa `transform`, así que no se puede combinar en el mismo
> elemento con utilidades de Tailwind que también lo usen (`-translate-y-1/2`,
> `scale-*`). En esos casos se usa `clip-path` directamente.

## El mapa

`CityMap.tsx` usa **Leaflet 1.9.4** con tiles reales de **Esri World Dark Gray
Canvas** (base + etiquetas). No requiere API key ni cuenta.

Leaflet accede a `window` al importarse, así que el componente se carga con
`next/dynamic` y `ssr: false`.

### Por qué Esri y no otro proveedor

Se probaron cuatro y solo uno sirve sin llave:

| Proveedor | Resultado |
|---|---|
| CARTO Dark Matter | Devuelve HTTP 200 pero con **"API KEY REQUIRED"** impreso sobre el tile |
| OSM estándar | Funciona en navegador, pero es claro y choca con el tema oscuro |
| Stadia Alidade | HTTP 401 sin llave |
| **Esri Dark Gray** | **Sin llave, sin marca de agua, oscuro** ✅ |

> Cuidado: CARTO y OSM responden **200 OK** aunque el tile sea un rechazo — la
> negativa viene dentro del PNG. Verificar el código de estado no basta; hay
> que mirar la imagen.

Los tiles se oscurecen con un filtro CSS sobre `.leaflet-tile-pane` para que
la ruta rosa siga siendo lo más brillante en pantalla. El filtro se aplica
solo a los tiles, así que los marcadores conservan su color real.

### Ruta y encuadre

La ruta es una curva de Bézier cuadrática entre origen y destino (`arc()`),
no una ruta por calles reales. `fitBounds` usa padding asimétrico
(`paddingBottomRight`) para dejar el trazo en la banda visible sobre el panel
de reserva.

## Tarifas

Se calculan en `lib/data.ts`: banderazo + costo por kilómetro + costo por
minuto, asumiendo un promedio de 18 km/h por el tráfico de la ciudad. Los
montos se formatean en MXN con `Intl.NumberFormat`.

La distancia usa la fórmula de haversine sobre coordenadas reales, con un
factor de rodeo de 1.35 — las calles nunca son línea recta. Es una
estimación honesta, no una ruta calculada.

## Páginas públicas

| Ruta | Contenido |
|---|---|
| `/` | App de reserva con mapa |
| `/servicios` | Las cuatro categorías explicadas, con tarifa de ejemplo |
| `/tarifas` | Cómo se calcula el precio, comparativa y rutas de ejemplo |
| `/nosotros` | Quiénes somos, seguridad y cobertura |
| `/contacto` | Formulario, canales de atención y cobertura |

Se navega desde el menú de pantalla completa (el botón ☰ del encabezado),
que además incluye `/entrar` — el acceso al panel de flota — separado por una
línea y con menor jerarquía, porque no es una página pública sino la entrada
para operadores.

Las rutas viven en `src/lib/nav.ts`. `NAV` alimenta el menú; `FOOTER_NAV`
alimenta el pie de página y excluye `/entrar`.

`/servicios` y `/tarifas` calculan sus precios con las mismas funciones que
usa la reserva (`fareFor`, `distanceKm`), así que nunca se desfasan de la app.

> El menú se monta con `createPortal` sobre `document.body`. Es necesario: el
> encabezado crea su propio contexto de apilamiento, y ahí dentro un
> `z-index` alto no alcanza para cubrir el panel de reserva.

### Formulario de contacto

Valida en el navegador y otra vez en el servidor con Zod. **No envía correos
todavía**: el mensaje se escribe en la consola del servidor
(`src/app/contacto/actions.ts`). Falta conectar un proveedor de correo.

## Flota y backend

### Rutas

| Ruta | Qué hace |
|---|---|
| `/entrar` | Alta y acceso de operadores |
| `/flota` | Panel de flota (requiere sesión) |
| `GET /api/drivers` | Lista de conductores (pública) |
| `POST /api/drivers` | Alta de conductor (requiere sesión) |
| `PATCH /api/drivers/:id` | Cambia estado (requiere sesión) |
| `DELETE /api/drivers/:id` | Elimina conductor (requiere sesión) |
| `POST /api/assign` | Asigna conductor disponible al reservar |

### Base de datos

**MySQL / MariaDB remoto** (Hostinger) con `mysql2`. La conexión se configura
con las variables `DB_*` de `.env.local`; nunca van en el código. Si la
contraseña lleva `#`, ponla entre comillas simples.

El esquema está en `src/lib/db/schema.sql` y se aplica solo (con
`CREATE TABLE IF NOT EXISTS`) en la primera consulta de cada proceso. Todas las
fechas se guardan en UTC.

Hostinger solo acepta conexiones desde IPs permitidas en hPanel →
*Bases de datos* → *MySQL remoto*. Para Vercel, cuyas IPs cambian, hay que
permitir cualquier host (`%`).

Tres tablas: `users`, `sessions` y `drivers`.

### Autenticación

Cuentas reales con `scrypt` (módulo `crypto` de Node, sin dependencias
externas): salt aleatorio por contraseña, comparación en tiempo constante y
sesiones en cookie `httpOnly` + `sameSite=lax`, válidas 30 días.

El login responde el mismo mensaje con correo inexistente o contraseña
incorrecta, para no revelar qué correos están registrados.

### Cómo se conecta con la reserva

Al confirmar un viaje, `/api/assign` busca un conductor con `status =
'available'` del servicio elegido y devuelve el más cercano al punto de
origen. Si no hay ninguno, la app muestra el error en pantalla.

> El arreglo `DRIVERS` fijo ya no existe: los conductores del panel son los
> que aparecen en la reserva.

## Despliegue en Vercel

Configura las mismas variables `DB_*` en *Project Settings → Environment
Variables*. Los datos viven en la base remota, así que sobreviven a despliegues
y arranques en frío.

Dos detalles que hacen falta para que el despliegue funcione:

- La conexión es **perezosa**: `next build` evalúa cada módulo de ruta para leer
  su configuración, y conectarse al importar haría que el build dependiera de la
  base.
- `schema.sql` se lee en tiempo de ejecución con una ruta armada desde
  `process.cwd()`, que el trazador de archivos no puede seguir. Va declarado en
  `outputFileTracingIncludes` dentro de `next.config.ts`; si no, el bundle sale
  sin el archivo y toda consulta truena.
- Cada instancia abre un pool de hasta 5 conexiones. El hosting compartido
  limita las conexiones por usuario; si aparece `ER_TOO_MANY_USER_CONNECTIONS`,
  baja `connectionLimit` en `src/lib/db/index.ts`.

## Pendientes para producción

Los datos son estáticos y el viaje es una simulación. Para llevarlo a real
faltaría: geolocalización y autocompletado de direcciones, ruteo real por
calles (OSRM o similar) con tráfico en vivo, pagos, seguimiento por websocket.

Sobre la flota, falta: verificación de documentos (licencia, tarjetón
SEMOVI), roles de administrador frente a operador, límite de intentos de
acceso, edición de conductores y bitácora de cambios. El estado del conductor
se cambia a mano; en producción lo movería el sistema al aceptar o terminar
un viaje.
