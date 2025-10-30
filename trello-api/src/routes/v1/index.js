import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'

const Router = express.Router()

// Check APIv1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'API is running' })
})

// Board API routes
Router.use('/boards', boardRoute)

// Column API routes
Router.use('/columns', columnRoute)

// Card API routes
Router.use('/cards', cardRoute)

export const APIs_V1 = Router