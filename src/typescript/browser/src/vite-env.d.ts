/// <reference types="vite/client" />

// Declare module for ?url imports
declare module '*?url' {
  const url: string;
  export default url;
}

// Declare module for ?worker imports
declare module '*?worker' {
  const WorkerFactory: new () => Worker;
  export default WorkerFactory;
}

// Declare module for ?worker&url imports
declare module '*?worker&url' {
  const url: string;
  export default url;
}
