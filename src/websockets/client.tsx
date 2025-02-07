import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import config from "../../app.config.json";

const initiateClient = (onConnect: (client: Client) => void) => {
  const client = new Client({
    brokerURL: config.backendBrokerUrl,
    connectHeaders: {},
    debug: () => {},
    reconnectDelay: 5000,
    webSocketFactory: () => new SockJS(config.websocketFactory),
  });

  client.onConnect = () => {
    onConnect(client);
  };

  client.activate();
  return client;
};

export default initiateClient;
