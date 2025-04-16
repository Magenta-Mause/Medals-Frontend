import { useCallback, useContext, useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";

const useGenericWebsocketInitialization = <T,>(
  topic: string,
  includeUser: boolean,
  createCallback: (item: T) => void,
  updateCallback: (item: T) => void,
  deleteCallback: (id: number) => void,
  buildTopicString?: (method: string) => string,
) => {
  const [isConnected, setConnected] = useState(false);
  const { selectedUser } = useContext(AuthContext);
  const initialize = () => {
    setConnected(true);
  };
  const uninitialize = () => {
    setConnected(false);
  };

  const buildTopic = useCallback(
    (methode: string) => {
      if (buildTopicString) {
        return buildTopicString(methode);
      }
      return isConnected && selectedUser
        ? [
            "/topics/" +
              topic +
              "/" +
              methode +
              (includeUser ? "/" + selectedUser!.id : ""),
          ]
        : [];
    },
    [isConnected, selectedUser, buildTopicString, includeUser, topic],
  );

  useSubscription(selectedUser ? buildTopic("deletion") : [], (message) => {
    deleteCallback(JSON.parse(message.body));
  });

  useSubscription(selectedUser ? buildTopic("update") : [], (message) =>
    updateCallback(JSON.parse(message.body)),
  );

  useSubscription(selectedUser ? buildTopic("creation") : [], (message) =>
    createCallback(JSON.parse(message.body)),
  );

  return { initialize, uninitialize };
};

export { useGenericWebsocketInitialization };
