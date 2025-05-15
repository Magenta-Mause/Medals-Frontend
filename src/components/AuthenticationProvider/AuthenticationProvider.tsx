import { JwtTokenBody, UserEntity } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import useInstantiation from "@hooks/useInstantiation/useInstantiation";
import { Box, CircularProgress } from "@mui/joy";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { StompSessionProvider } from "react-stomp-hooks";
import config from "config";
import SockJS from "sockjs-client";

interface AuthContextType {
  identityToken: string | null;
  authorized: boolean | null;
  tokenExpirationDate: number | null;
  selectedUser: UserEntity | null | undefined;
  email: string | null;
  authorizedUsers: UserEntity[] | null;
  refreshIdentityToken: () => void;
  logout: () => void;
  setSelectedUser: (user: UserEntity | null | undefined) => void;
}

const AuthInitializationComponent = () => {
  const { selectedUser, identityToken } = useContext(AuthContext);
  const { instantiateByType } = useInstantiation();
  const [instantiatedUser, setInstantiatedUser] = useState<UserEntity | null>(
    null,
  );

  useEffect(() => {
    if (selectedUser && identityToken && selectedUser != instantiatedUser) {
      setInstantiatedUser(selectedUser);
      instantiateByType(selectedUser?.type);
    }
  }, [selectedUser, instantiateByType, identityToken, instantiatedUser]);

  return <></>;
};

const AuthContext = createContext<AuthContextType>({
  identityToken: null,
  authorized: null,
  tokenExpirationDate: null,
  selectedUser: undefined,
  email: null,
  authorizedUsers: null,
  refreshIdentityToken() {
    console.warn("Called refresh identity token before auth context ready");
  },
  logout() {
    console.warn("Called logout before auth context ready");
  },
  setSelectedUser() {
    console.warn("Called setSelectedUser before auth context ready");
  },
});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[] | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<
    UserEntity | null | undefined
  >(undefined);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { logoutUser, fetchIdentityToken } = useApi();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [tokenExpirationDate, setTokenExpirationDate] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (pathname !== "/login" && selectedUser === null && authorized) {
      navigate("/login");
    }
  }, [pathname, navigate, selectedUser, authorized]);

  const selectUser = useCallback(
    (user: UserEntity | null | undefined) => {
      setSelectedUser(user);

      const storageKey = "selectedUser";

      if (user?.id == null) {
        window.localStorage.removeItem(storageKey);
        return;
      }

      window.localStorage.setItem(storageKey, user.id.toString());
    },
    [setSelectedUser],
  );

  const processJwtToken = useCallback(
    (jwtToken: string) => {
      const decoded = jwtDecode(jwtToken) as JwtTokenBody;
      setTokenExpirationDate(decoded.exp);
      setAuthorizedUsers(decoded.users);

      if (
        decoded.users?.length == 1 &&
        window.localStorage.getItem("selectedUser") === null
      ) {
        selectUser(decoded.users[0]);
      }
      setEmail(decoded.sub);
    },
    [selectUser],
  );

  const refreshIdentityToken = useCallback(async () => {
    try {
      const token = await fetchIdentityToken();
      setIdentityToken(token);
      setAuthorized(true);
      processJwtToken(token);
      return token;
    } catch {
      setIdentityToken(null);
      setAuthorized(false);
      return null;
    }
  }, [fetchIdentityToken, processJwtToken]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setAuthorized(false);
      selectUser(null);
      setIdentityToken(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [selectUser, logoutUser]);

  useEffect(() => {
    const selectedUser = parseInt(
      window.localStorage.getItem("selectedUser") ?? "-1",
    );

    const user = authorizedUsers?.find((user) => user.id == selectedUser);
    if (user) {
      selectUser(user);
    } else if (authorizedUsers?.length ?? 0 > 0) {
      selectUser(null);
    }
  }, [authorizedUsers, selectUser, selectedUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((tokenExpirationDate ?? 0) < Date.now() / 1000) {
        refreshIdentityToken();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshIdentityToken, tokenExpirationDate]);

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
        setSelectedUser: selectUser,
      }}
    >
      <StompSessionProvider
        url={config.backendBrokerUrl}
        enabled={Boolean(identityToken && selectedUser)}
        webSocketFactory={() => {
          return new SockJS(
            config.websocketFactory +
              "?authToken=" +
              identityToken +
              "&selectedUser=" +
              selectedUser?.id,
          );
        }}
      >
        <AuthInitializationComponent />
        {authorized == undefined ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size="lg" />
          </Box>
        ) : (
          children
        )}
        <AuthInitializationComponent />
      </StompSessionProvider>
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthenticationProvider;
