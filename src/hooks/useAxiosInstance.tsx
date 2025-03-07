import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import axios, { AxiosInstance } from "axios";
import { useContext, useMemo } from "react";

const useAxiosInstance = (baseUrl: string): AxiosInstance => {
  const { identityToken, authorized } = useContext(AuthContext);

  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });

    const authHeader = authorized ? `Bearer ${identityToken}` : null;
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = authHeader;
        return config;
      },
      (error) => Promise.reject(error),
    );

    return instance;
  }, [baseUrl, authorized, identityToken]);
};

export default useAxiosInstance;
