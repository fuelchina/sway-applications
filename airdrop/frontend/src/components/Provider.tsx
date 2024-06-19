"use client"

import React from 'react';
import { FuelProvider } from '@fuels/react';
import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
  FueletWalletConnector,
} from '@fuels/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
// 合约id
// 0xf8c99476762a8f85d4194816618fe7545fc2e40c3d0f92927d82ce55ed3cdc9b
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        fuelConfig={{
          connectors: [
            new FuelWalletConnector(),
            new FuelWalletDevelopmentConnector(),
            new FueletWalletConnector(),
          ],
        }}
      >
        {children}
      </FuelProvider>
    </QueryClientProvider>
  )
}

export default Provider