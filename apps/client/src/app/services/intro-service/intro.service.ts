import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({ providedIn: 'root' })
export class IntroService {
  intro = introJs();

  startDashboardTour(): void {
    this.intro.setOptions({
      disableInteraction: false,
      doneLabel: 'Done',
      exitOnOverlayClick: false,
      nextLabel: 'Next',
      prevLabel: 'Back',
      showBullets: false,
      showStepNumbers: false,
      steps: [
        {
          title: 'Welcome to FluentDoc!',
          intro: 'Let’s take a quick tour.',
        },
        {
          title: 'Explore Resources',
          element: '#nav-resources',
          intro: 'Check out our Resources section for guides and inspiration.',
          position: 'bottom',
        },
        {
          title: 'Glossary of Terms',
          element: '#nav-glossary',
          intro: 'Visit the Glossary to explore key linguistic terms.',
          position: 'bottom',
        },
        {
          title: 'Track Your Progress',
          element: '#stats-container',
          intro: 'Here are your creator stats — track your languages, words, and phrases.',
        },
        {
          title: 'Create a New Language',
          element: '.btn-primary.btn-md[routerLink="/new-language"]',
          intro: 'Start building a new constructed language using this button.',
        },
        {
          title: 'Your Languages',
          element: '.profile-languages',
          intro: 'Your languages will show up here — just click to edit or manage them.',
          position: 'top',
        },
        {
          title: 'Getting Started Checklist',
          element: '#getting-started-checklist',
          intro: 'Complete the Getting Started Checklist to ensure you don’t miss any key features.',
        },
        {
          title: 'All set!',
          intro: 'Happy conlanging! 🎉 You’re ready to start crafting your own language.',
        },
      ],
      tooltipClass: 'fd-ftu',
    });

    this.intro.start();
  }

  startLanguageTour(): void {
    this.intro.setOptions({
      showStepNumbers: false,
      showBullets: false,
      exitOnOverlayClick: false,
      disableInteraction: false,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      steps: [
        {
          title: 'Welcome to your language!',
          intro: 'Let’s take a quick tour of everything you can do here.',
        },
        {
          title: 'General Info',
          element: '#generalInfoAccordion',
          intro: 'Start by adding the core details of your language — its name, purpose, and background.',
          position: 'right'
        },
        {
          title: 'Words & Phrases',
          element: '#wordsAndPhrasesAccordion',
          intro: 'Build your lexicon and phrasebook by adding words and example phrases.',
          position: 'right'
        },
        {
          title: 'Worldbuilding',
          element: '#worldbuildingButton',
          intro: 'Tell the story behind your language — where it’s spoken, who uses it, and why it exists.',
        },
        {
          title: 'Export & Settings',
          element: '#export-or-share-button',
          intro: 'Download your language as a printable guide, dictionary, or phrasebook for sharing or offline use, and adjust settings like privacy, visibility, and sharing options here.',
        },
        {
          title: 'All set!',
          intro: 'Happy conlanging! 🎉 You’re ready to create something amazing.',
        }
      ],
      tooltipClass: 'fd-ftu',
    });

    this.intro.start();
  }
}
