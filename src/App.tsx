import AuthenticationProvider from "@components/AuthenticationProvider/AuthenticationProvider";
import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import { Close } from "@mui/icons-material";
import { CssVarsProvider, IconButton } from "@mui/joy";
import CssBaseline from "@mui/material/CssBaseline";
import {
  THEME_ID as MATERIAL_THEME_ID,
  ThemeProvider as MaterialCssVarsProvider,
  extendTheme as materialExtendTheme,
  ThemeProvider,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { closeSnackbar, SnackbarKey, SnackbarProvider } from "notistack";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "@uidotdev/usehooks";

type UtilContextType = {
  sideBarExtended: boolean;
  setSideBarExtended: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

const UtilContext = createContext<UtilContextType>({
  sideBarExtended: false,
  setSideBarExtended: undefined,
});

const materialTheme = materialExtendTheme();

const App = () => {
  const queryClient = new QueryClient();
  const [language, setLanguage] = useLocalStorage<string>("language");
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const snackBarActions = (snackbarId: SnackbarKey) => (
    <>
      <IconButton
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
        sx={{
          "&:hover": {
            background: "rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Close sx={{ fill: "white" }} />
      </IconButton>
    </>
  );
  const { i18n } = useTranslation();

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language, setLanguage]);

  useEffect(() => {
    if (language && i18n.language != language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <ThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
          <CssVarsProvider>
            <CssBaseline enableColorScheme />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={i18n.language}
            >
              <UtilContext.Provider
                value={{
                  sideBarExtended: isSideBarOpen,
                  setSideBarExtended: setSideBarOpen,
                }}
              >
                <BrowserRouter>
                  <SnackbarProvider
                    autoHideDuration={3000}
                    action={snackBarActions}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                  >
                    <AuthenticationProvider>
                      <RoutingComponent />
                    </AuthenticationProvider>
                  </SnackbarProvider>
                </BrowserRouter>
              </UtilContext.Provider>
            </LocalizationProvider>
          </CssVarsProvider>
        </ThemeProvider>
      </MaterialCssVarsProvider>
    </QueryClientProvider>
  );
};

export { UtilContext };
export default App;
