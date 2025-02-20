import AuthenticationProvider from "@components/AuthenticationProvider/AuthenticationProvider";
import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import useApi from "@hooks/useApi";
import { Close } from "@mui/icons-material";
import {
  CssBaseline,
  CssVarsProvider,
  IconButton,
  StyledEngineProvider,
} from "@mui/joy";
import { setAthltes as setAthletes } from "@stores/slices/athleteSlice";
import { setTrainers } from "@stores/slices/trainerSlice";
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

const App = () => {
  const queryClient = new QueryClient();
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const { getAthletes, getTrainers } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setAthletes((await getAthletes()) || []));
      dispatch(setTrainers((await getTrainers()) || []));
    };
    fetchData();
  }, [dispatch, getAthletes, getTrainers]);

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
        </CssVarsProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export { UtilContext };
export default App;
