import { Navigate, Outlet, useLocation } from "react-router-dom";

type UserRole = "ADMIN" | "TRAINER" | "ATHLETE";

const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ["/", "/trainer", "/downloads", "/help"],
  TRAINER: [
    "/",
    "/athletes",
    "/performanceMetrics",
    "/assignAthlete",
    "/downloads",
    "/help",
  ],
  ATHLETE: [
    "/",
    "/dashboard",
    "/profile",
    "/requirements",
    "/performances",
    "/downloads",
    "/help",
  ],
};

interface ProtectedRouteProps {
  userRole: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole }) => {
  const location = useLocation();

  if (!userRole) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  if (!rolePermissions[userRole]?.includes(location.pathname)) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
