import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import { Client } from "@stomp/stompjs";
import {
  updateAthlete,
  addAthlete,
  removeAthlete,
} from "@stores/slices/athleteSlice";
import {
  updatePerformanceRecording,
  addPerformanceRecording,
  removePerformanceRecording,
} from "@stores/slices/performanceRecordingSlice";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

const useGenericWebsocketInitialization = <T,>(
  client: Client | null,
  topic: string,
  insertCallback: (item: T) => void,
  updateCallback: (item: T) => void,
  deleteCallback: (id: number) => void,
) => {
  const [isConnected, setConnected] = useState(false);

  const initialize = useCallback(() => {
    if (isConnected) {
      return;
    }
    if (client == null || !client.connected) {
      throw new Error("Client not ready yet");
    }
    setConnected(true);
    client.subscribe("/topics/" + topic + "/creation", (message) => {
      insertCallback(JSON.parse(message.body) as T);
    });
    client.subscribe("/topics/" + topic + "/update", (message) => {
      updateCallback(JSON.parse(message.body) as T);
    });
    client.subscribe("/topics/" + topic + "/deletion", (message) => {
      deleteCallback(JSON.parse(message.body) as number);
    });
  }, [client, isConnected, insertCallback, updateAthlete, deleteCallback]);

  const uninitialize = useCallback(() => {
    if (!isConnected) {
      return;
    }
    if (client == null || !client.connected) {
      throw new Error("Client not ready yet");
    }
    client.unsubscribe("/topics/" + topic + "/creation");
    client.unsubscribe("/topics/" + topic + "/update");
    client.unsubscribe("/topics/" + topic + "/deletion");
  }, [client, isConnected]);

  return { initialize, uninitialize };
};

export { useGenericWebsocketInitialization };
