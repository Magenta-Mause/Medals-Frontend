import { JwtTokenBody, UserEntity } from "@customTypes/backendTypes";
import useApi from "@hooks/useApi";
import useInstantiation from "@hooks/useInstantiation/useInstantiation";
import { Box, CircularProgress } from "@mui/joy";
import { useLocalStorage } from "@uidotdev/usehooks";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";

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
    if (selectedUser && identityToken && selectedUser !== instantiatedUser) {
      instantiateByType(selectedUser?.type);
      setInstantiatedUser(selectedUser);
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
  const [storageSelectedUser, setStorageSelectedUser] = useLocalStorage<
    number | null
  >("selectedUser", null);
  const [email, setEmail] = useState<string | null>(null);
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[] | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<
    UserEntity | null | undefined
  >(undefined);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { enqueueSnackbar } = useSnackbar();
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
      setStorageSelectedUser(user?.id ?? null);
    },
    [setSelectedUser, setStorageSelectedUser],
  );

  const processJwtToken = useCallback(
    (jwtToken: string) => {
      const decoded = jwtDecode(jwtToken) as JwtTokenBody;
      setTokenExpirationDate(decoded.exp);
      setAuthorizedUsers(decoded.users);
      if (decoded.users?.length == 1) {
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
    if (storageSelectedUser === null) {
      return;
    }
    if (authorizedUsers === null) {
      return;
    }
    if (selectedUser === null) {
      return;
    }
    const user = authorizedUsers?.find(
      (user) => user.id == storageSelectedUser,
    );
    if (user === undefined) {
      selectUser(null);
    } else {
      if (selectedUser === null || selectedUser?.id != user.id) {
        selectUser(user);
      }
    }
  }, [
    authorizedUsers,
    selectUser,
    storageSelectedUser,
    enqueueSnackbar,
    selectedUser,
  ]);

  useEffect(() => {
    if ((tokenExpirationDate ?? 0) < Date.now() / 1000) {
      refreshIdentityToken();
    }
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
      <AuthInitializationComponent />
      {authorized == undefined ? (
        <>
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
        </>
      ) : (
        children
      )}
      <AuthInitializationComponent />
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthenticationProvider;
