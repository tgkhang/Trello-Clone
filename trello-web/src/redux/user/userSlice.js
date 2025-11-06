import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// initial state of slice
const initialState = {
  current: null,
}

// Asynchronous actions, Update data to redux using middleware createAsyncThunk with extraReducers
export const loginUserAPI = createAsyncThunk(
  'activeBoard/loginUserAPI', // name of action
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    // axios automatically parses the JSON response, stored in response.data
    return response.data
  }
)

// create slice in redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducer: handle synchronous data
  // reducer of redux by default always need {} to wrap, even has only 1 line (offical doc) ? update ?
  reducers: {},
  // extraReducers: handle asynchronous data
  extraReducers: (builder) => {
    builder.addCase(
      loginUserAPI.fulfilled, // catch case for successful API call, dead case catch by axios
      (state, action) => {
        state.current = action.payload
      }
    )
  },
})

// Action creators are generated for each case reducer function, SYNCHRONOUS only
// export const {} = userSlice.actions

// Selector : a way for child component to get specific data from redux store to use
export const selectCurrentUser = (state) => {
  return state.user.current
}

export const userReducer = userSlice.reducer
