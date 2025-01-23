import { mockAthletes } from "./ApiMock";
import { getAxiosInstance } from "./axiosInstance";

const getAthletes = async (): Promise<Athlete[]> => {
  return mockAthletes;
  
  const axiosInstance = getAxiosInstance();

  try {
    const request = await axiosInstance.get(`/athletes`);
    return request.data as Athlete[];
  } catch (error) {
    console.error("Error while fetching athletes", error);
  }
};

const getAthete = async (atheteId: number) => {
    const axiosInstance = getAxiosInstance();
    try {
        const request = await axiosInstance.get(`/athletes/${atheteId}`);
        return request.data as Athlete;
    } catch (error) {
        console.error(`Error while fetching athlete with id: ${atheteId}`, error);
    }
}

export { getAthletes, getAthete };
