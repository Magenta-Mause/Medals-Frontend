import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import axios, { AxiosInstance } from "axios";
import { useContext, useMemo } from "react";

const useAxiosInstance = (baseUrl: string): AxiosInstance => {
  const { identityToken, authorized, selectedUser } = useContext(AuthContext);

  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });

    const authHeader = authorized ? `Bearer ${identityToken}` : null;
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = authHeader;
        config.headers["X-Selected-User"] = selectedUser?.id;
        return config;
      },
      (error) => Promise.reject(error),
    );

    return instance;
  }, [baseUrl, authorized, identityToken, selectedUser]);
};

export default useAxiosInstance;
