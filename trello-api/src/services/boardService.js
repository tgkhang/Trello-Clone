/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call model to create board in DB
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log('Created Board:', createdBoard)

    // Other logic if creation of board affects other collections is here
    // createBoard.insertedId give a type of ObjectId
    // find one only accept type of ObjectId not string
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // return the created board, service always return something
    return getNewBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}