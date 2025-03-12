import { UserType } from "@customTypes/enums";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions = new Map<UserType | undefined, string[]>([
  [UserType.ADMIN, ["/", "/trainer", "/downloads", "/help"]],
  [
    UserType.TRAINER,
    [
      "/",
      "\\/athletes",
      "/athletes/[0-9]+",
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
      "\\/athletes",
      "/athletes/[0-9]+",
      "/performanceMetrics",
      "/assignAthlete",
      "/dashboard",
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
  const hasAccess = rolePermissions.get(userRole)?.reduce((prev, curr) => {
    return prev ? true : new RegExp("^" + curr + "$").test(location.pathname);
  }, false);

  if (!hasAccess) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
