import EN from './languages/en-us.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof EN;
    };
  }
}
