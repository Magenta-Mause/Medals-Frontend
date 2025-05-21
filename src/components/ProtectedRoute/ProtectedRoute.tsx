import { UserType } from "@customTypes/enums";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const rolePermissions = new Map<UserType | undefined, string[]>([
  [UserType.ADMIN, ["/", "/trainer", "/admins", "/materials", "/help"]],
  [
    UserType.TRAINER,
    [
      "/",
      "/",
      "/[0-9]+",
      "/performanceMetrics",
      "/assignAthlete",
      "/materials",
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
      "/materials",
      "/help",
    ],
  ],
  [
    undefined,
    [
      "/",
      "/trainer",
      "/admins",
      "/[0-9]+",
      "/performanceMetrics",
      "/assignAthlete",
      "/dashboard",
      "/requirements",
      "/performances",
      "/materials",
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
  const hasAccess = rolePermissions.get(userRole)?.reduce((prev, curr) => {
    return prev ? true : new RegExp("^" + curr + "$").test(location.pathname);
  }, false);

  if (!hasAccess) {
    return <Navigate to="/userRoleErrorPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
