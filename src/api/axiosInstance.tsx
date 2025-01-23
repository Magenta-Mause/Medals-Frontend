import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

let axiosInstance: AxiosInstance | null = null;

const getAuthorizationHeader = async () => {
  return "authToken";
};

const initializeConfig = async (baseUrl: string) => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: baseUrl,
    });

    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        config.headers!.Authorization =
          "Bearer " + (await getAuthorizationHeader());
        return config;
      },
      (error) => {
        {
          return Promise.reject(error);
        }
      },
    );
  }
};

const getAxiosInstance = () => {
  if (!axiosInstance) {
    throw new Error(
      "Axios instance has not been initialized. Call initializeConfig first.",
    );
  }
  return axiosInstance;
};

const isInitialized = () => {
  return axiosInstance != null;
};

export { getAxiosInstance, initializeConfig, isInitialized };
