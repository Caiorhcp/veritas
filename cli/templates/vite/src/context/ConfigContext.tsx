import { createContext, useContext, type ReactNode } from 'react';
import type { AppConfig } from '@/types/config';

const config: AppConfig = {
  appName: 'App',
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com',
};

const ConfigContext = createContext<AppConfig>(config);

export function ConfigProvider({ children }: { children: ReactNode }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export const useConfig = () => useContext(ConfigContext);
