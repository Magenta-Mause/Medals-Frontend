import { UserType } from "@customTypes/bffTypes";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions: Record<UserType, string[]> = {
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
  DEFAULT: [
    "/",
    "/trainer",
    "/athletes",
    "/performanceMetrics",
    "/assignAthlete",
    "/dashboard",
    "/profile",
    "/requirements",
    "/performances",
    "/downloads",
    "/help",

  ]
};

interface ProtectedRouteProps {
  userRole: UserType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole }) => {
  const location = useLocation();
  console.log(userRole);

  if (!userRole) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }
  
  if (!rolePermissions[userRole]?.includes(location.pathname)) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
