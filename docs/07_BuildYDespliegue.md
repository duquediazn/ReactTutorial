
# Build y despliegue (Producción)

Por último, en esta sección veremos **qué cambia entre desarrollo y producción en Vite**, cómo generar el **build** y las consideraciones típicas de despliegue en una SPA hecha con React.

## Índice de contenidos
- [Dev vs Prod en Vite (visión rápida)](#dev-vs-prod-en-vite-visión-rápida)
- [Comandos esenciales](#comandos-esenciales)
- [Rutas, `public/` y assets](#rutas-public-y-assets)
- [Variables de entorno](#variables-de-entorno)
- [SPA routing (muy importante)](#spa-routing-muy-importante)
- [Dónde desplegar (estático)](#dónde-desplegar-estático)
- [Checklist de producción](#checklist-de-producción)

---

## Dev vs Prod en Vite (visión rápida)

- **Dev (`npm run dev`)**
  - Arranca un servidor local con **HMR** (hot module replacement).
  - Sirve los archivos como **ES Modules** sin “empaquetar” (bundling mínimo).
  - Ideal para iterar rápido; no representa el tamaño/coste real en producción.

- **Prod (`npm run build`)**
  - Genera la carpeta `dist/` con assets listos para servir.
  - Usa **Rollup** para:
    - **bundling** (empaquetado),
    - **code splitting** (carga por chunks),
    - **tree-shaking** (elimina código no usado),
    - **minificación** y **hashing** de archivos para cache busting.

> `npm run preview` levanta un servidor que **simula** producción sobre `dist/`. Útil para comprobar rutas, SPA fallback, etc., **pero no es un servidor para producción**.

---

## Comandos esenciales

- **Desarrollo**  
  `npm run dev`

- **Build de producción**  
  `npm run build`  
  (equivale a `vite build`; genera `dist/`)

- **Previsualizar el build**  
  `npm run preview`  
  (sirve `dist/` en local para pruebas)

## Rutas, `public/` y assets

- **`src/`** → código fuente. Si **importas** una imagen (p. ej. `import logo from './logo.png'`), Vite la procesa, hace **hashing** y la coloca en `dist/assets/…`.
- **`public/`** → archivos estáticos “tal cual”. Acceso por ruta absoluta desde la raíz (p. ej. `/react-logo.png`). No reciben hashing, cuidado con el cacheo.
- **`base`**: si vas a desplegar en un **subdirectorio** (p. ej. GitHub Pages en `/mi-repo/`), ajusta `base` en `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mi-repo/' // cambia esto si la app vive en un subpath
})
```

---

## Variables de entorno

- Los nombres deben empezar por VITE_ para estar disponibles en el cliente.
- Archivos soportados: .env, .env.development, .env.production, etc.
- Lectura en código: import.meta.env.VITE_API_URL

Ejemplo:
```ini
# .env.production
VITE_API_URL=https://api.midominio.com
```

Uso:
```js
fetch(`${import.meta.env.VITE_API_URL}/todos`)
```

## SPA routing (muy importante)

Las SPA suelen usar rutas del lado del cliente (React Router, etc.). En producción, todas las rutas deben resolver a index.html (fallback), o el servidor devolverá 404 al refrescar en /users/42.

- Netlify → crea un archivo _redirects en public/:
```bash
/*    /index.html   200
```
- Vercel → configura un rewrite a /index.html (en vercel.json o dashboard):
```json
{
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```
- GitHub Pages → copia index.html como 404.html o usa spa-github-pages.
- Nginx (ejemplo):

```nginx
location / {
  try_files $uri /index.html;
}
```

---

## Dónde desplegar (estático)

- Vercel / Netlify (muy cómodo para Vite/React).
- GitHub Pages (requiere base si va bajo /usuario/repositorio).
- Cualquier hosting estático / S3+CloudFront / Nginx sirviendo dist/.

>Build directory: apunta a dist/.
>Command: npm run build.

---

## Checklist de producción
- npm run build genera dist/ sin errores.
- Rutas SPA con fallback a index.html.
- base correcto si usas subcarpeta.
- Variables VITE_ configuradas para producción.
- Assets correctos: public/ para estáticos “tal cual”, import para gestionados por Vite.
- Prueba local con npm run preview antes de subir.