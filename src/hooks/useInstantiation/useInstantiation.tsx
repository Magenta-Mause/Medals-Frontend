import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
  Trainer,
} from "@customTypes/backendTypes";
import { UserType } from "@customTypes/enums";
import {
  addAthlete,
  removeAthlete,
  setAthletes,
  updateAthlete,
} from "@stores/slices/athleteSlice";
import {
  addDiscipline,
  removeDiscipline,
  setDisciplines,
  updateDiscipline,
} from "@stores/slices/disciplineSlice";
import {
  addPerformanceRecording,
  removePerformanceRecording,
  setPerformanceRecordings,
  updatePerformanceRecording,
} from "@stores/slices/performanceRecordingSlice";
import {
  addTrainer,
  removeTrainer,
  setTrainers,
} from "@stores/slices/trainerSlice";
import { setDisciplineMetrics } from "@stores/slices/disciplineRatingMetricSlice";
import { useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import useApi from "../useApi";
import { useGenericWebsocketInitialization } from "./useWebsocketInstantiation";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const { selectedUser, refreshIdentityToken, email, authorizedUsers } =
    useContext(AuthContext);

  const [currentlyInitialized, setCurrentlyInitialized] = useState<
    number | null
  >(null);

  const checkUserAccountUpdate = useCallback(
    (entity: { email: string }) => {
      if (entity.email === email) {
        refreshIdentityToken();
      }
    },
    [refreshIdentityToken, email],
  );

  const checkUserAccountUpdateId = useCallback(
    (id: number) => {
      console.log(id, authorizedUsers);
      const isAuthorized = authorizedUsers?.some((user) => user.id === id);
      if (isAuthorized) {
        refreshIdentityToken();
      }
    },
    [refreshIdentityToken, authorizedUsers],
  );

  const {
    getAthletes,
    getPerformanceRecordings,
    getDisciplines,
    getTrainers,
    getDisciplineMetrics,
  } = useApi();
  const {
    initialize: initializeAthleteWebsocket,
    uninitialize: uninitializeAthleteWebsocket,
  } = useGenericWebsocketInitialization<Athlete>(
    "athlete",
    true,
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(addAthlete(a));
    },
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(updateAthlete(a));
    },
    (id) => {
      checkUserAccountUpdateId(id);
      dispatch(removeAthlete({ id: id }));
    },
  );

  const {
    initialize: initializeDisciplineWebsocket,
    uninitialize: uninitializeDisciplineWebsocket,
  } = useGenericWebsocketInitialization<Discipline>(
    "discipline",
    false,
    (d) => dispatch(addDiscipline(d)),
    (d) => dispatch(updateDiscipline(d)),
    (id) => dispatch(removeDiscipline({ id: id })),
  );

  const {
    initialize: initializePerformanceRecordingWebsocket,
    uninitialize: uninitializePerformanceRecordingWebsocket,
  } = useGenericWebsocketInitialization<PerformanceRecording>(
    "performance-recording",
    true,
    (p) => dispatch(addPerformanceRecording(p)),
    (p) => dispatch(updatePerformanceRecording(p)),
    (id) => dispatch(removePerformanceRecording({ id: id })),
  );

  const {
    initialize: initializeTrainerWebsocket,
    uninitialize: uninitializeTrainerWebsocket,
  } = useGenericWebsocketInitialization<Trainer>(
    "trainer",
    true,
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(addTrainer(a));
    },
    () => {},
    (id) => {
      console.log("deleted:", id);
      checkUserAccountUpdateId(id);
      dispatch(removeTrainer({ id: id }));
    },
    selectedUser?.type == UserType.ADMIN
      ? (methode) => "/topics/trainer/" + methode + "/admin"
      : undefined,
  );

  const initialDataFetching = useCallback(async () => {
    dispatch(setTrainers((await getTrainers()) ?? []));
    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines()) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );
    dispatch(setDisciplineMetrics((await getDisciplineMetrics()) ?? []));
  }, [
    dispatch,
    getAthletes,
    getDisciplineMetrics,
    getDisciplines,
    getPerformanceRecordings,
    getTrainers,
  ]);

  const instantiateAdmin = useCallback(async () => {
    if (currentlyInitialized != selectedUser?.id) {
      setCurrentlyInitialized(selectedUser?.id ?? null);
      initialDataFetching();

      setTimeout(() => {
        uninitializeAthleteWebsocket();
        uninitializeDisciplineWebsocket();
        uninitializeTrainerWebsocket();
        uninitializePerformanceRecordingWebsocket();

        initializeAthleteWebsocket();
        initializeDisciplineWebsocket();
        initializeTrainerWebsocket();
        initializePerformanceRecordingWebsocket();
      }, 500);
    }
  }, [
    currentlyInitialized,
    selectedUser?.id,
    initialDataFetching,
    uninitializeAthleteWebsocket,
    uninitializeDisciplineWebsocket,
    uninitializeTrainerWebsocket,
    uninitializePerformanceRecordingWebsocket,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializeTrainerWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateTrainer = useCallback(async () => {
    if (currentlyInitialized != selectedUser?.id) {
      setCurrentlyInitialized(selectedUser?.id ?? null);
      initialDataFetching();

      setTimeout(() => {
        uninitializeAthleteWebsocket();
        uninitializeDisciplineWebsocket();
        uninitializePerformanceRecordingWebsocket();

        initializeAthleteWebsocket();
        initializeDisciplineWebsocket();
        initializePerformanceRecordingWebsocket();
      }, 700);
    }
  }, [
    currentlyInitialized,
    selectedUser?.id,
    initialDataFetching,
    uninitializeAthleteWebsocket,
    uninitializeDisciplineWebsocket,
    uninitializePerformanceRecordingWebsocket,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateAthlete = useCallback(async () => {
    if (currentlyInitialized != selectedUser?.id) {
      setCurrentlyInitialized(selectedUser?.id ?? null);
      initialDataFetching();

      setTimeout(() => {
        uninitializeAthleteWebsocket();
        uninitializeDisciplineWebsocket();
        uninitializePerformanceRecordingWebsocket();

        initializeAthleteWebsocket();
        initializeDisciplineWebsocket();
        initializePerformanceRecordingWebsocket();
      }, 700);
    }
  }, [
    currentlyInitialized,
    selectedUser?.id,
    initialDataFetching,
    uninitializeAthleteWebsocket,
    uninitializeDisciplineWebsocket,
    uninitializePerformanceRecordingWebsocket,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

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
