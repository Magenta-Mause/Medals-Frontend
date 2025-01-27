import { Athlete } from "@types/bffTypes";
import { getAxiosInstance } from "./axiosInstance";

const getAthletes = async () => {
  const axiosInstance = getAxiosInstance();
  try {
    const request = await axiosInstance.get(`/athletes`);
    return request.data as Athlete[];
  } catch (error) {
    console.error("Error while fetching athletes", error);
  }
};

const getAthlete = async (atheteId: string) => {
  const axiosInstance = getAxiosInstance();
  try {
    const request = await axiosInstance.get(`/athletes/${atheteId}`);
    return request.data as Athlete;
  } catch (error) {
    console.error(`Error while fetching athlete with id: ${atheteId}`, error);
  }
};

const deleteAthlete = async (athleteId: string) => {
  const axiosInstance = getAxiosInstance();
  try {
    const request = await axiosInstance.delete(`/athletes/${athleteId}`);
    return request.status == 202;
  } catch (error) {
    console.error(`Error while deleting athlete with id: ${athleteId}`, error);
  }
};

export { getAthletes, getAthlete, deleteAthlete };
