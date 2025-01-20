import RoutingComponent from "@components/RoutingComponent/RoutingComponent";
import { CssBaseline, CssVarsProvider, StyledEngineProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { BrowserRouter } from "react-router";

type UtilContextType = {
  sideBarExtended: boolean;
  setSideBarExtended: any;
};

const UtilContext = createContext<UtilContextType>({
  sideBarExtended: false,
  setSideBarExtended: undefined,
});

const App = () => {
  const queryClient = new QueryClient();
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);

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
