import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.224421d98ecf4d25a187b9492eed9ad0',
  appName: 'ssh-buddy-connect',
  webDir: 'dist',
  server: {
    url: 'https://224421d9-8ecf-4d25-a187-b9492eed9ad0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;