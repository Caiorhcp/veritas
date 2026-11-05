import type { Locale } from "./config";
import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";

const DICTIONARIES = { pt, en, es };

export const getDictionary = (locale: Locale) => DICTIONARIES[locale];
