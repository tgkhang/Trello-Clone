
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

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

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)

    // If board not found, throw error
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // new board do not affect the old board
    const resBoard= cloneDeep(board)
    resBoard.columns.forEach(column => {
      // using toString() of javascript
      column.cards= resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

      // mongodb method support equals
      // column.cards= resBoard.cards.filter(card => card.columnId.equals(column._id)
    })
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}


const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update
}