import { UserType } from "@customTypes/enums";
import {
  addAthlete,
  removeAthlete,
  setAthletes,
  updateAthlete,
} from "@stores/slices/athleteSlice";
import { useCallback, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import useApi from "../useApi";
import { Client } from "@stomp/stompjs";
import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import initiateClient from "websockets/client";
import {
  addPerformanceRecording,
  removePerformanceRecording,
  setPerformanceRecordings,
  updatePerformanceRecording,
} from "@stores/slices/performanceRecordingSlice";
import {
  useAthleteWebsocket,
  useGenericWebsocketInitialization,
  usePerformanceRecordingWebsocket,
} from "./useWebsocketInstantiation";
import {
  addDiscipline,
  removeDiscipline,
  setDisciplines,
  updateDiscipline,
} from "@stores/slices/disciplineSlice";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const [client, setConnection] = useState<Client | null>(null);
  const { getAthletes, getPerformanceRecordings, getDisciplines } = useApi();
  const {
    initialize: initializeAthleteWebsocket,
    uninitialize: uninitialiseAthleteWebsocket,
  } = useGenericWebsocketInitialization<Athlete>(
    client,
    "athlete",
    (a) => dispatch(addAthlete(a)),
    (a) => dispatch(updateAthlete(a)),
    (id) => dispatch(removeAthlete({ id: id })),
  );

  const {
    initialize: initializeDisciplineWebsocket,
    uninitialize: uninitialiseDisciplineWebsocket,
  } = useGenericWebsocketInitialization<Discipline>(
    client,
    "discipline",
    (d) => dispatch(addDiscipline(d)),
    (d) => dispatch(updateDiscipline(d)),
    (id) => dispatch(removeDiscipline({ id: id })),
  );

  const {
    initialize: initializePerformanceRecordingWebsocket,
    uninitialize: uninitialisePerformanceRecordingWebsocket,
  } = useGenericWebsocketInitialization<PerformanceRecording>(
    client,
    "performance-recording",
    (p) => dispatch(addPerformanceRecording(p)),
    (p) => dispatch(updatePerformanceRecording(p)),
    (id) => dispatch(removePerformanceRecording({ id: id })),
  );

  useEffect(() => {
    setConnection(initiateClient(() => {}));
  }, []);

  const instantiateAdmin = useCallback(async () => {
    console.log("Initializing admin");

    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines(2025)) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );

    setTimeout(() => {
      initializeAthleteWebsocket();
      initializeDisciplineWebsocket();
      initializePerformanceRecordingWebsocket();
    }, 500);
  }, [
    client,
    dispatch,
    getAthletes,
    initializeAthleteWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateTrainer = useCallback(async () => {
    console.log("Initializing trainer");

    dispatch(setAthletes((await getAthletes()) ?? []));
    dispatch(setDisciplines((await getDisciplines(2025)) ?? []));
    dispatch(
      setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
    );

    setTimeout(() => {
      initializeAthleteWebsocket();
      initializeDisciplineWebsocket();
      initializePerformanceRecordingWebsocket();
    }, 500);
  }, [
    client,
    dispatch,
    getAthletes,
    initializeAthleteWebsocket,
    initializePerformanceRecordingWebsocket,
  ]);

  const instantiateAthlete = useCallback(async () => {
    console.log("Initializing athlete");
    uninitialiseAthleteWebsocket();
    uninitialiseDisciplineWebsocket();
    uninitialisePerformanceRecordingWebsocket();
  }, [client]);

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
