import { Athlete } from "@customTypes/bffTypes";
import { useCallback } from "react";
import config from "../../app.config.json";
import useAxiosInstance from "./useAxiosInstance";

const useApi = () => {
  const axiosInstance = useAxiosInstance(config.backendBaseUrl);

  const getAthletes = async () => {
    try {
      const request = await axiosInstance!.get(`/athletes`);
      return request.data.data as Athlete[];
    } catch (error) {
      console.error("Error while fetching athletes", error);
    }
  };

  const getAthlete = async (atheteId: string) => {
    try {
      const request = await axiosInstance!.get(`/athletes/${atheteId}`);
      return request.data as Athlete;
    } catch (error) {
      console.error(`Error while fetching athlete with id: ${atheteId}`, error);
    }
  };

  const deleteAthlete = async (athleteId: number) => {
    try {
      const request = await axiosInstance!.delete(`/athletes/${athleteId}`);
      return request.status == 202;
    } catch (error) {
      console.error(
        `Error while deleting athlete with id: ${athleteId}`,
        error,
      );
    }
  };

  const loginUser = useCallback(
    async (email: string, password: string) => {
      const request = await axiosInstance!.post(
        `/authorization/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      if (request.status != 200) {
        throw "Login Failed";
      }
      return request.status == 200;
    },
    [axiosInstance],
  );

  const logoutUser = useCallback(async () => {
    const request = await axiosInstance!.post(
      "/authorization/logout",
      {},
      { withCredentials: true },
    );
    return request.status == 200;
  }, [axiosInstance]);

  const fetchIdentityToken = useCallback(async () => {
    const request = await axiosInstance!.get("/authorization/token", {
      withCredentials: true,
    });
    return request.data.data;
  }, [axiosInstance]);

  const setPassword = useCallback(
    async (password: string, oneTimeCode: string) => {
      const request = await axiosInstance!.post(
        "/authorization/setPassword",
        {
          password: password,
          oneTimeCode: oneTimeCode,
        },
        {
          withCredentials: true,
        },
      );
      return request.status == 200;
    },
    [axiosInstance],
  );

  const resetPassword = useCallback(
    async (password: string, oneTimeCode: string) => {
      const request = await axiosInstance!.post(
        "/authorization/resetPassword",
        {
          password: password,
          oneTimeCode: oneTimeCode,
        },
      );
      return request.status == 200;
    },
    [axiosInstance],
  );

  return {
    loginUser,
    logoutUser,
    fetchIdentityToken,
    deleteAthlete,
    getAthlete,
    getAthletes,
    setPassword,
    resetPassword,
  };
};

export default useApi;
