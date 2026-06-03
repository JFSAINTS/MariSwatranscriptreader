import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.jfsaints.mariswa',
  appName: 'Mari Swa Reader',
  webDir: 'dist',
  server: {
    url: 'https://jfsaints.github.io/MariSwatranscriptreader/',
    cleartext: false,
  },
};

export default config;
