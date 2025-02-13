const config = {
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
  backendBrokerUrl: import.meta.env.VITE_BACKEND_BROKER_URL,
  websocketFactory: import.meta.env.VITE_WEBSOCKET_FACTORY,
};

export default config;
