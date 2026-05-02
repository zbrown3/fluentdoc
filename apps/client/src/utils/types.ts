export type User = {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  experience?: string;
  bannerUrl?: string;
};

export type Language = {
  collaborators?: any[];
  creator: any;
  creatorId: string;
  dateCreated?: string;
  description?: string;
  flagUrl?: string | null;
  id: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  name: string;
  privacyLevel: 'PRIVATE' | 'PUBLIC';
  reasons?: string[];
  showAllLanguageTypes?: boolean;
  story?: {
    id?: string;
  };
  types?: string[];
  progressPercentage?: number;
};

export type LanguageType = {
  key: string;
  type: string;
  description: string;
  examples: string[];
};

export type LanguagePurpose = {
  key: string;
  description: string;
  icon: string;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  status?: string;
}

export interface BaseViewSection {
  content: string | null;
  hasTable?: boolean;
  meta?: Record<string, unknown> | null;
  subsections?: BaseViewSection[] | null;
  subtitle?: string | null;
  title?: string | null;
}

export interface LanguageStats {
  likes?: number;
  comments?: number;
  stars?: number;
}

export interface LanguageView
  extends Omit<
    Language,
    'creatorId' | 'privacyLevel' | 'showAllLanguageTypes' | 'story'
  > {
  creator: Omit<User, 'bio' | 'experience'>;
  isPublic: boolean;
  overview: {
    sections?: BaseViewSection[];
  } | null;
  dictionary: VocabularyWord[] | null;
  phrases: Phrase[] | null;
  stories: Story;
  languageStats: LanguageStats;
  viewSettings: LanguageViewSettings;
}

export interface LanguageViewSettings {
  includeLanguageFlag: boolean;
  useFlagColors: boolean;
  colors?: {
    primary: string;
    secondary: string;
  };
  hiddenSections?: string[];
}
export interface Phrase {
  meaning: string;
  notes: string;
  phrase: string;
  pronunciation: string;
}

export interface Story {
  content?: string;
  dateCreated?: string;
  id: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  title?: string;
}

export interface VocabularyWord {
  meaning: string;
  notes: string;
  pos: string;
  pronunciation: string;
  word: string;
}

