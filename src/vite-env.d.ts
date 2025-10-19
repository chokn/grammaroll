/// <reference types="vite/client" />

// Allow importing SVG files as URLs (default Vite behavior)
declare module '*.svg' {
  const src: string
  export default src
}

