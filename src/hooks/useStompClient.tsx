import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Client } from "@stomp/stompjs";
import { useContext, useMemo } from "react";
import SockJS from "sockjs-client";
import config from "../config";

let previousClient: Client | null = null;

const useStompClient = () => {
  const { identityToken, selectedUser } = useContext(AuthContext);

  return useMemo(() => {
    if (previousClient != null) {
      console.log("stopping previous client");
      previousClient.deactivate();
    }

    if (!identityToken || !selectedUser) {
      return null;
    }

    const client = new Client({
      brokerURL: config.backendBrokerUrl,
      connectHeaders: {},
      reconnectDelay: 5000,
      webSocketFactory: () =>
        new SockJS(
          config.websocketFactory +
            "?authToken=" +
            identityToken +
            "&selectedUser=" +
            selectedUser.id,
        ),
    });

    client.onStompError = (error) => {
      console.log("stomp error:", error);
    };

    client.onWebSocketClose = (e: CloseEvent) => {
      console.log("websocket closed:", e);
    };
    client.activate();
    previousClient = client;
    return client;
  }, [identityToken, selectedUser]);
};

export default useStompClient;
