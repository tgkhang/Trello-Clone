import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/register').post(userValidation.createNew, userController.createNew)

Router.route('/verify_account').put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/refresh_token').get(userController.refreshToken) // get a new token

Router.route('/logout').delete(userController.logout) // can use get or post as well

Router.route('/update').put(authMiddleware.isAuthorized, userValidation.update, userController.update)

export const userRoute = Router
