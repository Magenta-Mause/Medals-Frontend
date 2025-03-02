import { Athlete, Trainer } from "@customTypes/bffTypes";
import { configureStore, Middleware, Store } from "@reduxjs/toolkit";
import { Client } from "@stomp/stompjs";
import initiateClient from "websockets/client";
import rootReducer from "./rootReducer";
import {
  addAthlete,
  removeAthlete,
  updateAthlete,
} from "./slices/athleteSlice";
import { addTrainer, removeTrainer } from "./slices/trainerSlice";

let websocketClient: Client | null = null;

const crossSliceMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (websocketClient == null) {
    const subscribe = (client: Client) => {
      client.subscribe("/topics/athlete/updates", (message) => {
        const athlete = JSON.parse(message.body) as Athlete;
        console.log("athlete update:", message.body);
        store.dispatch(updateAthlete(athlete));
      });

      client.subscribe("/topics/athlete/creation", (message) => {
        const athlete = JSON.parse(message.body) as Athlete;
        console.log("athlete created:", message.body);
        store.dispatch(addAthlete(athlete));
      });

      client.subscribe("/topics/athlete/deletion", (message) => {
        const athleteId = parseInt(message.body);
        console.log("athlete deletion [athleteId: " + athleteId + "]");
        store.dispatch(removeAthlete({ id: athleteId }));
      });

      client.subscribe("/topics/trainer/creation", (message) => {
        const trainer = JSON.parse(message.body) as Trainer;
        console.log("trainer created:", message.body);
        store.dispatch(addTrainer(trainer));
      });

      client.subscribe("/topics/trainer/deletion", (message) => {
        const trainerId = parseInt(message.body);
        console.log("trainer deletion [trainerId: " + trainerId + "]");
        store.dispatch(removeTrainer({ id: trainerId }));
      });
    };

    websocketClient = initiateClient(subscribe);
  }

  return result;
};

const store: Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crossSliceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
