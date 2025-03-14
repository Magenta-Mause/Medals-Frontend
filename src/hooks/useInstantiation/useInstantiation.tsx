import {
  Athlete,
  Discipline,
  PerformanceRecording,
} from "@customTypes/backendTypes";
import { UserType } from "@customTypes/enums";
import { Client } from "@stomp/stompjs";
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
import { setTrainers } from "@stores/slices/trainerSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import initiateClient from "websockets/client";
import useApi from "../useApi";
import { useGenericWebsocketInitialization } from "./useWebsocketInstantiation";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const [client, setConnection] = useState<Client | null>(null);
  const { getAthletes, getPerformanceRecordings, getDisciplines, getTrainers } =
    useApi();
  const {
    initialize: initializeAthleteWebsocket,
    uninitialize: uninitializeAthleteWebsocket,
  } = useGenericWebsocketInitialization<Athlete>(
    client,
    "athlete",
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
    (p) => dispatch(addPerformanceRecording(p)),
    (p) => dispatch(updatePerformanceRecording(p)),
    (id) => dispatch(removePerformanceRecording({ id: id })),
  );

  const {
    initialize: initializeTrainerWebsocket,
    uninitialize: uninitializeTrainerWebsocket,
  } = useGenericWebsocketInitialization<Athlete>(
    client,
    "trainer",
    (a) => dispatch(addAthlete(a)),
    (a) => dispatch(updateAthlete(a)),
    (id) => dispatch(removeAthlete({ id: id })),
  );

  useEffect(() => {
    setConnection(
      initiateClient((c) => {
        c.onWebSocketClose(() => {
          console.log("Websocket closed");
        });
        c.onWebSocketError((e: any) => {
          console.log("Websocket error", e);
        });
      }),
    );
  }, []);

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
    }, 500);
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
