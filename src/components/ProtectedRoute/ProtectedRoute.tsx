import { UserType } from "@customTypes/enums";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions = new Map<UserType | undefined, string[]>([
  [UserType.ADMIN, ["/", "/trainer", "/downloads", "/help"]],
  [
    UserType.TRAINER,
    [
      "/",
      "/athletes",
      "/performanceMetrics",
      "/assignAthlete",
      "/downloads",
      "/help",
    ],
  ],
  [
    UserType.ATHLETE,
    [
      "/",
      "/dashboard",
      "/requirements",
      "/performances",
      "/downloads",
      "/help",
    ],
  ],
  [
    undefined,
    [
      "/",
      "/trainer",
      "/athletes",
      "/performanceMetrics",
      "/assignAthlete",
      "/dashboard",
      "/requirements",
      "/performances",
      "/downloads",
      "/help",
      "validateInvite",
    ],
  ],
]);

interface ProtectedRouteProps {
  userRole: UserType | undefined;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole }) => {
  const location = useLocation();

  if (!rolePermissions.get(userRole)?.includes(location.pathname)) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
