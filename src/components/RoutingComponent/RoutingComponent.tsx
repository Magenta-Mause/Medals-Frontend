import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import PageLayout from "@components/PageLayout/PageLayout";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";
import AthleteDetailPage from "@pages/Athletes/AthleteDetailPage";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import CreditsPage from "@pages/Legal/CreditsPage";
import ImprintPage from "@pages/Legal/ImprintPage";
import PrivacyPolicyPage from "@pages/Legal/PrivacyPolicyPage";
import LoginPage from "@pages/Login/LoginPage";
import MaterialsDownloadPage from "@pages/MaterialsDownloadPage/MaterialsDownloadPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import ResetPasswordPage from "@pages/PasswordReset/PasswordResetPage";
import PerformanceMetricsPage from "@pages/PerformanceMetrics/PerformanceMetricsPage";
import SetPasswordPage from "@pages/SetPassword/SetPasswordPage";
import TrainerOverviewPage from "@pages/Trainers/TrainerOverviewPage";
import AdminsOverviewPage from "@pages/Admins/AdminsOverviewPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import ValidateInvitePage from "@pages/AcceptTrainerAccessRequestPage/AcceptTrainerAccessRequestPage";
import { useContext } from "react";

import { Route, Routes } from "react-router";
import AthleteDashboardPage from "@pages/Athletes/AthleteDashboardPage";
import AthletePerformanceViewPage from "@pages/Athletes/AthletePerformanceViewPage";

const RoutingComponent = () => {
  const { selectedUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      <Route path="/approve-request" element={<ValidateInvitePage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/credits" element={<CreditsPage />} />

        <Route element={<ProtectedRoute userRole={selectedUser?.type} />}>
          {/* ADMIN */}
          <Route path="/trainer" element={<TrainerOverviewPage />} />
          <Route path="/admins" element={<AdminsOverviewPage />} />

          {/* TRAINER */}
          <Route path="/athletes" element={<AthleteOverviewPage />} />
          <Route path="/athletes/:athleteId" element={<AthleteDetailPage />} />
          <Route
            path="/performanceMetrics"
            element={<PerformanceMetricsPage />}
          />
          <Route path="/assignAthlete" element={<InDevelopmentPage />} />

          {/* ATHLETE */}
          <Route path="/dashboard" element={<AthleteDashboardPage />} />
          <Route path="/requirements" element={<PerformanceMetricsPage />} />
          <Route
            path="/performances"
            element={<AthletePerformanceViewPage />}
          />

          {/* Shared Pages */}
          <Route path="/materials" element={<MaterialsDownloadPage />} />
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
