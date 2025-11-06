import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      {/* Redirect route */}
      <Route
        path='/'
        element={
          <Navigate
            to='/boards/690226e2f7a61739bcbae00d'
            replace={true} // prevent adding a new entry in the history stack
          />
        }
      />

      <Route path='/boards/:boardId' element={<Board />} />

      {/* AuthenticationRoutes */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
