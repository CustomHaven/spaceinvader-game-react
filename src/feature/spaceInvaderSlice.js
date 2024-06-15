import { createSlice } from "@reduxjs/toolkit";

const spaceInvaderSlice = createSlice({
    name: "spaceInvader",
    initialState: {
        game: {
            active: true,
            lives: 3
        },
        modal: false,
    },
    reducers: {
        playGame(state, action) {
            state.game.active = action.payload;
        },
        hitpoints(state, action) {
            state.game.lives = action.payload;
        },
        modalOptions(state, action) {
            state.modal = action.payload;
        }
    }
});

export const {
    playGame,
    hitpoints,
    modalOptions,
} = spaceInvaderSlice.actions;

export const selectGameActive = state => state.spaceInvader.game.active;
export const selectGameLives = state => state.spaceInvader.game.lives;
export const selectModal = state => state.spaceInvader.modal;

export default spaceInvaderSlice.reducer;