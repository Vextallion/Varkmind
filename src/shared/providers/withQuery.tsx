import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { queryClient } from '@shared/api/queryClient';

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
