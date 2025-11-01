// Redux tool kit
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
    //... add more reducers here later if needed
  },
})