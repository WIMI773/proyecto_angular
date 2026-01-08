import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { tokenInterceptor } from '../interceptors/token.interceptors';

export const appProviders = [
  provideRouter(routes),
  provideHttpClient(withInterceptors([tokenInterceptor])),
  provideAnimationsAsync()
];
