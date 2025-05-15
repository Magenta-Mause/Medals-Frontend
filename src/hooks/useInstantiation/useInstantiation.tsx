import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import {
  AccessRequest,
  Admin,
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
  updateTrainer,
} from "@stores/slices/trainerSlice";
import {
  addAdmin,
  removeAdmin,
  setAdmins,
  updateAdmin,
} from "@stores/slices/adminSlice";
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
  setManagingTrainer,
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
    getAdmins,
    getDisciplineMetrics,
    getAccessRequests,
    getTrainersAssignedToAthlete,
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
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(updateTrainer(a));
    },
    (id) => {
      console.log("deleted:", id);
      checkUserAccountUpdateId(id);
      dispatch(removeTrainer({ id: id }));
    },
    selectedUser?.type == UserType.ADMIN
      ? (methode) => "/topics/trainer/" + methode + "/admin"
      : undefined,
  );

  const {
    initialize: initializeAdminWebsocket,
    uninitialize: uninitializeAdminWebsocket,
  } = useGenericWebsocketInitialization<Admin>(
    "admin",
    true,
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(addAdmin(a));
    },
    (a) => {
      checkUserAccountUpdate(a);
      dispatch(updateAdmin(a));
    },
    (id) => {
      console.log("deleted admin:", id);
      checkUserAccountUpdateId(id);
      dispatch(removeAdmin({ id: id }));
    },
    selectedUser?.type == UserType.ADMIN
      ? (methode) => "/topics/admin/" + methode + "/admin"
      : undefined,
  );

  const instantiateByType = useCallback(
    (userType: UserType) => {
      const instantiate = async () => {
        dispatch(setManagingTrainer([]));
        dispatch(setAccessRequests([]));
        if (userType == UserType.ADMIN) {
          dispatch(setTrainers((await getTrainers()) ?? []));
          dispatch(setAdmins((await getAdmins()) ?? []));
        }
        if (userType == UserType.ATHLETE) {
          dispatch(setAccessRequests((await getAccessRequests()) ?? []));
          dispatch(
            setManagingTrainer((await getTrainersAssignedToAthlete()) ?? []),
          );
        }
        if (userType == UserType.ATHLETE) {
          dispatch(setAccessRequests((await getAccessRequests()) ?? []));
          dispatch(
            setManagingTrainer((await getTrainersAssignedToAthlete()) ?? []),
          );
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
          uninitializeAdminWebsocket();

          initializeAthleteWebsocket();
          initializeDisciplineWebsocket();
          initializePerformanceRecordingWebsocket();
          if (userType == UserType.ADMIN) {
            initializeTrainerWebsocket();
            initializeAdminWebsocket();
          }
          if (userType == UserType.ATHLETE) {
            initializeAccessRequestWebsocket();
            initializeManagingTrainerWebsocket();
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
      getTrainersAssignedToAthlete,
      dispatch,
      getAthletes,
      getAdmins,
      getDisciplineMetrics,
      getDisciplines,
      getPerformanceRecordings,
      getDisciplineMetrics,
      getTrainers,
      initializeAthleteWebsocket,
      initializeAdminWebsocket,
      initializeDisciplineWebsocket,
      initializePerformanceRecordingWebsocket,
      initializeTrainerWebsocket,
      getAccessRequests,
      uninitializeAthleteWebsocket,
      uninitializeAdminWebsocket,
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
