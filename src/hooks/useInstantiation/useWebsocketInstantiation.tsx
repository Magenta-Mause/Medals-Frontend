import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Client } from "@stomp/stompjs";
import { useCallback, useContext, useState } from "react";

const useGenericWebsocketInitialization = <T,>(
  client: Client | null,
  topic: string,
  includeUser: boolean,
  insertCallback: (item: T) => void,
  updateCallback: (item: T) => void,
  deleteCallback: (id: number) => void,
  buildTopicString?: (method: string) => string,
) => {
  const [isConnected, setConnected] = useState(false);
  const { selectedUser } = useContext(AuthContext);

  const initialize = useCallback(() => {
    if (isConnected) {
      console.log("is already connected");
      return;
    }
    if (client == null || !client.connected) {
      return;
    }
    setConnected(true);
    client.subscribe(
      buildTopicString
        ? buildTopicString("creation")
        : "/topics/" +
            topic +
            "/creation" +
            (includeUser ? "/" + selectedUser!.id : ""),
      (message) => {
        insertCallback(JSON.parse(message.body) as T);
      },
    );
    client.subscribe(
      buildTopicString
        ? buildTopicString("update")
        : "/topics/" +
            topic +
            "/update" +
            (includeUser ? "/" + selectedUser!.id : ""),
      (message) => {
        updateCallback(JSON.parse(message.body) as T);
      },
    );
    client.subscribe(
      buildTopicString
        ? buildTopicString("deletion")
        : "/topics/" +
            topic +
            "/deletion" +
            (includeUser ? "/" + selectedUser!.id : ""),
      (message) => {
        deleteCallback(JSON.parse(message.body) as number);
      },
    );
  }, [
    buildTopicString,
    client,
    isConnected,
    insertCallback,
    deleteCallback,
    updateCallback,
    topic,
    selectedUser,
    includeUser,
  ]);

  const uninitialize = useCallback(() => {
    if (!isConnected) {
      return;
    }
    if (client == null || !client.connected) {
      return;
    }
    setConnected(false);
    client.unsubscribe(
      "/topics/" +
        topic +
        "/creation" +
        (includeUser ? "/" + selectedUser!.id : ""),
    );
    client.unsubscribe(
      "/topics/" +
        topic +
        "/update" +
        (includeUser ? "/" + selectedUser!.id : ""),
    );
    client.unsubscribe(
      "/topics/" +
        topic +
        "/deletion" +
        (includeUser ? "/" + selectedUser!.id : ""),
    );
  }, [client, isConnected, topic, selectedUser, includeUser]);

  return { initialize, uninitialize };
};

export { useGenericWebsocketInitialization };
