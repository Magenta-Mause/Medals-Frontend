import {
  Athlete,
  PerformanceRecording,
  PerformanceRecordingCreationDto,
  Trainer,
  DisciplineRatingMetric,
} from "@customTypes/backendTypes";
import { useCallback } from "react";
import config from "../config";
import useAxiosInstance from "./useAxiosInstance";
import { SwimmingCertificateType } from "@customTypes/enums";

const useApi = () => {
  const axiosInstance = useAxiosInstance(config.backendBaseUrl);

  const getPerformanceRecordings = useCallback(async () => {
    try {
      const request = await axiosInstance!.get("/performance-recordings");
      return request.data.data as PerformanceRecording[];
    } catch (error) {
      console.error("Error while fetching performance recordings", error);
    }
  }, [axiosInstance]);

  const getAthletes = useCallback(async () => {
    try {
      const request = await axiosInstance!.get(`/athletes`);
      return request.data.data as Athlete[];
    } catch (error) {
      console.error("Error while fetching athletes", error);
    }
  }, [axiosInstance]);

  const getAthlete = useCallback(
    async (athleteId: string) => {
      try {
        const request = await axiosInstance!.get(`/athletes/${athleteId}`);
        return request.data.data as Athlete;
      } catch (error) {
        console.error(
          `Error while fetching athlete with id: ${athleteId}`,
          error,
        );
      }
    },
    [axiosInstance],
  );

  const deleteAthlete = useCallback(
    async (athleteId: number) => {
      try {
        const request = await axiosInstance!.delete(`/athletes/${athleteId}`);
        return request.status == 202;
      } catch (error) {
        console.error(
          `Error while deleting athlete with id: ${athleteId}`,
          error,
        );
      }
    },
    [axiosInstance],
  );

  const checkAthleteExists = useCallback(
    async (email: string, birthdate: string) => {
      try {
        const response = await axiosInstance!.get("athletes/exists", {
          params: { email, birthdate },
        });
        return response.data.data;
      } catch (error) {
        console.error("Error checking athlete existence:", error);
        return false;
      }
    },
    [axiosInstance],
  );

  const getTrainers = useCallback(async () => {
    try {
      const request = await axiosInstance!.get(`/trainers`);
      return request.data.data as Trainer[];
    } catch (error) {
      console.error("Error while fetching trainers", error);
    }
  }, [axiosInstance]);

  const getTrainer = useCallback(
    async (trainerId: string) => {
      try {
        const request = await axiosInstance!.get(`/trainers/${trainerId}`);
        return request.data.data as Trainer;
      } catch (error) {
        console.error(
          `Error while fetching trainer with id: ${trainerId}`,
          error,
        );
      }
    },
    [axiosInstance],
  );

  const deleteTrainer = useCallback(
    async (trainerId: number) => {
      try {
        const request = await axiosInstance!.delete(`/trainers/${trainerId}`);
        return request.status == 202;
      } catch (error) {
        console.error(
          `Error while deleting athlete with id: ${trainerId}`,
          error,
        );
      }
    },
    [axiosInstance],
  );

  const inviteTrainer = useCallback(
    async (trainer: Trainer) => {
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
    },
    [axiosInstance],
  );

  const createAthlete = useCallback(
    async (athlete: Athlete) => {
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
    },
    [axiosInstance],
  );

  const deleteAdmin = async (adminId: number) => {
    try {
      const request = await axiosInstance!.delete(`/admins/${adminId}`);
      return request.status == 202;
    } catch (error) {
      console.error(`Error while deleting admin with id: ${adminId}`, error);
    }
  };

  const approveRequest = useCallback(
    async (oneTimeCode: string, selectedUser: number) => {
      try {
        const response = await axiosInstance!.post(
          `/athletes/approve-access?oneTimeCode=${oneTimeCode}`,
          {},
          {
            headers: {
              "X-Selected-User": selectedUser,
            },
          },
        );

        if (response.status !== 200) {
          throw new Error(
            `Error during accepting invite: ${response.statusText}`,
          );
        }
      } catch (error) {
        console.error(`Error while accepting invite`, error);
        throw error;
      }
    },
    [axiosInstance],
  );

  const requestAthlete = async (athleteId: number, trainerId: number) => {
    try {
      const response = await axiosInstance!.post(
        "/trainers/request-athlete-access",
        {
          athleteId: athleteId,
          trainerId: trainerId,
        },
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error requesting athlete:", error);
      return false;
    }
  };

  const searchAthletes = useCallback(
    async (athlete: string) => {
      try {
        const request = await axiosInstance!.get(
          `/trainers/search-athletes?athleteSearch=${athlete}`,
        );
        return request.data.data as Athlete[];
      } catch (error) {
        console.error(
          `Error while fetching trainer with id: ${athlete}`,
          error,
        );
        throw new Error("Error searching for athlete");
      }
    },
    [axiosInstance],
  );

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

  const getDisciplines = useCallback(async () => {
    try {
      const request = await axiosInstance!.get("/disciplines");
      return request.data.data;
    } catch {
      console.error("Error while loading disciplines");
    }
  }, [axiosInstance]);

  const createPerformanceRecording = useCallback(
    async (p: PerformanceRecordingCreationDto) => {
      try {
        const response = await axiosInstance!.post(
          "/performance-recordings",
          p,
        );
        return response.status == 201;
      } catch {
        throw new Error("Error while creating performance recording");
      }
    },
    [axiosInstance],
  );

  const deletePerformanceRecording = useCallback(
    async (performanceRecordingId: number) => {
      try {
        const response = await axiosInstance!.delete(
          "/performance-recordings/" + performanceRecordingId,
        );
        return response.status == 204;
      } catch {
        throw new Error(
          "Error while deleting performance recording with id: " +
            performanceRecordingId,
        );
      }
    },
    [axiosInstance],
  );

  const getDisciplineMetrics = useCallback(async () => {
    try {
      const response = await axiosInstance!.get("/disciplines/metrics");
      return response.data.data as DisciplineRatingMetric[];
    } catch (error) {
      console.error("Error while fetching discipline metrics", error);
    }
  }, [axiosInstance]);

  const addSwimmingCertificate = useCallback(
    async (athleteId: number, certificate: SwimmingCertificateType) => {
      try {
        const response = await axiosInstance!.post(
          `/athletes/${athleteId}/swimming-certificate`,
          JSON.stringify(certificate),
          { headers: { "Content-Type": "application/json" } },
        );
        return response.data.data as Athlete;
      } catch (error) {
        console.error(
          `Error while adding swimming certificate for athlete with id: ${athleteId}`,
          error,
        );
        throw error;
      }
    },
    [axiosInstance],
  );

  const deleteSwimmingCertificate = useCallback(
    async (athleteId: number) => {
      try {
        const response = await axiosInstance!.delete(
          `/athletes/${athleteId}/swimming-certificate`,
        );
        return response.data.data as Athlete;
      } catch (error) {
        console.error(
          `Error while deleting swimming certificate for athlete with id: ${athleteId}`,
          error,
        );
        throw error;
      }
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
    getPerformanceRecordings,
    getDisciplines,
    deleteTrainer,
    getTrainer,
    getTrainers,
    inviteTrainer,
    checkAthleteExists,
    createPerformanceRecording,
    deletePerformanceRecording,
    getDisciplineMetrics,
    addSwimmingCertificate,
    deleteSwimmingCertificate,
    approveRequest,
    requestAthlete,
    searchAthletes,
  };
};

export default useApi;
