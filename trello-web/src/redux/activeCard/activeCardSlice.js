import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },
    updateCurrentActiveCard: (state, actions) => {
      const fullcard = actions.payload
      state.currentActiveCard = fullcard
    },
  },
})

export const { clearAndHideCurrentActiveCard, showModalActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
