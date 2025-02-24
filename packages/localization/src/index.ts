import type { PostProcessorModule } from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json' assert { type: 'json' };

const resources = {
    en: { translation: en },
};

export const languages = [
    {
        label: 'English',
        value: 'en',
    },
];

const lowerCasePostProcessor: PostProcessorModule = {
    name: 'lowerCase',
    process: (value: string) => {
        return value.toLocaleLowerCase();
    },
    type: 'postProcessor',
};

const upperCasePostProcessor: PostProcessorModule = {
    name: 'upperCase',
    process: (value: string) => {
        return value.toLocaleUpperCase();
    },
    type: 'postProcessor',
};

const titleCasePostProcessor: PostProcessorModule = {
    name: 'titleCase',
    process: (value: string) => {
        return value.replace(/\S+/g, (txt) => {
            return txt.charAt(0).toLocaleUpperCase() + txt.slice(1).toLowerCase();
        });
    },
    type: 'postProcessor',
};

i18n.use(lowerCasePostProcessor)
    .use(upperCasePostProcessor)
    .use(titleCasePostProcessor)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: 'en',
        // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        resources,
    });

export const localize = {
    changeLanguage: i18n.changeLanguage,
    instance: i18n,
    language: i18n.language,
    t: i18n.t,
};
