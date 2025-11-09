// This file is a middleware to validate jsonwebtoken from cookie sending from client request
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  //take out cookie from request
  const clientAccessToken = req.cookies?.accessToken

  // check
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized, no access token provided'))
    return
  }

  try {
    // step 1: verify token
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_JWT_SECRET_KEY)
    // console.log(' ~ isAuthorized ~ accessTokenDecoded:', accessTokenDecoded)

    // step 2: if valid, need to save info parsed from token to req.jwtDecoded, for next hanlding after that
    req.jwtDecoded = accessTokenDecoded

    // step 3: call next() allow request to continue
    next()
  } catch (error) {
    // console.log(' ~ isAuthorized ~ error:', error)
    // if accesstoken is expired -> send back error to client to call api refresh token
    if (error?.message?.includes('expired')) {
      next(new ApiError(StatusCodes.GONE, 'Your access token is expired, please refresh token'))
      return
    }

    // if accessToken is invalid -> 401 unauthorized for client to logout
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized, invalid access token'))
  }
}

export const authMiddleware = {
  isAuthorized,
}
