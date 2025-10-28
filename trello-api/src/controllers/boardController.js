import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
  try {
    console.log('Request body in controller: ', req.body)

    // Controller navigate to SERVICE LAYER


    // Return end response
    res.status(StatusCodes.CREATED).json({ status: 'POST from controller' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    })
  }
}

export const boardController = {
  createNew
}