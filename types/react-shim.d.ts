declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
  type Dispatch<T> = (value: T) => void;
}

declare module 'react' {
  export type ReactNode = any;
  export type Dispatch<T> = (value: T) => void;
  export function createContext<T>(value: T): any;
  export function useContext<T>(ctx: any): T;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useReducer<T, A>(reducer: (state: T, action: A) => T, initial: T): [T, Dispatch<A>];
  export function useState<T>(initial: T): [T, Dispatch<T>];
  export function useEffect(effect: () => void, deps: unknown[]): void;
}

declare module 'next/app' {
  export interface AppProps { Component: any; pageProps: any; }
}
