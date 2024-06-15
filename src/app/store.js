import { configureStore } from "@reduxjs/toolkit";
import spaceInvaderReducer from "../feature/spaceInvaderSlice";

export default configureStore({
    reducer: {
        spaceInvader: spaceInvaderReducer
    },
    devTools: true,
});

/* for typescript which I will use from now on!!

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
*/