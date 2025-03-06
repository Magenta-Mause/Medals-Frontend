import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import PageLayout from "@components/PageLayout/PageLayout";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import PdfDownloadPage from "@pages/Downloads/PdfDownloadPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import LoginPage from "@pages/Login/LoginPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import ResetPasswordPage from "@pages/PasswordReset/PasswordResetPage";
import SetPasswordPage from "@pages/SetPassword/SetPasswordPage";
import TrainerOverviewPage from "@pages/Trainers/TrainerOverviewPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import { useContext } from "react";
import ValidateInvitePage from "@pages/ValidateInvitePage/ValidateInvitePage";
import { Route, Routes } from "react-router";

const RoutingComponent = () => {
  const { selectedUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      <Route path="/validateInvite" element={<ValidateInvitePage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<ProtectedRoute userRole={selectedUser?.type} />}>
          {/* ADMIN */}
          <Route path="/trainer" element={<TrainerOverviewPage />} />

          {/* TRAINER */}
          <Route path="/athletes" element={<AthleteOverviewPage />} />
          <Route path="/performanceMetrics" element={<InDevelopmentPage />} />
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
