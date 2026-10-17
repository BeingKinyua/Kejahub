/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PropertyProvider } from './context/PropertyContext';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <PropertyProvider>
      <AppShell />
    </PropertyProvider>
  );
}
