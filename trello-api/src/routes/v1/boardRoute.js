import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { asyncHandler } from '~/utils/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, asyncHandler(boardController.getBoards))
  .post(authMiddleware.isAuthorized, boardValidation.createNew, asyncHandler(boardController.createNew))

Router.route('/:id')
  .get(authMiddleware.isAuthorized, asyncHandler(boardController.getDetails)) // do not call validation as id is validated in controller
  .put(authMiddleware.isAuthorized, boardValidation.update, asyncHandler(boardController.update))

// api support moving cards between different columns
Router.route('/supports/moving_card').put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  asyncHandler(boardController.moveCardToDifferentColumn)
)

export const boardRoute = Router
