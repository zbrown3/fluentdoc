import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const DEFAULT_LOCAL_BACKEND_URL = 'http://127.0.0.1:8080';

@Injectable({
  providedIn: 'root',
})
export class BackendConfigService {
  private baseUrl = DEFAULT_LOCAL_BACKEND_URL;
  private initPromise: Promise<void> | null = null;

  initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.resolveBaseUrl();
    return this.initPromise;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async resolveBaseUrl(): Promise<void> {
    let resolvedBaseUrl = DEFAULT_LOCAL_BACKEND_URL;

    if (typeof window !== 'undefined' && window.fluentdoc?.getBackendInfo) {
      try {
        const backendInfo = await Promise.resolve(
          window.fluentdoc.getBackendInfo()
        );
        if (backendInfo?.baseUrl) {
          resolvedBaseUrl = backendInfo.baseUrl;
        }
      } catch (error) {
        console.error('Failed to read backend info from Electron:', error);
      }
    }

    this.baseUrl = resolvedBaseUrl.replace(/\/$/, '');
    // Keep existing callers that still read environment.baseUrl working.
    environment.baseUrl = this.baseUrl;

    const defaultDesktopUserId =
      'desktopDefaultUserId' in environment
        ? environment.desktopDefaultUserId
        : undefined;
    if (
      environment.desktopMode &&
      typeof localStorage !== 'undefined' &&
      defaultDesktopUserId &&
      !localStorage.getItem('userId')
    ) {
      localStorage.setItem('userId', defaultDesktopUserId);
    }
  }
}

export function backendConfigInitializerFactory(
  backendConfigService: BackendConfigService
): () => Promise<void> {
  return () => backendConfigService.initialize();
}
