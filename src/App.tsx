import AuthenticationProvider from "@components/AuthenticationProvider/AuthenticationProvider";
import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import useApi from "@hooks/useApi";
import { Close } from "@mui/icons-material";
import { CssVarsProvider, IconButton } from "@mui/joy";
import CssBaseline from "@mui/material/CssBaseline";
import {
  THEME_ID as MATERIAL_THEME_ID,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  extendTheme as materialExtendTheme,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { setAthltes as setAthletes } from "@stores/slices/athleteSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { closeSnackbar, SnackbarKey, SnackbarProvider } from "notistack";
import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router";

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
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const { getAthletes } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setAthletes((await getAthletes()) || []));
    };
    fetchData();
  }, [dispatch, getAthletes]);

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

  return (
    <QueryClientProvider client={queryClient}>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <CssVarsProvider>
          <CssBaseline enableColorScheme />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      </MaterialCssVarsProvider>
    </QueryClientProvider>
  );
};

export { UtilContext };
export default App;
