import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  const createdUser = await userService.createNew(req.body)
  res.status(StatusCodes.CREATED).json(createdUser)
}

const verifyAccount = async (req, res, next) => {
  const result = await userService.verifyAccount(req.body)
  res.status(StatusCodes.OK).json(result)
}

const login = async (req, res, next) => {
  const result = await userService.login(req.body)

  // send cookie
  res.cookie('accessToken', result.accessToken, {
    httpOnly: true, // fe will not be able to access the cookie via client-side JS
    secure: true,
    sameSite: 'none', // allow cross-site cookie
    maxAge: ms('7d'), // 7 days
  })

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true, // fe will not be able to access the cookie via client-side JS
    secure: true,
    sameSite: 'none', // allow cross-site cookie
    maxAge: ms('7d'), // 7 days
  })

  res.status(StatusCodes.OK).json(result)
}

const refreshToken = async (req, res, next) => {
  const result = await userService.refreshToken(req.cookies?.refreshToken)
  res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('7d') })
  res.status(StatusCodes.OK).json(result)
}

const logout = async (req, res, next) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json({ loggedOut: true })
}

const update = async (req, res, next) => {
  // decoded in authMiddleware
  const userId = req.jwtDecoded._id
  const userAvatarFile = req.file
  // console.log('userAvatarFile:', userAvatarFile)
  const updatedUser = await userService.update(userId, req.body, userAvatarFile)
  res.status(StatusCodes.OK).json(updatedUser)
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  logout,
  update,
}
