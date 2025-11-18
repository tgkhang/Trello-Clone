import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null,
}

export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI', // name of action
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI', // name of action
  async ({ invitationId, status }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const newNotification = action.payload
      if (state.currentNotifications) {
        state.currentNotifications.unshift(newNotification)
      } else {
        state.currentNotifications = [newNotification]
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingNotifications = action.payload
      state.currentNotifications = Array.isArray(incomingNotifications) ? incomingNotifications.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const updatedNotification = action.payload
      const getInvitation = state.currentNotifications.find((i) => i._id === updatedNotification._id)
      getInvitation.boardInvitation = updatedNotification.boardInvitation
    })
  },
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer
