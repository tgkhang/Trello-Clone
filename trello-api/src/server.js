/* eslint-disable no-console */
import exitHook from 'async-exit-hook' //// https://www.npmjs.com/package/async-exit-hook
import express from 'express'
import cors from 'cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment.js'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors.js'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()
  const hostname = env.LOCAL_DEV_APP_HOST || 'localhost'
  const PORT = env.LOCAL_DEV_APP_PORT || 3000

  // Fix caching issues for API responses
  // ex: when user logout, the browser may cache some previous API response,
  // then when user login again, those cached response may still be used,
  // causing some issues like: user still get previous user info after logout and login with another account
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser()) // Enable cookie parsing middleware
  app.use(cors(corsOptions)) // Enable CORS for all routes by default

  // Middleware to parse JSON request bodies, enable request json body data
  app.use(express.json())
  app.use('/v1', APIs_V1)

  // Middleware for handling errors globally
  app.use(errorHandlingMiddleware)

  // Create HTTP server for Socket.io
  const server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    console.log('A user connected to Socket.io')

    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
      console.log(`3.Production: Server is running at ${process.env.PORT}`)
    })
  } else {
    server.listen(PORT, hostname, () => {
      console.log(`3.Local: Server is running on http://${hostname}:${PORT}`)
    })
  }

  // Cleanup tasks before exit application
  exitHook(() => {
    console.log('\n4.Exiting application, closing MongoDB connection...')
    CLOSE_DB()
    console.log('5.MongoDB connection closed.')
  })
}

// Using async/await syntax IIFE
;(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0)
  }
})()

// Or using .then() syntax
// console.log('1.Connecting to MongoDB...')
// CONNECT_DB()
//   .then(() => console.log('2.Connected to MongoDB successfully!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0)
//   })
// tgkhang