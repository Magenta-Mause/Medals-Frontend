import { useState, useEffect, useRef, useContext, useCallback } from "react";
import axios, { AxiosInstance } from "axios";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const useAxiosInstance = (baseUrl: string): AxiosInstance => {
  const axiosRef = useRef<AxiosInstance | null>(null);
  const { identityToken, authorized } = useContext(AuthContext);

  const getAuthorizationHeader = useCallback(() => {
    return authorized ? `Bearer ${identityToken}` : null;
  }, [authorized, identityToken]);

  useEffect(() => {
    if (!axiosRef.current) {
      const newAxiosInstance = axios.create({ baseURL: baseUrl });

      newAxiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = getAuthorizationHeader();
          return config;
        },
        (error) => Promise.reject(error),
      );

      axiosRef.current = newAxiosInstance;
    }
  }, [baseUrl, getAuthorizationHeader]);

  return axiosRef.current ?? axios.create({ baseURL: baseUrl });
};

export default useAxiosInstance;
