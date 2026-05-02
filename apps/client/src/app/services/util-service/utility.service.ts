import {Injectable} from '@angular/core';

@Injectable()
export class UtilityService {

    constructor() {}

    // Utility Service to get Alphabet Mapping
    mapToSymbol(symbol: string) {

        const irregularSymbolsMap: any = {
            // consonants
            'nn': 'ŋ',
            'tS': 'tʃ',
            'th': 'θ',
            'ss': 'ʃ',
            'thvcd': 'ð',
            'zz': 'ʒ',
            'dZ': 'dʒ',
            'tretro': 'ʈ',
            'dretro': 'ɖ',
            'glottal': 'ʔ',
            'nretro': 'ɳ',
            'gg': 'ɢ',
            'npal': 'ɲ',
            'fpal': 'ɟ',
            'sretro': 'ʂ',
            'zretro': 'ʐ',
            'cpal': 'ç',
            'jpal': 'ʝ',
            'latfone': 'ɬ',
            'latftwo': 'ɮ',
            'downrretro': 'ɻ',
            'lretro': 'ɭ',
            'mtail': 'ɱ',
            'Nuv': 'ɴ',
            'V': 'ⱱ',
            'rrvl': 'ɾ',
            'rrvd': 'ɽ',
            'BlVl': 'ɸ',
            'BlVd': 'β',
            'yvel': 'ɣ',
            'xuv': 'χ',
            'downrvd': 'ʁ',
            'hpha': 'ħ',
            'gpha': 'ʕ',
            'hcurve': 'ɦ',
            'vapprox': 'ʋ',
            'downr': 'ɹ',
            'wvel': 'ɰ',
            'ypal': 'ʎ',
            'lvd': 'ʟ',
            'mlva': 'ʍ',
            'uoc': 'ɥ',
            'H': 'ʜ',
            'vepi': 'ʢ',
            'epip': 'ʡ',
            'vapf': 'ɕ',
            'Vapf': 'ʑ',
            'ralf': 'ɺ',
            'simul': 'ɧ',
            'ats': 't͡s',
            'atsh': 't͡ʃ',
            'atc': 't͡ɕ',
            'atS': 'ʈ͡ʂ',
            'adz': 'd͡z',
            'adg': 'd͡ʒ',
            'adzt': 'd͡ʑ',
            'adZ': 'ɖ͡ʐ',
            'npcbl': 'ʘ ',
            'npvib': 'ɓ',
            'npeb': 'pʼ',
            'npcd': 'ǀ',
            'npvida': 'ɗ',
            'npeda': 'tʼ',
            'npcpa': 'ǃ',
            'npvip': 'ʄ',
            'npev': 'kʼ',
            'npcpl': 'ǂ',
            'npviv': 'ɠ',
            'npeaf': 'sʼ',
            'npcal': 'ǁ',
            'npviu': 'ʛ',

            // vowels
            'uu': '^',
            'a': 'ɑ:',
            'ae': 'æ',
            'eh': 'ɛ',
            'er': 'ɝ',
            'ii': 'ɪ',
            'ah': 'a',
            'ee': 'ə',
            'ibar': 'ɨ',
            'ubar': 'ʉ',
            'vowelw': 'ɯ',
            'oslant': 'ø',
            'obar': 'ɵ',
            'backelow': 'ɘ',
            'voweltwist': 'ɤ',
            'oe': 'œ',
            'backE': 'ɜ',
            'roundb': 'ɞ',
            'backc': 'ɔ',
            'backa': 'ɒ',
            'ce': 'ɶ',
            'upperY': 'ʏ',
            'nearu': 'ʊ',
            'downa': 'ɐ'
        };

        if (irregularSymbolsMap[symbol] !== undefined) {
            symbol = irregularSymbolsMap[symbol];
        }

        return symbol;
    }

  // return formatted string
  // example: HOBBY_FUN => Hobby
  // FRIENDS_GROUP => Friends,
  // NOVEL => Novel
  // @param subject
  // @returns {string}
  formatReason(subject: string) {
    if (subject.indexOf('_') === -1) {
      return this.capitalizeFLetter(subject.toLowerCase());
    }
    return this.capitalizeFLetter(subject.substring(0, subject.indexOf('_')).toLowerCase());
  }
  /**
   * Capitalize first letter of input
   * @param subject
   */
  capitalizeFLetter(subject: any) {
      if (subject.length === 1) {
          return subject.toUpperCase();
      } else {
          subject = subject.toLowerCase();
          return subject.charAt(0).toUpperCase() +
              subject.slice(1);
      }
    }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
  }

  displayType(type: any) {
   return this.capitalizeFLetter(type.replace('_', '/'));
  }

  // function that takes in a string and replaces every instance of ${expr} with the second argument
  formatDynamicString(subject: string, repr: string) {
    return subject.replace(/\${expr}/g, repr);
  }

  // function that adds '/' to the beginning and end of a word
  wrapWithSlashes(word: any) {
    if (word[0] !== '/') {
      word = '/' + word;
    }
    if (word[word.length - 1] !== '/') {
      word = word + '/';
    }
    return word;
  }

  // method to convert an image url to a base64 string
  convertBase64ToFile(base64String: string, filename: string, mimeType: string): File {
    try {
      // Ensure we only have the raw Base64 data
      const cleanedBase64 = base64String.replace(/^data:[^;]+;base64,/, '').trim();

      // Convert Base64 (handle URL-safe encoding if needed)
      const byteString = atob(cleanedBase64.replace(/_/g, '/').replace(/-/g, '+'));

      // Convert to byte array
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      // Return File object
      return new File([uint8Array], filename, { type: mimeType });
    } catch (error) {
      console.error("Error converting Base64 to File:", error);
      throw new Error("Invalid Base64 string");
    }
  }


  sanitizePrompt(input: string): string {
    if (!input) return "";

    return input
      .trim() // Remove extra spaces at the start and end
      .replace(/\r/g, "") // Remove carriage return (\r)
      .replace(/\n{2,}/g, "\n") // Replace multiple newlines with a single newline
      .replace(/\n/g, " "); // Convert remaining newlines into spaces (optional)
  }

}
