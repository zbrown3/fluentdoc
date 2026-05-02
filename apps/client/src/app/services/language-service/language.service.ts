import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import {
  type LanguageView,
  type LanguageViewSettings,
} from '../../../utils/types';
import { mapLanguageToShareLanguageViewFormat } from '../../../utils/utils';

@Injectable()
export class LanguageService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /***********************
     /***********************
     **  UPDATE SECTIONS  **
     /***********************
     /***********************

     /**
     * Update Language General Info
     * @param id
     * @param generalData
     * @returns {Promise<Object>}
     */
  updateLanguageGeneralInfo(id: string, generalData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/general-info', generalData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Add/Delete collaborator to/from language
   * @param id
   * @param collaboratorData
   * @returns {Promise<Object>}
   */
  editCollaborators(id: string, collaboratorData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/collaborator',
        collaboratorData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Introduction Info
   * @param id
   * @param introductionData
   * @returns {Promise<Object>}
   */
  updateLanguageIntroduction(id: string, introductionData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/introduction',
        introductionData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Consonant section
   * @param id
   * @param consonantData
   * @returns {Promise<Object>}
   */
  updateConsonants(id: string, consonantData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/consonants', consonantData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Vowel section
   * @param id
   * @param vowelData
   * @returns {Promise<Object>}
   */
  updateVowels(id: string, vowelData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/vowels', vowelData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language diphthongs section
   * @param id
   * @param diphthongsData
   * @returns {Promise<Object>}
   */
  updateDiphthongs(id: string, diphthongsData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/diphthongs', diphthongsData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Alphabet section
   * @param id
   * @param alphabetData
   * @returns {Promise<Object>}
   */
  updateAlphabet(id: string, alphabetData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/alphabet', alphabetData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Stress section
   * @param id
   * @param stressData
   * @returns {Promise<Object>}
   */
  updateStress(id: string, stressData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/stress', stressData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Language Constraint section
   * @param id
   * @param constraintData
   * @returns {Promise<Object>}
   */
  updateConstraints(id: string, constraintData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/constraints', constraintData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update VowelHarmony section
   * @param id
   * @param vowelHarmonyData
   * @returns {Promise<Object>}
   */
  updateVowelHarmony(id: string, vowelHarmonyData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/vowelHarmony',
        vowelHarmonyData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Honorifics section
   * @param id
   * @param honorificsData
   * @returns {Promise<Object>}
   */
  updateHonorifics(id: string, honorificsData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/honorifics', honorificsData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Conjugation section
   * @param id
   * @param conjugationData
   * @returns {Promise<Object>}
   */
  updateConjugation(id: string, conjugationData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/conjugation',
        conjugationData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Syntax section
   * @param id
   * @param syntaxData
   * @returns {Promise<Object>}
   */
  updateSyntax(id: string, syntaxData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/syntax', syntaxData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Negation section
   * @param id
   * @param negationData
   * @returns {Promise<Object>}
   */
  updateNegation(id: string, negationData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/negation', negationData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Question Forming section
   * @param id
   * @param questionFormingData
   * @returns {Promise<Object>}
   */
  updateQuestionForming(id: string, questionFormingData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/questionForming',
        questionFormingData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update vocab section
   * @param id
   * @param vocabData
   * @returns {Promise<Object>}
   */
  updateVocab(id: string, vocabData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/vocab', vocabData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update Words & Phrases section
   * @param id
   * @param phraseData
   * @returns {Promise<Object>}
   */
  updateWordsAndPhrases(id: string, phraseData: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/phrases', phraseData, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  updatePinnedSections(id: string, pinnedSections: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/pinned-sections',
        pinnedSections,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  deleteLanguageFlag(id: string) {
    id;
    return this.http
      .delete(this.baseUrl + '/languages/' + id + '/language-flag', {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  getRandomLanguageName() {
    return this.http
      .get(this.baseUrl + '/languages/generate-name', { withCredentials: true })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  /**
   * Update language numeral system
   * @param id
   * @param numberSystemData
   */
  updateNumeralSystem(id: any, numberSystemData: any) {
    return this.http
      .put(
        this.baseUrl + '/languages/' + id + '/numeralSystem',
        numberSystemData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  generateWords(id: any, randomLanguageData: any) {
    return this.http
      .post(
        this.baseUrl + '/languages/' + id + '/randomWords',
        randomLanguageData,
        { withCredentials: true }
      )
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  updateLanguageSettings(id: any, settings: any) {
    return this.http
      .put(this.baseUrl + '/languages/' + id + '/settings', settings, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data,
        }))
      );
  }

  getPublicLanguage(languageId: any) {
    return this.http.get(this.baseUrl + '/languages/public/' + languageId).pipe(
      map((response: any) => {
        const language = response.data;
        let viewPublicLanguageResponse: LanguageView | null = null;

        if (language) {
          viewPublicLanguageResponse =
            mapLanguageToShareLanguageViewFormat(language);
        }

        return {
          status: response.status,
          data: viewPublicLanguageResponse,
        };
      })
    );
  }

  getLanguageView(languageId: any) {
    return this.http
      .get(this.baseUrl + '/languages/' + languageId + '/view', {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          const language = response.data;
          let viewPublicLanguageResponse: LanguageView | null = null;

          if (language) {
            viewPublicLanguageResponse =
              mapLanguageToShareLanguageViewFormat(language);
          }

          return {
            status: response.status,
            data: viewPublicLanguageResponse,
          };
        })
      );
  }

  updateLanguageViewSettings(
    languageId: any,
    viewSettings: LanguageViewSettings
  ) {
    const requestBody = {
      ...viewSettings,
      colors: viewSettings.colors || { primary: '', secondary: '' },
      hiddenSections: viewSettings.hiddenSections || [],
    };

    return this.http
      .put(
        this.baseUrl + '/languages/' + languageId + '/view-settings',
        requestBody,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response: any) => {
          const language = response.data;
          let viewPublicLanguageResponse: LanguageView | null = null;

          if (language) {
            viewPublicLanguageResponse =
              mapLanguageToShareLanguageViewFormat(language);
          }

          return {
            status: response.status,
            data: viewPublicLanguageResponse,
          };
        })
      );
  }
}
