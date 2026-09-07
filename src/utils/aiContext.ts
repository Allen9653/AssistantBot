export interface BusinessService {
  name: string;
  description: string;
  price: string;
}

export interface BusinessSettings {
  businessName: string;
  industry: string;
  contactPhone: string;
  address: string;
  workingHours: string;
  services: BusinessService[];
  customGreeting: string;
  legalRules: string;
}

export const defaultBusinessSettings: BusinessSettings = {
  businessName: 'Vaše poslovanje',
  industry: 'Usluge',
  contactPhone: '',
  address: '',
  workingHours: 'Pon-Pet: 08:00 - 16:00',
  services: [],
  customGreeting: 'Pozdrav! Kako vam mogu pomoći danas?',
  legalRules: 'Ne izmišljaj pravne, finansijske ili zdravstvene savjete. Kada informacija nije u podešavanjima, jasno reci da vlasnik treba potvrditi odgovor.',
};

const STORAGE_KEY = 'assistantbot.business-settings.v1';

export function loadBusinessSettings(): BusinessSettings {
  if (typeof window === 'undefined') return defaultBusinessSettings;

  try {
    const storedSettings = window.localStorage.getItem(STORAGE_KEY);
    if (!storedSettings) return defaultBusinessSettings;

    const parsedSettings = JSON.parse(storedSettings) as Partial<BusinessSettings>;
    return {
      ...defaultBusinessSettings,
      ...parsedSettings,
      services: Array.isArray(parsedSettings.services) ? parsedSettings.services : [],
    };
  } catch {
    return defaultBusinessSettings;
  }
}

export function saveBusinessSettings(settings: BusinessSettings): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function buildBusinessContext(settings: BusinessSettings): string {
  const services = settings.services.length
    ? settings.services.map((service) => `- ${service.name}: ${service.description} | Cijena: ${service.price || 'nije navedena'}`).join('\n')
    : '- Usluge još nisu unesene.';

  return [
    `Naziv poslovanja: ${settings.businessName}`,
    `Industrija: ${settings.industry}`,
    `Telefon: ${settings.contactPhone || 'nije naveden'}`,
    `Adresa: ${settings.address || 'nije navedena'}`,
    `Radno vrijeme: ${settings.workingHours || 'nije navedeno'}`,
    'Usluge i cijene:',
    services,
    `Pravila usklađenosti: ${settings.legalRules}`,
  ].join('\n');
}

export function buildSystemPrompt(settings: BusinessSettings): string {
  return `Ti si AssistantBot za poslovanje "${settings.businessName}". Odgovaraj jasno, ljubazno i isključivo na osnovu poslovnog konteksta ispod. Ne izmišljaj cijene, radno vrijeme, dostupnost ili pravne tvrdnje. Ako odgovor nije naveden, reci korisniku da informaciju treba potvrditi direktno kod poslovanja. Poštuj lokalna pravila usklađenosti.\n\n${buildBusinessContext(settings)}`;
}

export function createConfiguredReply(question: string, settings: BusinessSettings): string {
  const normalizedQuestion = question.toLocaleLowerCase('bs');
  const context = buildBusinessContext(settings);

  if (normalizedQuestion.includes('radno') || normalizedQuestion.includes('vrijeme') || normalizedQuestion.includes('otvor')) {
    return `Radno vrijeme poslovanja ${settings.businessName} je: ${settings.workingHours || 'nije uneseno u podešavanjima'}.`;
  }

  if (normalizedQuestion.includes('telefon') || normalizedQuestion.includes('kontakt')) {
    return settings.contactPhone
      ? `Možete kontaktirati ${settings.businessName} na broj ${settings.contactPhone}.`
      : 'Kontakt telefon još nije unesen u poslovna podešavanja.';
  }

  if (normalizedQuestion.includes('adresa') || normalizedQuestion.includes('lokacij')) {
    return settings.address
      ? `Adresa poslovanja je: ${settings.address}.`
      : 'Adresa još nije unesena u poslovna podešavanja.';
  }

  const matchedService = settings.services.find((service) =>
    normalizedQuestion.includes(service.name.toLocaleLowerCase('bs')),
  );
  if (matchedService) {
    return `${matchedService.name}: ${matchedService.description}. Cijena: ${matchedService.price || 'nije navedena'}.`;
  }

  return `Hvala na pitanju. Trenutno mogu odgovoriti na osnovu ovih konfigurisanih podataka:\n\n${context}\n\nZa precizniji odgovor vlasnik poslovanja treba dopuniti podešavanja ili potvrditi informaciju.`;
}
