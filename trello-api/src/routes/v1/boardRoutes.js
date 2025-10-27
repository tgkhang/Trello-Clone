import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ status: 'API is running' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ status: 'Board created successfully' })
  })


export const boardRoutes = Router