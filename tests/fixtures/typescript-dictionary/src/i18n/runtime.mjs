import { messages as en } from './en.mjs';
import { messages as ko } from './ko.mjs';

export function getLocale(saved, browserLocale) {
  try {
    return (saved || browserLocale || 'ko').startsWith('ko') ? 'ko' : 'en';
  } catch {
    return 'ko';
  }
}

export function translate(locale, key, ...args) {
  const message = ({ ko, en })[locale][key];
  return typeof message === 'function' ? message(...args) : message;
}
