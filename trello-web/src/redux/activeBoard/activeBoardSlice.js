import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatter'
import { mapOrder } from '~/utils/sort'

// initial state of slice
const initialState = {
  currentActiveBoard: null,
}

// Asynchronous actions, Update data to redux using middleware createAsyncThunk with extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI', // name of action
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // axios automatically parses the JSON response, stored in response.data
    return response.data
  }
)

// create slice in redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducer: handle synchronous data
  // reducer of redux by default always need {} to wrap, even has only 1 line (offical doc) ? update ?
  reducers: {
    updateCurrentActiveBoard: (state, actions) => {
      // action.payload: data passed when dispatch action
      const board = actions.payload
      // update state

      // update curerent active board again
      state.currentActiveBoard = board
    }
  },
  // extraReducers: handle asynchronous data
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, // catch case for successful API call, dead case catch by axios
      (state, action) => {
        // payload from return of async function api above (response.data)
        let board = action.payload

        // handle needed logic before update to state
        // sort data column order before passing to child component
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          // drag with empty columns
          if (isEmpty(column.cards)) {
            const placeholderCard = generatePlaceholderCard(column)
            column.cards = [placeholderCard]
            column.cardOrderIds = [placeholderCard._id]
          }
          else {
            // sort cards before passing to child component
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })

        // update curerent active board again
        state.currentActiveBoard = board
      })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector : a way for child component to get specific data from redux store to use
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer