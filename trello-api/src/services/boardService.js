/* eslint-disable no-useless-catch */
import ApiError from '~/utils/APIError'
import { slugify } from '~/utils/formatters'


const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call model to create board in DB


    // Other logic if creation of board affects other collections is here

    // return the created board, service always return something
    return newBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}