import {
  Athlete,
  Discipline,
  PerformanceRecording,
  Trainer,
} from "@customTypes/backendTypes";
import { UserType } from "@customTypes/enums";
import useStompClient from "@hooks/useStompClient";
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
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useApi from "../useApi";
import { useGenericWebsocketInitialization } from "./useWebsocketInstantiation";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const { getAthletes, getPerformanceRecordings, getDisciplines, getTrainers } =
    useApi();
  const client = useStompClient();
  const {
    initialize: initializeAthleteWebsocket,
    uninitialize: uninitializeAthleteWebsocket,
  } = useGenericWebsocketInitialization<Athlete>(
    client,
    "athlete",
    true,
    (a) => dispatch(addAthlete(a)),
    (a) => dispatch(updateAthlete(a)),
    (id) => dispatch(removeAthlete({ id: id })),
  );

  const {
    initialize: initializeDisciplineWebsocket,
    uninitialize: uninitializeDisciplineWebsocket,
  } = useGenericWebsocketInitialization<Discipline>(
    client,
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
    client,
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
    client,
    "trainer",
    true,
    (a) => dispatch(addTrainer(a)),
    () => {},
    (id) => dispatch(removeTrainer({ id: id })),
  );

  const instantiateAdmin = useCallback(async () => {
    console.log("Initializing admin");

    dispatch(setTrainers((await getTrainers()) ?? []));
    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines()) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );

    setTimeout(() => {
      initializeAthleteWebsocket();
      initializeDisciplineWebsocket();
      initializeTrainerWebsocket();
      initializePerformanceRecordingWebsocket();
    }, 500);
  }, [
    initializeTrainerWebsocket,
    dispatch,
    getAthletes,
    getDisciplines,
    getTrainers,
    getPerformanceRecordings,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateTrainer = useCallback(async () => {
    console.log("Initializing trainer");

    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines()) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );

    setTimeout(() => {
      uninitializeTrainerWebsocket();
      initializeAthleteWebsocket();
      initializeDisciplineWebsocket();
      initializePerformanceRecordingWebsocket();
    }, 700);
  }, [
    uninitializeTrainerWebsocket,
    dispatch,
    getAthletes,
    getDisciplines,
    getPerformanceRecordings,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateAthlete = useCallback(async () => {
    console.log("Initializing athlete");
    uninitializeAthleteWebsocket();
    uninitializeDisciplineWebsocket();
    uninitializeTrainerWebsocket();
    uninitializePerformanceRecordingWebsocket();
  }, [
    uninitializeTrainerWebsocket,
    uninitializeAthleteWebsocket,
    uninitializeDisciplineWebsocket,
    uninitializePerformanceRecordingWebsocket,
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
