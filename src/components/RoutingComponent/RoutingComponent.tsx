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

const RoutingComponent = () => {
  const userRole="TRAINER";
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />

        {/* ADMIN */}
        <Route element={<ProtectedRoute userRole={userRole} />}>
          <Route path="/trainer" element={<InDevelopmentPage />} />
        </Route>

        {/* TRAINER */}
        <Route element={<ProtectedRoute userRole={userRole} />}>
          <Route path="/athletes" element={<AthleteOverviewPage />} />
          <Route path="/performanceMetrics" element={<InDevelopmentPage />} />
          <Route path="/assignAthlete" element={<InDevelopmentPage />} />
        </Route>

        {/* ATHLETE */}
        <Route element={<ProtectedRoute userRole={userRole} />}>
          <Route path="/dashboard" element={<InDevelopmentPage />} />
          <Route path="/profile" element={<InDevelopmentPage />} />
          <Route path="/requirements" element={<InDevelopmentPage />} />
          <Route path="/performances" element={<InDevelopmentPage />} />
        </Route>

        {/* Gemeinsame Seiten */}
        <Route element={<ProtectedRoute userRole={userRole} />}>
          <Route path="/downloads" element={<InDevelopmentPage />} />
          <Route path="/help" element={<InDevelopmentPage />} />
        </Route>

        {/* Error Pages */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/userRoleErrorPage" element={<UserRoleErrorPage/>} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
