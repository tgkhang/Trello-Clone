import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title : Joi.string().required().min(3).max(50).trim().strict(),
    description : Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // console.log('Request body: ', req.body)

    // abortEarly: false -> to show all errors at once
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // If validation is successful, proceed to the next middleware/controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}


export const boardValidation = {
  createNew
}