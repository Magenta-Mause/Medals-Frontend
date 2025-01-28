import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import { CssBaseline, CssVarsProvider, StyledEngineProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeConfig } from "@api/axiosInstance";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router";
import config from "../app.config.json";
import { useDispatch } from "react-redux";
import { fetchInitialState } from "@stores/slices/athleteSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

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
    initializeConfig(config.backendBaseUrl);
    dispatch(fetchInitialState());
  }, [dispatch]);

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
              <RoutingComponent />
            </BrowserRouter>
          </UtilContext.Provider>
        </CssVarsProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export { UtilContext };
export default App;
