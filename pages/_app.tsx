import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { WorkspaceProvider } from '../lib/workspace-context';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return <WorkspaceProvider><Component {...pageProps} /></WorkspaceProvider>;
}
