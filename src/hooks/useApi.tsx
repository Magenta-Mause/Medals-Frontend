import { Athlete, Trainer } from "@customTypes/bffTypes";
import { useCallback } from "react";
import config from "../config";
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
      return request.data.data as Athlete;
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

  const getTrainers = async () => {
    try {
      const request = await axiosInstance!.get(`/trainers`);
      return request.data.data as Trainer[];
    } catch (error) {
      console.error("Error while fetching trainers", error);
    }
  };

  const getTrainer = async (trainerId: string) => {
    try {
      const request = await axiosInstance!.get(`/trainers/${trainerId}`);
      return request.data.data as Trainer;
    } catch (error) {
      console.error(
        `Error while fetching trainer with id: ${trainerId}`,
        error,
      );
    }
  };

  const deleteTrainer = async (trainerId: number) => {
    try {
      const request = await axiosInstance!.delete(`/trainers/${trainerId}`);
      return request.status == 202;
    } catch (error) {
      console.error(
        `Error while deleting athlete with id: ${trainerId}`,
        error,
      );
    }
  };

  const inviteTrainer = async (trainer: Trainer) => {
    try {
      const request = await axiosInstance!.post(`/trainers`, trainer);
      if (request.status !== 201)
        throw new Error(
          `failed to create athlete, status code: ${request.status}`,
        );
      return true;
    } catch (error) {
      console.error(`Error while adding trainer`, error);
      throw error;
    }
  };

  const createAthlete = async (athlete: Athlete) => {
    const response = await axiosInstance.post(`/athletes`, {
      first_name: athlete.first_name,
      last_name: athlete.last_name,
      email: athlete.email,
      birthdate: athlete.birthdate,
      gender: athlete.gender,
    });
    if (response.status != 201) {
      throw new Error("Error during athlete creation");
    }
    return response.status == 201;
  };

  const deleteAdmin = async (adminId: number) => {
    try {
      const request = await axiosInstance!.delete(`/admins/${adminId}`);
      return request.status == 202;
    } catch (error) {
      console.error(`Error while deleting admin with id: ${adminId}`, error);
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
          token: oneTimeCode,
        },
      );
      return request.status == 200;
    },
    [axiosInstance],
  );

  const initiatePasswordReset = useCallback(
    async (email: string) => {
      const request = await axiosInstance!.post(
        "/authorization/resetPassword/" + email,
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
    deleteAdmin,
    setPassword,
    createAthlete,
    resetPassword,
    initiatePasswordReset,
    deleteTrainer,
    getTrainer,
    getTrainers,
    inviteTrainer,
  };
};

export default useApi;
