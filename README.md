## Proyecto de scraping

1.- Requerimientos:

    - Autenticación de usuarios
    - Lectura del endpoint de okwu
    - Interfaz de frontend funcional

2.- Tecnologías:

    - Backend: Python 3.14 + FastAPI, por la simpleza del framework para esta tarea mas sucinta, además de la documentación automática y facilidad para manejar y normalizar datos.
    - Frontend: Node.js + Vue 22.3, por la simpleza del framework para esta tarea mas sucinta, además de la lectura nativa de la estructura JSON y facilidad de usar templates.
    - Base de datos: PostgreSQL, por la comodidad que ya hemos adquirido por uso repetido en este ramo.
    - Docker: Para despliegue y compilación rápida.

3.- Estrategia de control de versiones:

    - Como somos solamente dos developers y el proyecto es corto, usaremos una branch por persona y una main.

4.- Estructura de carpetas:

    - Frontend:

# Scraping-Vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# Scraping-FastApi

A project created with FastAPI CLI.

## Quick Start

### Start the development server

```bash
uv run fastapi dev
```

Visit http://localhost:8000

### Deploy to FastAPI Cloud

> FastAPI Cloud is currently in private beta. Join the waitlist at https://fastapicloud.com

```bash
uv run fastapi deploy
```

## Project Structure

- `main.py` - Your FastAPI application
- `pyproject.toml` - Project dependencies

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [FastAPI Cloud](https://fastapicloud.com)
