import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// custom general axios for project
let authorizedAxiosInstance = axios.create()

// limit timeout for each request: 10 min
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000

// withCredentials: allow axios to send cookies for each request to backend (jwt token)
//  and httpOnly cookies of browser
authorizedAxiosInstance.defaults.withCredentials = true


// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use( (config) => {

  // Technique: block spam clicks or actions during loading state
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
},
{ synchronous: true, runWhen: () => true }
)

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  // Technique: remove loading effect after response received
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  interceptorLoadingElements(false)

  // Global error handling for all over the app
  let errorMessage = error?.message

  // check if error response from server has message, then use that message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }

  // Cureent ignore 410 errors (refresh token)
  // TO DO: handle 410 errors globally later
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})


export default authorizedAxiosInstance