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
import { useLocalStorage } from "@uidotdev/usehooks";
import { useSnackbar } from "notistack";
import { Box, CircularProgress } from "@mui/joy";
import useApi from "@hooks/useApi";

interface AuthContextType {
  identityToken: string | null;
  authorized: boolean | null;
  tokenExpirationDate: number | null;
  selectedUser: UserEntity | null;
  email: string | null;
  authorizedUsers: UserEntity[] | null;
  refreshIdentityToken: () => void;
  logout: () => void;
  setSelectedUser: (user: UserEntity | null) => void;
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
  setSelectedUser() {
    console.warn("Called setSelectedUser before auth context ready");
  },
});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const [storageSelectedUser, setStorageSelectedUser] = useLocalStorage<
    number | null
  >("selectedUser", null);
  const axiosInstance = useAxiosInstance(config.backendBaseUrl);
  const [email, setEmail] = useState<string | null>(null);
  const [authorizedUsers, setAuthorizedUsers] = useState<UserEntity[] | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { logoutUser, fetchIdentityToken } = useApi();
  const [tokenExpirationDate, setTokenExpirationDate] = useState<number | null>(
    null,
  );

  const processJwtToken = (jwtToken: string) => {
    const decoded = jwtDecode(jwtToken) as JwtTokenBody;
    setTokenExpirationDate(decoded.exp);
    setAuthorizedUsers(decoded.users);
    if (decoded.users?.length == 1) {
      setSelectedUser(decoded.users[0]);
    }
    setEmail(decoded.sub);
  };

  const selectUser = useCallback(
    (user: UserEntity | null) => {
      setSelectedUser(user);
      setStorageSelectedUser(user?.id ?? null);
    },
    [setSelectedUser, setStorageSelectedUser],
  );

  useEffect(() => {
    if (storageSelectedUser != null && authorizedUsers != undefined) {
      const user = authorizedUsers?.find(
        (user) => user.id == storageSelectedUser,
      );
      if (user == undefined) {
        enqueueSnackbar("User couldnt be found", { variant: "warning" });
      } else {
        selectUser(user);
      }
    }
  }, [authorizedUsers, selectUser, storageSelectedUser, enqueueSnackbar]);

  const refreshIdentityToken = useCallback(async () => {
    try {
      const token = await fetchIdentityToken();
      setIdentityToken(token);
      setAuthorized(true);
      processJwtToken(token);
      return token;
    } catch (error) {
      console.error("Failed to refresh token", error);
      setIdentityToken(null);
      setAuthorized(false);
      return null;
    }
  }, [axiosInstance]);

  const logout = useCallback(async () => {
    try {
      setIdentityToken(null);
      setAuthorized(false);
      selectUser(null);
      return await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [axiosInstance, selectUser]);

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
        setSelectedUser: selectUser,
      }}
    >
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
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthenticationProvider;
