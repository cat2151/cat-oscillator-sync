/// <reference types="vite/client" />

// Type declarations for Vite worker imports
declare module '*?worker&url' {
  const workerUrl: string;
  export default workerUrl;
}
