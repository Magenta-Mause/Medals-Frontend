import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import TestPage from "./pages/test";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <h1>Medals</h1>
        <TestPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
