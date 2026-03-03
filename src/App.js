import React, { useEffect } from "react";
import AppRouter from "./Routes/AppRouter";
import { Provider } from "react-redux";
import store from "./redux/store";
import { I18nProvider } from "./components/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const setLocationScript = () => {
  const maps = document.createElement("script");
  maps.src =
    "https://maps.google.com/maps/api/js?key=AIzaSyCIDUSBqHPfkEssENT_X9vuWt5nzca8_W4&libraries=places";
  document.body.appendChild(maps);
  maps.addEventListener("load", () => {
    // console.log('maps loaded')
    initMap();
  });
};
const initMap = () => {
  window.locService = new window.google.maps.places.PlacesService(
    new window.google.maps.Map(document.getElementById("map"))
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export default function App() {
  // const [lang,setLang] = useState(LOCALES.JAPANESE)

  // let currentLang = localStorage.getItem("lang")

  // useEffect(()=>{
  //   if(currentLang === 'jp'){
  //     setLang(LOCALES.JAPANESE)
  //   } else {
  //     setLang(LOCALES.ENGLISH)
  //   }
  // },[currentLang])

  // useEffect(() => {
  //   setLocationScript();
  // }, []);

  return (
    <Provider store={store({})}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          {/* <input hidden id="map" /> */}
        </QueryClientProvider>
      </I18nProvider>
    </Provider>
  );
}
