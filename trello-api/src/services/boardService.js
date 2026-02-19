import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    // Call model to create board in DB
    const createdBoard = await boardModel.createNew(userId, newBoard)
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

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)

    // If board not found, throw error
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // new board do not affect the old board
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach((column) => {
      // using toString() of javascript
      column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())

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
      updatedAt: Date.now(),
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

/*
 currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(col => col._id === prevColumnId).cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId).cardOrderIds
*/
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // 3 step
    // 1. update cardOrderIds in source column
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    })
    // 2. update cardOrderIds in destination column
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    })
    // 3. update columnId in moved card
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE
    // 2 number are take from query params so they are string need to convert to number
    const boards = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), queryFilter)
    return boards
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
}
