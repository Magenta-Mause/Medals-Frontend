import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import axios, { AxiosInstance } from "axios";
import { useCallback, useContext, useEffect, useRef } from "react";

const useAxiosInstance = (baseUrl: string): AxiosInstance => {
  const axiosRef = useRef<AxiosInstance | null>(null);
  const { identityToken, authorized } = useContext(AuthContext);

  const getAuthorizationHeader = useCallback(() => {
    return authorized ? `Bearer ${identityToken}` : null;
  }, [authorized, identityToken]);

  useEffect(() => {
    const newAxiosInstance = axios.create({ baseURL: baseUrl });
    const authHeader = getAuthorizationHeader();
    newAxiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = authHeader;
        return config;
      },
      (error) => Promise.reject(error),
    );

    axiosRef.current = newAxiosInstance;
  }, [baseUrl, getAuthorizationHeader]);

  return axiosRef.current ?? axios.create({ baseURL: baseUrl });
};

export default useAxiosInstance;
