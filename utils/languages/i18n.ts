import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./en/common.json";
import vi from "./vi/common.json";

const i18n = new I18n({ en, vi });

i18n.locale = getLocales()?.[0]?.languageCode ?? "vi";

export default i18n;
