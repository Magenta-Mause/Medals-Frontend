import PageLayout from "@components/PageLayout/PageLayout";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import LoginPage from "@pages/Login/LoginPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";
import SetPasswordPage from "@pages/SetPassword/SetPasswordPage";
import { Route, Routes } from "react-router";
import { UserType } from "@customTypes/bffTypes";

const RoutingComponent = () => {
  const userRole: UserType=UserType.ATHLETE;
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />

        {/* ADMIN */}
        <Route element={<ProtectedRoute userRole={userRole} />}>
          <Route path="/trainer" element={<InDevelopmentPage />} />

        {/* TRAINER */}
          <Route path="/athletes" element={<AthleteOverviewPage />} />
          <Route path="/performanceMetrics" element={<InDevelopmentPage />} />
          <Route path="/assignAthlete" element={<InDevelopmentPage />} />

        {/* ATHLETE */}
          <Route path="/dashboard" element={<InDevelopmentPage />} />
          <Route path="/profile" element={<InDevelopmentPage />} />
          <Route path="/requirements" element={<InDevelopmentPage />} />
          <Route path="/performances" element={<InDevelopmentPage />} />

        {/* Gemeinsame Seiten */}
          <Route path="/downloads" element={<InDevelopmentPage />} />
          <Route path="/help" element={<InDevelopmentPage />} />
        </Route>

        {/* Error Pages */}
        <Route path="/userRoleErrorPage" element={<UserRoleErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
