import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './features/games/gameSlice'
import templateReducer from './features/templates/templateSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    template: templateReducer,
  },
})