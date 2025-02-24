<<<<<<< HEAD
=======
import { Athlete, Trainer } from "@customTypes/bffTypes";
>>>>>>> 7351e3fa4cc808b9954ec3d5596c23a74da03d85
import { configureStore, Middleware, Store } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
<<<<<<< HEAD
=======
import {
  addAthlete,
  removeAthlete,
  updateAthlete,
} from "./slices/athleteSlice";
import { addTrainer, removeTrainer } from "./slices/trainerSlice";
>>>>>>> 7351e3fa4cc808b9954ec3d5596c23a74da03d85

const crossSliceMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

<<<<<<< HEAD
=======
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

>>>>>>> 7351e3fa4cc808b9954ec3d5596c23a74da03d85
  return result;
};

const store: Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crossSliceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
