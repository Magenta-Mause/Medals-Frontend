import { UserType } from "@customTypes/enums";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useApi from "./useApi";
import { setAthletes } from "@stores/slices/athleteSlice";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const { getAthletes } = useApi();

  const instantiateAdmin = useCallback(async () => {
    console.log("Instantiating admin");
    dispatch(setAthletes((await getAthletes()) ?? []));
  }, [dispatch, setAthletes, getAthletes]);

  const instantiateTrainer = useCallback(async () => {
    console.log("Instantiating trainer");
    dispatch(setAthletes((await getAthletes()) ?? []));
  }, [dispatch, setAthletes, getAthletes]);

  const instantiateAthlete = useCallback(async () => {
    console.log("Instantiating athlete");
  }, []);

  const instantiateByType = useCallback(
    (userType: UserType) => {
      switch (userType) {
        case UserType.ADMIN: {
          instantiateAdmin();
          break;
        }
        case UserType.TRAINER: {
          instantiateTrainer();
          break;
        }
        case UserType.ATHLETE: {
          instantiateAthlete();
          break;
        }
      }
    },
    [instantiateAdmin, instantiateAthlete, instantiateTrainer],
  );

  return {
    instantiateAdmin,
    instantiateAthlete,
    instantiateTrainer,
    instantiateByType,
  };
};

export default useInstantiation;
