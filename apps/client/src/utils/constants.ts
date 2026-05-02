export const APP_WEBSITE = 'https://www.fluentdoc.com';

/** Neutral background behind circular profile images (no custom avatars). */
export const PROFILE_IMAGE_BACKGROUND_DEFAULT = '#f0f0f0';

export const APP_ROUTES = {
  DASHBOARD: { key: 'dashboard', path: '/dashboard' },
  ERROR_PAGE_NOT_FOUND: {
    key: 'errorPageNotFound',
    path: '/error/page-not-found',
  },
  ERROR_UNSUPPORTED_DEVICE: {
    key: 'errorUnsupportedDevice',
    path: '/error/unsupported-device',
  },
  GLOSSARY: { key: 'glossary', path: '/glossary' },
  LANGUAGE: { key: 'language', path: '/language' },
  LOGIN: { key: 'login', path: '/login' },
  ONBOARDING: { key: 'onboarding', path: '/onboarding' },
  PREVIEW_LANGUAGE: { key: 'previewLanguage', path: '/preview' },
  RESET_PASSWORD: { key: 'resetPassword', path: '/reset-password' },
  VIEW_LANGUAGE: { key: 'viewLanguage', path: '/view' },
  WELCOME: { key: 'welcome', path: '/welcome' },
};

export const PLAN_TYPES = {
  STARTER: 'STARTER',
  CREATOR: 'CREATOR',
  FOUNDING_CREATOR: 'FOUNDING_CREATOR',
};

export const PRIVACY_LEVELS = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
};

export const PDF_EXPORT_TYPES = {
  LANGUAGE_GUIDE: { key: 'language-guide' },
  DICTIONARY: { key: 'dictionary' },
  PHRASE_BOOK: { key: 'phrase-book' },
};

export const MIN_WINDOW_SIZE = 768;
export const FD_STORAGE_KEYS = {
  IS_FTU: 'fd-isFTU',
  CURRENT_URL: 'fd-currentUrl',
  PREVIOUS_URL: 'fd-previousUrl',
};

export const CHECKLIST_TYPES = {
  GETTING_STARTED: 'GETTING_STARTED',
};

export const TYPE_DICTIONARY = 'dictionary';
export const TYPE_PHRASES = 'phrases';

export const FILE_TYPE_PNG = 'image/png';

export const SHOW_FTU_TOUR = 'showFtuTour';
export const SHOW_LANGUAGE_TOUR = 'showLanguageTour';

export const PLACEHOLDER_INTRO =
  'Outline the purpose and goals of constructed languages, share a personal introduction about yourself, or go into the inspiration behind your conlang and why you created it.';

export const DATE_FORMAT = 'yyyy MMMM dd';
export const RECEIPT_DATE_FORMAT = 'MMMM d, y';

export const VIEWS = {
  CARD: 'card',
  LIST: 'list',
};

export const LANGUAGE_VIEW_MODES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  PUBLIC: 'public',
} as const;

export const DEFAULT_PAGINATION_CONFIG = {
  disabled: false,
  hidePageSize: false,
  length: 0,
  pageSizeOptions: [5, 10, 25, 100],
  pageSize: 10,
  pageIndex: 0,
  showFirstLastButtons: true,
  showPageSizeOptions: true,
};
