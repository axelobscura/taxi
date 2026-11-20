# TAXI-MEX · Taxis CDMX

App de reserva de taxis para la Ciudad de México, en español e inglés.
Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 y MySQL.

## Arrancar

```bash
npm install
npm run dev                  # http://localhost:3000
```

Crea `.env.local` con las variables `DB_HOST`, `DB_PORT`, `DB_USER`,
`DB_PASSWORD` y `DB_NAME` (ver *Base de datos*). Las tablas se crean solas en
la primera consulta. Opcionales: `NEXT_PUBLIC_SITE_URL` (por defecto
`https://taxi.org.mx`), `NEXT_PUBLIC_GA_ID` (Google Analytics 4),
`GOOGLE_SITE_VERIFICATION` (Search Console) y `ADMIN_EMAILS` (ver *Roles*).

`npm run build` para producción, `npm run lint` para revisar el código. No hay
pruebas automatizadas.

> `build` usa `next build --webpack` a propósito: en el hosting, Turbopack
> fallaba al levantar su proceso de PostCSS. En desarrollo se sigue usando
> Turbopack.

## Cómo funciona

La reserva vive en `src/app/[lang]/RideBooker.tsx` (montada desde la portada,
`src/app/[lang]/page.tsx`) y avanza por tres etapas:

| Etapa | Qué ve el usuario |
|---|---|
| `search`  | Elige origen y destino desde lugares reales de la CDMX |
| `confirm` | Compara las cuatro categorías con tarifa y tiempo de llegada |
| `riding`  | Datos del conductor, placa, cuenta regresiva y total |

## Estructura

```
src/
  proxy.ts          Reescritura de URLs por idioma (ver *Idiomas*)
  app/
    [lang]/         Sitio público (es, en): layout raíz, portada y páginas
    (ops)/          Panel (/entrar, /flota, /flota/usuarios): layout raíz propio, solo español
    api/            Conductores, cuentas y asignación de viajes
    globals.css     Tokens de color, animaciones, utilidades
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    RootShell.tsx   <html>/<body>, fuentes y GA compartidos por los dos layouts raíz
    CityMap.tsx     Mapa Leaflet con ruta y encuadre automático
    Landing.tsx     Piezas y JSON-LD de las páginas de cobertura
  i18n/             Idiomas, diccionarios y helpers de servidor/cliente
  lib/
    data.ts         Lugares, categorías y tarifas
    cities.ts       Ciudades y zonas de las páginas /taxi (inglés en cities.en.ts)
    site.ts         Marca, URL pública y metadata por página
    db/             Conexión MySQL y schema.sql
    auth.ts         Contraseñas, sesiones y roles
    users.ts        Gestión de cuentas (solo administradores)
    drivers.ts      Alta, estado y asignación de conductores
  fonts/            Montserrat y Outfit, servidas localmente
```

## Idiomas

El español es el idioma por defecto y va **sin prefijo** (`/tarifas`); el
inglés vive bajo `/en` (`/en/tarifas`). Ambos se renderizan desde
`app/[lang]`: `src/proxy.ts` reescribe por dentro las rutas sin prefijo a
`/es/...` y redirige (308) cualquier `/es/...` visible a su forma sin prefijo,
para no duplicar páginas en buscadores.

- Los enlaces internos se arman con `localePath(lang, ruta)` de
  `src/i18n/config.ts`.
- Los Server Components leen el idioma con `getLang()` / `getI18n()`
  (`src/i18n/server.ts`); los Client Components, con `useI18n()`.
- Los textos compartidos están en `src/i18n/dictionaries.ts`; los propios de
  cada página, junto a ella (p. ej. `app/[lang]/taxi/copy.ts`).
- El panel de flota no se traduce y queda fuera del proxy, igual que `/api`.
  Si agregas una ruta fuera de `[lang]`, exclúyela en el `matcher` del proxy.

## Lenguaje visual

Amarillo taxi sobre negro noche, con secciones claras (`.theme-light`) para
páginas de contenido, tarifas y el panel de reserva. Los colores son tokens en
el bloque `@theme` de `globals.css`; `.theme-light` reasigna esas mismas
variables, así que `bg-ink-*`, `text-cream` y `text-muted` cambian solos dentro
de esa sección. `--color-accent` pasa a ámbar oscuro porque el texto amarillo
no se lee sobre blanco.

Tipografía: Montserrat para títulos y Outfit para texto. Se sirven desde
`src/fonts/` con `next/font/local` porque `next/font/google` rompía el build
en el hosting. La etiqueta pequeña en mayúsculas sobre los encabezados es
`.eyebrow`.

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
la ruta amarilla siga siendo lo más brillante en pantalla. El filtro se aplica
solo a los tiles, así que los marcadores conservan su color real.

### Ruta y encuadre

La ruta es una curva de Bézier cuadrática entre origen y destino (`arc()`),
no una ruta por calles reales. El mapa se encuadra con `fitBounds` para que
origen, destino y trazo queden a la vista.

## Tarifas

Se calculan en `lib/data.ts`: banderazo + costo por kilómetro + costo por
minuto, asumiendo un promedio de 18 km/h por el tráfico de la ciudad. Los
montos se formatean en MXN con `Intl.NumberFormat`.

La distancia usa la fórmula de haversine sobre coordenadas reales, con un
factor de rodeo de 1.35 — las calles nunca son línea recta. Es una
estimación honesta, no una ruta calculada.

## Páginas públicas

Todas existen también en inglés bajo `/en`.

| Ruta | Contenido |
|---|---|
| `/` | App de reserva con mapa |
| `/servicios` | Las cuatro categorías explicadas, con tarifa de ejemplo |
| `/tarifas` | Cómo se calcula el precio, comparativa y rutas de ejemplo |
| `/taxi` | Cobertura: índice de ciudades y zonas |
| `/taxi/[ciudad]` y `/taxi/[ciudad]/[zona]` | Páginas de cobertura para buscadores, con tarifas de ejemplo y preguntas frecuentes |
| `/nosotros` | Quiénes somos, seguridad y cobertura |
| `/contacto` | Formulario, canales de atención y cobertura |

Las páginas de ciudad y zona se generan en el build a partir de
`src/lib/cities.ts` (`dynamicParams = false`: una ciudad o zona que no esté
ahí da 404). Cada página arma su metadata con `pageMetadata()` de
`src/lib/site.ts`, que agrega la URL canónica y las alternativas `hreflang`.

Se navega desde el menú de pantalla completa (el botón ☰ del encabezado),
que además incluye `/entrar` — el acceso al panel de flota — separado por una
línea y con menor jerarquía, porque no es una página pública sino la entrada
para operadores.

Las rutas viven en `src/lib/nav.ts`: `NAV` alimenta el menú y el pie de
página, y `LOGIN_PATH` es `/entrar`. Los nombres de cada ruta salen de la
sección `nav` del diccionario.

`/servicios`, `/tarifas` y las páginas de cobertura calculan sus precios con
las mismas funciones que usa la reserva (`fareFor`, `distanceKm`), así que
nunca se desfasan de la app.

> El menú se monta con `createPortal` sobre `document.body`. Es necesario: el
> encabezado crea su propio contexto de apilamiento, y ahí dentro un
> `z-index` alto no alcanza para cubrir el panel de reserva.

### Formulario de contacto

Valida en el navegador y otra vez en el servidor con Zod. **No envía correos
todavía**: el mensaje se escribe en la consola del servidor
(`src/app/[lang]/contacto/actions.ts`). Falta conectar un proveedor de correo.

## Flota y backend

### Rutas

| Ruta | Qué hace |
|---|---|
| `/entrar` | Alta y acceso al panel |
| `/flota` | Panel de flota (requiere sesión) |
| `/flota/usuarios` | Cuentas del panel (solo administradores) |
| `GET /api/drivers` | Lista de conductores (pública) |
| `POST /api/drivers` | Alta de conductor (requiere sesión) |
| `PATCH /api/drivers/:id` | Cambia estado (requiere sesión) |
| `DELETE /api/drivers/:id` | Elimina conductor (requiere sesión) |
| `GET /api/users` | Lista de cuentas (solo administradores) |
| `POST /api/users` | Crea una cuenta con su rol (solo administradores) |
| `PATCH /api/users/:id` | Cambia el rol de una cuenta (solo administradores) |
| `DELETE /api/users/:id` | Elimina una cuenta (solo administradores) |
| `POST /api/assign` | Asigna conductor disponible al reservar |

### Base de datos

**MySQL / MariaDB remoto** (Hostinger) con `mysql2`. La conexión se configura
con las variables `DB_*` de `.env.local`; nunca van en el código. Si la
contraseña lleva `#`, ponla entre comillas simples.

El esquema está en `src/lib/db/schema.sql` y se aplica solo (con
`CREATE TABLE IF NOT EXISTS`) en la primera consulta de cada proceso. Todas las
fechas se guardan en UTC.

Si cambias `schema.sql` o el arranque de la base en `src/lib/db/index.ts`,
sube `SCHEMA_VERSION` en ese archivo: así un servidor de desarrollo que ya
estaba corriendo lo vuelve a aplicar tras la recarga en caliente.

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

### Roles

Hay dos roles: `operator` gestiona la flota y `admin` además gestiona las
cuentas del panel en `/flota/usuarios`. Las reglas viven en `src/lib/auth.ts`
y `src/lib/users.ts`:

- La **primera cuenta** que se registra es administrador; las siguientes que
  se registran desde `/entrar` son operadores. Un administrador puede crear
  cuentas con cualquier rol y cambiar o quitar roles.
- `ADMIN_EMAILS` (opcional, correos separados por comas): esas cuentas se
  vuelven administrador al registrarse o al entrar. Nunca se degradan. Sirve
  para recuperar el acceso si se pierden todos los administradores.
- Siempre queda **al menos un administrador**: no se puede degradar ni
  eliminar al último, y nadie puede eliminar su propia cuenta. Si una base
  vieja no tiene ninguno, al arrancar se promueve la cuenta más antigua.
- Un valor de rol desconocido en la base se trata como `operator`.

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

Detalles que hacen falta para que el despliegue funcione:

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
SEMOVI), límite de intentos de acceso, edición de conductores y bitácora de
cambios. El registro en `/entrar` sigue abierto: cualquiera puede crear una
cuenta de operador y gestionar conductores, así que en producción habría que
cerrarlo y dejar el alta de cuentas solo a los administradores. El estado del conductor
se cambia a mano; en producción lo movería el sistema al aceptar o terminar
un viaje.
