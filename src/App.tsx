import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import {
  CssBaseline,
  CssVarsProvider,
  IconButton,
  StyledEngineProvider,
} from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router";
import config from "../app.config.json";
import { useDispatch } from "react-redux";
import { fetchInitialState } from "@stores/slices/athleteSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import AuthenticationProvider from "@components/AuthenticationProvider/AuthenticationProvider";
import { closeSnackbar, SnackbarKey, SnackbarProvider } from "notistack";
import { Close } from "@mui/icons-material";

type UtilContextType = {
  sideBarExtended: boolean;
  setSideBarExtended: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

const UtilContext = createContext<UtilContextType>({
  sideBarExtended: false,
  setSideBarExtended: undefined,
});

const App = () => {
  const queryClient = new QueryClient();
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    dispatch(fetchInitialState());
  }, [dispatch]);

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
      <StyledEngineProvider injectFirst>
        <CssVarsProvider>
          <UtilContext.Provider
            value={{
              sideBarExtended: isSideBarOpen,
              setSideBarExtended: setSideBarOpen,
            }}
          >
            <CssBaseline />
            <BrowserRouter>
              <SnackbarProvider
                autoHideDuration={3000}
                action={snackBarActions}
              >
                <AuthenticationProvider>
                  <RoutingComponent />
                </AuthenticationProvider>
              </SnackbarProvider>
            </BrowserRouter>
          </UtilContext.Provider>
        </CssVarsProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export { UtilContext };
export default App;
