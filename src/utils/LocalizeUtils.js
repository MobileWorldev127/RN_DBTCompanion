import memoize from 'lodash.memoize';
import i18n from 'i18n-js'
import * as RNLocalize from "react-native-localize";
const translationGetters = {
    en: () => require('../translations/en.json'),
    it: () => require('../translations/it.json'),
};

export const translate = memoize(
    (key, config) => {
        const isError = i18n.t(key, config).includes("[missing");
        return isError ? key : i18n.t(key, config)
    },
    (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const languageTagFunc = () => {
    const fallback = {
        languageTag : 'en'
    };
    const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    return languageTag
};

export const setI18nConfig = () => {

    const languageTag = languageTagFunc();
    translate.cache.clear();

    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag
};
