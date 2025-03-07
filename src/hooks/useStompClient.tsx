import { AuthContext } from "@components/AuthenticationProvider/AuthenticationProvider";
import { Client } from "@stomp/stompjs";
import { useContext, useMemo } from "react";
import SockJS from "sockjs-client";
import config from "../config";
let previousClient: Client | null = null;

const useStompClient = () => {
  const { identityToken } = useContext(AuthContext);

  return useMemo(() => {
    if (previousClient != null) {
      previousClient.deactivate();
    }
    if (!identityToken) {
      return null;
    }

    const client = new Client({
      brokerURL: config.backendBrokerUrl,
      connectHeaders: {},
      debug: () => {},
      reconnectDelay: 5000,
      webSocketFactory: () =>
        new SockJS(config.websocketFactory + "?authToken=" + identityToken),
    });
    client.activate();
    console.log("Client activated");
    previousClient = client;
    return client;
  }, [identityToken]);
};

export default useStompClient;
