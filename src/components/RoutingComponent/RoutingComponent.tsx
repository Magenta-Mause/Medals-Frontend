import PageLayout from "@components/PageLayout/PageLayout";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/athletes" element={<AthleteOverviewPage />} />
        <Route path="/trainer" element={<InDevelopmentPage/>} />
        <Route path="/performanceMetric" element={<InDevelopmentPage />} />
        <Route path="/assignAthlete" element={<InDevelopmentPage />} />
        <Route path="/dashboard" element={<InDevelopmentPage />} />
        <Route path="/profile" element={<InDevelopmentPage />} />
        <Route path="/requirements" element={<InDevelopmentPage />} />
        <Route path="/performances" element={<InDevelopmentPage />} />
        <Route path="/downloads" element={<InDevelopmentPage />} />
        <Route path="/help" element={<InDevelopmentPage />} />
        <Route path="/userRoleErrorPage" element={<UserRoleErrorPage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
