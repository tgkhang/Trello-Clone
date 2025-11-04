import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    //1. Check if email already exists (can be written in validation layer or here)
    // có thể coi là 1 bước xử lí logic nên để service
    // validation chỉ xử lí validation gửi lên từ client
    const existingUser = await userModel.findOneByEmail(reqBody.email)
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already in use')
    }

    // create new user
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 10),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4(),
    }

    // save to db
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // send email verification

    // return created user, exclude password and verifyToken
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
}
