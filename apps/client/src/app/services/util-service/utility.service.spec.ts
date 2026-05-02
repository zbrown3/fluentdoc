// import { TestBed, inject } from '@angular/core/testing';
//
// import { UtilityService } from './utility.service';
//
// describe('UtilityService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [UtilityService]
//     });
//   });
//
//   it('should be created', inject([UtilityService], (service: UtilityService) => {
//     expect(service).toBeTruthy();
//   }));
//
//   it('mapToSymbol should correctly map', inject([UtilityService], (service: UtilityService) => {
//     expect(service.mapToSymbol('b')).toBe('b');
//     expect(service.mapToSymbol('d')).toBe('d');
//     expect(service.mapToSymbol('f')).toBe('f');
//     expect(service.mapToSymbol('g')).toBe('g');
//     expect(service.mapToSymbol('h')).toBe('h');
//     expect(service.mapToSymbol('j')).toBe('j');
//     expect(service.mapToSymbol('k')).toBe('k');
//     expect(service.mapToSymbol('k')).toBe('k');
//     expect(service.mapToSymbol('m')).toBe('m');
//     expect(service.mapToSymbol('n')).toBe('n');
//     expect(service.mapToSymbol('N')).toBe('ŋ');
//     expect(service.mapToSymbol('p')).toBe('p');
//     expect(service.mapToSymbol('r')).toBe('r');
//     expect(service.mapToSymbol('s')).toBe('s');
//     expect(service.mapToSymbol('S')).toBe('ʃ');
//     expect(service.mapToSymbol('t')).toBe('t');
//     expect(service.mapToSymbol('tS')).toBe('tʃ');
//     expect(service.mapToSymbol('th')).toBe('θ');
//     expect(service.mapToSymbol('TH')).toBe('ð');
//     expect(service.mapToSymbol('v')).toBe('v');
//     expect(service.mapToSymbol('w')).toBe('w');
//     expect(service.mapToSymbol('z')).toBe('z');
//     expect(service.mapToSymbol('Z')).toBe('ʒ');
//     expect(service.mapToSymbol('dZ')).toBe('dʒ');
//     expect(service.mapToSymbol('w')).toBe('w');
//     expect(service.mapToSymbol('w')).toBe('w');
//     expect(service.mapToSymbol('tretro')).toBe('ʈ');
//     expect(service.mapToSymbol('dretro')).toBe('ɖ');
//     expect(service.mapToSymbol('glottal')).toBe('ʔ');
//     expect(service.mapToSymbol('nretro')).toBe('ɳ');
//     expect(service.mapToSymbol('G')).toBe('ɢ');
//     expect(service.mapToSymbol('npal')).toBe('ɲ');
//     expect(service.mapToSymbol('fpal')).toBe('ɟ');
//     expect(service.mapToSymbol('sretro')).toBe('ʂ');
//     expect(service.mapToSymbol('zretro')).toBe('ʐ');
//     expect(service.mapToSymbol('cpal')).toBe('ç');
//     expect(service.mapToSymbol('jpal')).toBe('ʝ');
//     expect(service.mapToSymbol('latfone')).toBe('ɬ');
//     expect(service.mapToSymbol('latftwo')).toBe('ɮ');
//     expect(service.mapToSymbol('downrretro')).toBe('ɻ');
//     expect(service.mapToSymbol('lretro')).toBe('ɭ');
//     expect(service.mapToSymbol('mtail')).toBe('ɱ');
//     expect(service.mapToSymbol('Nuv')).toBe('ɴ');
//     expect(service.mapToSymbol('V')).toBe('ⱱ');
//     expect(service.mapToSymbol('rR')).toBe('ɾ');
//     expect(service.mapToSymbol('Rr')).toBe('ɽ');
//     expect(service.mapToSymbol('BlVl')).toBe('ɸ');
//     expect(service.mapToSymbol('BlVd')).toBe('β');
//     expect(service.mapToSymbol('yvel')).toBe('ɣ');
//     expect(service.mapToSymbol('xuv')).toBe('χ');
//     expect(service.mapToSymbol('downR')).toBe('ʁ');
//     expect(service.mapToSymbol('hpha')).toBe('ħ');
//     expect(service.mapToSymbol('gpha')).toBe('ʕ');
//     expect(service.mapToSymbol('hcurve')).toBe('ɦ');
//     expect(service.mapToSymbol('vapprox')).toBe('ʋ');
//     expect(service.mapToSymbol('downr')).toBe('ɹ');
//     expect(service.mapToSymbol('wvel')).toBe('ɰ');
//     expect(service.mapToSymbol('ypal')).toBe('ʎ');
//     expect(service.mapToSymbol('L')).toBe('ʟ');
//
//
//     // vowels
//     expect(service.mapToSymbol('U')).toBe('^');
//     expect(service.mapToSymbol('a')).toBe('ɑ:');
//     expect(service.mapToSymbol('ae')).toBe('æ');
//     expect(service.mapToSymbol('eh')).toBe('ɛ');
//     expect(service.mapToSymbol('er')).toBe('ɝ');
//     expect(service.mapToSymbol('I')).toBe('ɪ');
//     expect(service.mapToSymbol('ah')).toBe('a');
//   }))
//
//   it('name validation must properly validate names', inject([UtilityService], (service: UtilityService) => {
//     // valid names
//     expect(service.validateName('Patrick')).toBe(true);
//     expect(service.validateName('Scarlett')).toBe(true);
//     expect(service.validateName('ScarlettBlackBlueRed')).toBe(true);
//     // invalid names
//     expect(service.validateName('P')).toBe(false);
//     expect(service.validateName('Pat!')).toBe(false);
//     expect(service.validateName('Pat3')).toBe(false);
//   }));
//
//   it('email validation must properly validate emails', inject([UtilityService], (service: UtilityService) => {
//     // valid emails
//     expect(service.validateEmail('pat@gaston.com')).toBe(true);
//     expect(service.validateEmail('pat@g.com')).toBe(true);
//     // invalid emails
//     expect(service.validateEmail('patg.com')).toBe(false);
//     expect(service.validateEmail('pat@gcom')).toBe(false);
//   }));
//
//
//   it('first letter is always capitalized with capitalizeFLetter() method', inject([UtilityService], (service: UtilityService) => {
//     expect(service.capitalizeFLetter('validate')).toBe('Validate');
//     expect(service.capitalizeFLetter('Validate')).toBe('Validate');
//     expect(service.capitalizeFLetter('v')).toBe('V');
//     expect(service.capitalizeFLetter('V')).toBe('V');
//   }));
//
// });
