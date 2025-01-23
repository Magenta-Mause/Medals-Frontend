import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

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
      (error: any) => {
        {
          return Promise.reject(error);
        }
      },
    );
  }
};
