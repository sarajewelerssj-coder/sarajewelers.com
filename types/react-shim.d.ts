// Temporary shim to unblock TypeScript when React types are not resolved
declare module 'react';
declare module 'react/jsx-runtime';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

