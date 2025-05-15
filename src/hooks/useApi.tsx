import {
  AccessRequest,
  Athlete,
  DisciplineRatingMetric,
  PerformanceRecording,
  PerformanceRecordingCreationDto,
  Trainer,
  Admin,
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

  const updateAthlete = useCallback(
    async (athlete: Athlete) => {
      try {
        const request = await axiosInstance!.put(`/athletes/${athlete.id}`, {
          firstName: athlete.first_name,
          lastName: athlete.last_name,
        });
        if (request.status !== 200) {
          throw new Error(
            `Failed to update athlete, status code: ${request.status}`,
          );
        }
        return request.data.data as Athlete;
      } catch (error) {
        console.error(
          `Error while updating athlete with id: ${athlete.id}`,
          error,
        );
        throw error;
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

  const updateTrainer = useCallback(
    async (trainer: Trainer) => {
      try {
        const request = await axiosInstance!.put(`/trainers/${trainer.id}`, {
          firstName: trainer.first_name,
          lastName: trainer.last_name,
        });
        if (request.status !== 200) {
          throw new Error(
            `Failed to update trainer, status code: ${request.status}`,
          );
        }
        return request.data.data as Trainer;
      } catch (error) {
        console.error(
          `Error while updating trainer with id: ${trainer.id}`,
          error,
        );
        throw error;
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
            `failed to create trainer, status code: ${request.status}`,
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

  const inviteAdmin = useCallback(
    async (admin: Admin) => {
      try {
        const request = await axiosInstance!.post(`/admins`, {
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
        });
        if (request.status !== 201)
          throw new Error(
            `failed to create admin, status code: ${request.status}`,
          );
        return true;
      } catch (error) {
        console.error(`Error while adding admin`, error);
        throw error;
      }
    },
    [axiosInstance],
  );

  const updateAdmin = useCallback(
    async (admin: Admin) => {
      try {
        const request = await axiosInstance!.put(`/admins/${admin.id}`, {
          firstName: admin.first_name,
          lastName: admin.last_name,
        });
        if (request.status !== 200) {
          throw new Error(
            `Failed to update admin, status code: ${request.status}`,
          );
        }
        return request.data.data as Admin;
      } catch (error) {
        console.error(`Error while updating admin with id: ${admin.id}`, error);
        throw error;
      }
    },
    [axiosInstance],
  );

  const deleteAdmin = useCallback(
    async (adminId: number) => {
      try {
        const request = await axiosInstance!.delete(`/admins/${adminId}`);
        return request.status == 202;
      } catch (error) {
        console.error(`Error while deleting admin with id: ${adminId}`, error);
      }
    },
    [axiosInstance],
  );

  const getAccessRequests = useCallback(async () => {
    try {
      const response = await axiosInstance!.get("/athletes/access-requests");
      return response.data.data as AccessRequest[];
    } catch (error) {
      console.error("Error while loading access requests", error);
    }
  }, [axiosInstance]);

  const revokeRequest = useCallback(
    async (oneTimeCode: string, selectedUser: number) => {
      try {
        const response = await axiosInstance!.delete(
          `/athletes/access-requests/${oneTimeCode}`,
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

  const approveRequest = useCallback(
    async (oneTimeCode: string, selectedUser: number) => {
      try {
        const response = await axiosInstance!.post(
          `/athletes/access-requests/${oneTimeCode}`,
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

  const requestAthlete = async (athleteId: number) => {
    try {
      const response = await axiosInstance!.post(
        "/trainers/access-request/" + athleteId,
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

  const getAdmins = useCallback(async () => {
    try {
      const response = await axiosInstance!.get("/admins");
      return response.data.data as Admin[];
    } catch (error) {
      console.error("Error while fetching admins", error);
      return [];
    }
  }, [axiosInstance]);

  const removeTrainerAthleteConnection = useCallback(
    async (trainerId: number, athleteId: number) => {
      try {
        const response = await axiosInstance!.delete(
          `/trainers/trainer-athlete-connection`,
          {
            params: { trainerId, athleteId },
          },
        );
        return response.data.data as Trainer;
      } catch (error) {
        console.error(
          `Error while removing the connection between trainer and athlete`,
          error,
        );
        throw error;
      }
    },
    [axiosInstance],
  );

  const removeAssignedTrainer = useCallback(
    async (trainerId: number) => {
      try {
        const response = await axiosInstance.delete(
          "/athletes/approved-trainers/" + trainerId,
        );
        return response.data.data;
      } catch (error) {
        console.error(
          `Error while removing the connection between trainer and athlete`,
          error,
        );
        throw error;
      }
    },
    [axiosInstance],
  );

  const getTrainersAssignedToAthlete = useCallback(async () => {
    try {
      const request = await axiosInstance!.get(`/athletes/approved-trainers`);
      return request.data.data;
    } catch (error) {
      console.error(
        "Error while fetching athletes assigned to a trainer",
        error,
      );
    }
  }, [axiosInstance]);

  return {
    loginUser,
    logoutUser,
    fetchIdentityToken,
    deleteAthlete,
    getAthlete,
    updateAthlete,
    getAthletes,
    inviteAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmins,
    setPassword,
    createAthlete,
    resetPassword,
    initiatePasswordReset,
    getPerformanceRecordings,
    getDisciplines,
    deleteTrainer,
    updateTrainer,
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
    getAccessRequests,
    removeTrainerAthleteConnection,
    revokeRequest,
    removeAssignedTrainer,
    getTrainersAssignedToAthlete,
  };
};

export default useApi;
