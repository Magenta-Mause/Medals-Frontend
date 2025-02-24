import { UserType } from "@customTypes/enums";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions = new Map<UserType | undefined, string[]>([
  [UserType.ADMIN, ["/", "/trainer", "/downloads", "/help", "/profile"]],
  [
    UserType.TRAINER,
    [
      "/",
      "/athletes",
      "/performanceMetrics",
      "/assignAthlete",
      "/downloads",
      "/help",
      "/profile",
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
      "/profile",
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
      "/profile",
      "/requirements",
      "/performances",
      "/downloads",
      "/help",
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
