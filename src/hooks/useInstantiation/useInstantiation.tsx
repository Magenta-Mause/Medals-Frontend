import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import {
  AccessRequest,
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
import { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import useApi from "../useApi";
import { useGenericWebsocketInitialization } from "./useWebsocketInstantiation";
import {
  addAccessRequest,
  removeAccessRequest,
  setAccessRequests,
  updateAccessRequest,
} from "@stores/slices/accessRequestSlice";
import {
  addManagingTrainer,
  removeManagingTrainer,
  updateManagingTrainer,
} from "@stores/slices/managingTrainerSlice";

const useInstantiation = () => {
  const dispatch = useDispatch();
  const { selectedUser, refreshIdentityToken, email, authorizedUsers } =
    useContext(AuthContext);

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
    getAccessRequests,
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
    initialize: initializeManagingTrainerWebsocket,
    uninitialize: uninitializeControllingTrainerWebsocket,
  } = useGenericWebsocketInitialization<Trainer>(
    "controlling-trainer",
    true,
    (d) => dispatch(addManagingTrainer(d)),
    (d) => dispatch(updateManagingTrainer(d)),
    (id) => dispatch(removeManagingTrainer({ id: id })),
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
    initialize: initializeAccessRequestWebsocket,
    uninitialize: uninitializeAccessRequestWebsocket,
  } = useGenericWebsocketInitialization<AccessRequest>(
    "athlete-access-request",
    true,
    (p) => dispatch(addAccessRequest(p)),
    (p) => dispatch(updateAccessRequest(p)),
    (id) => dispatch(removeAccessRequest({ id: id as unknown as string })),
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

  const instantiateByType = useCallback(
    (userType: UserType) => {
      const instantiate = async () => {
        if (userType == UserType.ADMIN) {
          dispatch(setTrainers((await getTrainers()) ?? []));
        }
        if (userType == UserType.ATHLETE) {
          dispatch(setAccessRequests((await getAccessRequests()) ?? []));
        }
        dispatch(setAthletes((await getAthletes()) ?? []));
        dispatch(setDisciplines((await getDisciplines()) ?? []));
        dispatch(
          setPerformanceRecordings((await getPerformanceRecordings()) ?? []),
        );
        dispatch(setDisciplineMetrics((await getDisciplineMetrics()) ?? []));

        setTimeout(() => {
          uninitializeAthleteWebsocket();
          uninitializeDisciplineWebsocket();
          uninitializePerformanceRecordingWebsocket();
          uninitializeTrainerWebsocket();
          uninitializeAccessRequestWebsocket();
          uninitializeControllingTrainerWebsocket();

          initializeAthleteWebsocket();
          initializeDisciplineWebsocket();
          initializePerformanceRecordingWebsocket();
          if (userType == UserType.ADMIN) {
            initializeTrainerWebsocket();
          }
          if (userType == UserType.ATHLETE) {
            initializeAccessRequestWebsocket();
            initializeManagingTrainerWebsocket();
          }
        }, 700);
      };
      instantiate();
    },
    [
      dispatch,
      getAthletes,
      getDisciplines,
      getPerformanceRecordings,
      getDisciplineMetrics,
      getTrainers,
      getAccessRequests,
      uninitializeAthleteWebsocket,
      uninitializeDisciplineWebsocket,
      uninitializePerformanceRecordingWebsocket,
      uninitializeTrainerWebsocket,
      uninitializeAccessRequestWebsocket,
      uninitializeControllingTrainerWebsocket,
      initializeAthleteWebsocket,
      initializeDisciplineWebsocket,
      initializePerformanceRecordingWebsocket,
      initializeTrainerWebsocket,
      initializeAccessRequestWebsocket,
      initializeManagingTrainerWebsocket,
    ],
  );

  return {
    instantiateByType,
  };
};
export default useInstantiation;
