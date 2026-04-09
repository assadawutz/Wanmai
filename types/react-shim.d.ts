declare namespace JSX {
  interface Element {}
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
  type Dispatch<T> = (value: T | ((prev: T) => T)) => void;
}

declare module 'react' {
  export type ReactNode = any;
  export type Dispatch<T> = (value: T | ((prev: T) => T)) => void;
  export interface Context<T> {
    Provider: (props: { value: T; children?: any }) => JSX.Element;
  }
  export function createContext<T>(value: T): Context<T>;
  export function useContext<T>(ctx: Context<T>): T;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useReducer<T, A>(reducer: (state: T, action: A) => T, initial: T): [T, Dispatch<A>];
  export function useState<T>(initial: T): [T, Dispatch<T>];
  export function useEffect(effect: () => void, deps: unknown[]): void;
}

declare module 'next' {
  export type NextPage<P = any> = (props: P) => JSX.Element;
}

declare module 'next/app' {
  export interface AppProps { Component: any; pageProps: any; }
}

declare module 'next/link' {
  export default function Link(props: { href: string; className?: string; children?: any; [key: string]: any }): JSX.Element;
}

declare module 'next/router' {
  export function useRouter(): { query: Record<string, string | string[] | undefined> };
}
