# React Tutorial
Este tutorial está pensado como una **guía práctica y ordenada** para introducirse en React.  
No es un curso original desde cero: muchos ejemplos provienen de recursos ya existentes, como:

- El curso de [freeCodeCamp en YouTube](https://www.youtube.com/watch?v=x4rFhThSX04).  
- Partes del curso de [Desarrollo Web en Udemy](https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/37806286#overview).  
- La propia [documentación oficial de React](https://es.react.dev/learn).  

A estos materiales he añadido mis propios apuntes, comentarios y estructura, con el objetivo de **unificar conocimientos dispersos en un solo documento en español**. Básicamente, la guía que me hubiese gustado tener cuando empecé a aprender React.  

## Conocimientos previos necesarios
Para poder seguir con soltura este tutorial, conviene tener una base en:
- **HTML** (estructura de páginas web).  
- **CSS** (estilos básicos).  
- **JavaScript** (tipos de datos, funciones, condicionales, bucles, etc.).  

También es recomendable entender qué es el **DOM** y cómo manipularlo con JavaScript, ya que muchos conceptos de React tienen que ver con abstraer y simplificar ese trabajo.  

Si aún no tienes esas bases, mi recomendación es repasar primero esos temas y luego volver aquí: React será mucho más fácil de entender.  

---

## Quick menu
- [Introducción](#introducción)
- [Getting Started](#getting-started)
- [Contenido del tutorial](#índice-de-contenidos-y-navegación)  

---

## Introducción

[React](https://react.dev/) es una biblioteca de JavaScript para construir interfaces de usuario.  
Su filosofía principal es **componer la interfaz a partir de componentes reutilizables**, lo que hace que las aplicaciones sean más fáciles de mantener y escalar.

### ¿Qué es React?
React no es un framework completo, sino una biblioteca enfocada en la **capa de vista** (UI). Permite describir cómo debería verse la interfaz en función del estado de la aplicación, y se encarga de actualizar la página de manera eficiente cuando ese estado cambia.

### ¿Cómo funciona?
React utiliza un concepto llamado **Virtual DOM**:
- El DOM virtual es una representación en memoria del DOM real.
- Cuando el estado cambia, React compara la versión nueva con la anterior (**diffing**) y solo actualiza lo necesario en el DOM real (**reconciliación**).
- Esto lo hace mucho más rápido y eficiente que manipular el DOM directamente.

### Arquitectura SPA
Normalmente, React se usa para construir **Single Page Applications (SPA)**.  
Una SPA es una aplicación web que:
- Se carga una sola vez en el navegador.
- Navega entre vistas y actualiza contenido dinámicamente sin recargar toda la página.
- Ofrece una experiencia más fluida y cercana a una aplicación de escritorio o móvil.

### React y Vite
En lugar de herramientas más pesadas como Create React App, hoy en día se suele usar [Vite](https://vitejs.dev/) para iniciar proyectos con React:
- Es más rápido gracias a su sistema de compilación basado en **ES Modules**.
- Tiene hot reload inmediato (los cambios aparecen en la app casi al instante).
- Configura por defecto un entorno moderno con `main.jsx` como punto de entrada.

En este tutorial partiremos de Vite para crear un proyecto y aprender los fundamentos de React paso a paso.

---

## Getting Started
Necesitamos tener instalado [Node.js](https://nodejs.org/es/download).

Tras la instalación, tendremos npm para instalar dependencias. 

Para crear un proyecto utilizaremos vite.

```bash
npm create vite@latest
```

Nos movemos a la carpeta del proyecto creado.

```bash
cd first_react
```

Hacemos la instalación de las dependencias.
```bash
npm install
```

Aquí podemos lanzar VSCode.
```bash
code .
```

Y dentro abrir un terminal y ejecutar el servidor.
```bash
npm run dev
```

Hay que tener en cuenta que: 
- **Vite usa `main.jsx` como punto de entrada por convención**, aunque en otros proyectos React suele llamarse `index.jsx`. Los archivos se cargan como **ES Modules** (el estándar de JavaScript para usar `import`/`export` en el navegador). 
- React con Vite usa ES Modules y necesita un type="module" para cargar los scripts .jsx

Es decir, en nuestro index.html cargaremos el script main.jsx de la siguiente manera:
```html
<script type="module" src="src/main.jsx"></script> 
```
--- 

## Índice de contenido del tutorial y navegación
- [Introducción](#introducción)
- [Getting Started](#getting-started)  
- [Static Pages](./docs/01_StaticPages.md) 
- [Data Driven React](./docs/02_DataDrivenReact.md) 
- [React State](./docs/03_ReactState.md)
- [React State Intermediate](./docs/04_ReactStateIntermediate.md)
- [Component Design](./docs/05_ComponentDesign.md)
- [React Effects](./docs/06_SideEffects.md)
- [Build y despliegue (Producción)](./docs/BuildYDespliegue.md)

---
