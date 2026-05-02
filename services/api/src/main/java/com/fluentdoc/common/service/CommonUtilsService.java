package com.fluentdoc.common.service;

import com.fluentdoc.language.model.Language;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class CommonUtilsService {

    char[] vowels = { 'a', 'e', 'i', 'o', 'u',
            'à', 'è', 'a', 'e', 'i', 'o', 'u',
            'a', 'e', 'i', 'o', 'u',
            'a', 'e', 'i', 'o', 'u',
            'a', 'e', 'i', 'o', 'u',
            'a', 'e', 'i', 'o', 'u',
            'a', 'e', 'i', 'o', 'u',
            'ì', 'ò', 'ù', 'á', 'é', 'í', 'ó', 'ú', 'ý', 'â', 'ê',
            'î', 'ô', 'û', 'ã', 'ñ', 'õ', 'ä', 'ë', 'ï', 'ö', 'ü', 'ÿ', 'ç', 'ø', 'å', 'æ', 'œ' };

    public Map<String, String> otherSymbolMap  = new HashMap<>() {{
        put("mlva", "ʍ Voiceless labial-velar fricative");
        put("w", "w Voiced labial-velar approximant");
        put("uoc", "ɥ Voiced labial-palatal approximant");
        put("H", "ʜ Voiceless epiglottal fricative");
        put("vepi", "ʢ Voiced epiglottal fricative");
        put("epip", "ʡ Epiglottal plosive");
        put("vapf", "ɕ Voiceless alveolo-palatal fricative");
        put("Vapf", "ʑ Voiced alveolo-palatal fricative");
        put("ralf", "ɺ Alveolar lateral flap");
        put("simul", "ɧ Simultaneous ʃ and x");
    }};

    public Map<String, String> affricateSymbolMap  = new HashMap<>() {{
        put("ats", "t͡s Voiceless alveolar affricate");
        put("atsh", "t͡ʃ Voiceless palato-alveolar affricate");
        put("atc", "t͡ɕ Voiceless alveolo-palatal affricate");
        put("atS", "ʈ͡ʂ Voiceless retroflex affricate");
        put("adz", "d͡z Voiced alveolar affricate");
        put("adg", "d͡ʒ Voiced post-alveolar affricate");
        put("adzt", "d͡ʑ Voiced alveolo-palatal affricate");
        put("adZ", "ɖ͡ʐ Voiceless retroflex affricate");
    }};



    public Map<String, String> nonPulmonicSymbolMap  = new HashMap<>() {{
        put("npcbl", "ʘ Bilabial");
        put("npvib", "ɓ Bilabial");
        put("npeb", "pʼ Bilabial");
        put("npcd", "ǀ Dental");
        put("npvida", "ɗ Dental/alveolar");
        put("npeda", "tʼ Dental/alveolar");
        put("npcpa", "ǃ (Post)alveoalar");
        put("npvip", "ʄ Palatal");
        put("npev", "kʼ Velar");
        put("npcpl", "ǂ Palatoalveolar");
        put("npviv", "ɠ Velar");
        put("npeaf", "sʼ Alveolar fricative");
        put("npcal", "ǁ Alveolar lateral");
        put("npviu", "ʛ Uvular");
    }};


    public String decodeIpa(String character) {

        /**
         *     // consonants
         *     "N" :"ŋ",
         *     "tS": "tʃ",
         *     "th": "θ",
         *     "S": "ʃ",
         *     "TH": "ð",
         *     "Z": "ʒ",
         *     "dZ": "dʒ",
         *     "tretro": "ʈ"
         *     "dretro": "ɖ"
         *     "glottal": "ʔ"
         *     "nretro": "ɳ"
         *     "G": "ɢ"
         *     "npal": "ɲ"
         *     "fpal": "ɟ"
         *     "sretro": "ʂ"
         *     "zretro": "ʐ"
         *     "cpal": "ç"
         *     "jpal": "ʝ"
         *     "latfone": "ɬ"
         *     "latftwo": "ɮ"
         *     "downrretro": "ɻ"
         *     "lretro": "ɭ"
         *     "mtail": "ɱ"
         *     "Nuv": "ɴ",
         *     "V": "ⱱ",
         *     "rR": "ɾ",
         *     "Rr": "ɽ"
         *     "BlVl": "ɸ",
         *     "BlVd": "β",
         *     "yvel": "ɣ",
         *     "xuv": "χ",
         *     "downR": "ʁ"
         *     "hpha": "ħ",
         *     "gpha": "ʕ",
         *     "hcurve": "ɦ",
         *     "vapprox": "ʋ",
         *     "downr": "ɹ",
         *     "wvel": "ɰ",
         *     "ypal": "ʎ",
         *     "L": "ʟ",
         *     "mlva": "ʍ",
         *     "uoc": "ɥ",
         *     "H": "ʜ",
         *     "vepi": "ʢ",
         *     "epip": "ʡ",
         *     "vapf": "ɕ",
         *     "Vapf": "ʑ",
         *     "ralf": "ɺ",
         *     "simul": "ɧ",
         *     "ats" : "t͡s",
         *     "atsh" "t͡ʃ",
         *     "atc": "t͡ɕ",
         *     "atS": "ʈ͡ʂ",
         *     "adz": "d͡z",
         *     "adg": "d͡ʒ",
         *     "adzt": "d͡ʑ",
         *     "adZ": "ɖ͡ʐ",
         *     "npcbl": "ʘ ",
         *     "npvib": "ɓ",
         *     "npeb": "pʼ",
         *     "npcd": "ǀ",
         *     "npvida": "ɗ",
         *     "npeda": "tʼ",
         *     "npcpa": "ǃ",
         *     "npvip": "ʄ",
         *     "npev": "kʼ",
         *     "npcpl": "ǂ",
         *     "npviv": "ɠ",
         *     "npeaf": "sʼ",
         *     "npcal": "ǁ",
         *     "npviu": "ʛ",
         *
         *
         *
         *     // vowels
         *     "U": "^",
         *     "a": "ɑ:",
         *     "ae": "æ",
         *     "eh": "ɛ",
         *     "er": "ɝ",
         *     "I": "ɪ",
         *     "ah": "a",
         *     "ee": "ə",
         *     "ibar": "ɨ",
         *     "ubar":"ʉ",
         *     "vowelw": "ɯ",
         *     "oslant": "ø",
         *     "obar": "ɵ",
         *     "backelow": "ɘ",
         *     "voweltwist": "ɤ",
         *     "oe": "œ",
         *     "backE": "ɜ",
         *     "roundb": "ɞ",
         *     "backc": "ɔ",
         *     "backa": "ɒ",
         *     "ce": "ɶ",
         *     "upperY": "ʏ",
         *     "nearu": "ʊ",
         *     "downa": "ɐ"
         **/

        switch (character){
            // CONSONANTS
            case "N":
                character = "ŋ";
                break;
            case "tS":
                character = "tʃ";
                break;
            case "th":
                character = "θ";
                break;
            case "S":
                character = "ʃ";
                break;
            case "TH":
                character = "ð";
                break;
            case "Z":
                character = "ʒ";
                break;
            case "dZ":
                character = "dʒ";
                break;
            case "tretro":
                character = "ʈ";
                break;
            case "dretro":
                character = "ɖ";
                break;
            case "glottal":
                character = "ʔ";
                break;
            case "nretro":
                character = "ɳ";
                break;
            case "G":
                character = "ɢ";
                break;
            case "npal":
                character = "ɲ";
                break;
            case "fpal":
                character = "ɟ";
                break;
            case "sretro":
                character = "ʂ";
                break;
            case "zretro":
                character = "ʐ";
                break;
            case "cpal":
                character = "ç";
                break;
            case "jpal":
                character = "ʝ";
                break;
            case "latfone":
                character = "ɬ";
                break;
            case "latftwo":
                character = "ɮ";
                break;
            case "downrretro":
                character = "ɻ";
                break;
            case "lretro":
                character = "ɭ";
                break;
            case "mtail":
                character = "ɱ";
                break;
            case "Nuv":
                character = "ɴ";
                break;
            case "V":
                character = "ⱱ";
                break;
            case "rR":
                character = "ɾ";
                break;
            case "Rr":
                character = "ɽ";
                break;
            case "BlVl":
                character = "ɸ";
                break;
            case "BlVd":
                character = "β";
                break;
            case "yvel":
                character = "ɣ";
                break;
            case "xuv":
                character = "χ";
                break;
            case "downR":
                character = "ʁ";
                break;
            case "hpha":
                character = "ħ";
                break;
            case "gpha":
                character = "ʕ";
                break;
            case "hcurve":
                character = "ɦ";
                break;
            case "vapprox":
                character = "ʋ";
                break;
            case "downr":
                character = "ɹ";
                break;
            case "wvel":
                character = "ɰ";
                break;
            case "ypal":
                character = "ʎ";
                break;
            case "L":
                character = "ʟ";
                break;
            case "mlva":
                character = "ʍ";
                break;
            case "uoc":
                character = "ɥ";
                break;
            case "H":
                character = "ʜ";
                break;
            case "vepi":
                character = "ʢ";
                break;
            case "epip":
                character = "ʡ";
                break;
            case "vapf":
                character = "ɕ";
                break;
            case "Vapf":
                character = "ʑ";
                break;
            case "ralf":
                character = "ɺ";
                break;
            case "simul":
                character = "ɧ";
                break;
            case "ats":
                character = "t͡s";
                break;
            case "atsh":
                character = "t͡ʃ";
                break;
            case "atc":
                character = "t͡ɕ";
                break;
            case "atS":
                character = "ʈ͡ʂ";
                break;
            case "adz":
                character = "d͡z";
                break;
            case "adg":
                character = "d͡ʒ";
                break;
            case "adzt":
                character = "d͡ʑ";
                break;
            case "adZ":
                character = "ɖ͡ʐ";
                break;
            case "npcbl":
                character = "ʘ";
                break;
            case "npvib":
                character = "ɓ";
                break;
            case "npeb":
                character = "pʼ";
                break;
            case "npcd":
                character = "ǀ";
                break;
            case "npvida":
                character = "ɗ";
                break;
            case "npeda":
                character = "tʼ";
                break;
            case "npcpa":
                character = "ǃ";
                break;
            case "npvip":
                character = "ʄ";
                break;
            case "npev":
                character = "kʼ";
                break;
            case "npcpl":
                character = "ǂ";
                break;
            case "npviv":
                character = "ɠ";
                break;
            case "npeaf":
                character = "sʼ";
                break;
            case "npcal":
                character = "ǁ";
                break;
            case "npviu":
                character = "ʛ";
                break;


            // VOWELS
            case "U":
                character = "^";
                break;
            case "a":
                character = "ɑ";
                break;
            case "ae":
                character = "æ";
                break;
            case "eh":
                character = "ɛ";
                break;
            case "er":
                character = "ɝ";
                break;
            case "I":
                character = "ɪ";
                break;
            case "ah":
                character = "a";
                break;
            case "ee":
                character = "ə";
                break;
            case "ibar":
                character = "ɨ";
                break;
            case "ubar":
                character = "ʉ";
                break;
            case "vowelw":
                character = "ɯ";
                break;
            case "oslant":
                character = "ø";
                break;
            case "obar":
                character = "ɵ";
                break;
            case "backelow":
                character = "ɘ";
                break;
            case "voweltwist":
                character = "ɤ";
                break;
            case "oe":
                character = "œ";
                break;
            case "backE":
                character = "ɜ";
                break;
            case "roundb":
                character = "ɞ";
                break;
            case "backc":
                character = "ɔ";
                break;
            case "backa":
                character = "ɒ";
                break;
            case "ce":
                character = "ɶ";
                break;
            case "upperY":
                character = "ʏ";
                break;
            case "nearu":
                character = "ʊ";
                break;
            case "downa":
                character = "ɐ";
                break;
        }

        return character;
    }


    /**
     * Method to parse HTML for XML reader
     *
     * rules:
     * 1. <br> must be changed to <br />
     */
    public String formatXML(String string) {
        // rule 1
        return string.replace("<br>", "<br />");
    }


    /**
     * Method to check if language has other consonant symbols
     * (Other than IPA table)
     */
    public boolean hasOtherConsonantSymbols(Map<String, Boolean> consonantMap) {
        boolean result = false;

        // iterate through otherSymbols Consonant Set
        // Getting an iterator and assign to otherSymbols map
        Iterator hmIterator = otherSymbolMap.entrySet().iterator();

        // Iterate through hashMap and look for values in consonantMap
        while (hmIterator.hasNext()) {
            Map.Entry mapElement = (Map.Entry)hmIterator.next();
            if (consonantMap.containsKey(mapElement.getKey()) && consonantMap.get(mapElement.getKey()) == true) {
                result = true;
            }
        }
        return result;
    }

    /**
     * Method to check if language has other consonant symbols
     * (Other than IPA table)
     */
    public boolean hasAffricateSymbols(Map<String, Boolean> consonantMap) {
        boolean result = false;

        // iterate through affricateSymbol Consonant Set
        // Getting an iterator and assign to affricateSymbol map
        Iterator hmIterator = affricateSymbolMap.entrySet().iterator();

        // Iterate through hashMap and look for values in consonantMap
        while (hmIterator.hasNext()) {
            Map.Entry mapElement = (Map.Entry)hmIterator.next();
            if (consonantMap.containsKey(mapElement.getKey()) && consonantMap.get(mapElement.getKey()) == true) {
                result = true;
            }
        }

        return result;
    }

    /**
     * Method to check if language has other NonPulmonic consonant symbols
     * (Other than IPA table)
     */
    public boolean hasNonPulmonicSymbols(Map<String, Boolean> consonantMap) {
        boolean result = false;

        // iterate through NonPulmonic Consonant Set
        // Getting an iterator and assign to nonPulmonic map
        Iterator hmIterator = nonPulmonicSymbolMap.entrySet().iterator();

        // Iterate through hashMap and look for values in consonantMap
        while (hmIterator.hasNext()) {
            Map.Entry mapElement = (Map.Entry)hmIterator.next();
            if (consonantMap.containsKey(mapElement.getKey()) && consonantMap.get(mapElement.getKey()) == true) {
                result = true;
            }
        }

        return result;
    }


    public String generateRandomAlphaNumString(int length) {
        return RandomStringUtils.randomAlphanumeric(length);
    }


    /**
     * Return whether or not string has vowels
     */
    public boolean hasVowels(String subject) {
        boolean result = false;

        for (int i = 0; i < subject.length(); i++) {
            char currentChar = Character.toLowerCase(subject.charAt(i));
            // if, string element is vowel, set result to true
            for (char vowel : vowels) {
                if (currentChar == vowel) {
                    result = true;
                    break;
                }
            }
            if (result) break;
        }

        return result;
    }

    /**
     * Method to replace all vowels in string
     * Note: in place of .replaceAll() method due to the fact
     * that we needed each vowel to have a chance to be unique
     * @param subject
     * @return
     */
    public String modifyTargetWord(String subject) {
        // set vowel array to String to access compare method
        String compareString = Arrays.toString(vowels);

        // if subject doesn't have vowels, add a random initial vowel
        //TODO: Make this a pattern based on target language with syllables, syllable structure or some
        // determination based on phonotactics
        if (!hasVowels(subject)) {
            Random rand = new Random();
            subject = (vowels[rand.nextInt(vowels.length)]) + subject;
        }

        for (int i = 0; i < subject.length(); i++) {

            // if, string element is vowel,
            // replace index with random vowel
            if (compareString.contains(String.valueOf(subject.charAt(i)))) {
                Random rand = new Random();
                String randomVowel = String.valueOf(vowels[(rand.nextInt(vowels.length))]);
                subject = subject.substring(0,i) + randomVowel + subject.substring(i+1);
            }
        }

        return subject;
    }

    /**
     * Method to replace all vowels in string with vowels from language
     * Note: in place of .replaceAll() method due to the fact
     * that we needed each vowel to have a chance to be unique
     * @param subject
     * @return
     */
    public String modifyTargetWord(String subject, Language language) {
        // set vowel array to String to access compare method
        String compareString = Arrays.toString(vowels);

        // TODO: Add language alphabet into the mix to create new words
        Map<String, String> languageAlphabet = language.getAlphabet();

        // if subject doesn't have vowels, add a random initial vowel
        //TODO: Make this a pattern based on target language with syllables, syllable structure or some
        // determination based on phonotactics
        if (!hasVowels(subject)) {
            Random rand = new Random();
            subject = (vowels[rand.nextInt(vowels.length)]) + subject;
        }

        for (int i = 0; i < subject.length(); i++) {

            // if, string element is vowel,
            // replace index with random vowel
            if (compareString.contains(String.valueOf(subject.charAt(i)))) {
                Random rand = new Random();
                String randomVowel = String.valueOf(vowels[(rand.nextInt(vowels.length))]);
                subject = subject.substring(0,i) + randomVowel + subject.substring(i+1);
            }
        }

        return subject;
    }
}
