export const environment = {
  production: false,
  desktopMode: true,
  /** When set, desktop bootstrap seeds localStorage userId if missing. */
  desktopDefaultUserId: 'desktop-local-user',

  // resolved at runtime by BackendConfigService
  baseUrl: '',
  domain: 'localhost'
};
