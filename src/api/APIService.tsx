import { Athlete } from "@customTypes/bffTypes";
import { getAxiosInstance } from "./axiosInstance";

const getAthletes = async () => {
  const axiosInstance = getAxiosInstance();
  try {
    const request = await axiosInstance.get(`/athletes`);
    return request.data.data as Athlete[];
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

const deleteAthlete = async (athleteId: number) => {
  const axiosInstance = getAxiosInstance();
  try {
    const request = await axiosInstance.delete(`/athletes/${athleteId}`);
    return request.status == 202;
  } catch (error) {
    console.error(`Error while deleting athlete with id: ${athleteId}`, error);
  }
};

const createAthlete = async (athleteData: { firstname: string; lastname:string; email: string; birthdate: string; gender:string }): Promise<number | null> => {
  const axiosInstance = getAxiosInstance();
  try {
    const response = await axiosInstance.post("/athletes", athleteData);
    
    if (response.status === 201) {
      return response.data.id; // Assuming the API returns the created athlete's ID
    }
    
    return null;
  } catch (error) {
    console.error("Error while creating athlete:", error);
    return null;
  }
};

export { deleteAthlete, getAthlete, getAthletes, createAthlete };
