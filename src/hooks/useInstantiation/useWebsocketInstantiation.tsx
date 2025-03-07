import { Client } from "@stomp/stompjs";
import { useCallback, useState } from "react";

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
  }, [
    client,
    isConnected,
    insertCallback,
    deleteCallback,
    updateCallback,
    topic,
  ]);

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
  }, [client, isConnected, topic]);

  return { initialize, uninitialize };
};

export { useGenericWebsocketInitialization };
