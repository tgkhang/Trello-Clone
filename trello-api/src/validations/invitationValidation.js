import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'

const createNewBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteEmail: Joi.string().email().required(),
    boardId: Joi.string().required(),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS)),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const invitationValidation = {
  createNewBoardInvitation,
  updateBoardInvitation,
}
