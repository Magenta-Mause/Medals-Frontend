import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import PageLayout from "@components/PageLayout/PageLayout";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";
import AthleteDetailPage from "@pages/Athletes/AthleteDetailPage";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import PdfDownloadPage from "@pages/Downloads/PdfDownloadPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import CreditsPage from "@pages/Legal/CreditsPage";
import ImprintPage from "@pages/Legal/ImprintPage";
import PrivacyPolicyPage from "@pages/Legal/PrivacyPolicyPage";
import LoginPage from "@pages/Login/LoginPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import ResetPasswordPage from "@pages/PasswordReset/PasswordResetPage";
import PerformanceMetricsPage from "@pages/PerformanceMetrics/PerformanceMetricsPage";
import SetPasswordPage from "@pages/SetPassword/SetPasswordPage";
import TrainerOverviewPage from "@pages/Trainers/TrainerOverviewPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import { useContext } from "react";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  const { selectedUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="/credits" element={<CreditsPage />} />

        <Route element={<ProtectedRoute userRole={selectedUser?.type} />}>
          {/* ADMIN */}
          <Route path="/trainer" element={<TrainerOverviewPage />} />

          {/* TRAINER */}
          <Route path="/athletes" element={<AthleteOverviewPage />} />
          <Route path="/athletes/:athleteId" element={<AthleteDetailPage />} />
          <Route
            path="/performanceMetrics"
            element={<PerformanceMetricsPage />}
          />
          <Route path="/assignAthlete" element={<InDevelopmentPage />} />

          {/* ATHLETE */}
          <Route path="/dashboard" element={<InDevelopmentPage />} />
          <Route path="/requirements" element={<InDevelopmentPage />} />
          <Route path="/performances" element={<InDevelopmentPage />} />

          {/* Shared Pages */}
          <Route path="/downloads" element={<PdfDownloadPage />} />
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
