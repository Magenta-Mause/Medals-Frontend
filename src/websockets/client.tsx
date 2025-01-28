import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const initiateClient = () => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {},
    debug: console.log,
    reconnectDelay: 5000,
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  });

  client.onConnect = () => {
    client.subscribe("/topic/updates", (message) => {
      console.log("Received:", message.body);
    });
  };

  client.activate();
  return client;
};

export default initiateClient;
