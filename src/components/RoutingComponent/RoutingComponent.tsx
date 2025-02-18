import PageLayout from "@components/PageLayout/PageLayout";
import AthleteOverviewPage from "@pages/Athletes/AthleteOverviewPage";
import HomePage from "@pages/Home/HomePage";
import InDevelopmentPage from "@pages/InDevelopment/InDevelopmentPage";
import PdfDownloadPage from "@pages/Downloads/PdfDownloadPage";
import LoginPage from "@pages/Login/LoginPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import UserRoleErrorPage from "@pages/UserRoleError/UserRoleErrorPage";
import ProtectedRoute from "@components/ProtectedRoute/ProtectedRoute";
import ResetPasswordPage from "@pages/PasswordReset/PasswordResetPage";
import SetPasswordPage from "@pages/SetPassword/SetPasswordPage";
import { Route, Routes } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const RoutingComponent = () => {
  const { selectedUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setPassword" element={<SetPasswordPage />} />
      <Route path="/resetPassword" element={<ResetPasswordPage />} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<ProtectedRoute userRole={selectedUser?.type} />}>
          {/* ADMIN */}
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
        <Route path="/downloads" element={<PdfDownloadPage />} />
      </Route>
    </Routes>
  );
};

export default RoutingComponent;
