interface RuntimeHealth {
  geminiConfigured: boolean;
  ollamaReachable: boolean;
  provider: 'hybrid' | 'manual';
  state: 'ready' | 'degraded';
  checkedAt: string;
}

async function checkOllama(): Promise<boolean> {
  try {
    const response = await fetch((globalThis as any)?.process?.env?.OLLAMA_HEALTH_URL ?? 'http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default async function handler(_req: any, res: any): Promise<void> {
  const geminiConfigured = Boolean((globalThis as any)?.process?.env?.GEMINI_API_KEY);
  const ollamaReachable = await checkOllama();

  const state: RuntimeHealth = {
    geminiConfigured,
    ollamaReachable,
    provider: geminiConfigured && ollamaReachable ? 'hybrid' : 'manual',
    state: geminiConfigured && ollamaReachable ? 'ready' : 'degraded',
    checkedAt: new Date().toISOString()
  };

  res.status(200).json(state);
}
