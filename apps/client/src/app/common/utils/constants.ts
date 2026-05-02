import { type LanguageType } from '../../../utils/types';

export const SESSION_COOKIE = 'SESSION';
export const SUCCESS_STATUS = 'SUCCESS';
export const VIEW_LANGUAGE = 'language';
export const VIEW_STORY = 'story';
export const QUILL_CONFIG = {
  // toolbar: '.toolbar',
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['code-block'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript

      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      [{ direction: 'rtl' }], // text direction
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link'], // ['link', 'image', 'video']
    ],
  },
};

export const QUILL_CONFIG_READ_ONLY = {
  toolbar: {
    container: [],
  },
};

export const BS_MODAL_CONFIG = {
  animated: true,
  keyboard: true,
  backdrop: true,
};

export const SWADESH_LIST = [
  'I (Pers.Pron.1.Sg.)',
  'You (2.sg! )',
  'we (inclusive)',
  'this',
  'that',
  'who? (“?”)',
  'what? (“?”)',
  'not',
  'all (of a number)',
  'many',
  'one',
  'two',
  'big',
  'long (not wide)',
  'small',
  'woman',
  'man (adult male human)',
  'person (individual human)',
  'fish (noun)',
  'bird',
  'dog',
  'louse',
  'tree (not log)',
  'seed (noun)',
  'leaf (botanics)',
  'root (botanics)',
  'bark (of tree)',
  'skin (person’s)',
  'flesh (meat: flesh)',
  'blood',
  'bone',
  'grease (fat, organic substance)',
  'egg',
  'horn (of bull etc.: )',
  'tail',
  'feather (large, not down)',
  'hair (on head of humans)',
  'head (anatomic)',
  'ear',
  'eye',
  'nose',
  'mouth',
  'tooth (front, rather than molar)',
  'tongue (anatomical)',
  'claw',
  'foot',
  'knee',
  'hand',
  'belly (lower part of body, abdomen)',
  'neck (not nape)',
  'breasts (female)',
  'heart',
  'liver',
  'drink (verb)',
  'eat (verb)',
  'bite (verb)',
  'see (verb)',
  'hear (verb)',
  'know (facts)',
  'sleep (verb)',
  'die (verb)',
  'kill (verb)',
  'swim (verb)',
  'fly (verb)',
  'walk (verb)',
  'come (verb)',
  'lie (on side, recline)',
  'sit (verb)',
  'stand (verb)',
  'give (verb)',
  'say (verb)†',
  'sun',
  'moon (noun)',
  'star',
  'water (noun)',
  'rain (noun)',
  'stone',
  'sand',
  'earth (soil)',
  'cloud (not fog)',
  'smoke (noun, of fire)',
  'fire',
  'ash(es)',
  'burn (verb intr.!)',
  'path (road, trail; not street)',
  'mountain (not hill)',
  'red (colour)',
  'green (colour)',
  'yellow (colour)',
  'white (colour)',
  'black (colour)',
  'night',
  'hot (adjective; warm:,of weather)',
  'cold (of weather)',
  'full',
  'new',
  'good',
  'round',
  'dry (substance)',
  'name (noun)',
];

export const CommonPhraseExamples = [
  'Hi',
  'How are you?',
  "I'm sorry",
  'What is this?',
  'What is your name?',
  'My name is ___',
  'Where are you from?',
  'I am ___',
  'Thank you',
  "You're welcome",
];

export const LanguageTypes: LanguageType[] = [
  {
    key: 'PERSONAL',
    type: 'Personal',
    description:
      'Languages developed for personal use and experimentation, not necessarily intended for wider use.',
    examples: [],
  },
  {
    key: 'A_PRIORI',
    type: 'A priori',
    description:
      'Languages that are entirely or largely invented from scratch, with minimal to no direct borrowing from natural languages. A language is either a priori or a posteriori, not both.',
    examples: ['Klingon', 'Quenya', 'Toki Pona'],
  },
  {
    key: 'A_POSTERIORI',
    type: 'A posteriori',
    description:
      'Languages that derive much of their vocabulary and grammar from existing natural languages. A language is either a priori or a posteriori, not both.',
    examples: ['Esperanto', 'Interlingua', 'Brithenig'],
  },
  {
    key: 'ARTLANG',
    type: 'Artlang',
    description:
      'Designed for aesthetic and artistic purposes, often for personal or fictional worlds.',
    examples: [
      'Dothraki',
      'High Valyrian',
      'Klingon',
      "Na'vi",
      'Languages of World of Warcraft',
    ],
  },
  {
    key: 'AUXLANG',
    type: 'Auxlang',
    description:
      'Created to facilitate communication between people who do not share a common native language, aiming for ease of learning and neutrality.',
    examples: ['Esperanto', 'Interlingua', 'Ido'],
  },
  {
    key: 'ENGLANG',
    type: 'Englang',
    description:
      'Designed with specific linguistic experiments in mind or to test certain linguistic theories; these often focus on logic and philosophical languages.',
    examples: ['Lojban', 'Loglan', 'Toki Pona'],
  },
  {
    key: 'PHILOLOGICAL',
    type: 'Philological',
    description:
      'Constructed to recreate or simulate historical changes in languages or to explore hypothetical scenarios in linguistic evolution.',
    examples: ['Brithenig'],
  },
  {
    key: 'MICRONATIONAL',
    type: 'Micronational',
    description:
      'Languages created for micronations as a part of constructing a national identity and culture.',
    examples: ['Talossan'],
  },
  {
    key: 'SIGN',
    type: 'Sign',
    description:
      'Constructed sign languages designed for various purposes, either educational, fictional, or as part of a linguistic experiment.',
    examples: ['Gestuno'],
  },
  {
    key: 'SACRED_RELIGIOUS',
    type: 'Sacred/Religious',
    description:
      'Languages constructed for use in religious contexts or spiritual expression.',
    examples: ['Modernized Hebrew'],
  },
  {
    key: 'OTHER',
    type: 'Other',
    description: 'Languages that do not fit into the other categories.',
    examples: [],
  },
];

export const LanguagePurposes = [
  {
    key: 'HOBBY_FUN',
    description: 'Hobby/Fun',
    icon: 'ph-heart',
  },
  {
    key: 'FRIENDS_GROUP',
    description: 'Friends/Group',
    icon: 'ph-users-four',
  },
  {
    key: 'NOVEL',
    description: 'Novel',
    icon: 'ph-books',
  },
  {
    key: 'SCHOOL',
    description: 'School',
    icon: 'ph-student',
  },
  {
    key: 'VIDEO_GAME',
    description: 'Game',
    icon: 'ph-game-controller',
  },
  {
    key: 'FILM',
    description: 'Film',
    icon: 'ph-film-slate',
  },
  {
    key: 'WORK',
    description: 'Work',
    icon: 'ph-briefcase',
  },
  {
    key: 'OTHER',
    description: 'Other',
    icon: 'ph-globe',
  },
];

export const PartsOfSpeech = [
  {
    name: 'Common noun',
    group: 'noun',
    description:
      'A noun that refers to a general item or concept rather than a specific one.',
  },
  {
    name: 'Proper noun',
    group: 'noun',
    description:
      'A noun that refers to a specific name of a person, place, or thing and is usually capitalized.',
  },
  {
    name: 'Collective noun',
    group: 'noun',
    description: 'A noun that refers to a group of individuals or things.',
  },
  {
    name: 'Concrete noun',
    group: 'noun',
    description:
      'A noun that refers to a physical object that can be observed through the senses.',
  },
  {
    name: 'Abstract noun',
    group: 'noun',
    description:
      'A noun that refers to an idea, quality, or state rather than a concrete object.',
  },
  {
    name: 'Countable noun',
    group: 'noun',
    description: "A noun that can be counted (e.g., 'apple', 'book').",
  },
  {
    name: 'Uncountable noun',
    group: 'noun',
    description:
      "A noun that cannot be counted and does not have a plural form (e.g., 'water', 'music').",
  },
  {
    name: 'Compound noun',
    group: 'noun',
    description:
      "A noun made up of two or more words that together form a single noun (e.g., 'toothbrush', 'mother-in-law').",
  },
  {
    name: 'Personal pronoun',
    group: 'pronoun',
    description:
      "A pronoun that refers to a specific person or thing (e.g., 'I', 'you', 'he', 'she').",
  },
  {
    name: 'Possessive pronoun',
    group: 'pronoun',
    description:
      "A pronoun that shows ownership (e.g., 'mine', 'yours', 'his', 'hers').",
  },
  {
    name: 'Reflexive pronoun',
    group: 'pronoun',
    description:
      "A pronoun that refers back to the subject of the sentence (e.g., 'myself', 'yourself').",
  },
  {
    name: 'Relative pronoun',
    group: 'pronoun',
    description:
      "A pronoun that introduces a relative clause (e.g., 'who', 'which', 'that').",
  },
  {
    name: 'Demonstrative pronoun',
    group: 'pronoun',
    description:
      "A pronoun that points to a specific thing (e.g., 'this', 'that', 'these', 'those').",
  },
  {
    name: 'Interrogative pronoun',
    group: 'pronoun',
    description:
      "A pronoun used to ask questions (e.g., 'who', 'whom', 'which', 'what').",
  },
  {
    name: 'Indefinite pronoun',
    group: 'pronoun',
    description:
      "A pronoun that refers to non-specific people or things (e.g., 'someone', 'anything').",
  },
  {
    name: 'Reciprocal pronoun',
    group: 'pronoun',
    description:
      "A pronoun that expresses a mutual action or relationship (e.g., 'each other', 'one another').",
  },
  {
    name: 'Action verb',
    group: 'verb',
    description:
      "A verb that expresses a physical or mental action (e.g., 'run', 'think').",
  },
  {
    name: 'Stative verb',
    group: 'verb',
    description:
      "A verb that describes a state of being or condition (e.g., 'know', 'believe').",
  },
  {
    name: 'Transitive verb',
    group: 'verb',
    description:
      "A verb that requires one or more objects to complete its meaning (e.g., 'throw', 'eat').",
  },
  {
    name: 'Intransitive verb',
    group: 'verb',
    description:
      "A verb that does not require an object to complete its meaning (e.g., 'sleep', 'arrive').",
  },
  {
    name: 'Auxiliary verb',
    group: 'verb',
    description:
      "A verb that adds functional or grammatical meaning to the main verb (e.g., 'be', 'do', 'have').",
  },
  {
    name: 'Modal verb',
    group: 'verb',
    description:
      "A type of auxiliary verb that expresses necessity or possibility (e.g., 'can', 'must').",
  },
  {
    name: 'Linking verb',
    group: 'verb',
    description:
      "A verb that connects the subject to a subject complement (e.g., 'is', 'seem').",
  },
  {
    name: 'Phrasal verb',
    group: 'verb',
    description:
      "A verb combined with an adverb or a preposition, or both, to give a new meaning (e.g., 'give up', 'look after').",
  },
  {
    name: 'Descriptive adjective',
    group: 'adjective',
    description:
      "An adjective that describes a noun's qualities or states (e.g., 'happy', 'blue').",
  },
  {
    name: 'Quantitative adjective',
    group: 'adjective',
    description:
      "An adjective that describes the quantity of something (e.g., 'some', 'many').",
  },
  {
    name: 'Demonstrative adjective',
    group: 'adjective',
    description:
      "An adjective that points out which noun is meant (e.g., 'this', 'those').",
  },
  {
    name: 'Possessive adjective',
    group: 'adjective',
    description:
      "An adjective that shows possession or ownership (e.g., 'my', 'your').",
  },
  {
    name: 'Interrogative adjective',
    group: 'adjective',
    description: "An adjective used to ask questions (e.g., 'which', 'what').",
  },
  {
    name: 'Distributive adjective',
    group: 'adjective',
    description:
      "An adjective that refers to each individual of a group separately (e.g., 'each', 'every').",
  },
  {
    name: 'Proper adjective',
    group: 'adjective',
    description:
      "An adjective that is derived from a proper noun (e.g., 'American', 'Shakespearean').",
  },
  {
    name: 'Compound adjective',
    group: 'adjective',
    description:
      "An adjective that is made up of two or more words (e.g., 'well-known', 'high-speed').",
  },
  {
    name: 'Adverb',
    group: 'adverb',
    description:
      'An adverb is a word that modifies or qualifies a verb, an adjective, or another adverb, often providing information on manner, place, time, frequency, or degree.',
  },
  {
    name: 'Manner adverb',
    group: 'adverb',
    description:
      "An adverb that describes how an action is performed (e.g., 'quickly', 'silently').",
  },
  {
    name: 'Place adverb',
    group: 'adverb',
    description:
      "An adverb that describes where an action takes place (e.g., 'here', 'everywhere').",
  },
  {
    name: 'Time adverb',
    group: 'adverb',
    description:
      "An adverb that describes when an action takes place (e.g., 'now', 'yesterday').",
  },
  {
    name: 'Frequency adverb',
    group: 'adverb',
    description:
      "An adverb that describes how often an action occurs (e.g., 'often', 'never').",
  },
  {
    name: 'Degree adverb',
    group: 'adverb',
    description:
      "An adverb that describes the intensity or degree of an action, adjective, or another adverb (e.g., 'very', 'extremely').",
  },
  {
    name: 'Interrogative adverb',
    group: 'adverb',
    description: "An adverb used to ask questions (e.g., 'how', 'why').",
  },
  {
    name: 'Relative adverb',
    group: 'adverb',
    description:
      "An adverb that introduces a relative clause (e.g., 'where', 'when').",
  },
  {
    name: 'Conjunctive adverb',
    group: 'adverb',
    description:
      "An adverb that connects two independent clauses (e.g., 'however', 'therefore').",
  },
  {
    name: 'Simple preposition',
    group: 'preposition',
    description:
      "A single word that shows the relationship between a noun and another word (e.g., 'at', 'by').",
  },
  {
    name: 'Compound preposition',
    group: 'preposition',
    description:
      "A preposition that is made up of more than one word (e.g., 'according to', 'because of').",
  },
  {
    name: 'Phrase preposition',
    group: 'preposition',
    description:
      "A preposition that is a phrase made up of two or more words (e.g., 'in front of', 'on top of').",
  },
  {
    name: 'Participle preposition',
    group: 'preposition',
    description:
      "A preposition that is derived from a participle (e.g., 'concerning', 'considering').",
  },
  {
    name: 'Double preposition',
    group: 'preposition',
    description:
      "A preposition that consists of two simple prepositions used together (e.g., 'out of', 'from among').",
  },
  {
    name: 'Coordinating conjunction',
    group: 'conjunction',
    description:
      "A conjunction that connects words, phrases, or clauses of equal importance (e.g., 'and', 'but').",
  },
  {
    name: 'Subordinating conjunction',
    group: 'conjunction',
    description:
      "A conjunction that connects a dependent clause to an independent clause (e.g., 'because', 'although').",
  },
  {
    name: 'Correlative conjunction',
    group: 'conjunction',
    description:
      "Paired conjunctions that work together to join words or phrases (e.g., 'either...or', 'neither...nor').",
  },
  {
    name: 'Article',
    group: 'determiner',
    description:
      "A word that introduces a noun and specifies its definiteness (e.g., 'the', 'a', 'an').",
  },
  {
    name: 'Demonstrative',
    group: 'determiner',
    description:
      "A word that points to a specific noun (e.g., 'this', 'that').",
  },
  {
    name: 'Possessive',
    group: 'determiner',
    description: "A word that shows ownership (e.g., 'my', 'your').",
  },
  {
    name: 'Quantifier',
    group: 'determiner',
    description:
      "A word that indicates the quantity of the noun (e.g., 'some', 'many').",
  },
  {
    name: 'Distributive',
    group: 'determiner',
    description:
      "A word that refers to each individual in a group separately (e.g., 'each', 'every').",
  },
  {
    name: 'Interrogative',
    group: 'determiner',
    description: "A word used to ask questions (e.g., 'which', 'what').",
  },
  {
    name: 'Interjection',
    group: 'interjection',
    description:
      "A word or phrase that expresses sudden emotion or sentiment (e.g., 'oh!', 'wow!').",
  },
  {
    name: 'Infinitive marker',
    group: 'particle',
    description:
      "A particle used with the base form of a verb to indicate the infinitive (e.g., 'to' in 'to run').",
  },
  {
    name: 'Negation',
    group: 'particle',
    description:
      "A particle that negates the meaning of a word or phrase (e.g., 'not', 'never').",
  },
  {
    name: 'Definite article',
    group: 'article',
    description: "An article that specifies a particular noun (e.g., 'the').",
  },
  {
    name: 'Indefinite article',
    group: 'article',
    description:
      "An article that refers to a non-specific noun (e.g., 'a', 'an').",
  },
  {
    name: 'Cardinal numeral',
    group: 'numeral',
    description: "A numeral that indicates quantity (e.g., 'one', 'two').",
  },
  {
    name: 'Ordinal numeral',
    group: 'numeral',
    description:
      "A numeral that indicates position or order (e.g., 'first', 'second').",
  },
  {
    name: 'Expletive',
    group: 'expletive',
    description:
      'A word or phrase that serves a syntactic role but has no semantic meaning, often used to fill a sentence.',
  },
  {
    name: 'Prefix',
    group: 'affix',
    description:
      "An affix that is added to the beginning of a word to modify its meaning (e.g., 'un-' in 'undo').",
  },
  {
    name: 'Suffix',
    group: 'affix',
    description:
      "An affix that is added to the end of a word to modify its meaning (e.g., '-ly' in 'quickly').",
  },
  {
    name: 'Infix',
    group: 'affix',
    description:
      'An affix that is inserted within a word to modify its meaning.',
  },
  {
    name: 'Circumfix',
    group: 'affix',
    description: 'An affix that surrounds a word to modify its meaning.',
  },
  {
    name: 'Enclitic',
    group: 'clitics',
    description: 'A clitic that is attached to the end of a preceding word.',
  },
  {
    name: 'Proclitic',
    group: 'clitics',
    description:
      'A clitic that is attached to the beginning of a following word.',
  },
];

/**
 * Language Section Constants
 */
export const LANGUAGE_SECTIONS = {
  generalInfo: {
    title: 'General Information',
    name: 'generalInfo',
    show: true,
  },
  phonology: {
    title: 'Phonology',
    name: 'phonology',
    show: false,
  },
  syntax: {
    title: 'Syntax',
    name: 'syntax',
    show: false,
  },
  wordsPhrases: {
    title: 'Words & Phrases',
    name: 'words&phrases',
    show: false,
  },
  misc: {
    title: 'Miscellaneous',
    name: 'miscellaneous',
    show: false,
  },
};

export const LANGUAGE_SUBSECTIONS = {
  mainInformation: {
    order: 0,
    title: 'Overview',
    name: 'generalInfo',
    section: LANGUAGE_SECTIONS.generalInfo.name,
    description: 'Establish the foundation and add identity to ${expr}.',
  },
  introduction: {
    order: 1,
    title: 'Introduction',
    name: 'introduction',
    section: LANGUAGE_SECTIONS.generalInfo.name,
    description:
      'Provide a brief introduction to ${expr}, summarizing your work in a way that reflects your vision.',
  },
  languageFlag: {
    order: 2,
    title: 'Flag & Identity',
    name: 'languageFlag',
    section: LANGUAGE_SECTIONS.generalInfo.name,
    description:
      'Add a flag to represent ${expr}. This can be a simple image or a complex design.',
  },
  contributors: {
    order: 3,
    title: 'Contributors',
    name: 'contributors',
    section: LANGUAGE_SECTIONS.generalInfo.name,
    description:
      'List any friends or colleagues that helped you with the creation of ${expr}.',
  },
  consonants: {
    order: 4,
    title: 'Consonants',
    name: 'consonants',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      'Choose sounds from the consonant table below to be included in ${expr}.',
  },
  vowels: {
    order: 5,
    title: 'Vowels',
    name: 'vowels',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      'Choose sounds from the vowel table below to be included in ${expr}.',
  },
  diphthongs: {
    order: 6,
    title: 'Diphthongs',
    name: 'diphthongs',
    section: LANGUAGE_SECTIONS.phonology.name,
    description: 'Describe the diphthongs of ${expr}.',
  },
  alphabet: {
    order: 7,
    title: 'Alphabet',
    name: 'alphabet',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      "Map the sounds of ${expr}'s to symbols to be used in your languages writing system",
  },
  stress: {
    order: 8,
    title: 'Stress',
    name: 'stress',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      'Stress patterns can be useful in defining rhythm and length of ${expr}. Add a description below with any details about stress in ${expr}.',
  },
  phonotactics: {
    order: 9,
    title: 'Phonotactics',
    name: 'phonotactics',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      'Phonological Constraints, or Phonotactic constraints, help you define what is considered an "allowed" syllable structure in ${expr}. Provide any information on phonological constraints for ${expr}.',
  },
  vowelHarmony: {
    order: 10,
    title: 'Vowel Harmony',
    name: 'vowelHarmony',
    section: LANGUAGE_SECTIONS.phonology.name,
    description:
      'Vowel harmony is a phonological process where vowels in a word must belong to the same subclass. This creates constraints on which vowels can appear together, ensuring they are "in harmony."',
  },
  honorifics: {
    order: 11,
    title: 'Honorifics',
    name: 'honorifics',
    section: LANGUAGE_SECTIONS.syntax.name,
    description:
      "Honorifics can be described as grammatical changes to ${expr} to denote social status. (i.e. French has 'tu' (you) form for familiar/friend and 'vous' (you) form for elder/teacher, etc.)",
  },
  verbs: {
    order: 12,
    title: 'Verbs (conjugations, etc.)',
    name: 'verbs',
    section: LANGUAGE_SECTIONS.syntax.name,
    description:
      'You can explain verbs for ${expr} below. Be sure to include conjugations in your description.',
  },
  sentenceStructure: {
    order: 13,
    title: 'Sentence Structure',
    name: 'syntax',
    section: LANGUAGE_SECTIONS.syntax.name,
    description: 'Describe the sentence structure of ${expr}.',
  },
  negation: {
    order: 14,
    title: 'Negation',
    name: 'negation',
    section: LANGUAGE_SECTIONS.syntax.name,
    description:
      "Define how negation works in ${expr} (e.g., the distinction between 'I'm here' and 'I'm not here' in English).",
  },
  questionForming: {
    order: 15,
    title: 'Question Forming',
    name: 'questionForming',
    section: LANGUAGE_SECTIONS.syntax.name,
    description:
      'How do you form a question in ${expr}? (Tip: Think about how you might ask this question in ${expr}!)',
  },
  vocabulary: {
    order: 16,
    title: 'Vocabulary',
    name: 'vocabulary',
    section: LANGUAGE_SECTIONS.wordsPhrases.name,
    description:
      'Build your dictionary. Vocabulary is the meat of your language. Add words in ${expr} below!',
  },
  phrases: {
    order: 17,
    title: 'Common Phrases',
    name: 'phrases',
    section: LANGUAGE_SECTIONS.wordsPhrases.name,
    description: 'Provide common phrases for ${expr}.',
  },
  numberSystem: {
    order: 18,
    title: 'Number System',
    name: 'numberSystem',
    section: LANGUAGE_SECTIONS.misc.name,
    description:
      "Describe ${expr}'s numeral system. You can be as simple as identifying numerical values and how to say them in ${expr} or as complex as identifying a base numeral system and going into depth on the decisions that went into creating the numeral system.",
  },
};

export const VIEW_LANGUAGE_MAP_DETAIL = {
  overview: [
    {
      title: LANGUAGE_SUBSECTIONS.introduction.title,
      contentKey: LANGUAGE_SUBSECTIONS.introduction.name,
      subsections: [],
    },
    {
      title: LANGUAGE_SECTIONS.phonology.title,
      contentKey: 'phonologicalConstraints',
      subsections: [
        {
          title: LANGUAGE_SUBSECTIONS.consonants.title,
          contentKey: 'consonantsDescription',
          metaKey: LANGUAGE_SUBSECTIONS.consonants.name,
          hasTable: true,
        },
        {
          title: LANGUAGE_SUBSECTIONS.vowels.title,
          contentKey: 'vowelsDescription',
          metaKey: LANGUAGE_SUBSECTIONS.vowels.name,
          hasTable: true,
        },
        {
          title: LANGUAGE_SUBSECTIONS.diphthongs.title,
          contentKey: LANGUAGE_SUBSECTIONS.diphthongs.name,
          metaKey: null,
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.alphabet.title,
          contentKey: null,
          metaKey: LANGUAGE_SUBSECTIONS.alphabet.name,
          hasTable: true,
        },
        {
          title: LANGUAGE_SUBSECTIONS.stress.title,
          contentKey: LANGUAGE_SUBSECTIONS.stress.name,
          metaKey: null,
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.vowelHarmony.title,
          contentKey: LANGUAGE_SUBSECTIONS.vowelHarmony.name,
          metaKey: null,
          hasTable: false,
        },
      ],
    },
    {
      title: LANGUAGE_SECTIONS.syntax.title,
      contentKey: LANGUAGE_SECTIONS.syntax.name,
      subsections: [
        {
          title: LANGUAGE_SUBSECTIONS.honorifics.title,
          contentKey: LANGUAGE_SUBSECTIONS.honorifics.name,
          metaKey: LANGUAGE_SUBSECTIONS.honorifics.name,
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.verbs.title,
          contentKey: 'conjugation',
          metaKey: null,
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.sentenceStructure.title,
          contentKey: LANGUAGE_SUBSECTIONS.sentenceStructure.name,
          metaKey: 'wordOrder',
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.negation.title,
          contentKey: LANGUAGE_SUBSECTIONS.negation.name,
          metaKey: null,
          hasTable: false,
        },
        {
          title: LANGUAGE_SUBSECTIONS.questionForming.title,
          contentKey: 'questionFormingInfo',
          metaKey: null,
          hasTable: false,
        },
      ],
    },
  ],
  dictionary: {
    contentKey: 'vocab',
  },
  phrases: {
    contentKey: LANGUAGE_SUBSECTIONS.phrases.name,
  },
  stories: {
    contentKey: 'story',
  },
};

export const ALPHABET: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
