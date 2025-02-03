import useAxiosInstance from "@api/axiosInstance";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import config from "../../../app.config.json";
import { JwtTokenBody, UserEntity } from "@customTypes/bffTypes";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  identityToken: string | null;
  authorized: boolean | null;
  tokenExpirationDate: number | null;
  selectedUser: UserEntity | null;
  email: string | null;
  authorizedUsers: UserEntity[] | null;
  refreshIdentityToken: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  identityToken: null,
  authorized: null,
  tokenExpirationDate: null,
  selectedUser: null,
  email: null,
  authorizedUsers: null,
  refreshIdentityToken() {
    console.warn("Called refresh identity token before auth context ready");
  },
  logout() {
    console.warn("Called logout before auth context ready");
  },
});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const axiosInstance = useAxiosInstance(config.backendBaseUrl);
  const [email, setEmail] = useState<string | null>(null);
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[] | null>(
    null,
  );
  const [selectedUser] = useState<UserEntity | null>(null);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<number | null>(
    null,
  );

  const processJwtToken = (jwtToken: string) => {
    const decoded = jwtDecode(jwtToken) as JwtTokenBody;
    setTokenExpirationDate(decoded.exp);
    setAuthorizedUsers(decoded.users);
    setEmail(decoded.sub);
  };

  const refreshIdentityToken = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/authorization/token", {
        withCredentials: true,
      });
      setIdentityToken(response.data.data);
      setAuthorized(true);
      processJwtToken(response.data.data);
      return response.data.identityToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      setIdentityToken(null);
      setAuthorized(false);
      return null;
    }
  }, [axiosInstance]);

  const logout = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        "/authorization/logout",
        {},
        { withCredentials: true },
      );
      setIdentityToken(null);
      setAuthorized(false);
      return response.status == 200;
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    refreshIdentityToken();
  }, [refreshIdentityToken]);

  return (
    <AuthContext.Provider
      value={{
        identityToken,
        refreshIdentityToken,
        tokenExpirationDate,
        authorized,
        logout,
        email,
        authorizedUsers,
        selectedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthenticationProvider;
