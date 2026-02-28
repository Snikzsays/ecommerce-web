import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    // SSR disabled to avoid hydration issues with dynamic components
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
