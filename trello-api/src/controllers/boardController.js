import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/APIError.js'

const createNew = async (req, res, next) => {
  try {
    // console.log('Request body in controller: ', req.body)

    // Controller navigate to SERVICE LAYER

    //test
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This is a custom error from Board Controller!')

    // Return end response
    // res.status(StatusCodes.CREATED).json({ status: 'POST from controller' })
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}