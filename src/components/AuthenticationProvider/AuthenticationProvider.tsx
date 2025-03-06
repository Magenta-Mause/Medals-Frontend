import { JwtTokenBody, UserEntity } from "@customTypes/bffTypes";
import useApi from "@hooks/useApi";
import { Box, CircularProgress } from "@mui/joy";
import { useLocalStorage } from "@uidotdev/usehooks";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

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
  const [tokenExpirationDate, setTokenExpirationDate] = useState<number | null>(
    null,
  );

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
      console.log("Not authorized");
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
    if (storageSelectedUser == null) {
      selectUser(null);
      return;
    }
    if (authorizedUsers == null) {
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
      enqueueSnackbar("User couldnt be found", { variant: "warning" });
    } else {
      selectUser(user);
    }
  }, [
    authorizedUsers,
    selectUser,
    storageSelectedUser,
    enqueueSnackbar,
    selectedUser,
  ]);

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
