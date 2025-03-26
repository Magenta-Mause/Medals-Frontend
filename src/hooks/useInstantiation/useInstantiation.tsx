import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
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
import { setDisciplineMetrics } from "@stores/slices/disciplineRatingMetricSlice";
import { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import useApi from "../useApi";
import { useGenericWebsocketInitialization } from "./useWebsocketInstantiation";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useContext(AuthContext);
  const {
    getAthletes,
    getPerformanceRecordings,
    getDisciplines,
    getTrainers,
    getDisciplineMetrics,
  } = useApi();
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
    selectedUser?.type == UserType.ADMIN
      ? (methode) => "/topics/trainer/" + methode + "/admin"
      : undefined,
  );

  const instantiateAdmin = useCallback(async () => {
    dispatch(setTrainers((await getTrainers()) ?? []));
    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines()) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );
    dispatch(setDisciplineMetrics((await getDisciplineMetrics()) ?? []));

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
    getDisciplineMetrics,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateTrainer = useCallback(async () => {
    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines()) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );
    dispatch(
      setDisciplineMetrics(
        (await getDisciplineMetrics()) ?? [],
      ),
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
    getDisciplineMetrics,
    initializeAthleteWebsocket,
    initializeDisciplineWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateAthlete = useCallback(async () => {
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
