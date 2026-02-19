import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { asyncHandler } from '~/utils/asyncHandler'

const Router = express.Router()

Router.route('/register').post(userValidation.createNew, asyncHandler(userController.createNew))

Router.route('/verify_account').put(userValidation.verifyAccount, asyncHandler(userController.verifyAccount))

Router.route('/login').post(userValidation.login, asyncHandler(userController.login))

Router.route('/refresh_token').get(asyncHandler(userController.refreshToken)) // get a new token

Router.route('/logout').delete(asyncHandler(userController.logout)) // can use get or post as well

Router.route('/update').put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single('avatar'),
  userValidation.update,
  asyncHandler(userController.update)
)

export const userRoute = Router
