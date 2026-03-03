import React, { useState, createContext, Fragment, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { LOCALES } from "./locales";
import messages from "./messages";

export const IntlContext = createContext();

export const IntlProviderWrapper = (props) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const ChangeLangEN = () => {
    localStorage.setItem("lang", "en");
    setLang(LOCALES.ENGLISH);
  };
  const ChangeLangJP = () => {
    localStorage.setItem("lang", "jpn");
    setLang(LOCALES.JAPANESE);
  };

  // useEffect(() => {
  //   console.log(lang);
  // }, [lang]);

  return (
    <IntlContext.Provider value={[ChangeLangEN, ChangeLangJP]}>
      <IntlProvider
        locale={lang}
        textComponent={Fragment}
        messages={messages[lang]}
      >
        {props.children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};
