export interface ProviderConfig {
  id: string;
  enabled: boolean;
  isDefault: boolean;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  timeout: number;
  streaming: boolean;
  models: string[];
  connectionStatus?: string;
}

export interface ProviderDefinition {
  id: string;
  name: string;
  logo: string;
  color: string;
  category: 'cloud' | 'local' | 'compatible';
  defaultBaseUrl: string;
  needsApiKey: boolean;
  supportsFetchModels: boolean;
  defaultModel: string;
  description: string;
}

export const PROVIDER_DEFS: ProviderDefinition[] = [
  { id: 'ollama', name: 'Ollama', logo: '🦙', color: '#5B5B5B', category: 'local', defaultBaseUrl: 'http://localhost:11434', needsApiKey: false, supportsFetchModels: true, defaultModel: '', description: 'Local LLM server' },
  { id: 'lmstudio', name: 'LM Studio', logo: '🎯', color: '#4A90D9', category: 'local', defaultBaseUrl: 'http://localhost:1234/v1', needsApiKey: false, supportsFetchModels: true, defaultModel: '', description: 'Local model runner' },
  { id: 'openai', name: 'OpenAI', logo: '⚡', color: '#10A37F', category: 'cloud', defaultBaseUrl: 'https://api.openai.com/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: 'gpt-4o', description: 'GPT-4, GPT-4o, o-series' },
  { id: 'google', name: 'Google AI', logo: '🔮', color: '#4285F4', category: 'cloud', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta', needsApiKey: true, supportsFetchModels: false, defaultModel: 'gemini-2.5-flash', description: 'Gemini models' },
  { id: 'nvidia', name: 'NVIDIA', logo: '🟢', color: '#76B900', category: 'cloud', defaultBaseUrl: 'https://integrate.api.nvidia.com/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: '', description: 'NVIDIA NIM API' },
  { id: 'openrouter', name: 'OpenRouter', logo: '🔀', color: '#FF6B35', category: 'compatible', defaultBaseUrl: 'https://openrouter.ai/api/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: '', description: 'Multi-provider gateway' },
  { id: 'anthropic', name: 'Anthropic', logo: '🌀', color: '#D4A574', category: 'cloud', defaultBaseUrl: 'https://api.anthropic.com/v1', needsApiKey: true, supportsFetchModels: false, defaultModel: 'claude-sonnet-4', description: 'Claude models' },
  { id: 'groq', name: 'Groq', logo: '⚡', color: '#F55036', category: 'compatible', defaultBaseUrl: 'https://api.groq.com/openai/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: '', description: 'Fast inference cloud' },
  { id: 'mistral', name: 'Mistral', logo: '🌬️', color: '#FF6D00', category: 'cloud', defaultBaseUrl: 'https://api.mistral.ai/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: 'mistral-large', description: 'Mistral models' },
  { id: 'deepseek', name: 'DeepSeek', logo: '🔵', color: '#4F6EF7', category: 'compatible', defaultBaseUrl: 'https://api.deepseek.com/v1', needsApiKey: true, supportsFetchModels: true, defaultModel: 'deepseek-chat', description: 'DeepSeek models' },
  { id: 'xai', name: 'xAI (Grok)', logo: '🤖', color: '#1A1A2E', category: 'cloud', defaultBaseUrl: 'https://api.x.ai/v1', needsApiKey: true, supportsFetchModels: false, defaultModel: 'grok-4', description: 'Grok models' },
  { id: 'azure', name: 'Azure OpenAI', logo: '☁️', color: '#0078D4', category: 'cloud', defaultBaseUrl: 'https://YOUR_RESOURCE.openai.azure.com', needsApiKey: true, supportsFetchModels: true, defaultModel: '', description: 'Azure OpenAI Service' },
  { id: 'custom', name: 'Custom OpenAI Compatible', logo: '🔌', color: '#6B7280', category: 'compatible', defaultBaseUrl: '', needsApiKey: false, supportsFetchModels: true, defaultModel: '', description: 'Any OpenAI-compatible API' },
];

export function getProviderDef(id: string): ProviderDefinition | undefined {
  return PROVIDER_DEFS.find(p => p.id === id);
}

export function createDefaultConfig(def: ProviderDefinition): ProviderConfig {
  return {
    id: def.id,
    enabled: false,
    isDefault: false,
    apiKey: '',
    baseUrl: def.defaultBaseUrl,
    model: def.defaultModel,
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1.0,
    timeout: 30,
    streaming: true,
    models: [],
  };
}

export function mergeWithDefaults(providers: ProviderConfig[]): ProviderConfig[] {
  return PROVIDER_DEFS.map(def => {
    const existing = providers.find(p => p.id === def.id);
    return existing ? { ...createDefaultConfig(def), ...existing } : createDefaultConfig(def);
  });
}
