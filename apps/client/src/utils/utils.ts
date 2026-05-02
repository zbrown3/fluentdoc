import { DatePipe, TitleCasePipe } from '@angular/common';
import {DATE_FORMAT, PRIVACY_LEVELS, RECEIPT_DATE_FORMAT} from './constants';
import {
  LanguageTypes,
  LanguagePurposes,
  VIEW_LANGUAGE_MAP_DETAIL,
} from '../app/common/utils/constants';
import { type LanguageView } from '../utils/types';

export const getFormattedTitle = (title: string) => {
  const titleCasePipe = new TitleCasePipe();
  return titleCasePipe.transform(title) || '';
};

export const getFormattedDate = (dateString: string) => {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(dateString, DATE_FORMAT) || '';
};

export const getFormattedReadableDate = (dateString: string) => {
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(dateString, RECEIPT_DATE_FORMAT) || '';
};

export const getExperienceSelectionIcon = (experienceValue: string) => {
  switch (experienceValue) {
    case 'HOBBYIST':
      return 'ph-smiley-wink';
    case 'ADVANCED':
      return 'ph-student';
    default:
      return 'ph-map-trifold';
  }
};

export const getLanguageTypes = (typeIdList: string[]) => {
  if (!typeIdList || typeIdList.length === 0) {
    return '';
  }

  const isSingleType = typeIdList.length === 1;

  const languagetTypeDisplayed = typeIdList.reduce((acc, typeId) => {
    return (
      acc +
      (getLanguageTypeById(typeId)?.type || '') +
      (isSingleType ? '' : ', ')
    );
  }, '');

  return languagetTypeDisplayed;
};

export const getLanguageTypeById = (type: string) => {
  return LanguageTypes.find(
    (languageType) => languageType.key === type.toUpperCase()
  );
};

export const getLanguagePurposes = (purposeIdList: string[]) => {
  if (!purposeIdList || purposeIdList.length === 0) {
    return '';
  }

  const isSinglePurpose = purposeIdList.length === 1;

  const languagePurposeDisplayed = purposeIdList.reduce((acc, purposeId) => {
    return (
      acc +
      '#' +
      (getLanguagePurposeById(purposeId)?.description || '') +
      (isSinglePurpose ? '' : ' ')
    );
  }, '');

  return languagePurposeDisplayed;
};

export const getLanguagePurposeById = (purpose: string) => {
  return LanguagePurposes.find(
    (languagePurpose) => languagePurpose.key === purpose.toUpperCase()
  );
};

/**
 * Generic function to filter a dictionary of arrays by a search term.
 * @param dictionary The dictionary to filter (e.g., { [key: string]: T[] })
 * @param keys The keys to iterate over (e.g., ALPHABET)
 * @param searchTerm The search string
 * @param getValue Function to extract the string value from the item for searching
 * @returns A filtered dictionary with only matching items
 */
export function filterDictionaryBySearchTerm<T>(
  dictionary: { [key: string]: T[] },
  keys: string[],
  searchTerm: string,
  getValue: (item: T) => string
): { [key: string]: T[] } {
  const trimmedSearch = searchTerm.trim().toLowerCase();
  if (!trimmedSearch) {
    // Return a shallow copy to avoid mutation
    return { ...dictionary };
  }

  const filtered: { [key: string]: T[] } = {};
  for (const key of keys) {
    const items = dictionary[key] || [];

    // Filter items based on the search term
    const matches = items.filter((item) =>
      getValue(item).toLowerCase().includes(trimmedSearch)
    );
    // Only add to filtered if there are matches
    if (matches.length > 0) {
      filtered[key] = matches;
    }
  }
  return filtered;
}

export function mapLanguageToShareLanguageViewFormat(
  language: any
): LanguageView {
  return {
    collaborators: language.collaborators,
    creator: language.creator,
    dateCreated: language.dateCreated,
    description: language.description,
    dictionary: language[VIEW_LANGUAGE_MAP_DETAIL.dictionary.contentKey],
    flagUrl: language.flagUrl,
    id: language.id,
    isPublic: language.privacyLevel === PRIVACY_LEVELS.PUBLIC, // language.privacyLevel === 'PUBLIC',
    lastUpdated: language.lastUpdated,
    lastUpdatedBy: language.lastUpdatedBy,
    name: language?.name,
    overview: {
      sections: VIEW_LANGUAGE_MAP_DETAIL.overview.map((sectionDetail) => ({
        title: sectionDetail.title,
        content: language[sectionDetail.contentKey] || null,
        isHidden: language.hiddenSections?.includes(sectionDetail.contentKey),
        subsections: sectionDetail.subsections
          ? sectionDetail.subsections
              .map((subsection) => ({
                title: subsection.title,
                content: subsection.contentKey
                  ? language[subsection.contentKey]
                  : null,
                isHidden: language.hiddenSections?.includes(
                  subsection.contentKey
                ),
                meta: subsection.metaKey ? language[subsection.metaKey] : null,
                hasTable: subsection?.hasTable,
              }))
              // Filter out subsections that have no content and no meta data to display
              .filter(
                (subsectionDetail) =>
                  !(!subsectionDetail.content && !subsectionDetail.meta)
              )
          : [],
      })),
    },
    // TODO: Currently mocked until backend has those values ready
    languageStats: {
      stars: 2089,
      likes: 1995,
      comments: 497,
    },
    phrases: language[VIEW_LANGUAGE_MAP_DETAIL.phrases.contentKey],
    stories: language[VIEW_LANGUAGE_MAP_DETAIL.stories.contentKey],
    types: language.types,
    viewSettings: language.viewSettings,
  };
}

export function sortByKey(key: string, list: any[]) {
  return list.sort((a, b) => {
    if (key === 'name') {
      return a.name.localeCompare(b.name);
    } else if (key === 'lastUpdated') {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    }
    return 0;
  });
}
